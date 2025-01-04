// github.js
import {
  calculateTimeMetrics,
  analyzeOwner,
  analyzeProjectHealth,
  analyzeCommitPatterns,
  analyzeContributors,
  analyzeBranches,
  analyzeSecurityFeatures,
  calculateMetrics
} from '../analysis';

const BASE_URL = 'https://api.github.com';

const fetchGitHubAPI = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Health-Check'

      }
    });


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};


const calculateAverageFileSize = (files) => {
  const sizes = files
    .filter(f => f.size)
    .map(f => f.size);
  
  return sizes.length ? 
    (sizes.reduce((sum, size) => sum + size, 0) / sizes.length) / 1024 : 
    0;
};

const findLargestFile = (files) => {
  return files.reduce((largest, file) => {
    if (!file.size) return largest;
    return (!largest || file.size > largest.size) ? 
      { name: file.name, size: file.size / 1024 } : 
      largest;
  }, null);
};

const calculateMaxDirectoryDepth = (files) => {
  return files.reduce((maxDepth, file) => {
    const depth = (file.path || file.name).split('/').length;
    return Math.max(maxDepth, depth);
  }, 0);
};

export { calculateAverageFileSize, findLargestFile, calculateMaxDirectoryDepth };

export const analyzeGitHubRepo = async (url) => {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(\/.*)?$/);
  if (!match) {
    throw new Error('Invalid GitHub repository URL. Format should be: https://github.com/owner/repo');
  }

  const [, owner, repo] = match;
  
  try {
    // Fetch basic repository data first
    const repoData = await fetchGitHubAPI(`/repos/${owner}/${repo}`);
    
    // Fetch all additional data in parallel
    const [
      commits,
      contributors,
      issues,
      pulls,
      contents,
      readme,
      languages,
      branches,
      workflows
    ] = await Promise.all([
      fetchGitHubAPI(`/repos/${owner}/${repo}/commits`),
      fetchGitHubAPI(`/repos/${owner}/${repo}/contributors`),
      fetchGitHubAPI(`/repos/${owner}/${repo}/issues?state=all`),
      fetchGitHubAPI(`/repos/${owner}/${repo}/pulls?state=all`),
      fetchGitHubAPI(`/repos/${owner}/${repo}/contents`),
      fetchGitHubAPI(`/repos/${owner}/${repo}/readme`).catch(() => null),
      fetchGitHubAPI(`/repos/${owner}/${repo}/languages`),
      fetchGitHubAPI(`/repos/${owner}/${repo}/branches`),
      fetchGitHubAPI(`/repos/${owner}/${repo}/actions/workflows`).catch(() => ({ workflows: [] })),
    ]);

    const timeMetrics = calculateTimeMetrics(repoData.created_at, repoData.updated_at);
    const projectHealth = await analyzeProjectHealth(repoData, commits, issues, contributors);
    const ownerAnalysis = await analyzeOwner(owner);

    return {
      repoData: {
        ...repoData,
        description: repoData.description || 'No description provided',
        ownerInfo: ownerAnalysis
      },
      timeMetrics,
      health: projectHealth,
      commitAnalysis: analyzeCommitPatterns(commits),
      contributors: analyzeContributors(contributors),
      languages,
      branches: analyzeBranches(branches),
      security: analyzeSecurityFeatures(contents, workflows?.workflows || []),
      metrics: calculateMetrics(issues, pulls, contributors),
      codeQuality: {
        codeStyle: {
          hasLinter: contents.some(f => f.name.match(/\.(eslint|prettier|stylelint)rc/)),
          hasEditorConfig: contents.some(f => f.name === '.editorconfig'),
          hasFormatting: contents.some(f => f.name.match(/\.(prettier|clang-format)/)),
          hasTypeChecking: contents.some(f => f.name === 'tsconfig.json')
        },
        hasGitIgnore: contents.some(f => f.name === '.gitignore'),
        hasGitAttributes: contents.some(f => f.name === '.gitattributes'),
        hasPackageLock: contents.some(f => f.name === 'package-lock.json'),
        hasReadme: contents.some(f => f.name.toLowerCase() === 'readme.md'),
        hasContributing: contents.some(f => f.name.toLowerCase() === 'contributing.md'),
        hasLicense: contents.some(f => f.name.toLowerCase() === 'license'),
        hasChangelog: contents.some(f => f.name.toLowerCase() === 'changelog.md'),
        complexity: {
          averageFileSize: calculateAverageFileSize(contents),
          largestFile: findLargestFile(contents),
          maxDirectoryDepth: calculateMaxDirectoryDepth(contents)
        }
      }
    };
  } catch (error) {
    console.error('Repository analysis failed:', error);
    if (error.message.includes('Not Found')) {
      throw new Error('Repository not found. Please check the URL and try again.');
    }
    throw new Error(`Failed to analyze repository: ${error.message}`);
  }
};
