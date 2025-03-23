
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';
import ModelSelect, { AIModel } from './ModelSelect';

interface InputSectionProps {
  onSendMessage: (message: string) => void;
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

const InputSection = ({ onSendMessage, selectedModel, onModelChange }: InputSectionProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-focus on the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      // Re-focus the input after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
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
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      
      // Improve speed by setting continuous to false and interimResults to true
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setIsRecording(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + ' ' + transcript);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        // Re-focus the input after voice recording
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        // Re-focus the input after error
        if (inputRef.current) {
          inputRef.current.focus();
        }
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
      
      // Re-focus the input after attachment
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center">
      <div className="w-[500px] max-w-[500px] flex items-center">
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
        
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsTyping(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder=""
            className={`w-full bg-transparent p-2 outline-none font-mono text-amp-gray placeholder:text-amp-dark-gray caret-amp-cyan caret-[4px] ${!isTyping ? 'animate-blink' : ''}`}
          />
        </div>
        
        <div className="flex items-center">
          <ModelSelect selectedModel={selectedModel} onModelChange={onModelChange} />
          <button 
            onClick={handleSend}
            className="ml-3 py-2 px-3 h-[40px] w-[40px] flex items-center justify-center bg-transparent"
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5 text-amp-cyan" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
