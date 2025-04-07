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
    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-w-[1440px] mx-auto">
      {tools.slice(0, 3).map((tool) => (
        <Card 
          key={tool.id}
          className="px-4 py-12 hover:bg-amp-dark-blue/50 h-full border-amp-cyan/20 border transition-colors cursor-pointer bg-transparent"
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
      <div className="md:col-span-2 lg:col-span-3 flex flex-col md:flex-row md:justify-center md:gap-4">
        <div className="md:w-1/2 lg:w-1/3">
          <Card 
            key={tools[3].id}
            className="px-4 py-12 hover:bg-amp-dark-blue/50 h-full border-amp-cyan/20 border transition-colors cursor-pointer bg-transparent"
            onClick={() => onToolSelect(tools[3])}
          >
            <div className="flex flex-col items-center space-y-4">
              <img 
                src={tools[3].logo} 
                alt={`${tools[3].name} logo`} 
                className="w-16 h-16 rounded-md object-contain"
              />
              <div>
                <h3 className="font-pixel text-amp-cyan text-center">{tools[3].name}</h3>
                <p className="text-sm text-amp-gray text-center text-balance">{tools[3].description}</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="md:w-1/2 lg:w-1/3">
          <Card 
            key={tools[4].id}
            className="px-4 py-12 hover:bg-amp-dark-blue/50 border-amp-cyan/20 border transition-colors cursor-pointer bg-transparent"
            onClick={() => onToolSelect(tools[4])}
          >
            <div className="flex flex-col items-center space-y-4">
              <img 
                src={tools[4].logo} 
                alt={`${tools[4].name} logo`} 
                className="w-16 h-16 rounded-md object-contain"
              />
              <div>
                <h3 className="font-pixel text-amp-cyan text-center">{tools[4].name}</h3>
                <p className="text-sm text-amp-gray text-center text-balance">{tools[4].description}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ToolSelect;