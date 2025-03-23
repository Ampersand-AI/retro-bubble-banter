
import React from 'react';
import { Menu, Settings, Bot } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b-2 border-amp-gray/30 bg-amp-blue z-50 animate-fade-in-down">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        <div className="flex items-center space-x-2">
          <Menu className="w-6 h-6 text-amp-cyan" />
          <h1 className="font-pixel text-md md:text-xl text-amp-cyan tracking-wider">AMP AI</h1>
        </div>

        <nav className="hidden md:flex">
          <ul className="flex space-x-8">
            <li className="font-pixel text-xs text-amp-gray hover:text-amp-cyan transition-colors cursor-pointer">
              Chat
            </li>
            <li className="font-pixel text-xs text-amp-gray hover:text-amp-cyan transition-colors cursor-pointer">
              Commands
            </li>
            <li className="font-pixel text-xs text-amp-gray hover:text-amp-cyan transition-colors cursor-pointer">
              Settings
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <Settings className="w-6 h-6 text-amp-gray hover:text-amp-cyan cursor-pointer transition-colors" />
          <div className="pixel-border border-amp-cyan w-8 h-8 bg-amp-blue flex items-center justify-center">
            <Bot className="w-6 h-6 text-amp-cyan" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
