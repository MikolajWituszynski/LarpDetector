import { 
    Activity,
    Code, 
    Package, 
    Clock,
    Users,
    Shield,
    GitBranch,
    AlertTriangle
  } from 'lucide-react';
  
  export const TABS = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Activity,
    },
    {
      id: 'code',
      label: 'Code Quality',
      icon: Code,
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
      id: 'security',
      label: 'Security',
      icon: Shield,
    },
    {
      id: 'branches',
      label: 'Branches',
      icon: GitBranch,
    },
    {
      id: 'risks',
      label: 'Risks',
      icon: AlertTriangle,
    },
  ];
  
  export const TRUST_FACTORS = {
    'Active Maintenance': 'Regular commits and updates within the last month',
    'Documentation': 'Comprehensive README and additional documentation',
    'Testing': 'Presence of test files and CI integration',
    'Security Measures': 'Security policy and automated security checks',
    'Community Guidelines': 'Code of conduct and contribution guidelines',
    'Stable Release': 'Tagged releases with semantic versioning',
  };
  
  export const HEALTH_SCORE_COLORS = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800',
  };
  
  export const getHealthScoreColor = (score) => {
    if (score > 80) return HEALTH_SCORE_COLORS.high;
    if (score > 60) return HEALTH_SCORE_COLORS.medium;
    return HEALTH_SCORE_COLORS.low;
  };