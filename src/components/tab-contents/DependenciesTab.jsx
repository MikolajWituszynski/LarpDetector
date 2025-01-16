import React from 'react';
import { Package, AlertCircle, Check, XCircle, Globe, Cloud, Server, Terminal, Box, Database } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import AnalysisSection from '../AnalysisSection';
import MetricCard from '../MetricCard';

const DependenciesTab = ({ data }) => {
  if (!data) return null;

  // Get package.json data
  const packageJson = data.dependencies?.packageJson || {};
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  const scripts = packageJson.scripts || {};
  
  // Analyze deployment configurations
  const deploymentCapabilities = {
    // Container deployment
    docker: {
      possible: true, // React apps can always be containerized
      hasConfig: data.files?.some(f => 
        f.name.toLowerCase() === 'dockerfile' || 
        f.name.toLowerCase() === 'docker-compose.yml'
      ),
      readiness: 'Ready for containerization',
      requirements: [
        { name: 'Build script', met: !!scripts.build },
        { name: 'Start script', met: !!scripts.start },
        { name: 'Docker config', met: data.files?.some(f => f.name.toLowerCase() === 'dockerfile') }
      ]
    },

    // Static deployment
    static: {
      possible: true, // React apps can be deployed statically
      hasConfig: !!scripts.build,
      readiness: !!scripts.build ? 'Ready' : 'Needs build configuration',
      requirements: [
        { name: 'Build script', met: !!scripts.build },
        { name: 'Static output', met: true }, // React builds are static by default
        { name: 'Asset optimization', met: !!devDependencies.postcss }
      ]
    },

    // Serverless deployment
    serverless: {
      possible: true,
      hasConfig: dependencies['@vercel/analytics'] || 
                 data.files?.some(f => f.name.includes('netlify') || f.name.includes('vercel')),
      readiness: 'Compatible with serverless platforms',
      requirements: [
        { name: 'Build process', met: !!scripts.build },
        { name: 'Environment variables', met: !!dependencies.dotenv },
        { name: 'API endpoints', met: !!scripts.api }
      ]
    },

    // Kubernetes deployment
    kubernetes: {
      possible: true,
      hasConfig: data.files?.some(f => 
        f.name.includes('k8s') || 
        f.name.includes('kubernetes') ||
        f.name.includes('.yaml')
      ),
      readiness: 'Can be orchestrated with Kubernetes',
      requirements: [
        { name: 'Container support', met: true },
        { name: 'Health checks', met: !!scripts.test },
        { name: 'K8s manifests', met: data.files?.some(f => f.name.includes('k8s')) }
      ]
    },

    // Cloud platform specific
    cloud: {
      possible: true,
      hasConfig: data.files?.some(f => 
        f.name.includes('aws') || 
        f.name.includes('azure') ||
        f.name.includes('gcp')
      ),
      readiness: 'Cloud-platform compatible',
      requirements: [
        { name: 'Build artifacts', met: !!scripts.build },
        { name: 'Environment config', met: !!dependencies.dotenv },
        { name: 'Cloud configs', met: data.files?.some(f => f.name.includes('aws')) }
      ]
    }
  };

  // Check for deployment prerequisites
  const prerequisites = {
    hasNodeEngine: !!packageJson.engines?.node,
    hasLockFile: data.files?.some(f => 
      f.name === 'package-lock.json' || 
      f.name === 'yarn.lock' ||
      f.name === 'pnpm-lock.yaml'
    ),
    hasEnvExample: data.files?.some(f => f.name.includes('.env')),
    hasBuildScript: !!scripts.build,
    hasTestScript: !!scripts.test,
    hasStartScript: !!scripts.start
  };

  // Calculate deployment readiness score
  const calculateReadinessScore = () => {
    let score = 0;
    if (prerequisites.hasNodeEngine) score += 15;
    if (prerequisites.hasLockFile) score += 15;
    if (prerequisites.hasEnvExample) score += 10;
    if (prerequisites.hasBuildScript) score += 20;
    if (prerequisites.hasTestScript) score += 20;
    if (prerequisites.hasStartScript) score += 20;
    return score;
  };

  const readinessScore = calculateReadinessScore();

  // Identify optimal deployment methods
  const getRecommendedDeployments = () => {
    const recommendations = [];
    
    if (deploymentCapabilities.static.possible && deploymentCapabilities.static.hasConfig) {
      recommendations.push({
        type: 'Static Hosting',
        platforms: ['Netlify', 'Vercel', 'GitHub Pages', 'AWS S3'],
        reason: 'Ready for static deployment with optimized build'
      });
    }

    if (deploymentCapabilities.docker.possible) {
      recommendations.push({
        type: 'Container Platforms',
        platforms: ['Docker', 'AWS ECS', 'Google Cloud Run', 'Azure Container Apps'],
        reason: 'Can be containerized for scalable deployment'
      });
    }

    if (deploymentCapabilities.serverless.possible) {
      recommendations.push({
        type: 'Serverless Platforms',
        platforms: ['Vercel', 'Netlify', 'AWS Amplify', 'Firebase'],
        reason: 'Suitable for serverless deployment with automatic scaling'
      });
    }

    return recommendations;
  };

  return (
    <div className="space-y-6">
      {/* Deployment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Deployment Readiness"
          value={`${readinessScore}%`}
          description="Overall deployment configuration completeness"
        />
        <MetricCard
          title="Deployment Options"
          value={Object.values(deploymentCapabilities).filter(c => c.possible).length}
          description="Available deployment methods"
        />
        <MetricCard
          title="Prerequisites Met"
          value={Object.values(prerequisites).filter(Boolean).length}
          description="Out of 6 deployment prerequisites"
        />
      </div>

      {/* Container Deployment */}
      <AnalysisSection title="Container Deployment">
        <div className={`p-4 rounded-lg ${
          deploymentCapabilities.docker.hasConfig ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        } border`}>
          <div className="flex items-center gap-3">
            <Box className="h-5 w-5 text-gray-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Docker & Containers</h4>
                <span className={`text-sm ${
                  deploymentCapabilities.docker.hasConfig ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {deploymentCapabilities.docker.readiness}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {deploymentCapabilities.docker.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
                      {req.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnalysisSection>

      {/* Cloud Platforms */}
      <AnalysisSection title="Cloud Platform Deployment">
        <div className="space-y-4">
          {/* Static/Serverless */}
          <div className={`p-4 rounded-lg ${
            deploymentCapabilities.serverless.hasConfig ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
          } border`}>
            <div className="flex items-center gap-3">
              <Cloud className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Serverless Platforms</h4>
                  <span className={`text-sm ${
                    deploymentCapabilities.serverless.hasConfig ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {deploymentCapabilities.serverless.readiness}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {deploymentCapabilities.serverless.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {req.met ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
                        {req.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kubernetes */}
          <div className={`p-4 rounded-lg ${
            deploymentCapabilities.kubernetes.hasConfig ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
          } border`}>
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Kubernetes Orchestration</h4>
                  <span className={`text-sm ${
                    deploymentCapabilities.kubernetes.hasConfig ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {deploymentCapabilities.kubernetes.readiness}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {deploymentCapabilities.kubernetes.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {req.met ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
                        {req.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnalysisSection>

      {/* Deployment Recommendations */}
      <AnalysisSection title="Recommended Deployment Options">
        <div className="space-y-4">
          {getRecommendedDeployments().map((rec, index) => (
            <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">{rec.type}</h4>
              <p className="text-sm text-blue-700 mt-1">{rec.reason}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {rec.platforms.map((platform, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Prerequisites */}
      <AnalysisSection title="Deployment Prerequisites">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(prerequisites).map(([key, met]) => (
            <div key={key} className={`p-3 rounded-lg ${
              met ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            } border`}>
              <div className="flex items-center gap-2">
                {met ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <span className={met ? 'text-green-900' : 'text-gray-600'}>
                  {key.replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .replace('Has ', '')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Missing Prerequisites Warning */}
      {Object.values(prerequisites).some(v => !v) && (
        <Alert variant="warning">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Missing Prerequisites</AlertTitle>
          <AlertDescription>
            Some deployment prerequisites are missing. Consider adding:
            <ul className="list-disc list-inside mt-2">
              {Object.entries(prerequisites).map(([key, met]) => !met && (
                <li key={key}>
                  {key.replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .replace('Has ', '')}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DependenciesTab;