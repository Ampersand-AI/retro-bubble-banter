import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update or typing status changes
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatEndRef.current && scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          // Force scroll to bottom
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    };

    // Scroll immediately
    scrollToBottom();

    // If AI is typing, set up an interval to keep scrolling
    let intervalId: NodeJS.Timeout | null = null;
    if (isTyping) {
      intervalId = setInterval(scrollToBottom, 100);
    }

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
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
    <div className="flex justify-center items-center h-[calc(100vh-12rem)] pt-16">
      <div className="h-full w-full max-w-4xl overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full pr-[25px]">
          <div className="px-4 py-6">
            {messages.map((message) => (
              <div key={message.id} className="relative group mb-4">
                <MessageBubble
                  message={message.text}
                  isAi={message.isAi}
                  tokenCount={message.tokenCount}
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
              <div className="mb-4">
                <MessageBubble
                  message=""
                  isAi={true}
                  isTyping={true}
                />
              </div>
            )}
            <div ref={chatEndRef} className="h-4" />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatArea;
