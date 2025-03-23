
import React, { useState, useEffect } from 'react';
import TypingIndicator from './TypingIndicator';

interface MessageBubbleProps {
  message: string;
  isAi: boolean;
  isTyping?: boolean;
}

const MessageBubble = ({ message, isAi, isTyping }: MessageBubbleProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypewriting, setIsTypewriting] = useState(isAi);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isAi && !isTyping && message) {
      setIsTypewriting(true);
      setCurrentIndex(0);
      setDisplayedText('');
      
      const typingInterval = setInterval(() => {
        if (currentIndex < message.length) {
          setDisplayedText(prev => prev + message[currentIndex]);
          setCurrentIndex(prevIndex => prevIndex + 1);
        } else {
          clearInterval(typingInterval);
          setIsTypewriting(false);
        }
      }, 15); // Adjust speed as needed
      
      return () => clearInterval(typingInterval);
    }
  }, [message, isAi, isTyping, currentIndex]);

  return (
    <div className={`flex items-start mb-4 animate-fade-in-up ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && (
        <div className="w-8 h-8 mr-2 mt-1 bg-amp-blue flex items-center justify-center flex-shrink-0">
          <img 
            src="/lovable-uploads/ae5d333e-5be0-4b35-bb51-331e1ca052f8.png" 
            alt="AI Assistant" 
            className="w-6 h-6 text-[#1EAEDB]" 
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
        {isTyping ? <TypingIndicator /> : 
          isAi && isTypewriting ? displayedText : message}
      </div>
    </div>
  );
};

export default MessageBubble;
