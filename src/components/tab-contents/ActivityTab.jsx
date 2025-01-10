import React from 'react';
import { Info } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';

const ActivityTab = ({ data }) => {
  if (!data) return null;

  const { 
    commitAnalysis, 
    timeMetrics = { age: 0, isActive: false }
  } = data;

  // Calculate activity metrics
  const activityMetrics = {
    commitFrequency: commitAnalysis?.frequency ? 
      Math.round((commitAnalysis.frequency / (timeMetrics.age / 7 || 1)) * 10) / 10 : 0,
    activeAuthors: commitAnalysis?.authors || 0,
    isConsistent: commitAnalysis?.isConsistent || false
  };

  // Prepare time distribution data
  const timeDistributionData = commitAnalysis?.activityPatterns?.timeDistribution ? 
    Object.entries(commitAnalysis.activityPatterns.timeDistribution)
      .map(([hour, count]) => ({
        hour: `${hour}:00`,
        commits: count
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour)) :
    [];

  // Calculate weekly activity data
  const weeklyData = commitAnalysis?.activityPatterns ? [
    { day: 'Weekdays', commits: commitAnalysis.activityPatterns.weekdayActivity || 0 },
    { day: 'Weekends', commits: commitAnalysis.activityPatterns.weekendActivity || 0 }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Commit Frequency"
          value={`${activityMetrics.commitFrequency}/week`}
          description="Average commits per week"
        />
        <MetricCard
          title="Active Contributors"
          value={activityMetrics.activeAuthors}
          description="Unique commit authors"
        />
        <MetricCard
          title="Activity Pattern"
          value={activityMetrics.isConsistent ? 'Consistent' : 'Variable'}
          description="Commit frequency consistency"
        />
      </div>

      {timeDistributionData.length > 0 && (
        <AnalysisSection title="Daily Activity Pattern" subtitle="Commit distribution across hours">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="commits" fill="#3b82f6" name="Commits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnalysisSection>
      )}

      {weeklyData.length > 0 && (
        <AnalysisSection title="Weekly Activity Pattern" subtitle="Comparison of weekday vs weekend activity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="commits" fill="#3b82f6" name="Commits" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Peak Activity Hours</h4>
                <div className="flex flex-wrap gap-2">
                  {(commitAnalysis?.activityPatterns?.peakHours || []).map((hour) => (
                    <span key={hour} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {hour}:00
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnalysisSection>
      )}
    </div>
  );
};

export default ActivityTab;