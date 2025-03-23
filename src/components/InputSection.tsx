
import React, { useState, KeyboardEvent, useRef } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';

interface InputSectionProps {
  onSendMessage: (message: string) => void;
}

const InputSection = ({ onSendMessage }: InputSectionProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleVoiceToText = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsRecording(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + ' ' + transcript);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Here you would implement file upload logic
      // For now, just add a placeholder message about the attachment
      setMessage(prev => prev + ` [Attached: ${files[0].name}]`);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amp-blue p-4 flex justify-center animate-fade-in-up">
      <div className="w-1/2 flex items-center">
        <div className="flex items-center space-x-3 mr-3">
          <Mic 
            className={`w-6 h-6 ${isRecording ? 'text-amp-cyan' : 'text-amp-gray'} hover:text-amp-cyan cursor-pointer transition-colors`}
            onClick={handleVoiceToText}
          />
          <Paperclip 
            className="w-6 h-6 text-amp-gray hover:text-amp-cyan cursor-pointer transition-colors"
            onClick={handleAttachment}
          />
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>
        
        <div className="flex-1 bg-transparent">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder=""
            className="w-full bg-transparent p-2 outline-none font-mono text-amp-gray placeholder:text-amp-dark-gray caret-amp-cyan caret-[2px]"
          />
        </div>
        
        <button 
          onClick={handleSend}
          className="ml-3 py-2 px-3 h-[40px] w-[40px] flex items-center justify-center bg-transparent"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5 text-amp-cyan" />
        </button>
      </div>
    </div>
  );
};

export default InputSection;
