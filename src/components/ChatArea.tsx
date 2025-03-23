
import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: number;
  text: string;
  isAi: boolean;
}

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
}

const ChatArea = ({ messages, isTyping }: ChatAreaProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col pt-16 pb-20 h-screen">
      <div className="flex-1 px-4 md:px-8 overflow-hidden" ref={scrollContainerRef}>
        <div className="max-w-3xl mx-auto py-4 h-[calc(100vh-9rem)] overflow-y-auto">
          <div className="w-full max-w-md mx-auto my-8">
            <img 
              src="/lovable-uploads/a3f71c14-911d-4290-87fb-1be99d9e0fa0.png" 
              alt="Neural Network Circuit" 
              className="w-full h-auto pixel-border border-amp-cyan p-1"
            />
          </div>
          
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.text}
              isAi={message.isAi}
            />
          ))}
          {isTyping && (
            <MessageBubble
              message=""
              isAi={true}
              isTyping={true}
            />
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
