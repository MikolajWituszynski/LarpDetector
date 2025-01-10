import React from 'react';
import { Info, ChevronLeft,Activity, Shield,GitBranch,Users } from 'lucide-react';
import { Button } from "../ui/button";

const HowToStartSidebar = ({ open, onClose }) => {
  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={onClose}
        />
      )}
      <div className={`
        fixed inset-y-0 left-0 z-40
        w-102
        transform transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        bg-white border-r border-gray-200
      `}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600">
              <Info className="h-5 w-5" />
              <h2 className="font-medium">GitHub Repository Analysis</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Understanding GitHub Analysis</h3>
                <p className="text-blue-800 mb-4">
                  We analyze GitHub repositories to reveal project reliability through code patterns
                </p>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Commit Analysis
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Commit frequency: Shows if project is actively maintained</li>
                      <li>• Commit quality: Reveals development professionalism</li>
                      <li>• Commit patterns: Indicates genuine vs artificial activity</li>
                      <li>• Code changes: Shows what's really being updated</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      Repository Structure
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Branch organization: Shows development professionalism</li>
                      <li>• Code structure: Reveals project organization quality</li>
                      <li>• Documentation: Indicates transparency level</li>
                      <li>• Testing setup: Shows reliability focus</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Developer Activity
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Contributor patterns: Shows team size and engagement</li>
                      <li>• Issue handling: Reveals response to problems</li>
                      <li>• Pull requests: Shows collaboration quality</li>
                      <li>• Code reviews: Indicates development standards</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Repository Security
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Branch protection: Shows code change controls</li>
                      <li>• Security features: Reveals vulnerability prevention</li>
                      <li>• Access controls: Indicates code safety measures</li>
                      <li>• Dependency management: Shows update discipline</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium mb-2">Repository Health Score</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 80-100: Professional repository with strong practices</li>
                      <li>• 60-79: Active repository with some improvement areas</li>
                      <li>• Below 60: Multiple GitHub red flags detected</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToStartSidebar;
