import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';
import { TRUST_FACTORS } from '../../constants';

const OverviewTab = ({ data }) => {
  if (!data) return null;

  const { timeMetrics, metrics, health, commitAnalysis } = data;

  const getHealthScoreColor = (score) => {
    if (score >= 80) {
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        accent: 'text-green-600',
        border: 'border-green-200'
      };
    }
    if (score >= 60) {
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        accent: 'text-yellow-600',
        border: 'border-yellow-200'
      };
    }
    if (score >= 40) {
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        accent: 'text-orange-600',
        border: 'border-orange-200'
      };
    }
    return {
      bg: 'bg-red-100',
      text: 'text-red-800',
      accent: 'text-red-600',
      border: 'border-red-200'
    };
  };

  const scoreColors = getHealthScoreColor(health.score);

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-lg border ${scoreColors.border} p-6`}>
          <div className="flex flex-col space-y-1.5">
            <h3 className="font-medium text-sm text-gray-600">Health Score</h3>
            <div className={`text-2xl font-bold ${scoreColors.text}`}>
              {health.score}/100
            </div>
            <div className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreColors.bg} ${scoreColors.text}`}>
              {health.score >= 80 ? 'Excellent' :
               health.score >= 60 ? 'Good' :
               health.score >= 40 ? 'Fair' :
               'Poor'}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Overall repository health based on multiple factors
            </p>
          </div>
        </div>
        <MetricCard
          title="Activity Level"
          value={commitAnalysis.isConsistent ? 'Active' : 'Irregular'}
          description="Repository activity level based on commit patterns"
        />
        <MetricCard
          title="Community Size"
          value={metrics.contributorCount}
          description="Number of unique contributors"
        />
      </div>

      {/* Repository Details */}
      <AnalysisSection title="Repository Details">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-600">Age</h4>
            <p className="text-lg">{timeMetrics.age} days</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-600">Last Updated</h4>
            <p className="text-lg">{timeMetrics.lastUpdated} days ago</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-600">Status</h4>
            <p className="text-lg">{timeMetrics.isActive ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      </AnalysisSection>

      {/* Rest of the component remains the same */}
      <AnalysisSection title="Activity Metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Issue Resolution Rate"
            value={`${(metrics.issueResolutionRate * 100).toFixed(1)}%`}
            description="Percentage of closed issues"
          />
          <MetricCard
            title="PR Merge Rate"
            value={`${(metrics.pullRequestRate * 100).toFixed(1)}%`}
            description="Percentage of merged pull requests"
          />
          <MetricCard
            title="Issues per Contributor"
            value={metrics.issuesPerContributor.toFixed(1)}
            description="Average issues handled per contributor"
          />
        </div>
      </AnalysisSection>

      {/* Trust Factors */}
      {health.trustFactors.length > 0 && (
        <AnalysisSection title="Trust Indicators">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {health.trustFactors.map((factor) => (
              <div key={factor} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-900">{factor}</h4>
                  <p className="text-sm text-green-700">{TRUST_FACTORS[factor]}</p>
                </div>
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      {/* Risk Factors */}
      {health.riskFactors.length > 0 && (
        <AnalysisSection title="Risk Factors">
          <Alert variant="destructive" className="border-red-200">
            <AlertTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Potential Concerns
            </AlertTitle>
            <AlertDescription>
              <ul className="list-none pl-0 mt-2 space-y-2">
                {health.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </AnalysisSection>
      )}

      {/* Owner Information */}
      {data.repoData.ownerInfo && (
        <AnalysisSection title="Repository Owner">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-600">Type</h4>
              <p className="text-lg">{data.repoData.ownerInfo.type}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-600">Public Repositories</h4>
              <p className="text-lg">{data.repoData.ownerInfo.publicRepos}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-600">Followers</h4>
              <p className="text-lg">{data.repoData.ownerInfo.followers}</p>
            </div>
          </div>
        </AnalysisSection>
      )}
    </div>
  );
};

export default OverviewTab;
