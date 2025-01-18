import React from 'react';
import { 
  Scale, Timer, Users, Code, Heart, Twitter, LineChart,
  Brain, ShieldAlert, AlertTriangle, CheckCircle, Bot,
  Search, ClipboardCheck, RefreshCcw, GitFork
} from 'lucide-react';
import { HEALTH_SCORE_RANGES } from '../../constants';
import AnalysisSection from '../AnalysisSection';

const DocumentationTab = () => {
  return (
    <div className="space-y-4">
      {/* Introduction */}
      <AnalysisSection title="What is WarOnLarps?">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-gray-700">
            WarOnLarps is your go-to tool for quick and reliable research on crypto projects. Think of it as your personal detective that helps you spot potential risks and verify project legitimacy by analyzing GitHub repositories and social media presence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[
              {
                icon: Search,
                title: "Save Time",
                description: "Get comprehensive insights in seconds instead of hours"
              },
              {
                icon: ShieldAlert,
                title: "Spot Red Flags",
                description: "Quickly identify potential warning signs in projects"
              },
              {
                icon: ClipboardCheck,
                title: "Make Informed Decisions",
                description: "Get data-driven insights to support your research"
              },
              {
                icon: RefreshCcw,
                title: "Track Changes",
                description: "Monitor projects over time for concerning changes"
              }
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-2">
                <benefit.icon className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-medium">{benefit.title}</h4>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnalysisSection>

      {/* Scoring System */}
      <AnalysisSection title="How We Calculate Risk Scores">
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">
            Our comprehensive scoring system analyzes multiple aspects of a project to provide a holistic risk assessment. Each component is carefully weighted to ensure accurate and reliable results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: Timer,
              title: "Project Maturity (25%)",
              items: [
                "Repository age and history",
                "Consistent development patterns",
                "Long-term maintenance indicators",
                "Update frequency and timing"
              ]
            },
            {
              icon: Users,
              title: "Team Assessment (25%)",
              items: [
                "Contributor verification",
                "Development team size",
                "Contribution patterns",
                "Team consistency"
              ]
            },
            {
              icon: Code,
              title: "Code Quality (25%)",
              items: [
                "Documentation completeness",
                "Security implementations",
                "Development standards",
                "Testing and validation"
              ]
            },
            {
              icon: Heart,
              title: "Community Health (25%)",
              items: [
                "User engagement levels",
                "Issue response times",
                "Community growth patterns",
                "Collaboration indicators"
              ]
            }
          ].map((section, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <section.icon className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium mb-2">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Risk Levels */}
      <AnalysisSection 
        title="Understanding Risk Levels"
        subtitle="How to interpret different score ranges"
      >
        <div className="space-y-3">
          {[
            {
              range: "80-100",
              title: "Strong Project Indicators",
              description: "Projects in this range show excellent health across all metrics",
              color: "bg-indigo-50 border-indigo-100",
              icon: CheckCircle,
              iconColor: "text-indigo-500",
              indicators: [
                "Established project history",
                "Multiple trusted contributors",
                "Consistent development",
                "Professional code standards",
                "Active, organic community"
              ]
            },
            {
              range: "60-79",
              title: "Generally Healthy",
              description: "Good overall health with some areas for improvement",
              color: "bg-green-50 border-green-100",
              icon: CheckCircle,
              iconColor: "text-green-500",
              indicators: [
                "Good project history",
                "Verified contributors",
                "Regular development",
                "Solid code standards",
                "Growing community"
              ]
            },
            {
              range: "40-59",
              title: "Exercise Caution",
              description: "Multiple areas require attention and verification",
              color: "bg-yellow-50 border-yellow-100",
              icon: AlertTriangle,
              iconColor: "text-yellow-500",
              indicators: [
                "Limited history",
                "Few verified contributors",
                "Inconsistent development",
                "Basic code standards",
                "Small community"
              ]
            },
            {
              range: "Below 40",
              title: "High Risk",
              description: "Significant concerns detected",
              color: "bg-red-50 border-red-100",
              icon: ShieldAlert,
              iconColor: "text-red-500",
              indicators: [
                "Very new or unclear history",
                "Unverified contributors",
                "Irregular activity",
                "Poor standards",
                "Limited engagement"
              ]
            }
          ].map((level) => (
            <div key={level.range} className={`p-4 rounded-lg border ${level.color}`}>
              <div className="flex items-start gap-3">
                <level.icon className={`h-5 w-5 ${level.iconColor} mt-1`} />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{level.range}: {level.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {level.indicators.map((indicator, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <span className={`w-1 h-1 rounded-full ${level.iconColor}`} />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Best Practices */}
      <AnalysisSection title="Making the Most of WarOnLarps">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Regular Checks",
              items: [
                "Monitor projects regularly",
                "Watch for sudden changes",
                "Track development patterns"
              ]
            },
            {
              title: "Cross-Reference",
              items: [
                "Compare GitHub with social",
                "Look for consistency",
                "Verify team information"
              ]
            },
            {
              title: "Decision Making",
              items: [
                "Use as part of research",
                "Consider multiple metrics",
                "Verify independently"
              ]
            }
          ].map((practice, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">{practice.title}</h3>
              <ul className="space-y-2">
                {practice.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Future Plans */}
      <AnalysisSection title="Coming Soon">
        <div className="space-y-4">
          {[
            {
              icon: Bot,
              title: "ElizaOS Integration",
              description: "Smart AI analysis with cross-platform verification and automated risk detection",
              features: ["AI-powered analysis", "Real-time monitoring", "Pattern recognition"],
              timeline: "Q1 2024"
            },
            {
              icon: Twitter,
              title: "Enhanced Social Analysis",
              description: "Deeper team verification and historical pattern tracking",
              features: ["Team verification", "Pattern tracking", "Cross-platform correlation"],
              timeline: "Q2 2024"
            },
            {
              icon: Brain,
              title: "Advanced Features",
              description: "Comprehensive monitoring and verification tools",
              features: ["Custom alerts", "Project comparisons", "Team verification"],
              timeline: "Q3 2024"
            }
          ].map((feature, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <feature.icon className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{feature.title}</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {feature.timeline}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 mb-2">{feature.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.features.map((item, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Research Tool Disclaimer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
        <p className="font-medium mb-2">Important Note:</p>
        <p>WarOnLarps is designed for research purposes only. This tool helps you gather information but:</p>
        <ul className="mt-2 space-y-1">
          <li>• Not financial advice</li>
          <li>• Not investment recommendations</li>
          <li>• Should be part of broader research</li>
          <li>• Requires independent verification</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentationTab;