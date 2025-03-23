
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { AIModel } from './ModelSelect';
import SystemArtifact from './SystemArtifact';
import HeaderAPIStatus from './HeaderAPIStatus';
import TokenStatsDialog from './TokenStatsDialog';

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
}

const Header = ({ selectedModel, onModelChange, apiStatus, messages }: HeaderProps) => {
  const [showTokenStats, setShowTokenStats] = useState(false);
  
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
          <button 
            className="w-8 h-8 bg-amp-blue flex items-center justify-center ml-4"
            onClick={() => setShowTokenStats(true)}
          >
            <img 
              src="/lovable-uploads/d8aff0f2-6bde-4839-8047-d0aa14601210.png" 
              alt="Zack AI Logo" 
              className="w-6 h-6 filter brightness-100 saturate-150 hue-rotate-[290deg]"
            />
          </button>
        </div>
      </div>
      
      <TokenStatsDialog 
        open={showTokenStats} 
        onOpenChange={setShowTokenStats} 
        messages={messages} 
      />
    </header>
  );
};

export default Header;
