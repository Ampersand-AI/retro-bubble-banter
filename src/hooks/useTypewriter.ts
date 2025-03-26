import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 100, delay: number = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeText = () => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeText, speed);
      } else {
        // Wait before starting to delete
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, delay);
      }
    };

    const deleteText = () => {
      if (currentIndex > 0) {
        currentIndex--;
        // Keep the last character and add a cursor
        setDisplayText(text.slice(0, currentIndex));
        timeoutId = setTimeout(deleteText, speed);
      } else {
        // Wait before starting to type again
        timeoutId = setTimeout(() => {
          setIsTyping(true);
        }, delay);
      }
    };

    if (isTyping) {
      typeText();
    } else {
      deleteText();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [text, speed, delay, isTyping]);

  return displayText + (showCursor ? '|' : '');
}; 