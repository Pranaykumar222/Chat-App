import React from 'react';

const TypingIndicator = ({ name }) => {
  return (
    <div className="flex items-center">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
      </div>
      <span className="ml-2 text-xs text-gray-500">{name} is typing...</span>
    </div>
  );
};

export default TypingIndicator;