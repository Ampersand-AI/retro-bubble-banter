import React, { useState, useEffect } from 'react';

const models = [
  ['GPT-4o', 'GPT-4o Mini', 'GPT-3.5 Turbo'],
  ['Claude 3 Opus', 'Claude 3 Sonnet', 'Claude 3 Haiku'],
  ['Gemini 2.0 Flash', 'Gemini 2.0 Flash Lite', 'Gemini 1.5 Flash'],
  ['Deepseek Chat', 'Deepseek Reasoner', 'Grok 2'],
  ['Grok 1.5', 'Grok 1', 'and more...']
];

const ModelDisplay = () => {
  const [currentBatch, setCurrentBatch] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentModels = models[currentBatch];
    const currentModel = currentModels[currentModelIndex];
    
    if (!isDeleting) {
      if (displayText.length < currentModel.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentModel.substring(0, displayText.length + 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        if (currentModelIndex < currentModels.length - 1) {
          setCurrentModelIndex(currentModelIndex + 1);
        } else {
          setCurrentModelIndex(0);
          setCurrentBatch((currentBatch + 1) % models.length);
        }
      }
    }
  }, [displayText, currentBatch, currentModelIndex, isDeleting]);

  return (
    <div className="space-y-1">
      <p className="text-amp-gray">Access state-of-the-art AI models including</p>
      <p className="text-amp-gray">
        {displayText}
        <span className="animate-pulse">▋</span>
      </p>
    </div>
  );
};

export default ModelDisplay; 