// components/SocialsSidebar.jsx
import React from 'react';
import { Twitter, ChevronLeft } from 'lucide-react';
import { Button } from "../ui/button";
import SocialsTab from '../tab-contents/SocialsTab';
const SocialsSidebar = ({ open, onClose, data }) => (
  <>
    {open && (
      <div 
        className="fixed inset-0 bg-black/20 z-30"
        onClick={onClose}
      />
    )}
    <div className={`
      fixed inset-y-0 left-0 z-40
      w-110
      transform transition-transform duration-200 ease-in-out
      ${open ? 'translate-x-0' : '-translate-x-full'}
      bg-white border-r border-gray-200
    `}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <h2 className="font-medium">Team Socials</h2>
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
          <SocialsTab />
        </div>
      </div>
    </div>
  </>
);

export default SocialsSidebar;