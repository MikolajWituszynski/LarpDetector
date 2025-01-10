// src/constants.js
import { 
  Activity,
  Code, 
  Package, 
  Clock,
  Users,
  Shield,
  GitBranch,
  AlertTriangle,Map,ChevronLeft,Twitter
} from 'lucide-react';


export const MATURITY_LEVELS = {
  NEW: 'new',           // 0-9 months (increased from 6)
  EMERGING: 'emerging', // 9-18 months (increased from 12)
  GROWING: 'growing',   // 18-24 months (increased from 18)
  MATURE: 'mature'      // 24+ months
  };

// MODIFIED: Adjusted age thresholds to match new maturity levels
export const getMaturityLevel = (age) => {
  if (age <= 270) return MATURITY_LEVELS.NEW;        // 9 months
  if (age <= 547) return MATURITY_LEVELS.EMERGING;   // 18 months
  if (age <= 730) return MATURITY_LEVELS.GROWING;    // 24 months
  return MATURITY_LEVELS.MATURE;
  };

export const TRUST_FACTORS = {
  'Active Maintenance': 'Any updates in the last 90 days',
  'Documentation': 'Has a README file',
  'Community Engagement': 'Has stars or multiple contributors',
  'Quality Practices': 'Has tests, CI, or linting configured',
  'Security Awareness': 'Has security policy or automated checks'
};
// Completely revised scoring system to match real-world GitHub patterns
export const MATURITY_EXPECTATIONS = {
  [MATURITY_LEVELS.NEW]: {
    expectedCommits: 1,       // 4 commits per week for new projects
    expectedContributors: 1,  // Single contributor is normal
    minStars: 0,             // No star expectation for new projects
    basicRequirements: [
      'README.md'            // Only README required initially
    ],
    bonusFeatures: [
      'LICENSE',
      '.gitignore'
    ],
    expectedScore: 60        // Base expectation for new projects
  },
  [MATURITY_LEVELS.EMERGING]: {
    expectedCommits: 2,      // 8 commits per week shows good momentum
    expectedContributors: 2, // Starting to attract contributors
    minStars: 10,           // Some community interest
    basicRequirements: [
      'README.md',
      'LICENSE'
    ],
    bonusFeatures: [
      'CONTRIBUTING.md',
      '.github/workflows'    // Basic CI/CD
    ],
    expectedScore: 70       // Higher expectations
  },
  [MATURITY_LEVELS.GROWING]: {
    expectedCommits: 3,     // 12 commits per week shows active development
    expectedContributors: 3, // Growing contributor base
    minStars: 30,          // Good community interest
    basicRequirements: [
      'README.md',
      'LICENSE',
      'CONTRIBUTING.md'
    ],
    bonusFeatures: [
      'SECURITY.md',
      'tests/',
      '.github/workflows'
    ],
    expectedScore: 80      // Strong project expectations
  },
  [MATURITY_LEVELS.MATURE]: {
    expectedCommits: 4,     // 16 commits per week for mature projects
    expectedContributors: 4, // Established contributor base
    minStars: 100,         // Strong community interest
    basicRequirements: [
      'README.md',
      'LICENSE',
      'CONTRIBUTING.md',
      'SECURITY.md'
    ],
    bonusFeatures: [
      'tests/',
      'docs/',
      '.github/workflows',
      'CODE_OF_CONDUCT.md'
    ],
    expectedScore: 90      // High expectations for mature projects
  }
};
export const TABS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Activity,
  },
  
  {
    id: 'activity',
    label: 'Activity',
    icon: Clock,
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
  },
  {
    id: 'code',
    label: 'Code Quality (advanced)',
    icon: Code,
  }
];



// New helper function to provide context
export const getMaturityContext = (repo) => {
  const context = {
    strengths: [],
    suggestions: []
  };

  // Add strengths
  if (repo.stargazers_count > 100) context.strengths.push('Strong community interest');
  if (repo.contributors > 2) context.strengths.push('Active contributor base');
  if (repo.hasRecentActivity) context.strengths.push('Regular maintenance');
  if (repo.docs?.includes('README.md')) context.strengths.push('Well documented');

  // Add contextual suggestions
  if (!repo.hasTests) context.suggestions.push('Consider adding basic tests');
  if (!repo.hasSecurity) context.suggestions.push('Consider adding security policy');
  if (repo.contributors === 1) context.suggestions.push('Look for opportunities to grow contributor base');

  return context;
};

