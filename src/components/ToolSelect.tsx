import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sparkles } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  logo: string;
}

const tools: Tool[] = [
  {
    id: 'v0',
    name: 'V0',
    description: 'AI-powered development tool for creating beautiful interfaces',
    logo: '/images/v0-logo.png'
  },
  {
    id: 'cursor',
    name: 'Cursor AI',
    description: 'AI-powered code editor for faster development',
    logo: '/images/cursor-logo.jpg'
  },
  {
    id: 'bolt',
    name: 'Bolt',
    description: 'AI-powered development platform for building full-stack apps',
    logo: '/images/bolt-logo.png'
  },
  {
    id: 'tempo',
    name: 'Tempo',
    description: 'AI-powered platform for building React Applications faster',
    logo: '/images/tempo-logo.jpg'
  },
  {
    id: 'lovable',
    name: 'Lovable',
    description: 'AI-powered development tool for creating lovable user experiences',
    logo: '/images/lovable-logo.jpg'
  }
];

interface ToolSelectProps {
  onToolSelect: (tool: Tool) => void;
}

const ToolSelect = ({ onToolSelect }: ToolSelectProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 justify-center">
      {tools.map((tool) => (
        <Card 
          key={tool.id}
          className="px-4 py-12 hover:bg-amp-dark-blue/50 transition-colors cursor-pointer bg-transparent"
          onClick={() => onToolSelect(tool)}
        >
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={tool.logo} 
              alt={`${tool.name} logo`} 
              className="w-16 h-16 rounded-md object-contain"
            />
            <div>
              <h3 className="font-pixel text-amp-cyan text-center">{tool.name}</h3>
              <p className="text-sm text-amp-gray text-center text-balance">{tool.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ToolSelect; 