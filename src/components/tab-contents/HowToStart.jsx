import React from 'react';
import { Info, ChevronLeft, Activity, Shield, GitBranch, Users, ExternalLink } from 'lucide-react';
import { Button } from "../ui/button";
import { SAMPLE_REPOS, HEALTH_SCORE_RANGES } from '../../constants';
import HowToStartContent from './HowToStartContent';

const HowToStart = ({ open, onClose }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

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
              <h2 className="font-medium">Getting Started</h2>
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
              {/* Quick Start Guide */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Quick Start Guide</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium mb-2">What are GitHub Repositories?</h4>
                    <p className="text-gray-600 mb-2">
                      GitHub repositories are where developers store their project's code. For crypto projects,
                      these repositories contain the actual code that powers the protocol or application.
                    </p>
                    <p className="text-gray-600">
                      Analyzing these repositories can reveal important information about:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                      <li>How actively the project is maintained</li>
                      <li>The quality of the development practices</li>
                      <li>The size and engagement of the developer community</li>
                      <li>Security measures and potential risks</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium mb-2">How to Find a Repository</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                      <li>Visit the project's website or documentation</li>
                      <li>Look for GitHub links (usually in the footer or About section)</li>
                      <li>Copy the repository URL (e.g., https://github.com/username/repository)</li>
                      <li>Paste the URL into our analyzer</li>
                    </ol>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium mb-2">Try These Example Repositories</h4>
                    <div className="space-y-3">
                      {Object.entries(SAMPLE_REPOS).map(([key, repo]) => (
                        <div key={key} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium capitalize">{key}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(repo.url)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Copy URL
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600">{repo.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <HowToStartContent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToStart;