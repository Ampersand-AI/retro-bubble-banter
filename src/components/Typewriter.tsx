import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
  pauseTime?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  delay = 50, 
  className = "", 
  pauseTime = 2000 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isDeleting) {
      if (displayText.length < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(text.substring(0, displayText.length + 1));
        }, delay);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, delay / 2);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
      }
    }
  }, [displayText, text, delay, pauseTime, isDeleting]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default Typewriter; 