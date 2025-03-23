
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex space-x-1 mt-1 ml-2">
      <div className="w-2 h-2 bg-amp-cyan rounded-full animate-typing" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-amp-cyan rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-amp-cyan rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default TypingIndicator;
