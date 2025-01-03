import React from 'react';

const Progress = ({ value, className }) => {
  return (
    <div className={`bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default Progress;