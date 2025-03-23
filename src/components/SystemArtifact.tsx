
import React, { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';
import { Progress } from './ui/progress';

const SystemArtifact = () => {
  const [processingLoad, setProcessingLoad] = useState(70);
  const [neuralSync, setNeuralSync] = useState(35);
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
    <div className="flex items-center space-x-4 bg-[#1a1c21] text-amp-cyan p-2 text-xs font-mono mr-4">
      <div className="flex items-center">
        <Cpu className="w-4 h-4 mr-2" />
        <span className="mr-2">ID: {id}</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span>Load:</span>
          <Progress value={processingLoad} className="h-2 bg-amp-blue w-24 green-progress" />
          <span>{processingLoad}%</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span>Neural Sync:</span>
          <Progress value={neuralSync} className="h-2 bg-amp-blue w-24 green-progress" />
          <span>{neuralSync}%</span>
        </div>
      </div>
    </div>
  );
};

export default SystemArtifact;