// Complete the getContextualMessage function



// Even more lenient color thresholds with status labels
export const getHealthScoreColor = (score) => {
  if (score >= 60) return 'bg-green-100 text-green-800';   // Healthy
  if (score >= 40) return 'bg-blue-100 text-blue-800';     // Promising
  if (score >= 20) return 'bg-yellow-100 text-yellow-800'; // Developing
  return 'bg-gray-100 text-gray-800';                      // New
};

// Helper function to get status text
export const getHealthStatus = (score) => {
  if (score >= 60) return 'Healthy';
  if (score >= 40) return 'Promising';
  if (score >= 20) return 'Developing';
  return 'New';
};
export const getContextualMessage = (metricName, value, maturityLevel) => {
  const contexts = {
    commitFrequency: {
      [MATURITY_LEVELS.NEW]: {
        low: "Initial development phase - any activity is positive",
        medium: "Good development momentum!",
        high: "Excellent activity level for a new project!"
      },
      [MATURITY_LEVELS.EMERGING]: {
        low: "Building momentum - keep pushing!",
        medium: "Good consistent activity",
        high: "Strong development pace!"
      },
      [MATURITY_LEVELS.GROWING]: {
        low: "Activity could be increased",
        medium: "Maintaining good momentum",
        high: "Very active development"
      },
      [MATURITY_LEVELS.MATURE]: {
        low: "Could benefit from more frequent updates",
        medium: "Steady maintenance",
        high: "Excellent maintenance level"
      }
    },
    contributors: {
      [MATURITY_LEVELS.NEW]: {
        single: "Solo development is normal at this stage",
        multiple: "Great to see early collaboration!"
      },
      [MATURITY_LEVELS.EMERGING]: {
        single: "Consider opening to contributions",
        multiple: "Growing contributor base!"
      },
      [MATURITY_LEVELS.GROWING]: {
        single: "Could benefit from more contributors",
        multiple: "Healthy collaboration level"
      },
      [MATURITY_LEVELS.MATURE]: {
        single: "Repository could be more collaborative",
        multiple: "Strong community participation"
      }
    },
    issueResolution: {
      [MATURITY_LEVELS.NEW]: {
        low: "Starting to handle community feedback",
        medium: "Good response to issues",
        high: "Excellent issue management!"
      },
      [MATURITY_LEVELS.EMERGING]: {
        low: "More active issue management needed",
        medium: "Maintaining good issue response",
        high: "Great issue resolution rate!"
      }
    },
    codeQuality: {
      [MATURITY_LEVELS.NEW]: {
        low: "Focus on adding basic quality tools",
        medium: "Good foundation for quality",
        high: "Excellent quality practices!"
      },
      [MATURITY_LEVELS.EMERGING]: {
        low: "Consider adding more quality checks",
        medium: "Good quality maintenance",
        high: "Strong quality practices!"
      }
    }
  };
  
  // Return default messages if specific context not found
  if (!contexts[metricName]?.[maturityLevel]?.[value]) {
    return "Showing good progress";
  }
  
  return contexts[metricName][maturityLevel][value];
};


// Updated health score display thresholds
export const getHealthScoreDisplay = (score) => {
  const levels = {
    exceptional: { min: 95, color: 'bg-indigo-100 text-indigo-800', label: 'Exceptional' },
    excellent: { min: 85, color: 'bg-green-100 text-green-800', label: 'Excellent' },
    veryGood: { min: 75, color: 'bg-emerald-100 text-emerald-800', label: 'Very Good' },
    good: { min: 65, color: 'bg-blue-100 text-blue-800', label: 'Good' },
    fair: { min: 55, color: 'bg-yellow-100 text-yellow-800', label: 'Fair' },
    developing: { min: 0, color: 'bg-gray-100 text-gray-800', label: 'Developing' }
  };

  const level = Object.values(levels).find(l => score >= l.min) || levels.developing;
  
  return {
    color: level.color,
    label: level.label,
    description: `${level.label} (${score}/100)`
  };
};


