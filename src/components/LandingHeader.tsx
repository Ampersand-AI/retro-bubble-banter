import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Terminal } from 'lucide-react';

const LandingHeader = () => {
  const navigate = useNavigate();

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToChat = () => {
    localStorage.setItem('chatMode', 'chat');
    navigate('/chat');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-amp-cyan/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <img src="/images/rovyk.png" alt="Rovyk" className="w-8 h-8 md:w-10 md:h-10" />
            <h1 className="font-pixel text-sm md:text-xl text-amp-cyan tracking-wider">Rovyk<sup className="text-[10px] ml-1 text-yellow-400">Beta</sup></h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              onClick={(e) => handleSectionClick(e, 'features')}
              className="text-amp-gray hover:text-amp-cyan transition-colors"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleSectionClick(e, 'pricing')}
              className="text-amp-gray hover:text-amp-cyan transition-colors"
            >
              Pricing
            </a>
            <a 
              href="#about" 
              onClick={(e) => handleSectionClick(e, 'about')}
              className="text-amp-gray hover:text-amp-cyan transition-colors"
            >
              About
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleNavigateToChat}
              className="hidden border border-amp-cyan py-2 px-4 rounded-lg md:flex items-center space-x-2 text-amp-gray hover:text-amp-cyan transition-colors"
            >
              <Terminal className="w-4 h-4" />
              <span>cd chat</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader; 