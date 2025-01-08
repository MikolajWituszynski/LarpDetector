// OverviewTab.jsx
import React from 'react';
import { Activity, Users, GitPullRequest, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';
import { DefaultLegendContent } from 'recharts';

const OverviewTab = ({ data }) => {
  if (!data) return null;

  const { timeMetrics, metrics, health, commitAnalysis } = data;

  // Helper function to describe project age
  const getAgeDescription = (days) => {
    if (days < 30) return 'Less than a month old';
    if (days < 90) return `${Math.floor(days/30)} months old`;
    return `${(days/365).toFixed(1)} years old`;
  };

  return (
    <div className="space-y-6">
      {/* Project Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-blue-900">Quick Summary</h3>
        </div>
        <p className="text-blue-800 mt-2">
          This project is {getAgeDescription(timeMetrics.age)}. It has {metrics.contributorCount} active 
          contributors and maintains a health score of {health.score}/100.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium">Overall Health</h4>
          </div>
          <div className="text-2xl font-bold mb-1">{health.score}/100</div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium">Team Size</h4>
          </div>
          <div className="text-2xl font-bold mb-1">
            {metrics.contributorCount} Contributors
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <GitPullRequest className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium">Update Frequency</h4>
          </div>
          <div className="text-2xl font-bold mb-1">
            {commitAnalysis.isConsistent ? 'Regular' : 'Variable'}
          </div>
        </div>
      </div>

      {/* Project Strengths */}
      {health.trustFactors.length > 0 && (
        <AnalysisSection title="What's Working Well">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {health.trustFactors.map((factor) => (
              <div key={factor} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span className="text-green-800">{factor}</span>
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      {/* Areas for Improvement */}
      {health.riskFactors.length > 0 && (
        <AnalysisSection title="Areas for Improvement">
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Suggested Improvements
            </AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-2">
                {health.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2 text-yellow-800">
                    <span>•</span>
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
export default OverviewTab