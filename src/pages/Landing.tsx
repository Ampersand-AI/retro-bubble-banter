import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CRTEffect from '../components/CRTEffect';
import LandingHeader from '../components/LandingHeader';
import { Bot, MessageSquare, Zap, CreditCard, Terminal, Sparkles, Shield, Brain, Cpu, Star } from 'lucide-react';
import DisclaimerDialog from '../components/DisclaimerDialog';

const TypewriterText = ({ text, delay = 100, className = "" }) => {
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

  return <span className={`font-mono ${className}`}>{displayText}</span>;
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

  const handleNavigateToChat = () => {
    localStorage.setItem('chatMode', 'chat');
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-black text-amp-cyan font-mono relative overflow-hidden">
      <LandingHeader />
      
      {/* Hero Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between mb-24">
          {/* Left Side - Text Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="bg-amp-blue/30 p-4 w-fit rounded-lg border border-amp-cyan/20 mb-4 font-mono text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-4 h-4 text-amp-cyan" />
                  <span className="text-amp-gray">rovyk@terminal:~$</span>
                </div>
                <TypewriterText text="Welcome to The AI Powerhouse" />
              </div>
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
              className="max-w-xs lg:max-w-md mx-auto object-contain animate-pulse"
            />
          </div>
        </div>

        {/* New Feature Announcement */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-amp-blue/30 p-6 rounded-lg border border-amp-cyan/20 hover:border-amp-cyan/40 transition-all animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-amp-cyan/20 p-3 rounded-lg">
                <Sparkles className="w-6 h-6 text-amp-cyan" />
              </div>
              <div>
                <h3 className="text-xl font-pixel text-amp-cyan">New Feature: AI Prompt Generator</h3>
                <p className="text-amp-gray text-sm">Generate optimized prompts for your favorite AI tools</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-amp-cyan font-pixel mb-2">Supported Tools</h4>
                <ul className="space-y-2 text-amp-gray text-sm">
                  <li className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amp-cyan" />
                    <TypewriterText text="V0 - UI Design" />
                  </li>
                  <li className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amp-cyan" />
                    <TypewriterText text="Cursor - Code Generation" />
                  </li>
                  <li className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amp-cyan" />
                    <TypewriterText text="Bolt - App Development" />
                  </li>
                  <li className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amp-cyan" />
                    <TypewriterText text="Tempo - Component Building" />
                  </li>
                  <li className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amp-cyan" />
                    <TypewriterText text="Lovable - Design System" />
                  </li>
                </ul>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-amp-cyan font-pixel mb-2">Key Benefits</h4>
                <ul className="space-y-2 text-amp-gray text-sm">
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amp-cyan" />
                    <span>Optimized prompts for each tool</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amp-cyan" />
                    <span>Token-efficient generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amp-cyan" />
                    <span>Markdown-formatted output</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amp-cyan" />
                    <span>One-click copy functionality</span>
                  </li>
                </ul>
              </div>
            </div>
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
            
            <div className="flex justify-center">
              <button
                onClick={handleNavigateToChat}
                className="bg-amp-blue text-amp-cyan px-8 py-4 rounded-lg font-pixel text-lg hover:bg-amp-blue/80 transition-colors border border-amp-cyan/20 hover:border-amp-cyan/40"
              >
                Open Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative z-10 w-full max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-pixel mb-4">
            <GlitchText>Powerful Features</GlitchText>
          </h2>
          <p className="text-amp-gray max-w-2xl mx-auto">
            Experience the future of AI interaction with our cutting-edge features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-amp-blue/30 p-6 rounded-lg border border-amp-cyan/20 hover:border-amp-cyan/40 transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-amp-cyan" />
              <h3 className="text-xl font-pixel">Advanced AI Models</h3>
            </div>
            <p className="text-amp-gray">Access state-of-the-art AI models including GPT-4, Claude, Gemini, and more</p>
          </div>

          <div className="bg-amp-blue/30 p-6 rounded-lg border border-amp-cyan/20 hover:border-amp-cyan/40 transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-amp-cyan" />
              <h3 className="text-xl font-pixel">Secure & Private</h3>
            </div>
            <p className="text-amp-gray">Enterprise-grade security with end-to-end comprehensive encryption and data privacy protection</p>
          </div>

          <div className="bg-amp-blue/30 p-6 rounded-lg border border-amp-cyan/20 hover:border-amp-cyan/40 transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-6 h-6 text-amp-cyan" />
              <h3 className="text-xl font-pixel">Smart Token System</h3>
            </div>
            <p className="text-amp-gray">Efficient token management with real-time usage tracking and optimization</p>
          </div>

          <div className="bg-amp-blue/30 p-6 rounded-lg border border-amp-cyan/20 hover:border-amp-cyan/40 transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-amp-cyan" />
              <h3 className="text-xl font-pixel">Premium Experience</h3>
            </div>
            <p className="text-amp-gray">Enjoy a seamless, premium experience with our retro-futuristic interface</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 w-full max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-pixel mb-4">
            <GlitchText>Choose Your Plan</GlitchText>
          </h2>
          <p className="text-amp-gray max-w-2xl mx-auto">
            Select the perfect plan for your AI needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-amp-blue/30 p-8 rounded-lg border border-amp-cyan/20 hover:border-amp-cyan/40 transition-all flex flex-col">
            <div className="flex-grow">
              <h3 className="text-2xl font-pixel mb-4">Free</h3>
              <div className="text-3xl font-pixel mb-6">$0</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amp-cyan" />
                  <span>5,000 tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-amp-cyan" />
                  <span>Basic AI models</span>
                </li>
              </ul>
            </div>
            <button
              onClick={handleNavigateToChat}
              className="w-full bg-amp-blue text-amp-cyan px-6 py-3 rounded-lg font-pixel hover:bg-amp-blue/80 transition-colors border border-amp-cyan/20 hover:border-amp-cyan/40"
            >
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-amp-blue/30 p-8 rounded-lg border border-amp-cyan/20 hover:border-amp-cyan/40 transition-all flex flex-col">
            <div className="flex-grow">
              <h3 className="text-2xl font-pixel mb-4">Rovyk Plus</h3>
              <div className="text-3xl font-pixel mb-6">$8.99</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amp-cyan" />
                  <span>200,000 tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-amp-cyan" />
                  <span>Access to all premiumAI models</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amp-cyan" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
            <button
              onClick={handleNavigateToChat}
              className="w-full bg-amp-blue text-amp-cyan px-6 py-3 rounded-lg font-pixel hover:bg-amp-blue/80 transition-colors border border-amp-cyan/20 hover:border-amp-cyan/40"
            >
              Upgrade to Plus
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-amp-blue/30 p-8 rounded-lg border-2 border-amp-cyan/40 hover:border-amp-cyan/60 transition-all transform hover:scale-105 flex flex-col">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-amp-cyan text-black px-4 py-1 rounded-full text-sm font-pixel">Best Value</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-pixel mb-4">Rovyk Ultra</h3>
              <div className="text-3xl font-pixel mb-6">$14.99</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amp-cyan" />
                  <span>500,000 tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-amp-cyan" />
                  <span>Access to all premiumAI models</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amp-cyan" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amp-cyan" />
                  <span>Early access to new features</span>
                </li>
              </ul>
            </div>
            <button
              onClick={handleNavigateToChat}
              className="w-full bg-amp-cyan text-black px-6 py-3 rounded-lg font-pixel hover:bg-amp-cyan/90 transition-colors"
            >
              Upgrade to Ultra
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 w-full max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-pixel mb-4">
            <GlitchText>About Rovyk</GlitchText>
          </h2>
          <p className="text-amp-gray max-w-2xl mx-auto">
            Your trusted AI companion for seamless conversations and powerful interactions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-amp-gray">
              Rovyk is more than just another AI chat platform. We combine cutting-edge AI technology with a unique retro-futuristic aesthetic to create an experience that's both powerful and engaging.
            </p>
            <p className="text-amp-gray">
              Our platform supports multiple AI models, allowing you to choose the perfect AI for your needs. Whether you're looking for creative writing assistance, technical analysis, or casual conversation, Rovyk has you covered.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={handleNavigateToChat}
                className="text-amp-gray border-amp-cyan border-2 px-4 py-2 rounded-lg font-pixel bg-amp-blue hover:text-amp-cyan transition-colors flex items-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span>cd chat</span>
              </button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/images/rovyk-comic.jpg" 
              alt="Rovyk AI" 
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-amp-gray text-xs">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-4">
            <p className="hover:underline">© 2025 Rovyk - AI Powerhouse by Neural Paths</p>
            <span className="text-amp-cyan/50">|</span>
            <DisclaimerDialog />
          </div>
          <a 
            href="https://www.producthunt.com/products/rovyk/reviews?utm_source=badge-product_review&utm_medium=badge&utm_souce=badge-rovyk" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1049814&theme=light" 
              alt="Rovyk - Platform to experience the latest model & Prompt Generator | Product Hunt"
              className="h-8"
            />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 