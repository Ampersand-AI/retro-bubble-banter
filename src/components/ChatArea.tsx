
import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TokenUsageCard from './TokenUsageCard';
import { Clipboard } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  isAi: boolean;
  tokenCount?: {
    input: number;
    output: number;
  };
}

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
}

const ChatArea = ({ messages, isTyping }: ChatAreaProps) => {
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
    <div className="flex flex-row h-screen items-center justify-center gap-6">
      <div className="w-[850px] h-[850px] max-w-[850px] max-h-[850px] overflow-hidden">
        <ScrollArea className="h-full pr-[25px]">
          <div className="px-4 py-4">
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
        </ScrollArea>
      </div>
      
      {/* Token Usage Card */}
      <TokenUsageCard messages={messages} />
    </div>
  );
};

export default ChatArea;
