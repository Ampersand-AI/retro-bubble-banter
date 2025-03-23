
import React, { useState, useEffect } from 'react';
import TypingIndicator from './TypingIndicator';

interface MessageBubbleProps {
  message: string;
  isAi: boolean;
  isTyping?: boolean;
  tokenCount?: number;
}

const MessageBubble = ({ message, isAi, isTyping, tokenCount }: MessageBubbleProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingEffect, setIsTypingEffect] = useState(false);
  const [textComplete, setTextComplete] = useState(false);
  
  useEffect(() => {
    if (isAi && message && !isTyping && !textComplete) {
      setIsTypingEffect(true);
      setDisplayedText('');
      
      let i = 0;
      const speed = 5; // Even faster typing speed (reduced from 10ms to 5ms)
      
      const typeWriter = () => {
        if (i < message.length) {
          setDisplayedText(message.substring(0, i + 1)); // Use substring instead of concatenation
          i++;
          setTimeout(typeWriter, speed);
        } else {
          setIsTypingEffect(false);
          setTextComplete(true);
        }
      };
      
      typeWriter();
    } else if (!isAi) {
      setDisplayedText(message);
      setTextComplete(true);
    }
    
    return () => {
      setIsTypingEffect(false);
      setTextComplete(false);
    };
  }, [message, isAi, isTyping]);

  return (
    <div className={`flex items-start mb-4 animate-fade-in-up ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && (
        <div className="w-8 h-8 mr-2 mt-1 bg-amp-blue flex items-center justify-center flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="AI Assistant" 
            className="w-6 h-6 text-[#1EAEDB] filter brightness-0 invert" 
          />
        </div>
      )}
      <div 
        className={`${
          isAi 
            ? 'bg-transparent text-amp-cyan' 
            : 'bg-transparent text-amp-gray'
        } p-3 max-w-[75%] break-words`}
      >
        {isTyping ? (
          <TypingIndicator />
        ) : isAi && isTypingEffect ? (
          <>
            {displayedText}
            <span className="inline-block w-1 h-4 bg-amp-cyan ml-1 animate-blink"></span>
          </>
        ) : (
          displayedText || message
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