export const getScoreBreakdown = (repo) => ({
  activity: calculateActivityScore(repo),
  quality: calculateQualityScore(repo),
  community: calculateCommunityScore(repo),
  total: getMaturityScore(repo)
});


// Revised scoring system with lower base scores and better distribution

export const calculateActivityScore = (repo) => {
  let score = 25; // Lower base score
  
  // Recent activity scoring (max 35 points)
  if (repo.hasRecentActivity) {
    const daysAgo = repo.timeMetrics?.lastUpdated || 0;
    if (daysAgo === 0) score += 35;
    else if (daysAgo <= 7) score += 30;
    else if (daysAgo <= 30) score += 20;
    else if (daysAgo <= 90) score += 10;
  }

  // Commit frequency scoring (max 35 points)
  if (repo.commitAnalysis?.frequency > 0) {
    const weeklyCommits = repo.commitAnalysis.frequency / (repo.timeMetrics?.age / 7 || 1);
    if (weeklyCommits >= 10) score += 35;
    else if (weeklyCommits >= 5) score += 25;
    else if (weeklyCommits >= 2) score += 15;
    else if (weeklyCommits >= 1) score += 10;
  }

  return Math.min(100, score);
};

export const calculateQualityScore = (repo) => {
  let score = 25; // Lower base score
  
  // Documentation scoring (max 30 points)
  let docScore = 0;
  if (repo.docs?.includes('README.md')) docScore += 15;
  if (repo.docs?.includes('CONTRIBUTING.md')) docScore += 8;
  if (repo.docs?.includes('SECURITY.md')) docScore += 7;
  score += Math.min(30, docScore);
  
  // Code quality tools (max 40 points)
  let toolScore = 0;
  if (repo.hasTests) toolScore += 15;
  if (repo.hasCI || repo.hasGithubActions) toolScore += 10;
  if (repo.hasLinter) toolScore += 8;
  if (repo.hasCodeowners) toolScore += 7;
  score += Math.min(40, toolScore);
  
  return Math.min(100, score);
};

export const calculateCommunityScore = (repo) => {
  let score = 25; // Lower base score

  // Star scoring (max 35 points)
  if (repo.stargazers_count >= 1000) score += 35;
  else if (repo.stargazers_count >= 500) score += 30;
  else if (repo.stargazers_count >= 100) score += 25;
  else if (repo.stargazers_count >= 50) score += 20;
  else if (repo.stargazers_count > 0) score += 10;

  // Contributor scoring (max 35 points)
  if (repo.contributors > 10) score += 35;
  else if (repo.contributors > 5) score += 30;
  else if (repo.contributors > 2) score += 25;
  else if (repo.contributors > 1) score += 15;

  return Math.min(100, score);
};

export const getMaturityScore = (repo) => {
  const activityScore = calculateActivityScore(repo);
  const qualityScore = calculateQualityScore(repo);
  const communityScore = calculateCommunityScore(repo);
  
  // Calculate weighted score
  const weightedScore = (
    activityScore * 0.35 +    // Activity weight
    qualityScore * 0.35 +     // Quality weight
    communityScore * 0.30     // Community weight
  );
  
  // Apply maturity level minimums but with lower thresholds
  const maturityLevel = getMaturityLevel(repo.timeMetrics?.age || 0);
  const minScore = Math.max(20, MATURITY_EXPECTATIONS[maturityLevel].expectedScore - 20);
  
  // More conservative bonus scoring
  let bonusScore = 0;
  if (repo.timeMetrics?.age > 730) { // More than 2 years
    bonusScore += 5;
  }
  if (repo.stargazers_count > 1000 && repo.contributors > 10) {
    bonusScore += 5;
  }
  
  return Math.min(100, Math.max(minScore, Math.round(weightedScore + bonusScore)));
};