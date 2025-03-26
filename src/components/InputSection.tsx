import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';
import ModelDropdown from './ModelDropdown';
import { AIModel } from '../config/apiConfig';
import AuthDialog from './AuthDialog';
import { useTypewriter } from '../hooks/useTypewriter';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const placeholderText = isAuthenticated 
    ? "Type your message..." 
    : "Sign in to start chatting...";
  
  const { text: typewriterText, showCursor } = useTypewriter(placeholderText, 50, 2000);
  
  // Auto-focus on the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Auto-resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set the height to scrollHeight to fit content
      textarea.style.height = `${Math.max(40, textarea.scrollHeight)}px`;
    }
  }, [message]);
  
  const handleSend = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setIsTyping(false); // Reset isTyping to show placeholder
      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = '40px';
      }
      // Re-focus the textarea after sending
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const handleAuthSuccess = (userProfile: {
    id: string;
    email: string;
    is_subscribed: boolean;
    subscription_tier?: 'free' | 'pro' | 'enterprise';
  }) => {
    if (onAuthSuccess) {
      onAuthSuccess({
        email: userProfile.email,
        isSubscribed: userProfile.is_subscribed,
        subscriptionTier: userProfile.subscription_tier
      });
    }
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center px-2 input-section">
        <div className="w-[850px] max-w-[850px] flex items-end">
          <div className="flex items-center space-x-3 mr-3 mb-2">
            <Mic 
              className={`w-6 h-6 ${isRecording ? 'text-blue-500' : 'text-blue-400'} hover:text-blue-600 cursor-pointer transition-colors`}
              onClick={handleVoiceToText}
            />
            <ModelDropdown 
              selectedModel={selectedModel}
              selectedSubModel={selectedSubModel}
              onSubModelChange={onSubModelChange}
            />  
          </div>
          
          <div className="flex-1 rounded-lg">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={!isTyping ? `${typewriterText}${showCursor ? '▋' : ''}` : ""}
              className="w-full bg-transparent p-2 outline-none font-mono text-green-500 placeholder:text-amp-dark-gray placeholder:text-lg placeholder:tracking-[0.2em] placeholder:font-normal caret-4 [&::placeholder]:animate-none resize-none overflow-hidden min-h-[40px] max-h-[120px]"
              rows={1}
            />
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={handleSend}
              className="ml-1 py-2 px-3 h-[40px] w-[40px] flex items-center justify-center bg-transparent"
              disabled={!message.trim()}
            >
              <Send className="w-6 h-6 text-amp-cyan" />
            </button>
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
