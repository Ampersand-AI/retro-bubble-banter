
import React from 'react';

export type AIModel = 'openai' | 'claude' | 'gemini';

interface ModelSelectProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

const ModelSelect = ({ selectedModel, onModelChange }: ModelSelectProps) => {
  return (
    <div className="flex space-x-2">
      {['openai', 'claude', 'gemini'].map((model) => (
        <button
          key={model}
          onClick={() => onModelChange(model as AIModel)}
          className={`px-3 py-1 text-xs border rounded transition-colors ${
            selectedModel === model 
              ? 'border-amp-cyan text-amp-cyan bg-transparent' 
              : 'border-amp-gray text-amp-gray bg-transparent hover:border-amp-cyan hover:text-amp-cyan'
          }`}
        >
          {model.charAt(0).toUpperCase() + model.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ModelSelect;
