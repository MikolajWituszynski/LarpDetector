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
import AnalysisSection from '../AnalysisSection';

const ActivityTab = ({ data }) => {
  if (!data) return null;

  // Access commits directly from data, not from commitAnalysis
  const { 
    commits = [], // Direct commits array
    commitAnalysis = {
      frequency: 0,
      authors: 0,
      activityPatterns: {}
    },
    timeMetrics = {},
    repoData = {}
  } = data;

  const getWeekKey = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
  };

  const formatDateRange = (startStr) => {
    const start = new Date(startStr);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    const formatDate = (date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getLastFourWeeks = () => {
    // Process commits array directly
    const commitsByWeek = {};
    
    commits.forEach(commit => {
      // Access the correct path for commit date
      const dateStr = commit?.commit?.author?.date;
      if (!dateStr) return;
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return;
      
      const weekKey = getWeekKey(date);
      commitsByWeek[weekKey] = (commitsByWeek[weekKey] || 0) + 1;
    });

    // Get current date for week alignment
    const now = new Date();
    let currentWeekStart = new Date(now);
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    // Create array of last 4 weeks
    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(currentWeekStart);
      weekStart.setDate(currentWeekStart.getDate() - (i * 7));
      const weekKey = weekStart.toISOString().split('T')[0];
      const weekLabel = formatDateRange(weekKey);
      weeks.push({
        week: weekLabel,
        commits: commitsByWeek[weekKey] || 0,
        weekStart: new Date(weekStart)
      });
    }

    const totalCommits = weeks.reduce((sum, w) => sum + w.commits, 0);
    return {
      weeks,
      averageCommits: totalCommits / weeks.length
    };
  };

  const { weeks, averageCommits } = getLastFourWeeks();

  // Get the last activity date from actual commits
  const lastActivityDate = commits.length > 0 
    ? new Date(commits[0].commit?.author?.date || repoData.updated_at)
    : new Date(repoData.updated_at);

  const daysSinceLastActivity = Math.floor(
    (new Date() - lastActivityDate) / (1000 * 60 * 60 * 24)
  );

  // Get active contributors count
  const activeContributors = commitAnalysis.authors || 0;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-5 w-5 text-blue-600" />
          <h4 className="font-medium">Activity Summary</h4>
        </div>
        <p className="text-gray-600">
          Project managed by {activeContributors} active contributor{activeContributors !== 1 ? 's' : ''}.
          {daysSinceLastActivity <= 7 
            ? ' Active development with regular updates.'
            : daysSinceLastActivity <= 30
            ? ' Last updated within the past month.'
            : ` Last updated ${daysSinceLastActivity} days ago.`}
        </p>
      </div>

      {/* Weekly Activity */}
      <AnalysisSection title="Recent Activity">
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              {averageCommits > 0 
                ? `On average, this project receives ${averageCommits.toFixed(1)} updates per week.`
                : 'No activity detected in the last 4 weeks.'}
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="commits" fill="#3b82f6" name="Updates">
                  {weeks.map((entry, index) => (
                    <Cell 
                      key={index}
                      fill={entry.commits > 0 ? '#3b82f6' : '#e5e7eb'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium mb-2">Last Active Period</h5>
              <p className="text-gray-600">
                {lastActivityDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium mb-2">Activity Status</h5>
              <p className="text-gray-600">
                {daysSinceLastActivity <= 7 
                  ? "Active this week"
                  : daysSinceLastActivity <= 30 
                  ? "Active this month"
                  : "Currently inactive"}
              </p>
            </div>
          </div>
        </div>
      </AnalysisSection>
    </div>
  );
};

export default ActivityTab;
