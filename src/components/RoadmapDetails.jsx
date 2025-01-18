import React from 'react';
import { CircleDot,Circle,CheckCircle2 } from 'lucide-react';
import { Badge } from "./ui/Badge";

const RoadmapDetails = () => {
  const features = [

    {
      title: "Social Signal Analysis",
      status: "In Development",
      timeline: "Q1 2025",
      description: "Deep analysis of project's social footprint and team authenticity",
      features: [
        {
          title: "Twitter history",
          subFeatures: ["handle changes & past activities"],
          completed: true 
        },
        {
          title: "Team verification",
          subFeatures: ["cross-platform presence"],
          completed: false 
        },
        {
          title: "Community analysis",
          subFeatures: ["authenticity scoring"],
          completed: false
        }
      ]
    },
    {
      title: "elizaOS  ",
      status: "Planned",
      timeline: "Q1 2025",
      description: "AI assistant for comprehensive project analysis and risk detection",
      features: [
        {
          title: "ElizaOS Setup",
          subFeatures: [
            "Twitter/X API integration",
            "Telegram connection",
           
          ],
          completed: true
        },
        {
          title: "Code Analysis",
          subFeatures: [
            "Repository scanning",
            "Basic risk detection"
          ],
          completed: false
        },
        {
          title: "Twitter Analysis",
          subFeatures: [
            "Account history check",
            "Engagement patterns",
            "Team verification across platforms"
          ],
          completed: false
        },
        {
          title: "Combined Reports",
          subFeatures: [
            "Code + social risk score",
            "Quick summaries",
            "Pattern recognition",
          ],
          completed: false
        }
      ]
    },
  
    {
      title: "Launch Analysis Tools",
      status: "Planned",
      timeline: "Q2 2025",
      description: "Detect potential risks in token launches and initial distributions",
      features: [
        {
          title: "Token distribution",
          subFeatures: ["analysis patterns"],
          completed: false
        },
        {
          title: "Historical patterns",
          subFeatures: ["from similar launches"],
          completed: false
        },
        {
          title: "Wallet analysis",
          subFeatures: ["team & early holders"],
          completed: false
        }
      ]
    },
    {
      title: "Cross-Platform Alert System",
      status: "Planned",
      timeline: "Q2 2025",
      description: "Comprehensive monitoring across blockchain, social media, and code repositories to detect potential risks and suspicious activities",
      features: [
        {
          title: "On-Chain Monitoring",
          subFeatures: [
            "Unusual token movements and large transfers",
            "Smart contract interaction patterns",
            "Liquidity pool changes and rugpull signals",
            "Wallet clustering and relationship analysis"
          ]
        },
        {
          title: "Social Signal Detection",
          subFeatures: [
            "Twitter handle changes and suspicious activity",
            "Sudden follower growth or drop patterns",
            "Coordinated social engineering attempts",
            "Cross-platform reputation analysis"
          ]
        },
        {
          title: "Repository Intelligence",
          subFeatures: [
            "Critical code changes and backdoor attempts",
            "Dependency vulnerability alerts",
            "Suspicious commit patterns",
            "Access control modifications"
          ]
        },
        {
          title: "Alert Management",
          subFeatures: [
            "Custom alert rules and thresholds",
            "Priority-based notification routing",
            "Team collaboration features",
            "Multi-channel delivery (Discord, Telegram)"
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {features.map((feature, index) => (
        <div key={index} className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="space-y-2 mb-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium text-lg">{feature.title}</h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={feature.status === "In Development" ? "default" : "secondary"} 
                  className="whitespace-nowrap text-xs"
                >
                  {feature.status}
                </Badge>
                <Badge variant="outline" className="whitespace-nowrap text-xs">
                  {feature.timeline}
                </Badge>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>

          <div className="space-y-3 pl-2">
            {feature.features.map((item, itemIndex) => (
              <div key={itemIndex} className="group">
                <div className="flex items-start gap-2 py-1">
                  {feature.status === "In Development" ? (
                    item.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    )
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                  )}
                  <div>
                    <span className={`font-medium text-sm ${
                      feature.status === "In Development" 
                        ? item.completed 
                          ? 'text-green-700'
                          : 'text-blue-700'
                        : 'text-gray-600'
                    }`}>
                      {item.title}
                    </span>
                    {item.subFeatures.map((sub, subIndex) => (
                      <div key={subIndex} className="text-sm text-gray-500 ml-1 mt-0.5">
                        • {sub}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Community Feedback Section */}
    <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
      <h3 className="text-lg font-medium text-blue-900 mb-3">
        Community Input Welcome! 🤝
      </h3>
      <p className="text-blue-800 mb-4">
        This roadmap represents our current vision, but we believe in building together with our community. Your feedback is invaluable in shaping our priorities and development direction. Have suggestions? Want certain features sooner? Join our community channels and let us know what matters most to you!
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
          Telegram Group
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
          X (Twitter)
        </span>
      </div>
    </div>
 
    </div>
  );
};

export default RoadmapDetails;