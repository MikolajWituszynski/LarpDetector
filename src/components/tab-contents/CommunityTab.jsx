import React from 'react';
import { Users, Star, GitPullRequest, MessageCircle, GitFork, ExternalLink, TrendingUp } from 'lucide-react';
import Progress from "../ui/Progress";
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';

const CommunityTab = ({ data }) => {
  if (!data) return null;

  const { contributors, repoData } = data;

  // Calculate community metrics
  const metrics = {
    contributorCount: contributors?.numberOfContributors || 0,
    issueResolutionRate: data.repoData?.open_issues > 0 ? 
      1 - (data.repoData.open_issues / (data.repoData.open_issues + data.repoData.closed_issues || 1)) : 1,
    pullRequestRate: 0.75, // Default value if not available
    issuesPerContributor: (data.repoData?.open_issues || 0) / (contributors?.numberOfContributors || 1),
    activeUsers: contributors?.numberOfContributors || 0,
    totalContributions: contributors?.totalContributions || 0
  };

  const getGrowthRate = () => {
    const totalContributions = contributors?.totalContributions || 0;
    const monthlyAverage = totalContributions / (metrics.age || 1);
    return monthlyAverage.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Community Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Contributors"
          value={metrics.contributorCount}
          description="Total unique contributors"
        />
        <MetricCard
          title="Engagement"
          value={repoData?.stargazers_count || 0}
          description="Repository stars"
        />
        <MetricCard
          title="Issue Resolution"
          value={`${(metrics.issueResolutionRate * 100).toFixed(0)}%`}
          description="Issues resolved ratio"
        />
      </div>

      {/* Growth Metrics */}
      <AnalysisSection
        title="Community Growth"
        subtitle="Repository growth and engagement trends"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Monthly Growth</span>
            </div>
            <p className="text-2xl font-bold">{getGrowthRate()}</p>
            <p className="text-sm text-gray-600 mt-1">Contributions per month</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <GitFork className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Fork Rate</span>
            </div>
            <p className="text-2xl font-bold">{repoData?.forks_count || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Total repository forks</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Contributor Ratio</span>
            </div>
            <p className="text-2xl font-bold">
              {((metrics.contributorCount / (metrics.activeUsers || 1)) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Contributors to active users</p>
          </div>
        </div>
      </AnalysisSection>

      {/* Contributor Distribution */}
      {contributors?.contributionDistribution && (
        <AnalysisSection 
          title="Top Contributors"
          subtitle="Distribution of contributions"
        >
          <div className="space-y-4">
            {contributors.contributionDistribution.slice(0, 5).map((contributor) => (
              <div key={contributor.login} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{contributor.login}</span>
                    <a
                      href={`https://github.com/${contributor.login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
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

      {/* Community Health */}
      <AnalysisSection 
        title="Community Health"
        subtitle="Community engagement metrics"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium">Repository Activity</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Stars</span>
                </div>
                <p className="text-2xl font-bold mt-2">{repoData?.stargazers_count || 0}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Pull Requests</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.pullRequests?.totalCount || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Issue Engagement</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Open Issues</span>
                </div>
                <p className="text-2xl font-bold mt-2">{repoData?.open_issues_count || 0}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Active Users</span>
                </div>
                <p className="text-2xl font-bold mt-2">{metrics.activeUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </AnalysisSection>

      {/* Repository Features */}
      <AnalysisSection
        title="Repository Features"
        subtitle="Available community resources"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Wiki', enabled: repoData?.has_wiki },
            { name: 'Issues', enabled: repoData?.has_issues },
            { name: 'Projects', enabled: repoData?.has_projects },
            { name: 'Discussions', enabled: repoData?.has_discussions }
          ].map((feature) => (
            <div
              key={feature.name}
              className={`p-4 rounded-lg border ${
                feature.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{feature.name}</span>
                <span className={`text-sm ${
                  feature.enabled ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {feature.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>
    </div>
  );
};

export default CommunityTab;