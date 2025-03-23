
import React from 'react';
import { Menu, Bot } from 'lucide-react';
import ModelSelect, { AIModel } from './ModelSelect';
import SystemArtifact from './SystemArtifact';

interface HeaderProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

const Header = ({ selectedModel, onModelChange }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b-2 border-amp-gray/30 bg-amp-blue z-50 animate-fade-in-down">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        <div className="flex items-center space-x-2">
          <Menu className="w-6 h-6 text-amp-cyan" />
          <h1 className="font-pixel text-md md:text-xl text-amp-cyan tracking-wider">AMP AI</h1>
        </div>

        <div className="flex items-center">
          <SystemArtifact />
          <ModelSelect selectedModel={selectedModel} onModelChange={onModelChange} />
          <div className="pixel-border border-amp-cyan w-8 h-8 bg-amp-blue flex items-center justify-center ml-4">
            <Bot className="w-6 h-6 text-amp-cyan" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
