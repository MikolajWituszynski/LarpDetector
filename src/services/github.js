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

import { 
  calculateActivityScore,
  calculateQualityScore,
  calculateCommunityScore,
  getMaturityLevel,
  MATURITY_EXPECTATIONS
} from '../constants';

const BASE_URL = 'https://api.github.com';

const fetchGitHubAPI = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Health-Check',
        'Authorization': 'Bearer '
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

const calculateHealthScore = (repoData, timeMetrics, commits, contents, contributors) => {
  // Prepare repo object with all required metrics
  const repo = {
    timeMetrics,
    hasRecentActivity: timeMetrics.lastUpdated <= 90,
    commitAnalysis: {
      frequency: commits.length,
      authors: contributors.length
    },
    docs: contents.map(f => f.name.toLowerCase()),
    hasTests: contents.some(f => 
      f.name.toLowerCase().includes('test') ||
      f.path?.toLowerCase().includes('test')
    ),
    hasCI: contents.some(f => 
      f.path?.includes('.github/workflows') ||
      f.name.includes('.travis.yml') ||
      f.name.includes('circle.yml')
    ),
    hasLinter: contents.some(f => f.name.match(/\.(eslint|prettier|stylelint)rc/)),
    stargazers_count: repoData.stargazers_count,
    contributors: contributors.length,
    // Additional quality metrics
    hasReadme: contents.some(f => f.name.toLowerCase() === 'readme.md'),
    hasContributing: contents.some(f => f.name.toLowerCase() === 'contributing.md'),
    hasLicense: contents.some(f => f.name.toLowerCase() === 'license'),
    hasCodeowners: contents.some(f => f.name.toLowerCase() === 'codeowners'),
    hasSecurityPolicy: contents.some(f => f.name.toLowerCase() === 'security.md')
  };

  // Calculate individual scores
  const activityScore = calculateActivityScore(repo);
  const qualityScore = calculateQualityScore(repo);
  const communityScore = calculateCommunityScore(repo);
  
  // Calculate weighted score
  const weightedScore = (
    activityScore * 0.35 +
    qualityScore * 0.35 +
    communityScore * 0.30
  );
  
  // Apply maturity level adjustments
  const maturityLevel = getMaturityLevel(timeMetrics.age);
  const minScore = Math.max(20, MATURITY_EXPECTATIONS[maturityLevel].expectedScore - 20);
  
  // Apply bonuses
  let bonusScore = 0;
  if (timeMetrics.age > 730) bonusScore += 5; // More than 2 years old
  if (repoData.stargazers_count > 1000 && contributors.length > 10) bonusScore += 5; // Popular and collaborative
  if (repo.hasReadme && repo.hasContributing && repo.hasLicense) bonusScore += 5; // Complete documentation
  if (repo.hasTests && repo.hasCI) bonusScore += 5; // Good development practices
  
  return Math.min(100, Math.max(minScore, Math.round(weightedScore + bonusScore)));
};

// Function to analyze commit frequency and patterns
const analyzeCommitFrequency = (commits) => {
  if (!commits.length) return { frequency: 0, pattern: 'inactive' };

  const now = new Date();
  const oldestCommit = new Date(commits[commits.length - 1].commit.author.date);
  const daysSinceStart = Math.ceil((now - oldestCommit) / (1000 * 60 * 60 * 24));
  
  const frequency = commits.length / (daysSinceStart / 7); // commits per week
  
  let pattern;
  if (frequency >= 10) pattern = 'very active';
  else if (frequency >= 4) pattern = 'active';
  else if (frequency >= 1) pattern = 'moderate';
  else pattern = 'low';

  return { frequency, pattern };
};

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
    const ownerAnalysis = await analyzeOwner(owner);
    
    // Calculate comprehensive health score
    const healthScore = calculateHealthScore(repoData, timeMetrics, commits, contents, contributors);
    
    // Analyze commit patterns
    const commitFrequency = analyzeCommitFrequency(commits);

    // Get trust and risk factors
    const projectHealth = await analyzeProjectHealth(repoData, commits, issues, contributors);

    return {
      repoData: {
        ...repoData,
        description: repoData.description || 'No description provided',
        ownerInfo: ownerAnalysis
      },
      timeMetrics,
      health: {
        score: healthScore,
        trustFactors: projectHealth.trustFactors,
        riskFactors: projectHealth.riskFactors,
        commitFrequency
      },
      commits,
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

export { calculateAverageFileSize, findLargestFile, calculateMaxDirectoryDepth };