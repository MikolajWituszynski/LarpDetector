// RoadmapTab.jsx
import React from 'react';
import { MapIcon } from 'lucide-react';
import AnalysisSection from '../AnalysisSection';
import RoadmapDetails from '../RoadmapDetails';

const RoadmapTab = () => {
  return (
    <div className="space-y-6">
      {/* Roadmap Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-start gap-3">
          <MapIcon className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">Future Development</h3>
            <p className="text-sm text-blue-700 mt-1">
              Explore upcoming features and improvements planned for the GitHub Repository Analyzer
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Chart */}
      <AnalysisSection 
        title="Development Timeline" 
        subtitle="Planned feature releases and major milestones"
      >
        <div className="h-96 w-full">
          {/* Insert your timeline chart artifact here */}
        </div>
      </AnalysisSection>

      {/* Feature Details */}
      <AnalysisSection 
        title="Upcoming Features" 
        subtitle="Detailed overview of planned developments"
      >
        <RoadmapDetails />
      </AnalysisSection>
    </div>
  );
};

export default RoadmapTab;