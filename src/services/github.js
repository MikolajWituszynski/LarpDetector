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
    throw new Error('Invalid GitHub repository URL');
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

    // Calculate time metrics
    const now = new Date();
    const createdAt = new Date(repoData.created_at);
    const updatedAt = new Date(repoData.updated_at);
    const lastCommitDate = commits.length > 0 ? new Date(commits[0].commit.author.date) : updatedAt;
    
    const timeMetrics = {
      age: Math.floor((now - createdAt) / (1000 * 60 * 60 * 24)),
      lastUpdated: Math.floor((now - lastCommitDate) / (1000 * 60 * 60 * 24)),
      isActive: (now - lastCommitDate) / (1000 * 60 * 60 * 24) < 90 // Consider active if updated within 90 days
    };

    // Calculate commit analysis
    const commitAnalysis = {
      frequency: commits.length,
      isConsistent: commits.length > 0,
      authors: new Set(commits.map(c => c.commit.author.email)).size
    };

    // Analyze code quality
    const codeQuality = {
      hasReadme: contents.some(f => f.name.toLowerCase() === 'readme.md'),
      hasContributing: contents.some(f => f.name.toLowerCase() === 'contributing.md'),
      hasLicense: contents.some(f => f.name.toLowerCase() === 'license'),
      hasChangelog: contents.some(f => f.name.toLowerCase() === 'changelog.md'),
      codeStyle: {
        hasLinter: contents.some(f => f.name.match(/\.(eslint|prettier|stylelint)rc/)),
        hasTypeChecking: contents.some(f => f.name === 'tsconfig.json'),
        hasEditorConfig: contents.some(f => f.name === '.editorconfig'),
        hasFormatting: contents.some(f => f.name.match(/\.(prettier|clang-format)/))
      }
    };

    // Process contributors
    const contributorStats = {
      numberOfContributors: contributors.length,
      totalContributions: contributors.reduce((sum, c) => sum + c.contributions, 0),
      contributionDistribution: contributors.map(c => ({
        login: c.login,
        percentage: (c.contributions / contributors.reduce((sum, cont) => sum + cont.contributions, 0)) * 100
      }))
    };

    // Calculate base health score
    let healthScore = 60; // Start with base score

    // Activity score (max 15)
    if (timeMetrics.isActive) healthScore += 15;

    // Community score (max 15)
    if (repoData.stargazers_count > 1000) healthScore += 15;
    else if (repoData.stargazers_count > 100) healthScore += 10;
    else if (repoData.stargazers_count > 10) healthScore += 5;

    // Code quality score (max 10)
    if (codeQuality.hasReadme) healthScore += 3;
    if (codeQuality.hasContributing) healthScore += 2;
    if (codeQuality.hasLicense) healthScore += 2;
    if (codeQuality.codeStyle.hasLinter || codeQuality.codeStyle.hasTypeChecking) healthScore += 3;

    return {
      repoData: {
        ...repoData,
        description: repoData.description || 'No description provided'
      },
      timeMetrics,
      commitAnalysis,
      contributors: contributorStats,
      languages,
      codeQuality,
      health: {
        score: healthScore,
        trustFactors: [
          timeMetrics.isActive && 'Active Maintenance',
          codeQuality.hasReadme && 'Documentation',
          contributorStats.numberOfContributors > 2 && 'Active Community'
        ].filter(Boolean)
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