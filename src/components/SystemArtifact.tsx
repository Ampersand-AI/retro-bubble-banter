
import React, { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';
import { Progress } from './ui/progress';

const SystemArtifact = () => {
  const [processingLoad, setProcessingLoad] = useState(70);
  const [neuralSync, setNeuralSync] = useState(35);
  const [branch] = useState("hb01e5");
  const [id] = useState("7ueza1tgs");
  
  // Animate the processing load between 65-95%
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingLoad(Math.floor(Math.random() * 30) + 65);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Animate the neural sync between 20-45%
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralSync(Math.floor(Math.random() * 25) + 20);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center space-x-4 pixel-border border-amp-cyan bg-[#1a1c21] text-amp-cyan p-2 text-xs font-mono mr-4">
      <div className="flex items-center">
        <Cpu className="w-4 h-4 mr-2" />
        <span className="mr-2">ID: {id}</span>
      </div>
      
      <div className="flex-1 min-w-[100px]">
        <div className="flex justify-between mb-1">
          <span>Load:</span>
          <span>{processingLoad}%</span>
        </div>
        <Progress 
          value={processingLoad} 
          className="h-2 bg-amp-gray/30"
        />
      </div>
      
      <div className="flex-1 min-w-[100px]">
        <div className="flex justify-between mb-1">
          <span>Neural Sync:</span>
          <span>{neuralSync}%</span>
        </div>
        <Progress 
          value={neuralSync} 
          className="h-2 bg-amp-gray/30"
        />
      </div>
      
      <div className="text-amp-gray/70">
        <span className="mr-1">⌥</span>
        <span>{branch}</span>
      </div>
    </div>
  );
};

export default SystemArtifact;
