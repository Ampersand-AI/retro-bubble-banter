import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CRTEffect from '../components/CRTEffect';
import { Bot, MessageSquare, Zap, CreditCard, Terminal } from 'lucide-react';

const TypewriterText = ({ text, delay = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return <span className="font-mono">{displayText}</span>;
};

const GlitchText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span className="absolute top-0 left-0.5 w-full h-full text-red-500 opacity-50 animate-glitch-1 z-0">{children}</span>
      <span className="absolute top-0 -left-0.5 w-full h-full text-blue-500 opacity-50 animate-glitch-2 z-0">{children}</span>
    </span>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTerminal(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-amp-cyan font-mono relative overflow-hidden">
      <CRTEffect />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4a5568_1px,transparent_1px),linear-gradient(to_bottom,#4a5568_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-24">
          {/* Left Side - Text Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              {showTerminal && (
                <div className="bg-amp-blue/30 p-4 rounded-lg border border-amp-cyan/20 mb-4 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-4 h-4 text-amp-cyan" />
                    <span className="text-amp-gray">rovyk@terminal:~$</span>
                  </div>
                  <TypewriterText text="Welcome to The AI Powerhouse" />
                </div>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-pixel">
              <GlitchText>Rovyk Beta.1</GlitchText>
            </h1>
            
            <p className="text-xl text-amp-gray">
              Which Premium AI model would you like to explore?
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-amp-cyan">
                <Bot className="w-5 h-5" />
                <span>OpenAI</span>
              </div>
              <div className="flex items-center gap-2 text-amp-cyan">
                <Bot className="w-5 h-5" />
                <span>Claude</span>
              </div>
              <div className="flex items-center gap-2 text-amp-cyan">
                <Bot className="w-5 h-5" />
                <span>Gemini</span>
              </div>
              <div className="flex items-center gap-2 text-amp-cyan">
                <Bot className="w-5 h-5" />
                <span>DeepSeek</span>
              </div>
              <div className="flex items-center gap-2 text-amp-cyan">
                <Bot className="w-5 h-5" />
                <span>Grok</span>
              </div>
            </div>
            
            <div className="bg-amp-blue/30 p-4 rounded-lg border border-amp-cyan/20 inline-block">
              <TypewriterText text="Unlock 5,000 Tokens for FREE" />
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div className="relative">
            <img 
              src="/images/rovyk-loading.png" 
              alt="Rovyk AI" 
              className="w-full max-w-md mx-auto animate-pulse"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amp-blue/30 p-6 rounded-lg border border-amp-cyan/20 hover:border-amp-cyan/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <Bot className="w-6 h-6 text-amp-cyan" />
                  <h3 className="text-xl font-pixel">Multiple AI Models</h3>
                </div>
                <p className="text-amp-gray">Choose from OpenAI, Claude, Gemini, DeepSeek, and Grok</p>
              </div>
              
              <div className="bg-amp-blue/30 p-6 rounded-lg border border-amp-cyan/20 hover:border-amp-cyan/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-amp-cyan" />
                  <h3 className="text-xl font-pixel">Retro Aesthetics</h3>
                </div>
                <p className="text-amp-gray">Enjoy a unique CRT-style interface with modern functionality</p>
              </div>
              
              <div className="bg-amp-blue/30 p-6 rounded-lg border border-amp-cyan/20 hover:border-amp-cyan/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-amp-cyan" />
                  <h3 className="text-xl font-pixel">Token Tracking</h3>
                </div>
                <p className="text-amp-gray">Monitor your token usage and manage your AI interactions</p>
              </div>
              
              <div className="bg-amp-blue/30 p-6 rounded-lg border border-amp-cyan/20 hover:border-amp-cyan/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-amp-cyan" />
                  <h3 className="text-xl font-pixel">Subscription Tiers</h3>
                </div>
                <p className="text-amp-gray">Choose the plan that best fits your needs</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/chat')}
              className="bg-amp-blue text-amp-cyan px-8 py-4 rounded-lg font-pixel text-lg hover:bg-amp-blue/80 transition-colors border border-amp-cyan/20 hover:border-amp-cyan/40"
            >
              Start Chatting
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 text-center py-4 text-amp-gray text-sm">
        <p>© 2024 Retro Bubble Banter. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing; 