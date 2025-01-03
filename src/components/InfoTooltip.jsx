import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const InfoTooltip = ({ content }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button className="p-0.5 rounded-full hover:bg-gray-100 transition-colors">
            <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            <span className="sr-only">More information</span>
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;