import React from 'react';
import { CheckCircle, AlertTriangle,Clock,GitPullRequest,Shield,Star,GitFork,Users } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';
import { TRUST_FACTORS } from '../../constants';
import Progress from '../ui/Progress';

const OverviewTab = ({ data }) => {
  if (!data) return null;

  const { timeMetrics, health, commitAnalysis, contributors, repoData, codeQuality } = data;

  // Calculate metrics
  const metrics = {
    stars: repoData?.stargazers_count || 0,
    forks: repoData?.forks_count || 0,
    contributors: contributors?.numberOfContributors || 0,
    openIssues: repoData?.open_issues_count || 0,
    weeklyCommits: commitAnalysis?.frequency ? 
      Math.round((commitAnalysis.frequency / (timeMetrics?.age / 7 || 1)) * 10) / 10 : 0
  };

  // Calculate code quality indicators
  const qualityChecks = [
    { label: 'Documentation', passing: codeQuality?.hasReadme },
    { label: 'Security Policy', passing: codeQuality?.hasSecurityPolicy },
    { label: 'Code Testing', passing: codeQuality?.codeStyle?.hasTypeChecking },
    { label: 'Automated Checks', passing: codeQuality?.codeStyle?.hasLinter }
  ];

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Repository Health Analysis</h2>
          <div className={`px-4 py-2 rounded-full text-lg font-semibold ${
            health.score >= 80 ? 'bg-green-100 text-green-800' :
            health.score >= 60 ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {health.score}/100
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
            <p className="text-sm text-gray-600">Repository Age</p>
              <p className="font-medium">
                {timeMetrics.age < 30 
                  ? `${Math.round(timeMetrics.age)} days`
                  : `${Math.round(timeMetrics.age / 30)} months`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GitPullRequest className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Last Update</p>
              <p className="font-medium">{timeMetrics.lastUpdated} days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Development Status</p>
              <p className="font-medium">{timeMetrics.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <MetricCard
          title="Stars"
          value={metrics.stars.toLocaleString()}
          description="Community Interest"
          icon={Star}
        />
        <MetricCard
          title="Forks"
          value={metrics.forks.toLocaleString()}
          description="Project Forks"
          icon={GitFork}
        />
        <MetricCard
          title="Contributors"
          value={metrics.contributors.toLocaleString()}
          description="Unique Contributors"
          icon={Users}
        />
        <MetricCard
          title="Issues"
          value={metrics.openIssues.toLocaleString()}
          description="Open Issues"
          icon={GitPullRequest}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Development Activity */}
        <AnalysisSection title="Development Activity">
          <div className="space-y-2">
            <div className="p-3 bg-gray-40 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Weekly Commits</span>
                <span className="text-sm text-gray-600">{metrics.weeklyCommits} avg</span>
              </div>
              <Progress 
                value={Math.min((metrics.weeklyCommits / 10) * 100, 100)} 
                className="h-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Active Days</p>
                <p className="text-xl font-semibold">{
                  commitAnalysis?.activityPatterns?.weekdayActivity || 0
                }</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Contributors</p>
                <p className="text-xl font-semibold">{metrics.contributors}</p>
              </div>
            </div>
          </div>
        </AnalysisSection>

        {/* Code Quality */}
        <AnalysisSection title="Code Quality">
          <div className="space-y-3">
            {qualityChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">{check.label}</span>
                {check.passing ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            ))}
          </div>
        </AnalysisSection>
      </div>

      {/* Contributors */}
      {contributors?.contributionDistribution && (
        <AnalysisSection title="Top Contributors">
          <div className="space-y-4">
            {contributors.contributionDistribution.slice(0, 5).map((contributor) => (
              <div key={contributor.login} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{contributor.login}</span>
                      <a
                        href={`https://github.com/${contributor.login}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        <span className="sr-only">Visit {contributor.login}'s GitHub profile</span>
                      </a>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {contributor.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={contributor.percentage} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      {/* Risk Factors */}
      {health.riskFactors && health.riskFactors.length > 0 && (
        <AnalysisSection title="Risk Factors">
          <Alert variant="destructive" className="border-red-200">
            <AlertTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Areas of Concern
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
    </div>
  );
};

export default OverviewTab;