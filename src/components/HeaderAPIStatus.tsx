
import React, { useState } from 'react';
import { AIModel } from './ModelSelect';

interface HeaderAPIStatusProps {
  apiStatus: {[key in AIModel]: boolean};
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

const HeaderAPIStatus = ({ apiStatus, selectedModel, onModelChange }: HeaderAPIStatusProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleModelClick = (model: AIModel) => {
    if (model === selectedModel) {
      // Toggle expansion if clicking on the selected model
      setIsExpanded(!isExpanded);
    } else {
      // Select the new model and collapse
      onModelChange(model);
      setIsExpanded(false);
    }
  };

  return (
    <div className="flex items-center bg-amp-blue p-2 rounded text-amp-gray text-xs">
      {isExpanded ? (
        // Show all models when expanded
        Object.entries(apiStatus).map(([api, status]) => (
          <div 
            key={api} 
            className={`flex items-center mx-2 px-3 py-2 border border-amp-cyan rounded cursor-pointer transition-colors ${selectedModel === api ? 'bg-amp-blue/30' : ''}`}
            onClick={() => handleModelClick(api as AIModel)}
          >
            <div className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
            <span className="capitalize">{api}</span>
          </div>
        ))
      ) : (
        // Show only the selected model when collapsed
        <div 
          className="flex items-center mx-2 px-3 py-2 border border-amp-cyan rounded cursor-pointer transition-colors bg-amp-blue/30"
          onClick={() => setIsExpanded(true)}
        >
          <div className={`w-2 h-2 rounded-full ${apiStatus[selectedModel] ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
          <span className="capitalize">{selectedModel}</span>
        </div>
      )}
    </div>
  );
};

export default HeaderAPIStatus;
