import { UserCog } from 'lucide-react';
import { AIModel } from '../config/apiConfig';
import SystemArtifact from './SystemArtifact';
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
          <img src="/images/rovyk.png" alt="Rovyk" className="w-10 h-10" />
          <h1 className="font-pixel text-md md:text-xl text-amp-cyan tracking-wider">Rovyk</h1>
        </div>
        <div className="flex items-center space-x-4">
          <SystemArtifact />
          <ModelSelect
            selectedModel={selectedModel}
            onModelChange={onModelChange}
            apiStatus={apiStatus}
          />
           <button
            onClick={onTokenStatsClick}
            className="flex items-center space-x-2 text-amp-cyan hover:text-amp-gray transition-colors"
          >
            <UserCog className="w-5 h-5" />
            <span className="text-sm">Account</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
