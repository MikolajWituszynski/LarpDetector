import React from 'react';
import { cn } from "../../lib/utils";

const Tab = ({ icon: Icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 border-b-2 transition-colors duration-200",
        "hover:text-black hover:border-gray-300",
        active 
          ? "border-black text-black font-medium" 
          : "border-transparent text-gray-500"
      )}
      aria-selected={active}
      role="tab"
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      <span>{label}</span>
    </button>
  );
};

export default Tab;