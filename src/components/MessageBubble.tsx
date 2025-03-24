
import React, { useState, useEffect } from 'react';
import TypingIndicator from './TypingIndicator';

interface MessageBubbleProps {
  message: string;
  isAi: boolean;
  isTyping?: boolean;
  tokenCount?: {
    input: number;
    output: number;
  };
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
      const speed = 2; // Even faster typing speed (reduced from 5ms to 2ms)
      
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
        <div className="w-8 h-8 mr-1 bg-amp-blue flex items-center justify-center flex-shrink-0">
          <img 
            src="/images/rovyk.png" 
            alt="AI Assistant" 
            className="w-6 h-6 filter brightness-100 saturate-100 hue-rotate-60" 
          />
        </div>
      )}
      <div 
        className={`${
          isAi 
            ? 'bg-transparent text-amp-cyan' 
            : 'bg-transparent text-amp-gray'
        } px-3 max-w-[75%] break-words`}
      >
        {isTyping ? (
          <TypingIndicator />
        ) : isAi && isTypingEffect ? (
          <>
            {displayedText}
            <span className="inline-block w-1 h-4 bg-amp-cyan ml-1 animate-blink"></span>
          </>
        ) : (
          <>
            {displayedText || message}
            {tokenCount && !isTyping && (
              <div className="text-xs mt-2">
                <span className="text-red-500">Input: {tokenCount.input} tokens</span>
                {' | '}
                <span className="text-orange-500">Output: {tokenCount.output} tokens</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
