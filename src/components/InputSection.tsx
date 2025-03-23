
import React, { useState, KeyboardEvent } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';

interface InputSectionProps {
  onSendMessage: (message: string) => void;
}

const InputSection = ({ onSendMessage }: InputSectionProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amp-blue border-t-2 border-amp-gray/30 p-4 animate-fade-in-up">
      <div className="max-w-3xl mx-auto flex items-center">
        <div className="flex items-center space-x-3 mr-3">
          <Mic className="w-6 h-6 text-amp-gray hover:text-amp-cyan cursor-pointer transition-colors" />
          <Paperclip className="w-6 h-6 text-amp-gray hover:text-amp-cyan cursor-pointer transition-colors" />
        </div>
        
        <div className="flex-1 pixel-border border-amp-gray bg-transparent">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full bg-transparent p-2 outline-none font-mono text-amp-gray placeholder:text-amp-dark-gray"
          />
        </div>
        
        <button 
          onClick={handleSend}
          className="pixel-button ml-3 py-2 px-3 h-[40px] w-[40px] flex items-center justify-center"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InputSection;
