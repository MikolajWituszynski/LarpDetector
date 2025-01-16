import React from 'react';
import { Book, Users, MessageCircle, Clock, Mail, Github, ExternalLink, Heart,AlertCircle  } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription} from "../ui/alert";
import AnalysisSection from '../AnalysisSection';
import MetricCard from '../MetricCard';
import { Badge } from "../ui/Badge";

const GettingStartedTab = ({ data }) => {
  if (!data) return null;

  const { repoData, contributors = [], timeMetrics = {} } = data;

  // Calculate team metrics
  const contributorsArray = Array.isArray(contributors) ? contributors : [];
  const activeContributors = contributorsArray.filter(c => c.recentCommits > 0);
  const responseTime = timeMetrics.averageIssueResponseTime || 48; // hours
  const mainContributors = contributorsArray.slice(0, 5); // Top 5 contributors

  // Analyze project setup
  const getProjectSetup = () => {
    // Check if it's a Rust project
    const isRustProject = data.files?.some(f => 
      f.name === 'Cargo.toml' || 
      f.name === 'Cargo.lock'
    );
    
    // Check if it uses Docker
    const hasDocker = data.files?.some(f => 
      f.name === 'Dockerfile' || 
      f.name === 'docker-compose.yml'
    );

    // Check for required system dependencies from README
    const systemDependencies = [
      'protoc',
      'build-essential',
      'pkg-config',
      'libssl-dev'
    ];

    return {
      isRustProject,
      hasDocker,
      systemDependencies
    };
  };

  const setup = getProjectSetup();

  // Generate appropriate quick start steps
  const quickStartSteps = [
    ...(setup.hasDocker ? [
      {
        title: "Configuration",
        command: "cp .env.example .env && cd dashboard && cp .env.example .env",
        description: "Set up environment configuration files"
      },
      {
        title: "Docker Setup",
        command: "docker compose up",
        description: "Start the application using Docker"
      }
    ] : [
      {
        title: "System Dependencies",
        command: "sudo apt install protoc build-essential pkg-config libssl-dev",
        description: "Install required system dependencies"
      },
      {
        title: "Build",
        command: "cargo build --release",
        description: "Build the project using Cargo"
      },
      {
        title: "Run Services",
        command: "./run-systemd-services.sh",
        description: "Start the required services"
      }
    ]),
    {
      title: "Configuration",
      command: "cp .env.example .env",
      description: "Set up your environment variables"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       
      
      </div>

     

      {/* Core Team */}
      <AnalysisSection 
        title="Core Team" 
        subtitle="Meet the main contributors"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repoData.owner && (
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <img 
                  src={repoData.owner.avatar_url} 
                  alt={repoData.owner.login}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    {repoData.owner.login}
                    <Badge variant="success">Owner</Badge>
                  </h4>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <a
                  href={repoData.owner.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Github className="h-3 w-3" />
                  GitHub Profile
                </a>
              </div>
            </div>
          )}
          {Array.isArray(repoData.contributors) && repoData.contributors.slice(0, 4).map((contributor) => (
            <div key={contributor.login} className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <img 
                  src={contributor.avatar_url} 
                  alt={contributor.login}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-medium">{contributor.login}</h4>
                  {contributor.contributions && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Heart className="h-3 w-3" />
                      {contributor.contributions} contributions
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <a
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Github className="h-3 w-3" />
                  GitHub Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Support Channels */}
      <AnalysisSection 
        title="Getting Help" 
        subtitle="Ways to get support"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Issues & Discussions */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              Community Support
            </h4>
            
            <a
              href={`${repoData.html_url}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View Issues
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Documentation */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium flex items-center gap-2">
              <Book className="h-4 w-4 text-green-600" />
              Documentation
            </h4>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">README</span>
                <Badge variant={repoData.has_readme ? "success" : "secondary"}>
                  {repoData.has_readme ? "Available" : "Not Found"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Wiki</span>
                <Badge variant={repoData.has_wiki ? "success" : "secondary"}>
                  {repoData.has_wiki ? "Available" : "Not Found"}
                </Badge>
              </div>
            </div>
            {repoData.homepage && (
              <a
                href={repoData.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
              >
                Visit Documentation
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </AnalysisSection>

      {/* Project Status */}
      <AnalysisSection 
        title="Project Status" 
        subtitle="Current state and activity"
      >
        <div className="space-y-4">
          {/* Last Update */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span>Last Updated</span>
            </div>
            <Badge variant={timeMetrics.lastUpdated < 30 ? "success" : "warning"}>
              {timeMetrics.lastUpdated} days ago
            </Badge>
          </div>

          {/* Maintenance Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span>Maintenance</span>
            </div>
            <Badge variant={timeMetrics.isActive ? "success" : "warning"}>
              {timeMetrics.isActive ? "Active" : "Low Activity"}
            </Badge>
          </div>
        </div>
      </AnalysisSection>

      {/* Project Health Alert */}
      <Alert className={timeMetrics.isActive ? "bg-green-50" : "bg-yellow-50"}>
        <AlertTitle className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          Project Health Status
        </AlertTitle>
        <AlertDescription>
          {timeMetrics.isActive 
            ? "This project is actively maintained with regular updates and responsive maintainers."
            : "This project shows low activity. Consider checking with maintainers about its status."}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default GettingStartedTab;