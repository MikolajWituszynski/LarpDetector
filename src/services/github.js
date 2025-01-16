// github.js
import { calculateTrustScore } from './trustScore';

const BASE_URL = 'https://api.github.com';

const fetchGitHubAPI = async (endpoint, token = null) => {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Health-Check'
    };


    const response = await fetch(`${BASE_URL}${endpoint}`, { headers });

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

const getContributorProfiles = async (contributors) => {
  try {
    const profiles = await Promise.all(
      contributors.map(async (contributor) => {
        const profile = await fetchGitHubAPI(`/users/${contributor.login}`);
        return {
          login: contributor.login,
          accountAge: (new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24),
          publicRepos: profile.public_repos,
          followers: profile.followers,
          contributions: contributor.contributions
        };
      })
    );
    return profiles;
  } catch (error) {
    console.warn('Failed to fetch contributor profiles:', error);
    return [];
  }
};

export const analyzeGitHubRepo = async (url, token = null) => {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(\/.*)?$/);
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }

  const [, owner, repo] = match;
  
  try {
    // Fetch basic repository data first
    const repoData = await fetchGitHubAPI(`/repos/${owner}/${repo}`, token);
    
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
      fetchGitHubAPI(`/repos/${owner}/${repo}/commits`, token),
      fetchGitHubAPI(`/repos/${owner}/${repo}/contributors`, token),
      fetchGitHubAPI(`/repos/${owner}/${repo}/issues?state=all`, token),
      fetchGitHubAPI(`/repos/${owner}/${repo}/pulls?state=all`, token),
      fetchGitHubAPI(`/repos/${owner}/${repo}/contents`, token),
      fetchGitHubAPI(`/repos/${owner}/${repo}/readme`, token).catch(() => null),
      fetchGitHubAPI(`/repos/${owner}/${repo}/languages`, token),
      fetchGitHubAPI(`/repos/${owner}/${repo}/branches`, token),
      fetchGitHubAPI(`/repos/${owner}/${repo}/actions/workflows`, token).catch(() => ({ workflows: [] })),
    ]);

    // Calculate time metrics
    const now = new Date();
    const createdAt = new Date(repoData.created_at);
    const updatedAt = new Date(repoData.updated_at);
    const lastCommitDate = commits.length > 0 ? new Date(commits[0].commit.author.date) : updatedAt;
    
    const timeMetrics = {
      age: Math.floor((now - createdAt) / (1000 * 60 * 60 * 24)),
      lastUpdated: Math.floor((now - lastCommitDate) / (1000 * 60 * 60 * 24)),
      isActive: (now - lastCommitDate) / (1000 * 60 * 60 * 24) < 90
    };

    // Analyze commit patterns
    const commitAnalysis = {
      frequency: commits.length,
      isConsistent: commits.length > 0,
      authors: new Set(commits.map(c => c.commit.author.email)).size,
      activityPatterns: {
        weekdayActivity: commits.filter(c => {
          const date = new Date(c.commit.author.date);
          return date.getDay() !== 0 && date.getDay() !== 6;
        }).length,
        weekendActivity: commits.filter(c => {
          const date = new Date(c.commit.author.date);
          return date.getDay() === 0 || date.getDay() === 6;
        }).length,
        timeDistribution: commits.reduce((dist, c) => {
          const hour = new Date(c.commit.author.date).getHours();
          dist[hour] = (dist[hour] || 0) + 1;
          return dist;
        }, {})
      }
    };

    // Get contributor profiles
    const contributorProfiles = await getContributorProfiles(contributors);

    // Process repository data
    const processedData = {
      repoData: {
        ...repoData,
        description: repoData.description || 'No description provided'
      },
      timeMetrics,
      commitAnalysis,
      contributors: {
        numberOfContributors: contributors.length,
        totalContributions: contributors.reduce((sum, c) => sum + c.contributions, 0),
        contributionDistribution: contributors.map(c => ({
          login: c.login,
          percentage: (c.contributions / contributors.reduce((sum, cont) => sum + cont.contributions, 0)) * 100
        }))
      },
      contributorProfiles,
      languages,
      codeQuality: {
        hasReadme: contents.some(f => f.name.toLowerCase() === 'readme.md'),
        hasContributing: contents.some(f => f.name.toLowerCase() === 'contributing.md'),
        hasLicense: contents.some(f => f.name.toLowerCase() === 'license'),
        hasChangelog: contents.some(f => f.name.toLowerCase() === 'changelog.md'),
        hasGitIgnore: contents.some(f => f.name === '.gitignore'),
        hasGitAttributes: contents.some(f => f.name === '.gitattributes'),
        hasPackageLock: contents.some(f => f.name === 'package-lock.json'),
        codeStyle: {
          hasLinter: contents.some(f => f.name.match(/\.(eslint|prettier|stylelint)rc/)),
          hasTypeChecking: contents.some(f => f.name === 'tsconfig.json'),
          hasEditorConfig: contents.some(f => f.name === '.editorconfig'),
          hasFormatting: contents.some(f => f.name.match(/\.(prettier|clang-format)/))
        },
        complexity: {
          averageFileSize: calculateAverageFileSize(contents),
          largestFile: findLargestFile(contents),
          maxDirectoryDepth: calculateMaxDirectoryDepth(contents)
        }
      },
      metrics: {
        issueResolutionRate: issues.length ? 
          issues.filter(i => i.state === 'closed').length / issues.length : 0,
        pullRequestRate: pulls.length ?
          pulls.filter(p => p.merged_at).length / pulls.length : 0,
        activeUsers: new Set([
          ...issues.map(i => i.user.login),
          ...pulls.map(p => p.user.login)
        ]).size
      }
    };

    // Calculate trust score
    const trustScore = calculateTrustScore(processedData);

    return {
      ...processedData,
      health: trustScore
    };

  } catch (error) {
    console.error('Repository analysis failed:', error);
    if (error.message.includes('Not Found')) {
      throw new Error('Repository not found. Please check the URL and try again.');
    }
    throw new Error(`Failed to analyze repository: ${error.message}`);
  }
};