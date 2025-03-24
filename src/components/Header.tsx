import React from 'react';
import { Menu, BarChart3 } from 'lucide-react';
import { AIModel } from './ModelSelect';
import SystemArtifact from './SystemArtifact';
import HeaderAPIStatus from './HeaderAPIStatus';
import ModelSelect from './ModelSelect';

interface HeaderProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  apiStatus: {[key in AIModel]: boolean};
  messages: Array<{
    id: number;
    text: string;
    isAi: boolean;
    tokenCount?: {
      input: number;
      output: number;
    };
  }>;
  onTokenStatsClick: () => void;
}

const Header = ({ selectedModel, onModelChange, apiStatus, messages, onTokenStatsClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-amp-blue z-50 animate-fade-in-down">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        <div className="flex items-center space-x-2">
          <Menu className="w-6 h-6 text-amp-cyan" />
          <h1 className="font-pixel text-md md:text-xl text-amp-cyan tracking-wider">Zack AI</h1>
        </div>

        <div className="flex items-center space-x-4">
          <SystemArtifact />
          <HeaderAPIStatus 
            apiStatus={apiStatus} 
            selectedModel={selectedModel}
            onModelChange={onModelChange}
          />
          <ModelSelect
            selectedModel={selectedModel}
            onModelChange={onModelChange}
            apiStatus={apiStatus}
          />
          <button
            onClick={onTokenStatsClick}
            className="flex items-center space-x-2 text-amp-cyan hover:text-amp-gray transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm">Token Stats</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
