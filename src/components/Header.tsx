
import React from 'react';
import { Menu } from 'lucide-react';
import { AIModel } from './ModelSelect';
import SystemArtifact from './SystemArtifact';
import HeaderAPIStatus from './HeaderAPIStatus';

interface HeaderProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  apiStatus: {[key in AIModel]: boolean};
}

const Header = ({ selectedModel, onModelChange, apiStatus }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-amp-blue z-50 animate-fade-in-down">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        <div className="flex items-center space-x-2">
          <Menu className="w-6 h-6 text-amp-cyan" />
          <h1 className="font-pixel text-md md:text-xl text-amp-cyan tracking-wider">Zack AI</h1>
        </div>

        <div className="flex items-center">
          <SystemArtifact />
          <HeaderAPIStatus 
            apiStatus={apiStatus} 
            selectedModel={selectedModel}
            onModelChange={onModelChange}
          />
          <div className="w-8 h-8 bg-amp-blue flex items-center justify-center ml-4">
            <img 
              src="/lovable-uploads/ae5d333e-5be0-4b35-bb51-331e1ca052f8.png" 
              alt="Zack AI Logo" 
              className="w-6 h-6 text-amp-blue" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
