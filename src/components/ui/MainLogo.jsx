import React from 'react';

const MainLogo = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20'
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg 
        viewBox="0 0 100 120" 
        width="100%" 
        height="100%"
      >
        {/* Shield outline */}
        <path
          d="
            M 20 20
            L 20 90
            C 20 105, 50 115, 50 115
            C 50 115, 80 105, 80 90
            L 80 20
            Z
          "
          fill="black"
          stroke="black"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Centered Fortress Symbol */}
        <path
          d="
            M 35 40
            L 35 80
            L 65 80
            L 65 40
            L 65 35
            L 60 35
            L 60 40
            L 55 40
            L 55 35
            L 45 35
            L 45 40
            L 40 40
            L 40 35
            L 35 35
            L 35 40
          "
          fill="white"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="square"
        />

        {/* Center archway */}
        <path
          d="
            M 43 55
            A 7 7 0 0 1 57 55
            L 57 80
            L 43 80
            Z
          "
          fill="black"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default MainLogo;