// src/constants.js
import { 
  Activity,
  Code, 
  Package, 
  Clock,
  Users,
  Shield,
  GitBranch,
  AlertTriangle,Map,ChevronLeft
} from 'lucide-react';

export const TRUST_FACTORS = {
  'Active Maintenance': 'Regular commits and updates in the last 30 days',
  'Documentation': 'Comprehensive documentation and wiki available',
  'Active Community': 'Multiple active contributors',
  'Responsive Maintenance': 'High issue resolution rate',
  'Security Measures': 'Security features and analysis enabled',
  'Stable Releases': 'Regular release cycle maintained',
  'Community Guidelines': 'Clear contribution and community guidelines'
};

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
    id: 'dependencies',
    label: 'Dependencies',
    icon: Package,
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
  {
    id: 'roadmap',
    label: 'Roadmap',
    icon: Map,
    ChevronLeft  // Import this from lucide-react
  },
];

export const getHealthScoreColor = (score) => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};