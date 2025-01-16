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
  },
  {
    id: 'dependencies',
    label: 'Dependencies',
    icon: Package,
  },
];

export const TRUST_FACTORS = {
  'Established Project': 'Repository has been active for a significant period',
  'Trusted Contributors': 'Multiple contributors with established GitHub history',
  'Consistent Development': 'Regular and natural development patterns',
  'Quality Standards': 'Professional development practices and documentation',
  'Active Community': 'Engaged community with organic growth patterns'
};

export const RISK_FACTORS = {
  'New Repository': 'Project was created recently',
  'Limited Contributor History': 'Contributors have limited or no track record',
  'Irregular Activity': 'Unusual or inconsistent development patterns',
  'Basic Code Standards': 'Missing key professional development practices',
  'Low Community Engagement': 'Limited community interaction and growth'
};

export const getHealthScoreColor = (score) => {
  if (score >= 80) return 'bg-indigo-100 text-indigo-800';
  if (score >= 60) return 'bg-green-100 text-green-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  if (score >= 20) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

export const getHealthScoreBadge = (score) => {
  if (score >= 80) return {
    color: 'bg-indigo-100 text-indigo-800',
    label: 'Very Low Risk',
    description: `${score}/100 - Strong trust indicators`
  };
  if (score >= 60) return {
    color: 'bg-green-100 text-green-800',
    label: 'Low Risk',
    description: `${score}/100 - Good trust indicators`
  };
  if (score >= 40) return {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Moderate Risk',
    description: `${score}/100 - Some concerns identified`
  };
  if (score >= 20) return {
    color: 'bg-orange-100 text-orange-800',
    label: 'High Risk',
    description: `${score}/100 - Multiple risk factors`
  };
  return {
    color: 'bg-red-100 text-red-800',
    label: 'Critical Risk',
    description: `${score}/100 - Significant risk indicators`
  };
};

export const HEALTH_SCORE_RANGES = {
  exceptional: {
    range: '80-100',
    description: 'Very low risk with strong trust indicators',
    indicators: [
      'Established project history',
      'Multiple trusted contributors',
      'Consistent development patterns',
      'Professional code quality',
      'Active, organic community'
    ]
  },
  good: {
    range: '60-79',
    description: 'Low risk with positive trust indicators',
    indicators: [
      'Moderate project history',
      'Some trusted contributors',
      'Regular development activity',
      'Good code standards',
      'Growing community'
    ]
  },
  moderate: {
    range: '40-59',
    description: 'Moderate risk with mixed indicators',
    indicators: [
      'Limited project history',
      'Few verified contributors',
      'Some development activity',
      'Basic code standards',
      'Small community'
    ]
  },
  concerning: {
    range: '20-39',
    description: 'High risk with multiple concerns',
    indicators: [
      'Very new project',
      'Unverified contributors',
      'Irregular activity',
      'Minimal standards',
      'Limited engagement'
    ]
  },
  critical: {
    range: '0-19',
    description: 'Critical risk level',
    indicators: [
      'Brand new project',
      'Unknown contributors',
      'Suspicious activity',
      'Poor standards',
      'No community'
    ]
  }
};