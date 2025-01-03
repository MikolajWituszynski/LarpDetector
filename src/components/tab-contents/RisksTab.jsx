import React from 'react';
import { AlertTriangle, AlertOctagon, Gauge, ShieldAlert, GitBranch, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import Progress from "../ui/Progress";
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';

const RiskLevel = ({ level }) => {
  const colors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${colors[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
    </span>
  );
};

const RisksTab = ({ data }) => {
  if (!data) return null;

  const { health, security, branches } = data;

  // Aggregate risks from different areas
  const risks = [
    // Security Risks
    ...(security.vulnerabilities?.map(v => ({
      category: 'Security',
      title: v.title,
      description: v.description,
      level: v.severity === 'critical' ? 'high' : v.severity === 'medium' ? 'medium' : 'low',
      icon: ShieldAlert,
      recommendation: v.recommendation
    })) || []),
    
    // Branch Risks
    ...(branches.staleCount > 0 ? [{
      category: 'Branch Management',
      title: 'Stale Branches',
      description: `${branches.staleCount} branches haven't been updated in over 3 months`,
      level: branches.staleCount > 5 ? 'high' : 'medium',
      icon: GitBranch,
      recommendation: 'Review and clean up inactive branches to maintain repository health'
    }] : []),
    
    // Dependency Risks
    ...(data.dependencies?.outdated?.map(dep => ({
      category: 'Dependencies',
      title: `Outdated Dependency: ${dep.name}`,
      description: `Current: ${dep.current}, Latest: ${dep.latest}`,
      level: dep.breaking ? 'high' : 'medium',
      icon: AlertOctagon,
      recommendation: `Update ${dep.name} to version ${dep.latest}${dep.breaking ? ' with caution - contains breaking changes' : ''}`
    })) || [])
  ];
  const totalRisks = Math.max(risks.length, 1); // Prevent division by zero
  const percentage = (count) => {
    return ((count / totalRisks) * 100).toFixed(1);
  };
  // Group risks by level
  const risksByLevel = {
    high: risks.filter(r => r.level === 'high'),
    medium: risks.filter(r => r.level === 'medium'),
    low: risks.filter(r => r.level === 'low')
  };

  // Calculate overall risk score (0-100)
  const riskScore = Math.max(0, 100 - (
    (risksByLevel.high.length * 20) + 
    (risksByLevel.medium.length * 10) + 
    (risksByLevel.low.length * 5)
  ));

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Risk Score"
          value={`${riskScore}/100`}
          description="Overall risk assessment score"
        />
        <MetricCard
          title="Critical Issues"
          value={risksByLevel.high.length}
          description="High-priority issues requiring attention"
        />
        <MetricCard
          title="Total Risks"
          value={risks.length}
          description="Total number of identified risks"
        />
      </div>

      {/* Risk Distribution */}
      <AnalysisSection 
        title="Risk Distribution" 
        subtitle="Overview of risk levels across the repository"
      >
        <div className="space-y-4">
          {Object.entries(risksByLevel).map(([level, levelRisks]) => (
            <div key={level} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{level} Risk</span>
                  <span className="text-sm text-gray-600">
                    ({levelRisks.length} issue{levelRisks.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                {percentage(levelRisks.length)}%
                </span>
              </div>
              <Progress 
                value={(levelRisks.length / risks.length) * 100}
                className={`h-2 ${
                  level === 'high' ? 'bg-red-100' : 
                  level === 'medium' ? 'bg-yellow-100' : 
                  'bg-green-100'
                }`}
              />
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Critical Risks */}
      {risksByLevel.high.length > 0 && (
        <AnalysisSection 
          title="Critical Issues"
          subtitle="High-priority risks requiring immediate attention"
        >
          <div className="space-y-4">
            {risksByLevel.high.map((risk, index) => (
              <Alert key={index} variant="destructive">
                <AlertTitle className="flex items-center gap-2">
                  <risk.icon className="h-5 w-5" />
                  {risk.title}
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="space-y-2">
                    <p>{risk.description}</p>
                    {risk.recommendation && (
                      <div className="mt-2 text-sm bg-red-50 p-2 rounded">
                        <span className="font-medium">Recommendation: </span>
                        {risk.recommendation}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </AnalysisSection>
      )}

      {/* Risk Categories */}
      <AnalysisSection 
        title="Risk Categories"
        subtitle="Detailed breakdown by category"
      >
        <div className="grid grid-cols-1 gap-4">
          {['Security', 'Dependencies', 'Branch Management'].map(category => {
            const categoryRisks = risks.filter(r => r.category === category);
            if (categoryRisks.length === 0) return null;

            return (
              <div key={category} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">{category}</h4>
                  <RiskLevel 
                    level={
                      categoryRisks.some(r => r.level === 'high') ? 'high' :
                      categoryRisks.some(r => r.level === 'medium') ? 'medium' : 'low'
                    }
                  />
                </div>
                <div className="space-y-3">
                  {categoryRisks.map((risk, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg ${
                        risk.level === 'high' ? 'bg-red-50' :
                        risk.level === 'medium' ? 'bg-yellow-50' :
                        'bg-green-50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <risk.icon className={`h-5 w-5 mt-0.5 ${
                          risk.level === 'high' ? 'text-red-600' :
                          risk.level === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                        <div>
                          <p className="font-medium">{risk.title}</p>
                          <p className="text-sm mt-1">{risk.description}</p>
                          {risk.recommendation && (
                            <p className="text-sm mt-2 text-gray-600">
                              <span className="font-medium">Recommendation:</span>{' '}
                              {risk.recommendation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </AnalysisSection>

      {/* Best Practices */}
      <AnalysisSection 
        title="Risk Prevention"
        subtitle="Recommended practices to minimize risks"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Regular Updates',
              description: 'Keep dependencies up to date to avoid security vulnerabilities',
              icon: AlertOctagon,
              status: data.dependencies?.outdated?.length === 0
            },
            {
              title: 'Branch Protection',
              description: 'Enable branch protection rules for critical branches',
              icon: GitBranch,
              status: branches.protected
            },
            {
              title: 'Security Scanning',
              description: 'Regular security scans and vulnerability assessments',
              icon: ShieldAlert,
              status: security.hasCodeScanning
            },
            {
              title: 'Clean Branch Structure',
              description: 'Regular cleanup of stale and unused branches',
              icon: AlertCircle,
              status: branches.staleCount === 0
            }
          ].map((practice, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                practice.status ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <practice.icon className={`h-5 w-5 mt-0.5 ${
                  practice.status ? 'text-green-600' : 'text-gray-400'
                }`} />
                <div>
                  <h4 className="font-medium">{practice.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{practice.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>
    </div>
  );
};

export default RisksTab;