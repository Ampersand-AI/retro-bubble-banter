
import React from 'react';
import { AIModel } from './ModelSelect';

interface HeaderAPIStatusProps {
  apiStatus: {[key in AIModel]: boolean};
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

const HeaderAPIStatus = ({ apiStatus, selectedModel, onModelChange }: HeaderAPIStatusProps) => {
  return (
    <div className="flex items-center bg-amp-blue p-2 rounded text-amp-gray text-xs">
      {Object.entries(apiStatus).map(([api, status]) => (
        <div 
          key={api} 
          className={`flex items-center mx-2 px-3 py-2 border border-amp-cyan rounded cursor-pointer transition-colors ${selectedModel === api ? 'bg-amp-blue/30' : ''}`}
          onClick={() => onModelChange(api as AIModel)}
        >
          <div className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
          <span className="capitalize">{api}</span>
        </div>
      ))}
    </div>
  );
};

export default HeaderAPIStatus;
