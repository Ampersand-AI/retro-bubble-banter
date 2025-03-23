
import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Clipboard } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

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

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Message has been copied to your clipboard",
      duration: 2000
    });
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="w-[500px] h-[500px] max-w-[500px] max-h-[500px] overflow-hidden" ref={scrollContainerRef}>
        <div className="mx-auto py-4 h-full overflow-y-auto px-4">
          {messages.map((message) => (
            <div key={message.id} className="relative group">
              <MessageBubble
                message={message.text}
                isAi={message.isAi}
              />
              {message.isAi && (
                <button 
                  onClick={() => copyMessage(message.text)}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-amp-cyan hover:text-amp-gray"
                >
                  <Clipboard size={16} />
                </button>
              )}
            </div>
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
