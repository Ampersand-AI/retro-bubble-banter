import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';
import ModelDropdown from './ModelDropdown';
import { AIModel } from './ModelSelect';
import AuthDialog from './AuthDialog';

interface InputSectionProps {
  onSendMessage: (message: string) => void;
  selectedModel: AIModel;
  selectedSubModel: string;
  onSubModelChange: (subModel: string) => void;
  isAuthenticated?: boolean;
  onAuthSuccess?: (userProfile: {
    email: string;
    isSubscribed: boolean;
    subscriptionTier?: 'free' | 'pro' | 'enterprise';
  }) => void;
}

const InputSection = ({ 
  onSendMessage, 
  selectedModel, 
  selectedSubModel, 
  onSubModelChange,
  isAuthenticated = false,
  onAuthSuccess 
}: InputSectionProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-focus on the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSend = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

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
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      
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
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const handleAuthSuccess = (userProfile: {
    email: string;
    isSubscribed: boolean;
    subscriptionTier?: 'free' | 'pro' | 'enterprise';
  }) => {
    if (onAuthSuccess) {
      onAuthSuccess(userProfile);
    }
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <div className="w-[850px] max-w-[850px] flex items-center">
          <div className="flex items-center space-x-3 mr-3">
            <Mic 
              className={`w-6 h-6 ${isRecording ? 'text-blue-500' : 'text-blue-400'} hover:text-blue-600 cursor-pointer transition-colors`}
              onClick={handleVoiceToText}
            />
          </div>
          
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={isAuthenticated ? "Type your message..." : "Sign in to start chatting..."}
              className={`w-full bg-transparent p-2 outline-none font-mono text-green-500 placeholder:text-amp-dark-gray caret-[4px] ${!isTyping ? 'animate-blink' : ''}`}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSend}
              className="ml-1 py-2 px-3 h-[40px] w-[40px] flex items-center justify-center bg-transparent"
              disabled={!message.trim()}
            >
              <Send className="w-5 h-5 text-amp-cyan" />
            </button>
            <ModelDropdown 
              selectedModel={selectedModel}
              selectedSubModel={selectedSubModel}
              onSubModelChange={onSubModelChange}
            />
          </div>
        </div>
      </div>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default InputSection;
