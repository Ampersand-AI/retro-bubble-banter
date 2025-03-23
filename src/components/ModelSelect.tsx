
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type AIModel = 'openai' | 'claude' | 'gemini';

interface ModelSelectProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

const ModelSelect = ({ selectedModel, onModelChange }: ModelSelectProps) => {
  return (
    <Select
      value={selectedModel}
      onValueChange={(value: AIModel) => onModelChange(value)}
    >
      <SelectTrigger className="w-[140px] bg-amp-blue border-amp-gray text-amp-cyan font-pixel text-xs">
        <SelectValue placeholder="Select Model" />
      </SelectTrigger>
      <SelectContent className="bg-amp-blue border-amp-gray text-amp-cyan font-pixel">
        <SelectItem value="openai" className="text-xs hover:bg-amp-gray/20">OpenAI</SelectItem>
        <SelectItem value="claude" className="text-xs hover:bg-amp-gray/20">Claude</SelectItem>
        <SelectItem value="gemini" className="text-xs hover:bg-amp-gray/20">Gemini</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
