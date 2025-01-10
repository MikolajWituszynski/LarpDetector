import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { Twitter, Github, Map, Info, Globe } from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/Badge";
import RoadmapSidebar from "./components/tab-contents/RoadmapSidebar";
import SocialsSidebar from "./components/tab-contents/SocialsSidebar";
import HowToStartSidebar from "./components/tab-contents/HowToStartSidebar";
const Navbar = ({ setRoadmapOpen, setSocialsOpen, setHowToStartOpen, currentPage, roadmapOpen, socialsOpen, howToStartOpen }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⌘ Code_Crunch</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setHowToStartOpen(true)}
                className="flex items-center gap-2"
              >
                <Info className="h-4 w-4" />
                How to Start
                <Badge variant="secondary" className="ml-1">New</Badge>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => setRoadmapOpen(true)}
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                Roadmap
                <Badge variant="secondary" className="ml-1">New</Badge>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => setSocialsOpen(true)}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4" />
                Socials
                <Badge variant="secondary" className="ml-1">New</Badge>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate(currentPage === 'github' ? '/X-check' : '/')}
                className="flex items-center gap-2"
              >
                {currentPage === 'github' ? (
                  <>
                    <Twitter className="h-4 w-4" />
                    Twitter Check
                  </>
                ) : (
                  <>
                    <Github className="h-4 w-4" />
                    GitHub Check
                  </>
                )}
                <Badge variant="secondary" className="ml-1">New</Badge>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebars */}
      <RoadmapSidebar 
        open={roadmapOpen} 
        onClose={() => setRoadmapOpen(false)} 
      />
      
      <SocialsSidebar 
        open={socialsOpen} 
        onClose={() => setSocialsOpen(false)} 
      />

      <HowToStartSidebar
        open={howToStartOpen}
        onClose={() => setHowToStartOpen(false)}
      />
    </>
  );
};

export default Navbar;
