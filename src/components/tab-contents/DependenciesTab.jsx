import React, { useState, useEffect } from 'react';
import { Package, Server, Download, AlertTriangle, CheckCircle, Terminal, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';
import Progress from "../ui/Progress";
import { Button } from "../ui/button";

const DependenciesTab = ({ data }) => {
  if (!data) return null;

  const { dependencies = {} } = data;

  // Analyze package.json for local deployment requirements
  const [localDeployment, setLocalDeployment] = useState({
    canRunLocally: false,
    hasStartScript: false,
    hasBuildScript: false,
    hasRequiredDeps: false,
    missingDeps: [],
    nodeVersionSpecified: false,
    recommendedNodeVersion: null,
    setupSteps: []
  });

  useEffect(() => {
    // Check package.json for deployment requirements
    const checkLocalDeployment = async () => {
      try {
        const packageJson = await window.fs.readFile('package.json', { encoding: 'utf8' });
        const pkgData = JSON.parse(packageJson);
        
        const hasStart = !!pkgData.scripts?.start;
        const hasBuild = !!pkgData.scripts?.build;
        const requiredDeps = ['react', 'react-dom'];
        const missingDeps = requiredDeps.filter(dep => !pkgData.dependencies?.[dep]);
        
        const steps = [];
        if (hasBuild) steps.push('npm install');
        if (hasBuild) steps.push('npm run build');
        if (hasStart) steps.push('npm start');

        setLocalDeployment({
          canRunLocally: hasStart && !missingDeps.length,
          hasStartScript: hasStart,
          hasBuildScript: hasBuild,
          hasRequiredDeps: !missingDeps.length,
          missingDeps,
          nodeVersionSpecified: !!pkgData.engines?.node,
          recommendedNodeVersion: pkgData.engines?.node || '>=14.0.0',
          setupSteps: steps
        });
      } catch (error) {
        console.error('Error analyzing package.json:', error);
      }
    };

    checkLocalDeployment();
  }, []);

  return (
    <div className="space-y-6">
      {/* Why We Check Dependencies */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle>Why We Analyze Dependencies</AlertTitle>
        <AlertDescription className="mt-2 text-blue-700">
          <p className="mb-2">Analyzing project dependencies helps identify potential security risks, maintenance needs, and deployment requirements. We check for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Outdated or vulnerable packages that could pose security risks</li>
            <li>Development and runtime dependencies for local deployment</li>
            <li>Build and deployment configurations for different environments</li>
            <li>Node.js version requirements and compatibility</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Local Development Setup */}
      <AnalysisSection
        title="Local Development"
        subtitle="Analysis of local deployment requirements and setup instructions"
      >
        <div className="space-y-4">
          {/* Overall Status */}
          <div className={`p-4 rounded-lg ${
            localDeployment.canRunLocally ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start gap-3">
              {localDeployment.canRunLocally ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div>
                <h4 className="font-medium">
                  {localDeployment.canRunLocally ? 
                    'Project can be run locally' : 
                    'Some configuration required for local deployment'}
                </h4>
                <p className="text-sm mt-1">
                  {localDeployment.canRunLocally ?
                    'All necessary scripts and dependencies are present' :
                    'Missing required configuration or dependencies'}
                </p>
              </div>
            </div>
          </div>

          {/* Setup Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Required Scripts
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Start Script</span>
                  {localDeployment.hasStartScript ? (
                    <span className="text-green-600 text-sm">✓ Present</span>
                  ) : (
                    <span className="text-red-600 text-sm">✗ Missing</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Build Script</span>
                  {localDeployment.hasBuildScript ? (
                    <span className="text-green-600 text-sm">✓ Present</span>
                  ) : (
                    <span className="text-red-600 text-sm">✗ Missing</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Server className="h-4 w-4" />
                Environment Requirements
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Node.js Version</span>
                  <span className="text-sm font-mono">
                    {localDeployment.recommendedNodeVersion || '>=14.0.0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          {localDeployment.canRunLocally && (
            <div className="mt-4">
              <h4 className="font-medium mb-3">Local Setup Instructions</h4>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                {localDeployment.setupSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-500">{index + 1}.</span>
                    <code>{step}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Dependencies Warning */}
          {localDeployment.missingDeps.length > 0 && (
            <Alert variant="warning" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Missing Required Dependencies</AlertTitle>
              <AlertDescription>
                <p className="mt-2">The following core dependencies are missing:</p>
                <ul className="list-disc pl-5 mt-2">
                  {localDeployment.missingDeps.map(dep => (
                    <li key={dep}>{dep}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </AnalysisSection>

      {/* Dependencies Overview */}
      <AnalysisSection title="Dependencies Overview">
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

      {/* Development Tools */}
      <AnalysisSection 
        title="Development Tools"
        subtitle="Analysis of development and build tools configuration"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Build System',
              value: dependencies.buildTool || 'react-scripts',
              description: 'Tool used for building the project'
            },
            {
              name: 'Test Framework',
              value: dependencies.testFramework || 'Jest',
              description: 'Testing framework configuration'
            },
            {
              name: 'Package Manager',
              value: dependencies.packageManager || 'npm',
              description: 'Recommended package manager'
            }
          ].map((tool) => (
            <div key={tool.name} className="p-4 border rounded-lg">
              <h4 className="font-medium">{tool.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
              <p className="font-mono text-sm mt-2">{tool.value}</p>
            </div>
          ))}
        </div>
      </AnalysisSection>
    </div>
  );
};

export default DependenciesTab;