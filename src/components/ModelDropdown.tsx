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
      { value: 'claude-3-opus', label: 'Claude 3 Opus' },
      { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
      { value: 'claude-3-haiku', label: 'Claude 3 Haiku' }
    ],
    gemini: [
      { value: 'gemini-2.0-pro', label: 'Gemini 2.0 Flash' },
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash Lite' },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Flash' }
    ],
    deepseek: [
      { value: 'Deepseek-V3', label: 'Deepseek V3' },
      { value: 'Deepseek-R1', label: 'Deepseek R1' },
      { value: 'Deepseek-R1-Zero', label: 'Deepseek R1 Zero' }
    ],
    grok: [
      { value: 'grok-2', label: 'Grok 2' },
      { value: 'grok-1.5', label: 'Grok 1.5' },
      { value: 'grok-1', label: 'Grok 1' }
    ]
  };

  const options = modelOptions[selectedModel] || [];

  return (
    <Select
      value={selectedSubModel}
      onValueChange={onSubModelChange}
    >
      <SelectTrigger className="w-[140px] bg-amp-blue border-amp-cyan text-amp-cyan text-xs h-[35px]">
        <SelectValue placeholder="Select Model" />
      </SelectTrigger>
      <SelectContent className="bg-amp-blue border-amp-cyan text-amp-cyan">
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value} 
            className="text-xs hover:bg-amp-gray/20"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelDropdown;
