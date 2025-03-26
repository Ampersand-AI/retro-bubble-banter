import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AIModel } from '../config/apiConfig';

interface ModelSelectProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  apiStatus: {[key in AIModel]: boolean};
}

const ModelSelect = ({ selectedModel, onModelChange, apiStatus }: ModelSelectProps) => {
  return (
    <Select
      value={selectedModel}
      onValueChange={(value: AIModel) => onModelChange(value)}
    >
      <SelectTrigger className="w-[120px] bg-amp-blue border-amp-gray text-amp-cyan font-pixel text-xs">
        <SelectValue>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus[selectedModel] ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="capitalize">{selectedModel}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-amp-blue border-amp-gray text-amp-cyan font-pixel">
        <SelectItem value="openai" className="text-xs hover:bg-amp-gray/20">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.openai ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>OpenAI</span>
          </div>
        </SelectItem>
        <SelectItem value="claude" className="text-xs hover:bg-amp-gray/20">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.claude ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>Claude</span>
          </div>
        </SelectItem>
        <SelectItem value="gemini" className="text-xs hover:bg-amp-gray/20">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.gemini ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>Gemini</span>
          </div>
        </SelectItem>
        <SelectItem value="deepseek" className="text-xs hover:bg-amp-gray/20">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.deepseek ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>DeepSeek</span>
          </div>
        </SelectItem>
        <SelectItem value="grok" className="text-xs hover:bg-amp-gray/20">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.grok ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>Grok</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
