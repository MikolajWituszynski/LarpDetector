import React from 'react';
import { Package, AlertCircle, Clock, Shield, Cloud, Server, Box, Terminal } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';
import { Progress } from "../ui/Progress";
import { useState,useEffect } from 'react';
const DependenciesTab = ({ data }) => {
  if (!data) return null;

  const { dependencies = {} } = data;

  const [deploymentFiles, setDeploymentFiles] = useState({
    hasDockerfile: false,
    hasDockerCompose: false,
    hasKubernetes: false,
    hasTerraform: false,
    hasEnvConfig: false,
       // Vercel detection
    isVercelCompatible: false,
    hasVercelDependencies: false,
    isNextJsProject: false,
    hasDeploymentScript: false,
    // Project structure indicators
    hasBuildScript: false,
    hasStaticExports: false,
    hasPublicDir: false
    
  });

  // Get base content URL
  const baseContentUrl = data.repoData.contents_url.replace('{+path}', '');

  useEffect(() => {
    const fetchRepoContents = async () => {
      try {
        const response = await fetch(baseContentUrl);
        const contents = await response.json();
        
        // Log contents for debugging
        console.log('Repository contents:', contents);

        // Check for deployment files
        const files = Array.isArray(contents) ? contents : [];
        const fileNames = files.map(f => f.name.toLowerCase());

        setDeploymentFiles({
          hasDockerfile: fileNames.includes('dockerfile'),
          hasDockerCompose: fileNames.includes('docker-compose.yml') || fileNames.includes('docker-compose.yaml'),
          hasKubernetes: fileNames.some(name => name.includes('k8s') || name.includes('kubernetes')),
          hasTerraform: fileNames.some(name => name.endsWith('.tf')),
          hasEnvConfig: fileNames.some(name => name.includes('.env')),
          // Vercel configuration checks
          hasVercelConfig: fileNames.some(name => name === 'vercel.json' || name === '.vercel'),
          hasNextConfig: fileNames.includes('next.config.js') || fileNames.includes('next.config.ts'),
          hasVercelJson: fileNames.includes('vercel.json'),
          // CI/CD checks
          hasGithubActions: files.some(f => f.type === 'dir' && f.name === '.github'),
          hasVercelGithubIntegration: files.some(f => 
            f.type === 'file' && 
            (f.name.includes('vercel') || f.name.includes('now')) && 
            f.name.endsWith('.yml')
          )
        });
      } catch (error) {
        console.error('Error fetching repo contents:', error);
      }
    };

    fetchRepoContents();
  }, [baseContentUrl]);

  // Calculate dependency metrics
  const outdatedCount = dependencies.outdated?.length || 0;
  const totalDeps = Object.keys(dependencies.all || {}).length;
  const updatePercentage = totalDeps ? ((totalDeps - outdatedCount) / totalDeps) * 100 : 100;

  const getDeploymentType = () => {
    if (deploymentFiles.hasDockerfile) return 'Container-based';
    if (deploymentFiles.hasKubernetes) return 'Kubernetes';
    return 'Standard';
  };


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
          title="Deployment Type"
          value={getDeploymentType()}
          description="Detected deployment method"
        />
      </div>

      {/* Deployment Configuration */}
      <AnalysisSection
        title="Deployment Analysis"
        subtitle="Project deployment capabilities and configurations"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Containerization */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Box className="h-5 w-5 text-blue-600" />
              Container Support
            </h4>
            <div className="space-y-3">
            <div className={`p-3 rounded-lg ${deploymentFiles.hasDockerfile ? 'bg-green-50' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
                  <span className="font-medium">Docker Support</span>
                  <span className={`text-sm ${deploymentFiles.hasDockerfile ? 'text-green-600' : 'text-gray-500'}`}>
                    {deploymentFiles.hasDockerfile ? 'Available' : 'Not Found'}
                  </span>
                </div>
                {deploymentFiles.hasDockerfile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Project can be containerized using Docker
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${deploymentFiles.hasDockerCompose ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Docker Compose</span>
                  <span className={`text-sm ${deploymentFiles.hasDockerCompose ? 'text-green-600' : 'text-gray-500'}`}>
                    {deploymentFiles.hasDockerCompose ? 'Available' : 'Not Found'}
                  </span>
                </div>
                {deploymentFiles.hasDockerCompose && (
                  <p className="text-sm text-gray-600 mt-1">
                    Multi-container setup defined
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CI/CD Configuration */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Server className="h-5 w-5 text-purple-600" />
              CI/CD Configuration
            </h4>
            <div className="space-y-3">
              {[
                {
                  name: 'GitHub Actions',
                  available: deploymentFiles.hasGithubActions,
                  description: 'Automated workflows configured'
                },
                {
                  name: 'CircleCI',
                  available: deploymentFiles.hasCircleCI,
                  description: 'CircleCI pipelines configured'
                },
                {
                  name: 'Jenkins',
                  available: deploymentFiles.hasJenkinsfile,
                  description: 'Jenkins pipeline configured'
                }
              ].map(config => (
                <div key={config.name} className={`p-3 rounded-lg ${config.available ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{config.name}</span>
                    <span className={`text-sm ${config.available ? 'text-green-600' : 'text-gray-500'}`}>
                      {config.available ? 'Available' : 'Not Found'}
                    </span>
                  </div>
                  {config.available && (
                    <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vercel Deployment */}
        <div className="p-4 border rounded-lg">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Cloud className="h-5 w-5 text-black" />
              Vercel Deployment
            </h4>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${
                (deploymentFiles.hasVercelConfig || deploymentFiles.hasNextConfig) 
                ? 'bg-green-50' 
                : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Vercel Configuration</span>
                  <span className={`text-sm ${
                    (deploymentFiles.hasVercelConfig || deploymentFiles.hasNextConfig) 
                    ? 'text-green-600' 
                    : 'text-gray-500'
                  }`}>
                    {(deploymentFiles.hasVercelConfig || deploymentFiles.hasNextConfig) 
                      ? 'Configured' 
                      : 'Not Found'
                    }
                  </span>
                </div>
                {(deploymentFiles.hasVercelConfig || deploymentFiles.hasNextConfig) && (
                  <p className="text-sm text-gray-600 mt-1">
                    Project is configured for Vercel deployment
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${deploymentFiles.hasVercelGithubIntegration ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Vercel CI/CD</span>
                  <span className={`text-sm ${deploymentFiles.hasVercelGithubIntegration ? 'text-green-600' : 'text-gray-500'}`}>
                    {deploymentFiles.hasVercelGithubIntegration ? 'Integrated' : 'Not Found'}
                  </span>
                </div>
                {deploymentFiles.hasVercelGithubIntegration && (
                  <p className="text-sm text-gray-600 mt-1">
                    Automatic deployments with GitHub integration
                  </p>
                )}
              </div>
            </div>
          </div>


        {/* Infrastructure Configuration */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium flex items-center gap-2 mb-3">
            <Cloud className="h-5 w-5 text-blue-600" />
            Infrastructure Configuration
          </h4>
          <div className="space-y-3">
            {[
              {
                type: 'Container Orchestration',
                available: deploymentFiles.hasKubernetes,
                description: 'Kubernetes configuration found',
                files: ['kubernetes configs', 'k8s manifests']
              },
              {
                type: 'Infrastructure as Code',
                available: deploymentFiles.hasTerraform || deploymentFiles.hasCloudformation,
                description: 'Infrastructure automation available',
                files: ['Terraform files', 'CloudFormation templates']
              },
              {
                type: 'Environment Configuration',
                available: deploymentFiles.hasEnvConfig,
                description: 'Environment variables configured',
                files: ['.env templates', 'configuration files']
              }
            ].map(option => (
              <div key={option.type} className="p-3 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{option.type}</span>
                  <span className={`text-sm ${option.available ? 'text-green-600' : 'text-gray-500'}`}>
                    {option.available ? 'Available' : 'Not Configured'}
                  </span>
                </div>
                {option.available && (
                  <p className="text-sm text-gray-600">{option.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </AnalysisSection>
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