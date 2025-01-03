import React from 'react';
import { Users, Star, GitPullRequest, MessageCircle } from 'lucide-react';
import  Progress from "../ui/Progress";
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';

const CommunityTab = ({ data }) => {
  if (!data?.contributors) return null;

  const { contributors, metrics, repoData } = data;

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
          value={repoData.stargazers_count || 0}
          description="Repository stars"
        />
        <MetricCard
          title="Issue Resolution"
          value={`${(metrics.issueResolutionRate * 100).toFixed(0)}%`}
          description="Issues resolved ratio"
        />
      </div>

      {/* Contributor Distribution */}
      <AnalysisSection 
        title="Top Contributors"
        subtitle="Distribution of contributions"
      >
        <div className="space-y-4">
          {contributors.contributionDistribution?.slice(0, 5).map((contributor) => (
            <div key={contributor.login} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{contributor.login}</span>
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

      {/* Community Health */}
      <AnalysisSection 
        title="Community Health"
        subtitle="Community engagement metrics"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Repository Activity</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Stars</span>
                </div>
                <p className="text-2xl font-bold mt-2">{repoData.stargazers_count || 0}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Pull Requests</span>
                </div>
                <p className="text-2xl font-bold mt-2">{metrics.pullRequestCount || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Issue Engagement</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Open Issues</span>
                </div>
                <p className="text-2xl font-bold mt-2">{repoData.open_issues_count || 0}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Active Users</span>
                </div>
                <p className="text-2xl font-bold mt-2">{metrics.activeUsers || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </AnalysisSection>
    </div>
  );
};

export default CommunityTab;