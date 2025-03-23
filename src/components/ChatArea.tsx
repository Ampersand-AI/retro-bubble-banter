
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col pt-16 pb-20 h-screen">
      <ScrollArea className="flex-1 px-4 md:px-8">
        <div className="max-w-3xl mx-auto py-4">
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
      </ScrollArea>
    </div>
  );
};

export default ChatArea;
