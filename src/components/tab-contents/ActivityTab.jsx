import React from 'react';
import { Clock, Calendar, Users, GitCommit } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';

const ActivityTab = ({ data }) => {
  if (!data?.commitAnalysis?.activityPatterns?.timeDistribution) {
    return null;
  }

  const { 
    commitAnalysis: { 
      activityPatterns, 
      frequency = 0, 
      authors = 0, 
      isConsistent = false 
    },
    timeMetrics
  } = data;

  
  const timeDistributionData = Object.entries(activityPatterns.timeDistribution)
    .map(([hour, count]) => ({
      hour: `${hour}:00`,
      commits: count
    }))
    .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  // Calculate weekly activity data
  const weeklyData = [
    { day: 'Weekdays', commits: activityPatterns.weekdayActivity },
    { day: 'Weekends', commits: activityPatterns.weekendActivity }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Commit Frequency"
          value={`${((frequency || 0) / (timeMetrics?.age / 7 || 1)).toFixed(1)}/week`}
          description="Average commits per week"
        />
        <MetricCard
          title="Active Contributors"
          value={authors}
          description="Unique commit authors"
        />
        <MetricCard
          title="Activity Pattern"
          value={isConsistent ? 'Consistent' : 'Variable'}
          description="Commit frequency consistency"
        />
      </div>

      {/* Time Distribution Chart */}
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

      {/* Weekly Activity */}
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
                {activityPatterns.peakHours.map((hour) => (
                  <span key={hour} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {hour}:00
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnalysisSection>
    </div>
  );
};

export default ActivityTab;