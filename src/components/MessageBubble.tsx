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

  const formatMarkdown = (text: string) => {
    return text
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
      // Headers
      .replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, content) => {
        const level = hashes.length;
        return `<h${level}>${content}</h${level}>`;
      })
      // Convert line breaks to <br> for lists
      .replace(/(<li>.*<\/li>)\n/g, '$1<br>')
      // Wrap lists in <ul>
      .replace(/(<li>.*<\/li>.*?)(?=<br>|$)/gs, '<ul>$1</ul>')
      // Convert remaining line breaks to <br>
      .replace(/\n/g, '<br>');
  };
  
  useEffect(() => {
    if (isAi && message && !isTyping && !textComplete) {
      setIsTypingEffect(true);
      setDisplayedText('');
      
      let i = 0;
      const speed = 2;
      
      const typeWriter = () => {
        if (i < message.length) {
          setDisplayedText(message.substring(0, i + 1));
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

  const renderContent = () => {
    if (isTyping) {
      return <TypingIndicator />;
    }

    if (isAi && isTypingEffect) {
      return (
        <>
          {displayedText}
          <span className="inline-block w-1 h-4 bg-amp-cyan ml-1 animate-blink"></span>
        </>
      );
    }

    const text = displayedText || message;
    return (
      <>
        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: formatMarkdown(text)
          }} 
        />
        {tokenCount && !isTyping && (
          <div className="text-xs mt-2">
            <span className="text-red-500">Input: {tokenCount.input} tokens</span>
            {' | '}
            <span className="text-orange-500">Output: {tokenCount.output} tokens</span>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={`flex items-start mb-4 animate-fade-in-up ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && (
        <div className="w-8 h-8 bg-amp-blue flex items-center justify-center flex-shrink-0">
          <img 
            src="/images/rovyk.png" 
            alt="AI Assistant" 
            className="w-6 h-6" 
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
        {renderContent()}
      </div>
    </div>
  );
};

export default MessageBubble;
