import React from 'react';

const MainLogo = ({ className = '', size = 40 }) => {
  return (
    <div className={`${className}`} style={{ width: size, height: size }}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        <g fill="currentColor">
          {/* Sword handle */}
          <rect x="45" y="10" width="10" height="20" rx="1" />
          {/* Sword guard */}
          <rect x="35" y="30" width="30" height="6" rx="1" />
          {/* Sword blade */}
          <rect x="47" y="36" width="6" height="54" />
          {/* Cross lines */}
          <rect x="20" y="47" width="25" height="4" transform="rotate(-15 20 47)" />
          <rect x="55" y="47" width="25" height="4" transform="rotate(15 80 47)" />
        </g>
      </svg>
    </div>
  );
};

export default MainLogo;