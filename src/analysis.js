// src/services/analysis.js

export const calculateTimeMetrics = (createdAt, updatedAt) => {
    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    const now = new Date();
    
    return {
      age: Math.floor((now - created) / (1000 * 60 * 60 * 24)),
      lastUpdated: Math.floor((now - updated) / (1000 * 60 * 60 * 24)),
      isActive: (now - updated) / (1000 * 60 * 60 * 24) < 30
    };
  };
  
  export const analyzeOwner = async (owner) => {
    return {
      type: 'User',
      isOrganization: false,
      followers: 0,
      publicRepos: 0,
      createdAt: new Date().toISOString()
    };
  };
  
  export const analyzeProjectHealth = async (repoData, commits, issues, contributors) => {
    const trustFactors = [];
    let score = 0;
  
    // Active maintenance
    if (commits.length > 0) {
      const lastCommitDate = new Date(commits[0].commit.author.date);
      if ((new Date() - lastCommitDate) / (1000 * 60 * 60 * 24) < 30) {
        trustFactors.push('Active Maintenance');
        score += 20;
      }
    }
  
    // Documentation
    if (repoData.has_wiki || repoData.has_pages) {
      trustFactors.push('Documentation');
      score += 15;
    }
  
    // Community size
    if (contributors.length > 2) {
      trustFactors.push('Active Community');
      score += 15;
    }
  
    const riskFactors = calculateRiskFactors(repoData, commits, issues);
  
    return {
      score: Math.min(100, score),
      trustFactors,
      riskFactors
    };
  };
  
  export const analyzeCommitPatterns = (commits) => {
    const activityPatterns = {
      timeDistribution: {},
      weekdayActivity: 0,
      weekendActivity: 0,
      peakHours: []
    };
  
    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date);
      const hour = date.getHours();
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  
      activityPatterns.timeDistribution[hour] = (activityPatterns.timeDistribution[hour] || 0) + 1;
      if (isWeekend) {
        activityPatterns.weekendActivity++;
      } else {
        activityPatterns.weekdayActivity++;
      }
    });
  
    // Calculate peak hours
    const hours = Object.entries(activityPatterns.timeDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
    activityPatterns.peakHours = hours;
  
    return {
      frequency: commits.length,
      authors: new Set(commits.map(c => c.commit.author.email)).size,
      activityPatterns,
      isConsistent: true // Simplified for now
    };
  };
  
  export const analyzeContributors = (contributors) => {
    if (!contributors.length) return { numberOfContributors: 0, totalContributions: 0, contributionDistribution: [] };
    
    const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0);
    
    return {
      numberOfContributors: contributors.length,
      totalContributions,
      contributionDistribution: contributors.map(c => ({
        login: c.login,
        percentage: (c.contributions / totalContributions) * 100
      }))
    };
  };
  
  export const analyzeBranches = (branches) => {
    return {
      count: branches.length,
      protected: Boolean(branches.find(b => b.protected)),
      patterns: {
        hasFeatureBranches: branches.some(b => b.name.startsWith('feature/')),
        hasDevBranch: branches.some(b => b.name === 'dev' || b.name === 'develop'),
        hasReleaseBranches: branches.some(b => b.name.startsWith('release/'))
      },
      staleCount: branches.filter(b => {
        const lastUpdate = new Date(b.commit?.committer?.date || Date.now());
        const daysSinceUpdate = (Date.now() - lastUpdate) / (1000 * 60 * 60 * 24);
        return daysSinceUpdate > 90;
      }).length
    };
  };
  
  export const analyzeSecurityFeatures = (files, workflows = []) => {
    return {
      hasSecurityPolicy: files.some(f => f.name.toLowerCase() === 'security.md'),
      hasDependabot: workflows.some(w => w.name?.toLowerCase().includes('dependabot')),
      hasCodeScanning: workflows.some(w => w.name?.toLowerCase().includes('codeql')),
      securityFeatures: countSecurityFeatures(files, workflows)
    };
  };
  
  export const calculateMetrics = (issues, pulls, contributors) => {
    const totalIssues = issues.length;
    const closedIssues = issues.filter(i => i.state === 'closed').length;
    const totalPulls = pulls.length;
    const mergedPulls = pulls.filter(p => p.merged_at).length;
  
    return {
      issueResolutionRate: totalIssues ? closedIssues / totalIssues : 0,
      pullRequestRate: totalPulls ? mergedPulls / totalPulls : 0,
      contributorCount: contributors.length,
      issuesPerContributor: contributors.length ? totalIssues / contributors.length : 0
    };
  };
  
  const calculateRiskFactors = (repoData, commits, issues) => {
    const risks = [];
  
    // Infrequent updates
    if (commits.length > 0) {
      const lastCommitDate = new Date(commits[0].commit.author.date);
      if ((new Date() - lastCommitDate) / (1000 * 60 * 60 * 24) > 180) {
        risks.push('Infrequent Updates');
      }
    }
  
    // Low engagement
    if (repoData.open_issues_count > repoData.stargazers_count * 0.1) {
      risks.push('High Issue-to-Star Ratio');
    }
  
    // Documentation concerns
    if (!repoData.has_wiki && !repoData.has_pages) {
      risks.push('Limited Documentation');
    }
  
    return risks;
  };
  
  const countSecurityFeatures = (files, workflows) => {
    let count = 0;
    
    if (files.some(f => f.name.toLowerCase() === 'security.md')) count++;
    if (workflows.some(w => w.name.toLowerCase().includes('dependabot'))) count++;
    if (workflows.some(w => w.name.toLowerCase().includes('codeql'))) count++;
    
    return count;
  };