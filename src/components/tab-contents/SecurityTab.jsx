import React from 'react';
import { AlertTriangle, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';
import  Progress  from "../ui/Progress";

const SecurityTab = ({ data }) => {
  if (!data) return null;

  const { security } = data;

  // Calculate security score based on enabled features
  const securityFeatures = [
    { name: 'Security Policy', enabled: security.hasSecurityPolicy },
    { name: 'Dependabot', enabled: security.hasDependabot },
    { name: 'Code Scanning', enabled: security.hasCodeScanning },
    { name: 'Secret Scanning', enabled: security.hasSecretScanning },
    { name: 'Branch Protection', enabled: security.hasBranchProtection }
  ];

  const securityScore = (securityFeatures.filter(f => f.enabled).length / securityFeatures.length) * 100;

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Security Score"
          value={`${Math.round(securityScore)}%`}
          description="Overall security measures implemented"
        />
        <MetricCard
          title="Security Features"
          value={securityFeatures.filter(f => f.enabled).length}
          description={`of ${securityFeatures.length} recommended features enabled`}
        />
        <MetricCard
          title="Vulnerabilities"
          value={security.vulnerabilities?.length || 0}
          description="Known security vulnerabilities"
        />
      </div>

      {/* Security Features */}
      <AnalysisSection 
        title="Security Features"
        subtitle="Status of recommended security measures"
      >
        <div className="space-y-4">
          {securityFeatures.map((feature) => (
            <div
              key={feature.name}
              className={`p-4 rounded-lg border ${
                feature.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {feature.enabled ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <h4 className="font-medium">{feature.name}</h4>
                    <p className="text-sm text-gray-600">
                      {feature.enabled ? 'Enabled and configured' : 'Not configured'}
                    </p>
                  </div>
                </div>
                {!feature.enabled && (
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50">
                    Enable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Branch Protection */}
      <AnalysisSection 
        title="Branch Protection"
        subtitle="Configuration for protected branches"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Required Reviews', enabled: security.branchProtection?.requiresReview },
            { name: 'Status Checks', enabled: security.branchProtection?.requiresStatusChecks },
            { name: 'Linear History', enabled: security.branchProtection?.requiresLinearHistory },
            { name: 'Force Push Protection', enabled: security.branchProtection?.preventsForcePush }
          ].map((rule) => (
            <div
              key={rule.name}
              className={`p-4 rounded-lg border ${
                rule.enabled ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {rule.enabled ? (
                  <Lock className="h-4 w-4 text-blue-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                )}
                <span className={rule.enabled ? 'text-blue-900' : 'text-gray-600'}>
                  {rule.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Vulnerabilities */}
      {security.vulnerabilities && security.vulnerabilities.length > 0 && (
        <AnalysisSection 
          title="Security Vulnerabilities"
          subtitle="Detected security issues requiring attention"
        >
          <div className="space-y-4">
            {security.vulnerabilities.map((vuln, index) => (
              <Alert
                key={index}
                variant={vuln.severity === 'critical' ? 'destructive' : 'warning'}
              >
                <AlertTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {vuln.title}
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="space-y-2">
                    <p>{vuln.description}</p>
                    <div className="text-sm">
                      <span className="font-medium">Severity:</span> {vuln.severity}
                      {vuln.cwe && (
                        <span className="ml-3">
                          <span className="font-medium">CWE:</span> {vuln.cwe}
                        </span>
                      )}
                    </div>
                    {vuln.recommendation && (
                      <div className="text-sm">
                        <span className="font-medium">Recommendation:</span>{' '}
                        {vuln.recommendation}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </AnalysisSection>
      )}

      {/* Security Insights */}
      <AnalysisSection 
        title="Security Insights"
        subtitle="Additional security observations"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium">Dependencies</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Up-to-date dependencies</span>
                <span className="text-sm">
                  {security.dependencyStats?.upToDate || 0} of {security.dependencyStats?.total || 0}
                </span>
              </div>
              <Progress 
                value={
                  security.dependencyStats?.total
                    ? (security.dependencyStats?.upToDate / security.dependencyStats?.total) * 100
                    : 0
                }
                className="h-2"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Automated Checks</h4>
            <div className="space-y-2">
              {[
                { name: 'Security Updates', count: security.stats?.securityUpdates || 0 },
                { name: 'CodeQL Alerts', count: security.stats?.codeqlAlerts || 0 },
                { name: 'Secret Scanning Alerts', count: security.stats?.secretAlerts || 0 }
              ].map((stat) => (
                <div key={stat.name} className="flex justify-between items-center">
                  <span>{stat.name}</span>
                  <span className="text-sm">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnalysisSection>
    </div>
  );
};

export default SecurityTab;