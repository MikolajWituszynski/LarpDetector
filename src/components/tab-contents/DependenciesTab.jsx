import React from 'react';
import { Package, AlertCircle, Clock, Shield } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';
import { Progress } from "../ui/Progress";

const DependenciesTab = ({ data }) => {
  if (!data) return null;

  const { dependencies = {} } = data;

  // Calculate dependency metrics
  const outdatedCount = dependencies.outdated?.length || 0;
  const totalDeps = Object.keys(dependencies.all || {}).length;
  const updatePercentage = totalDeps ? ((totalDeps - outdatedCount) / totalDeps) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Dependencies"
          value={totalDeps}
          description="Number of package dependencies"
        />
        <MetricCard
          title="Up to Date"
          value={`${Math.round(updatePercentage)}%`}
          description="Packages on latest version"
        />
        <MetricCard
          title="Updates Available"
          value={outdatedCount}
          description="Number of outdated packages"
        />
      </div>

      {/* Dependency Types */}
      <AnalysisSection title="Dependency Breakdown">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Production Dependencies */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Production Dependencies
            </h4>
            <div className="space-y-3">
              {Object.entries(dependencies.production || {}).map(([name, version]) => (
                <div key={name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">{name}</span>
                  <span className="text-sm text-gray-600">{version}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Development Dependencies */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Development Dependencies
            </h4>
            <div className="space-y-3">
              {Object.entries(dependencies.development || {}).map(([name, version]) => (
                <div key={name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">{name}</span>
                  <span className="text-sm text-gray-600">{version}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnalysisSection>

      {/* Updates Available */}
      {dependencies.outdated && dependencies.outdated.length > 0 && (
        <AnalysisSection 
          title="Available Updates"
          subtitle="Packages with newer versions available"
        >
          <div className="space-y-4">
            {dependencies.outdated.map((pkg) => (
              <div key={pkg.name} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{pkg.name}</h4>
                    <p className="text-sm text-gray-600">Current: {pkg.current}</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                    Latest: {pkg.latest}
                  </span>
                </div>
                {pkg.breaking && (
                  <Alert variant="warning" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Breaking Changes</AlertTitle>
                    <AlertDescription>
                      This update includes breaking changes. Review changelog before updating.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      {/* Security Advisories */}
      {dependencies.vulnerabilities && dependencies.vulnerabilities.length > 0 && (
        <AnalysisSection 
          title="Security Advisories"
          subtitle="Known vulnerabilities in dependencies"
        >
          <div className="space-y-4">
            {dependencies.vulnerabilities.map((vuln, index) => (
              <Alert key={index} variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{vuln.package}</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>{vuln.description}</p>
                  <p className="text-sm">
                    Severity: {vuln.severity} | Affected versions: {vuln.affectedVersions}
                  </p>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </AnalysisSection>
      )}
    </div>
  );
};

export default DependenciesTab;