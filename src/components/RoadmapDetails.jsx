import React from 'react';
import { CircleDot } from 'lucide-react';
import { Badge } from "./ui/Badge";

const RoadmapDetails = () => {
  const features = [
    {
      title: "ElizaOS AI Agent Integration",
      status: "In Development",
      timeline: "Q1 2025",
      description: "AI assistant for comprehensive project analysis and risk detection",
      features: [
        {
          title: "Natural conversations",
          subFeatures: ["about any crypto project"]
        },
        {
          title: "Risk assessment",
          subFeatures: ["through repository analysis"]
        },
        {
          title: "Cross-platform",
          subFeatures: ["Twitter integration, Telegram integration"]
        }
      ]
    },
    {
      title: "Social Signal Analysis",
      status: "Planned",
      timeline: "Q1 2025",
      description: "Deep analysis of project's social footprint and team authenticity",
      features: [
        {
          title: "Twitter history",
          subFeatures: ["handle changes & past activities"]
        },
        {
          title: "Team verification",
          subFeatures: ["cross-platform presence"]
        },
        {
          title: "Community analysis",
          subFeatures: ["authenticity scoring"]
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
          subFeatures: ["analysis patterns"]
        },
        {
          title: "Historical patterns",
          subFeatures: ["from similar launches"]
        },
        {
          title: "Wallet analysis",
          subFeatures: ["team & early holders"]
        }
      ]
    },
    {
      title: "Advanced Alerts",
      status: "Planned",
      timeline: "Q2 2025",
      description: "Real-time monitoring and alert system",
      features: [
        {
          title: "Custom alerts",
          subFeatures: ["for project changes"]
        },
        {
          title: "Risk signals",
          subFeatures: ["real-time detection"]
        },
        {
          title: "Automated reporting",
          subFeatures: ["for communities"]
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {features.map((feature, index) => (
        <div key={index} className="bg-white rounded-lg">
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

          <div className="space-y-3">
            {feature.features.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-start gap-2">
                <CircleDot className="h-2 w-2 mt-2 flex-shrink-0 text-blue-600" />
                <div>
                  <span className="font-medium text-sm">
                    {item.title}
                  </span>
                  {item.subFeatures.map((sub, subIndex) => (
                    <span key={subIndex} className="text-sm text-gray-600">
                      {" "}{sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoadmapDetails;