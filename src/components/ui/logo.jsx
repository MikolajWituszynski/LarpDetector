import React from 'react';

const XLogo = ({ className = '', size = 24 }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      aria-label="X" 
      className={className}
      width={size} 
      height={size}
    >
      <path 
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="currentColor"
      />
    </svg>
  );
};

export default XLogo;