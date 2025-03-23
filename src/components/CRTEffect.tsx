
import React, { useState, useEffect } from 'react';
import { Switch } from './ui/switch';

interface CRTEffectProps {
  children: React.ReactNode;
}

const CRTEffect = ({ children }: CRTEffectProps) => {
  const [isCRTEnabled, setIsCRTEnabled] = useState(false);
  
  // Load preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('crtEffect');
    if (savedPreference) {
      setIsCRTEnabled(savedPreference === 'true');
    }
  }, []);
  
  // Save preference to localStorage
  const toggleCRTEffect = () => {
    const newValue = !isCRTEnabled;
    setIsCRTEnabled(newValue);
    localStorage.setItem('crtEffect', String(newValue));
  };
  
  return (
    <div className={`min-h-screen ${isCRTEnabled ? 'crt-effect' : ''}`}>
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-amp-blue p-2 rounded">
        <span className="text-amp-gray text-xs">CRT Effect:</span>
        <Switch 
          checked={isCRTEnabled}
          onCheckedChange={toggleCRTEffect}
        />
      </div>
      {children}
    </div>
  );
};

export default CRTEffect;
