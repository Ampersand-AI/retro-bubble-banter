
import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="pt-20 pb-24 px-4 md:px-8 overflow-y-auto h-screen crt-effect">
      <div className="max-w-3xl mx-auto">
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
  );
};

export default ChatArea;
