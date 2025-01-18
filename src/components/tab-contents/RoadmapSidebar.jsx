import React, { useState, useCallback, useEffect } from 'react';
import { Map, ChevronLeft } from 'lucide-react';
import { Button } from "../ui/button";
import RoadmapDetails from '../RoadmapDetails';

const RoadmapSidebar = ({ open, onClose }) => {
  const [width, setWidth] = useState(384); // Starting width
  const [isResizing, setIsResizing] = useState(false);

  // Handle mouse move for resizing
  const handleMouseMove = useCallback((e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      // Set min and max width limits
      if (newWidth >= 320 && newWidth <= 800) {
        setWidth(newWidth);
      }
    }
  }, [isResizing]);

  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'ew-resize';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.body.style.cursor = 'default';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={onClose}
        />
      )}
      <div 
        className={`
          fixed inset-y-0 left-0 z-40
          transform transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          bg-white border-r border-gray-200 flex
        `}
        style={{ width: `${width}px` }}
      >
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600">
              <Map className="h-5 w-5" />
              <h2 className="font-medium">Development Roadmap</h2>
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
            <RoadmapDetails />
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-blue-500/50 group"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 -mr-2 rounded flex items-center justify-center transition-colors group-hover:bg-blue-100">
            <div className="w-0.5 h-4 bg-gray-300 group-hover:bg-blue-400" />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoadmapSidebar;