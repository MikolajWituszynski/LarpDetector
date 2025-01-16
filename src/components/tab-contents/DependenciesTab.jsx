import React from 'react';
import { Package, AlertCircle, Check, XCircle, Globe, Cloud, Server, Terminal, Box } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import AnalysisSection from '../AnalysisSection';
import MetricCard from '../MetricCard';

const DependenciesTab = ({ data }) => {
  if (!data) return null;

  // Analyze package.json
  const packageJson = data.dependencies?.packageJson || {};
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  const scripts = packageJson.scripts || {};

  // File-based deployment analysis
  const deploymentFiles = {
    // Docker related
    hasDockerfile: data.files?.some(f => f.name.toLowerCase() === 'dockerfile'),
    hasDockerCompose: data.files?.some(f => f.name.toLowerCase() === 'docker-compose.yml' || f.name.toLowerCase() === 'docker-compose.yaml'),
    hasDockerIgnore: data.files?.some(f => f.name.toLowerCase() === '.dockerignore'),

    // Kubernetes related
    hasKubernetesConfig: data.files?.some(f => 
      f.name.toLowerCase().includes('k8s') || 
      f.name.endsWith('.yaml') || 
      f.name.endsWith('.yml')
    ),

    // Cloud Platform specific
    hasAwsConfig: data.files?.some(f => 
      f.name.includes('aws') || 
      f.name.includes('amplify') || 
      f.name === 'serverless.yml'
    ),
    hasGcloudConfig: data.files?.some(f => 
      f.name.includes('app.yaml') || 
      f.name.includes('cloudbuild')
    ),
    hasAzureConfig: data.files?.some(f => 
      f.name.includes('azure-pipelines') || 
      f.name.includes('.azure')
    ),

    // Environment and build
    hasEnvFile: data.files?.some(f => f.name.includes('.env')),
    hasProcfile: data.files?.some(f => f.name === 'Procfile'),
    hasVercelConfig: data.files?.some(f => 
      f.name === 'vercel.json' || 
      f.name === '.vercelignore'
    ),
    hasNetlifyConfig: data.files?.some(f => 
      f.name === 'netlify.toml' || 
      f.name === '_redirects'
    ),

    // CI/CD
    hasGithubActions: data.files?.some(f => f.path?.includes('.github/workflows')),
    hasCircleCI: data.files?.some(f => f.path?.includes('.circleci')),
    hasTravisConfig: data.files?.some(f => f.name === '.travis.yml'),

    // Build configuration
    hasBuildScript: !!scripts.build,
    hasStartScript: !!scripts.start,
    hasTestScript: !!scripts.test,
  };

  // Dependency-based deployment analysis
  const deploymentDeps = {
    // Static deployment
    hasStaticDeps: dependencies['react-scripts'] || devDependencies['vite'],
    
    // Serverless
    hasServerlessDeps: dependencies['@vercel/analytics'] || 
                      dependencies['@netlify/functions'] ||
                      dependencies['serverless'],
    
    // Container
    hasContainerDeps: dependencies['docker'] || dependencies['kubernetes'],
    
    // Cloud Platform SDKs
    hasAwsSdk: dependencies['aws-sdk'],
    hasGcloudSdk: dependencies['@google-cloud/storage'],
    hasAzureSdk: dependencies['@azure/storage-blob'],
    
    // Environment
    hasEnvConfig: dependencies['dotenv'],
  };

  // Calculate deployment possibilities
  const deploymentPossibilities = {
    docker: {
      possible: true, // React apps can always be containerized
      configured: deploymentFiles.hasDockerfile || deploymentFiles.hasDockerCompose,
      readinessScore: [
        deploymentFiles.hasDockerfile,
        deploymentFiles.hasDockerCompose,
        deploymentFiles.hasDockerIgnore,
        deploymentFiles.hasBuildScript
      ].filter(Boolean).length * 25,
      requirements: [
        { name: 'Dockerfile', met: deploymentFiles.hasDockerfile },
        { name: 'Docker Compose', met: deploymentFiles.hasDockerCompose },
        { name: 'Docker Ignore', met: deploymentFiles.hasDockerIgnore },
        { name: 'Build Script', met: deploymentFiles.hasBuildScript }
      ]
    },
    
    kubernetes: {
      possible: deploymentFiles.hasKubernetesConfig || deploymentFiles.hasDockerfile,
      configured: deploymentFiles.hasKubernetesConfig,
      readinessScore: [
        deploymentFiles.hasKubernetesConfig,
        deploymentFiles.hasDockerfile,
        deploymentFiles.hasEnvFile,
        deploymentFiles.hasTestScript
      ].filter(Boolean).length * 25,
      requirements: [
        { name: 'K8s Configs', met: deploymentFiles.hasKubernetesConfig },
        { name: 'Dockerfile', met: deploymentFiles.hasDockerfile },
        { name: 'Environment Config', met: deploymentFiles.hasEnvFile },
        { name: 'Health Checks', met: deploymentFiles.hasTestScript }
      ]
    },
    
    serverless: {
      possible: true,
      configured: deploymentFiles.hasVercelConfig || deploymentFiles.hasNetlifyConfig,
      readinessScore: [
        deploymentFiles.hasVercelConfig || deploymentFiles.hasNetlifyConfig,
        deploymentFiles.hasEnvFile,
        deploymentFiles.hasBuildScript,
        deploymentDeps.hasServerlessDeps
      ].filter(Boolean).length * 25,
      requirements: [
        { name: 'Platform Config', met: deploymentFiles.hasVercelConfig || deploymentFiles.hasNetlifyConfig },
        { name: 'Environment Setup', met: deploymentFiles.hasEnvFile },
        { name: 'Build Process', met: deploymentFiles.hasBuildScript },
        { name: 'Serverless Dependencies', met: deploymentDeps.hasServerlessDeps }
      ]
    },
    
    cloudPlatform: {
      possible: true,
      configured: deploymentFiles.hasAwsConfig || deploymentFiles.hasGcloudConfig || deploymentFiles.hasAzureConfig,
      readinessScore: [
        deploymentFiles.hasAwsConfig || deploymentFiles.hasGcloudConfig || deploymentFiles.hasAzureConfig,
        deploymentDeps.hasAwsSdk || deploymentDeps.hasGcloudSdk || deploymentDeps.hasAzureSdk,
        deploymentFiles.hasEnvFile,
        deploymentFiles.hasBuildScript
      ].filter(Boolean).length * 25,
      requirements: [
        { name: 'Cloud Config', met: deploymentFiles.hasAwsConfig || deploymentFiles.hasGcloudConfig },
        { name: 'Cloud SDK', met: deploymentDeps.hasAwsSdk || deploymentDeps.hasGcloudSdk },
        { name: 'Environment Setup', met: deploymentFiles.hasEnvFile },
        { name: 'Build Process', met: deploymentFiles.hasBuildScript }
      ]
    }
  };

  // Get recommended deployment methods based on current configuration
  const getDeploymentRecommendations = () => {
    const recommendations = [];

    // Container recommendations
    if (deploymentPossibilities.docker.configured) {
      recommendations.push({
        type: 'Container Deployment',
        platforms: ['Docker Swarm', 'AWS ECS', 'Google Cloud Run', 'Azure Container Apps'],
        confidence: deploymentPossibilities.docker.readinessScore,
        reason: 'Docker configuration detected'
      });
    }

    // Kubernetes recommendations
    if (deploymentPossibilities.kubernetes.configured) {
      recommendations.push({
        type: 'Container Orchestration',
        platforms: ['Kubernetes', 'AWS EKS', 'GKE', 'AKS'],
        confidence: deploymentPossibilities.kubernetes.readinessScore,
        reason: 'Kubernetes configuration present'
      });
    }

    // Serverless recommendations
    if (deploymentPossibilities.serverless.configured) {
      recommendations.push({
        type: 'Serverless Deployment',
        platforms: ['Vercel', 'Netlify', 'AWS Lambda', 'Cloud Functions'],
        confidence: deploymentPossibilities.serverless.readinessScore,
        reason: 'Serverless configuration detected'
      });
    }

    // Cloud platform recommendations
    if (deploymentPossibilities.cloudPlatform.configured) {
      recommendations.push({
        type: 'Cloud Platform',
        platforms: ['AWS', 'Google Cloud', 'Azure'],
        confidence: deploymentPossibilities.cloudPlatform.readinessScore,
        reason: 'Cloud platform configuration found'
      });
    }

    // If no specific configuration, recommend based on project type
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'Recommended Setup',
        platforms: ['Docker', 'Vercel', 'Netlify'],
        confidence: 70,
        reason: 'Based on React project structure'
      });
    }

    return recommendations;
  };

  return (
    <div className="space-y-6">
      {/* Deployment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Configured Methods"
          value={Object.values(deploymentPossibilities).filter(d => d.configured).length}
          description="Number of configured deployment methods"
        />
        <MetricCard
          title="Highest Readiness"
          value={`${Math.max(...Object.values(deploymentPossibilities).map(d => d.readinessScore))}%`}
          description="Best deployment readiness score"
        />
        <MetricCard
          title="Available Options"
          value={Object.values(deploymentPossibilities).filter(d => d.possible).length}
          description="Total possible deployment methods"
        />
      </div>

      {/* Docker Deployment */}
      <AnalysisSection title="Container Deployment">
        <div className={`p-4 rounded-lg ${
          deploymentPossibilities.docker.configured ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        } border`}>
          <div className="flex items-center gap-3">
            <Box className="h-5 w-5 text-gray-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Docker Configuration</h4>
                <span className={`text-sm ${
                  deploymentPossibilities.docker.configured ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {deploymentPossibilities.docker.readinessScore}% Ready
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {deploymentPossibilities.docker.requirements.map((req, index) => (
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

      {/* Cloud Platform Deployment */}
      <AnalysisSection title="Cloud & Serverless">
        <div className="space-y-4">
          {/* Serverless */}
          <div className={`p-4 rounded-lg ${
            deploymentPossibilities.serverless.configured ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
          } border`}>
            <div className="flex items-center gap-3">
              <Cloud className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Serverless Deployment</h4>
                  <span className={`text-sm ${
                    deploymentPossibilities.serverless.configured ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {deploymentPossibilities.serverless.readinessScore}% Ready
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {deploymentPossibilities.serverless.requirements.map((req, index) => (
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
            deploymentPossibilities.kubernetes.configured ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
          } border`}>
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Kubernetes Deployment</h4>
                  <span className={`text-sm ${
                    deploymentPossibilities.kubernetes.configured ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {deploymentPossibilities.kubernetes.readinessScore}% Ready
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {deploymentPossibilities.kubernetes.requirements.map((req, index) => (
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
          {getDeploymentRecommendations().map((rec, index) => (
            <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-900">{rec.type}</h4>
                <span className="text-sm text-blue-700">{rec.confidence}% Confidence</span>
              </div>
              <p className="text-sm text-blue-700">{rec.reason}</p>
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

      {/* Configuration Files */}
      <AnalysisSection title="Deployment Configuration Files">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Container Configuration */}
          <div className="space-y-2">
            <h4 className="font-medium">Container Configuration</h4>
            <div className="space-y-1">
              {[
                { name: 'Dockerfile', present: deploymentFiles.hasDockerfile },
                { name: 'Docker Compose', present: deploymentFiles.hasDockerCompose },
                { name: 'Docker Ignore', present: deploymentFiles.hasDockerIgnore },
                { name: 'Kubernetes Config', present: deploymentFiles.hasKubernetesConfig }
              ].map((file) => (
                <div key={file.name} className="flex items-center gap-2 text-sm">
                  {file.present ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cloud Platform Configuration */}
          <div className="space-y-2">
            <h4 className="font-medium">Cloud Configuration</h4>
            <div className="space-y-1">
              {[
                { name: 'AWS Config', present: deploymentFiles.hasAwsConfig },
                { name: 'Google Cloud Config', present: deploymentFiles.hasGcloudConfig },
                { name: 'Azure Config', present: deploymentFiles.hasAzureConfig },
                { name: 'Environment Config', present: deploymentFiles.hasEnvFile }
              ].map((file) => (
                <div key={file.name} className="flex items-center gap-2 text-sm">
                  {file.present ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CI/CD Configuration */}
          <div className="space-y-2">
            <h4 className="font-medium">CI/CD Configuration</h4>
            <div className="space-y-1">
              {[
                { name: 'GitHub Actions', present: deploymentFiles.hasGithubActions },
                { name: 'CircleCI Config', present: deploymentFiles.hasCircleCI },
                { name: 'Travis CI Config', present: deploymentFiles.hasTravisConfig }
              ].map((file) => (
                <div key={file.name} className="flex items-center gap-2 text-sm">
                  {file.present ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Build Configuration */}
          <div className="space-y-2">
            <h4 className="font-medium">Build Configuration</h4>
            <div className="space-y-1">
              {[
                { name: 'Build Script', present: deploymentFiles.hasBuildScript },
                { name: 'Start Script', present: deploymentFiles.hasStartScript },
                { name: 'Test Script', present: deploymentFiles.hasTestScript }
              ].map((file) => (
                <div key={file.name} className="flex items-center gap-2 text-sm">
                  {file.present ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnalysisSection>

      {/* Missing Configuration Alerts */}
      {Object.values(deploymentPossibilities).some(p => p.readinessScore < 100) && (
        <Alert variant="warning">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Missing Deployment Configurations</AlertTitle>
          <AlertDescription>
            <p>Some deployment configurations are incomplete. Consider adding:</p>
            <ul className="list-disc list-inside mt-2">
              {Object.entries(deploymentPossibilities).map(([key, value]) => {
                if (value.readinessScore < 100) {
                  return value.requirements
                    .filter(req => !req.met)
                    .map((req, index) => (
                      <li key={`${key}-${index}`} className="text-sm">
                        {req.name} for {key} deployment
                      </li>
                    ));
                }
                return null;
              }).flat().filter(Boolean)}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DependenciesTab;