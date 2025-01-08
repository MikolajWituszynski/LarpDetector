import React from 'react';
import { GitBranch, GitMerge, GitCommit, Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';
import Progress from "../ui/Progress"
const calculateBranchHealth = (branches) => {
  let score = 100;
  
  // Deduct points for no branch protection
  if (!branches.protected) score -= 20;
  
  // Deduct for missing branch patterns
  if (!branches.patterns.hasFeatureBranches) score -= 10;
  if (!branches.patterns.hasDevBranch) score -= 10;
  if (!branches.patterns.hasReleaseBranches) score -= 10;
  
  // Deduct for too many stale branches
  if (branches.staleCount > 5) score -= 20;
  
  return Math.max(0, score);
};

const BranchesTab = ({ data }) => {
  if (!data) return null;

  const { branches } = data;
  const totalBranches = branches.count || 0;
  const healthScore = calculateBranchHealth(branches);

  return (
    <div className="space-y-6">
      {/* Branch Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Branches"
          value={totalBranches}
          description="Active repository branches"
        />
        <MetricCard
          title="Branch Health"
          value={`${healthScore}%`}
          description="Overall branch structure health"
        />
        <MetricCard
          title="Protected Branches"
          value={branches.protectedCount || 0}
          description="Branches with protection rules"
        />
      </div>

      {/* Main Branch Status */}
      <AnalysisSection title="Default Branch">
        <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-start gap-3">
            <GitBranch className="h-5 w-5 text-blue-600 mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-blue-900">
                  {branches.defaultBranch?.name || 'main'}
                </h4>
                {branches.defaultBranch?.protected && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Protected
                  </span>
                )}
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-sm text-blue-700">
                  <p>Last commit: {branches.defaultBranch?.lastCommit?.date || 'N/A'}</p>
                  <p>Commits ahead: {branches.defaultBranch?.aheadCount || 0}</p>
                </div>
                <div className="text-sm text-blue-700">
                  <p>Status checks: {branches.defaultBranch?.checksEnabled ? 'Enabled' : 'Disabled'}</p>
                  <p>Reviews required: {branches.defaultBranch?.requiredReviews || 'None'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnalysisSection>

      {/* Branch Categories */}
      <AnalysisSection 
        title="Branch Structure"
        subtitle="Organization of repository branches"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              type: 'Feature Branches',
              present: branches.patterns.hasFeatureBranches,
              count: branches.featureBranchCount || 0,
              description: 'Branches for new features and improvements',
              icon: GitBranch
            },
            {
              type: 'Development Branch',
              present: branches.patterns.hasDevBranch,
              count: 1,
              description: 'Integration branch for ongoing development',
              icon: GitCommit
            },
            {
              type: 'Release Branches',
              present: branches.patterns.hasReleaseBranches,
              count: branches.releaseBranchCount || 0,
              description: 'Branches for release preparation',
              icon: GitMerge
            },
            {
              type: 'Hotfix Branches',
              present: branches.patterns.hasHotfixBranches,
              count: branches.hotfixBranchCount || 0,
              description: 'Branches for critical fixes',
              icon: GitBranch
            }
          ].map((category) => (
            <div
              key={category.type}
              className={`p-4 rounded-lg border ${
                category.present ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <category.icon 
                  className={`h-5 w-5 ${
                    category.present ? 'text-green-600' : 'text-gray-400'
                  }`}
                />
                <div>
                  <h4 className="font-medium">{category.type}</h4>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  {category.present && (
                    <p className="text-sm text-gray-600 mt-2">
                      {category.count} branch{category.count !== 1 ? 'es' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Protection Rules */}
      <AnalysisSection 
        title="Branch Protection"
        subtitle="Security measures for critical branches"
      >
        <div className="space-y-4">
          {branches.protectionRules?.map((rule, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{rule.pattern}</h4>
                    {rule.strict && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        Strict
                      </span>
                    )}
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <GitMerge className="h-4 w-4" />
                        {rule.requiresApproval 
                          ? `${rule.requiredApprovals} approval(s) required`
                          : 'No approvals required'
                        }
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <GitCommit className="h-4 w-4" />
                        {rule.requiresStatusChecks 
                          ? 'Status checks required'
                          : 'No status checks required'
                        }
                      </div>
                    </div>
                    {rule.restrictions && (
                      <p className="text-sm text-gray-600">
                        Push access restricted to specific users/teams
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Branch Age Analysis */}
      <AnalysisSection 
        title="Branch Age Analysis"
        subtitle="Distribution of branch ages"
      >
        <div className="space-y-4">
          {branches.ageDistribution?.map((category) => (
            <div key={category.range} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{category.range}</span>
                <span className="text-sm text-gray-600">
                  {category.count} branch{category.count !== 1 ? 'es' : ''}
                  {' '}({((category.count / totalBranches) * 100).toFixed(1)}%)
                </span>
              </div>
              <Progress 
                value={(category.count / totalBranches) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Stale Branches Warning */}
      {branches.staleCount > 0 && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Stale Branches Detected</AlertTitle>
          <AlertDescription>
            Found {branches.staleCount} branches with no activity in the last 3 months.
            Consider cleaning up unused branches to maintain repository health.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BranchesTab;