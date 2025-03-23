
import React from 'react';
import { Robot } from 'lucide-react';
import TypingIndicator from './TypingIndicator';

interface MessageBubbleProps {
  message: string;
  isAi: boolean;
  isTyping?: boolean;
}

const MessageBubble = ({ message, isAi, isTyping }: MessageBubbleProps) => {
  return (
    <div className={`flex items-start mb-4 animate-fade-in-up ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && (
        <div className="pixel-border border-amp-cyan w-8 h-8 mr-2 mt-1 bg-amp-blue flex items-center justify-center flex-shrink-0">
          <Robot className="w-5 h-5 text-amp-cyan" />
        </div>
      )}
      <div 
        className={`pixel-border ${
          isAi 
            ? 'border-amp-cyan bg-transparent text-amp-cyan' 
            : 'border-amp-gray bg-transparent text-amp-gray'
        } p-3 max-w-[75%] break-words`}
      >
        {isTyping ? <TypingIndicator /> : message}
      </div>
    </div>
  );
};

export default MessageBubble;
