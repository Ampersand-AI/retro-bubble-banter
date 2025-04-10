import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AIModel } from '../config/apiConfig';

interface ModelOption {
  value: string;
  label: string;
}

interface ModelDropdownProps {
  selectedModel: AIModel;
  selectedSubModel: string;
  onSubModelChange: (subModel: string) => void;
}

const ModelDropdown = ({ selectedModel, selectedSubModel, onSubModelChange }: ModelDropdownProps) => {
  // Model options for each AI provider
  const modelOptions: Record<AIModel, ModelOption[]> = {
    openai: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
    ],
    claude: [
      { value: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet' },
      { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
      { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' }
    ],
    gemini: [
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite' },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Flash' }
    ],
    deepseek: [
      { value: 'deepseek-chat', label: 'Deepseek Chat' },
      { value: 'deepseek-reasoner', label: 'Deepseek Reasoner' },
    ],
    grok: [
      { value: 'grok-2-1212', label: 'Grok 2' },
      { value: 'grok-2-vision-1212', label: 'Grok 1.5' },
      { value: 'grok-beta', label: 'Grok 1' }
    ]
  };

  const options = modelOptions[selectedModel] || [];

  return (
    <Select
      value={selectedSubModel}
      onValueChange={onSubModelChange}
    >
      <SelectTrigger className="w-[100px] md:w-fit bg-amp-blue border-amp-cyan text-amp-cyan text-xs h-[35px]">
        <SelectValue placeholder="Select Model" />
      </SelectTrigger>
      <SelectContent className="bg-amp-blue border-amp-cyan text-amp-cyan">
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value} 
            className="text-xs hover:bg-amp-gray/20 truncate"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelDropdown;
