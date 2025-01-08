import React from 'react';
import { Shield, GitBranch, Users, AlertTriangle, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const HowToStartGuide = () => {
  const features = [
    {
      icon: Shield,
      title: "Security Analysis",
      description: "Analyze repository security features, dependencies, and potential vulnerabilities"
    },
    {
      icon: GitBranch,
      title: "Code Quality",
      description: "Evaluate code maintenance, documentation, and development practices"
    },
    {
      icon: Users,
      title: "Community Health",
      description: "Assess community engagement, contributor activity, and project momentum"
    },
    {
      icon: AlertTriangle,
      title: "Risk Detection",
      description: "Identify potential risks in repository structure and maintenance patterns"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Info className="h-5 w-5" />
            Welcome to Code_Crunch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Code_Crunch helps you evaluate GitHub repositories for potential risks and quality metrics. 
            Perfect for researchers and investors looking to assess project credibility.
          </p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Quick Start:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Paste a GitHub repository URL in the search bar</li>
              <li>Click "ANALYZE" to start the evaluation</li>
              <li>Review comprehensive analysis across multiple categories</li>
              <li>Check the Socials tab for additional team verification</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pro Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-600">
                Check the "Risks" tab first for quick red flags
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-600">
                Review commit patterns in the "Activity" tab to assess development consistency
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-600">
                Use the "Socials" feature to cross-reference team information
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToStartGuide;