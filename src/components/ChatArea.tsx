
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
    <div className="flex flex-col pt-16 pb-20 h-screen items-center justify-center">
      <div className="flex-1 px-4 md:px-8 overflow-hidden w-1/2 h-1/2" ref={scrollContainerRef}>
        <div className="mx-auto py-4 h-[calc(50vh-9rem)] overflow-y-auto">
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
