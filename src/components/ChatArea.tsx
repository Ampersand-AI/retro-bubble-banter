import React, { useRef, useEffect, useState } from 'react';
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
  const [inputHeight, setInputHeight] = useState(0);

  // Listen for input height changes
  useEffect(() => {
    const handleResize = () => {
      const inputSection = document.querySelector('.input-section');
      if (inputSection) {
        setInputHeight(inputSection.clientHeight);
      }
    };

    // Initial measurement
    handleResize();

    // Create ResizeObserver to watch for height changes
    const resizeObserver = new ResizeObserver(handleResize);
    const inputSection = document.querySelector('.input-section');
    if (inputSection) {
      resizeObserver.observe(inputSection);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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
    <div className="flex justify-center items-center" style={{ height: `calc(100vh - ${inputHeight + 64}px)` }}>
      <div className="h-full self-start max-w-4xl overflow-hidden">
        <ScrollArea className="h-full pr-[25px] pt-12 [&_[data-radix-scroll-area-scrollbar]]:w-1 [&_[data-radix-scroll-area-scrollbar]]:bg-amp-cyan/5 [&_[data-radix-scroll-area-scrollbar]]:hover:bg-amp-cyan/10 [&_[data-radix-scroll-area-scrollbar]]:rounded-none">
          <div className="px-4 py-4">
            <div className="flex flex-col items-center justify-center mb-8">
              <img 
                src="/images/rovyk-loading.png" 
                alt="RovyK Loading" 
                className="lg:w-80 hidden lg:block h-auto mb-4"
              />
            </div>
            {messages.map((message) => (
              <div key={message.id} className="relative group p-2">
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
    </div>
  );
};

export default ChatArea;
