// src/constants.js
import { 
  Activity,
  Code, 
  Package, 
  Clock,
  Users,
  Shield,
  GitBranch,
  AlertTriangle,
  Map,
  ChevronLeft,
  Twitter,
  Info
} from 'lucide-react';

export const SAMPLE_REPOS = {
  excellent: {
    url: "https://github.com/Uniswap/v3-core",
    description: "High-quality DeFi protocol with excellent practices"
  },
  good: {
    url: "https://github.com/aave/aave-v3-core",
    description: "Well-maintained lending protocol"
  },
  basic: {
    url: "https://github.com/compound-finance/compound-protocol",
    description: "Basic but functional DeFi implementation"
  }
};

export const TABS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Activity,
  }
];

export const TRUST_FACTORS = {
  'Active Maintenance': 'Regular updates within the last 30 days',
  'Documentation': 'Comprehensive documentation available',
  'Testing': 'Has automated tests and CI integration',
  'Security Measures': 'Security policy and automated checks',
  'Community Guidelines': 'Clear contribution and community guidelines',
  'Stable Release': 'Regular release cycle maintained'
};

export const HEALTH_SCORE_RANGES = {
  exceptional: {
    range: '90-100',
    description: 'Professional repository with exceptional practices',
    indicators: [
      'Frequent updates and active maintenance',
      'Extensive documentation and testing',
      'Large, engaged community',
      'Strong security measures'
    ]
  },
  excellent: {
    range: '80-89',
    description: 'High-quality repository with strong practices',
    indicators: [
      'Regular updates and maintenance',
      'Good documentation and testing',
      'Active community',
      'Proper security measures'
    ]
  },
  good: {
    range: '70-79',
    description: 'Solid repository with good practices',
    indicators: [
      'Consistent updates',
      'Basic documentation',
      'Growing community',
      'Basic security measures'
    ]
  },
  fair: {
    range: '50-69',
    description: 'Basic repository with some areas for improvement',
    indicators: [
      'Semi-regular updates',
      'Some documentation',
      'Small community',
      'Basic security'
    ]
  },
  needs_improvement: {
    range: 'Below 50',
    description: 'Areas needing significant improvement',
    indicators: [
      'Infrequent updates',
      'Limited documentation',
      'Small or inactive community',
      'Limited security measures'
    ]
  }
};

export const calculateActivityScore = (repoData) => {
  let score = 60; // Base score

  // Recent activity scoring (max 20 points)
  if (repoData.timeMetrics && repoData.timeMetrics.isActive) {
    score += 20;
  } else if (repoData.timeMetrics && repoData.timeMetrics.lastUpdated < 90) {
    score += 15;
  }

  // Commit patterns (max 20 points)
  if (repoData.commitAnalysis) {
    if (repoData.commitAnalysis.isConsistent) score += 10;
    if (repoData.commitAnalysis.frequency > 0) score += 10;
  }

  return Math.min(100, score);
};

export const calculateQualityScore = (repoData) => {
  let score = 60; // Base score
  
  if (!repoData.codeQuality) return score;

  // Documentation (max 20 points)
  if (repoData.codeQuality.hasReadme) score += 5;
  if (repoData.codeQuality.hasContributing) score += 5;
  if (repoData.codeQuality.hasLicense) score += 5;
  if (repoData.codeQuality.hasChangelog) score += 5;

  // Code quality tools (max 20 points)
  if (repoData.codeQuality.codeStyle) {
    if (repoData.codeQuality.codeStyle.hasLinter) score += 5;
    if (repoData.codeQuality.codeStyle.hasTypeChecking) score += 5;
    if (repoData.codeQuality.codeStyle.hasEditorConfig) score += 5;
    if (repoData.codeQuality.codeStyle.hasFormatting) score += 5;
  }

  return Math.min(100, score);
};

export const calculateCommunityScore = (repoData) => {
  let score = 60; // Base score

  // Stars scoring (max 20 points)
  const stars = repoData.repoData?.stargazers_count || 0;
  if (stars >= 1000) score += 20;
  else if (stars >= 500) score += 15;
  else if (stars >= 100) score += 10;
  else if (stars > 0) score += 5;

  // Contributors scoring (max 20 points)
  const contributorCount = repoData.contributors?.numberOfContributors || 0;
  if (contributorCount >= 10) score += 20;
  else if (contributorCount >= 5) score += 15;
  else if (contributorCount >= 2) score += 10;
  else if (contributorCount > 0) score += 5;

  return Math.min(100, score);
};

export const getProjectHealthScore = (repoData) => {
  const activityScore = calculateActivityScore(repoData);
  const qualityScore = calculateQualityScore(repoData);
  const communityScore = calculateCommunityScore(repoData);
  
  // Weighted average with higher weight on activity and quality
  return Math.round(
    (activityScore * 0.4) +
    (qualityScore * 0.4) +
    (communityScore * 0.2)
  );
};

export const getHealthScoreColor = (score) => {
  if (score >= 90) return 'bg-indigo-100 text-indigo-800';
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 70) return 'bg-emerald-100 text-emerald-800';
  if (score >= 50) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const getHealthScoreDisplay = (score) => {
  if (score >= 90) return {
    color: 'bg-indigo-100 text-indigo-800',
    label: 'Exceptional',
    description: `${score}/100 - Professional grade repository`
  };
  if (score >= 80) return {
    color: 'bg-green-100 text-green-800',
    label: 'Excellent',
    description: `${score}/100 - High quality repository`
  };
  if (score >= 70) return {
    color: 'bg-emerald-100 text-emerald-800',
    label: 'Good',
    description: `${score}/100 - Solid repository`
  };
  if (score >= 50) return {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Fair',
    description: `${score}/100 - Developing repository`
  };
  return {
    color: 'bg-red-100 text-red-800',
    label: 'Concerning',
    description: `${score}/100 - Multiple concerns identified`
  };
};