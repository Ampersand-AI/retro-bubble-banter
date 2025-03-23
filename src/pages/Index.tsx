
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ChatArea from '../components/ChatArea';
import InputSection from '../components/InputSection';
import { toast } from "../components/ui/use-toast";
import CRTEffect from '../components/CRTEffect';
import APIStatus from '../components/APIStatus';
import { AIModel, DEFAULT_SUBMODELS } from '../config/apiConfig';
import { testOpenAIApi, testClaudeApi, testGeminiApi } from '../services/apiStatusService';
import { useMessages } from '../hooks/useMessages';

const Index = () => {
  // State for models and API status
  const [selectedModel, setSelectedModel] = useState<AIModel>('openai');
  const [selectedSubModel, setSelectedSubModel] = useState<string>(DEFAULT_SUBMODELS.openai);
  const [apiStatus, setApiStatus] = useState<{[key in AIModel]: boolean}>({
    openai: false,
    claude: false,
    gemini: false
  });
  const [showApiStatus, setShowApiStatus] = useState(false);

  // Use our custom hook for messages
  const { 
    messages, 
    isTyping, 
    messageIdCounter, 
    setMessageIdCounter, 
    addModelSwitchMessage, 
    handleSendMessage 
  } = useMessages();

  // Update submodel when the main model changes
  useEffect(() => {
    setSelectedSubModel(DEFAULT_SUBMODELS[selectedModel]);
  }, [selectedModel]);

  // Check API status on load
  useEffect(() => {
    const validateApis = async () => {
      try {
        // Test APIs in parallel for better performance
        const [openaiStatus, claudeStatus, geminiStatus] = await Promise.all([
          testOpenAIApi(),
          testClaudeApi(),
          testGeminiApi()
        ]);
        
        setApiStatus({
          openai: openaiStatus,
          claude: claudeStatus,
          gemini: geminiStatus
        });
      } catch (error) {
        console.error("Error validating APIs:", error);
      }
    };
    
    validateApis();
  }, []);

  const handleModelChange = (model: AIModel) => {
    setSelectedModel(model);
    setSelectedSubModel(DEFAULT_SUBMODELS[model]);
    const newCounter = addModelSwitchMessage(model, messageIdCounter);
    setMessageIdCounter(newCounter);
  };

  const handleSubModelChange = (subModel: string) => {
    setSelectedSubModel(subModel);
    // Optionally notify the user about the submodel change
    toast({
      title: `Model Updated`,
      description: `Now using ${subModel}`,
      duration: 2000
    });
  };

  const handleSendUserMessage = (message: string) => {
    handleSendMessage(message, selectedModel, selectedSubModel, messageIdCounter);
  };

  // Sound effects for UI interactions (subtle blips and bloops)
  useEffect(() => {
    const handleClick = () => {
      // This would play a sound effect in a full implementation
      console.log("Click sound effect would play here");
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <CRTEffect>
      <div className="min-h-screen bg-amp-blue overflow-hidden">
        <Header 
          selectedModel={selectedModel} 
          onModelChange={handleModelChange}
          apiStatus={apiStatus}
          messages={messages}
        />
        {showApiStatus && <APIStatus apiStatus={apiStatus} />}
        <ChatArea messages={messages} isTyping={isTyping} />
        <InputSection 
          onSendMessage={handleSendUserMessage} 
          selectedModel={selectedModel}
          selectedSubModel={selectedSubModel}
          onSubModelChange={handleSubModelChange}
        />
      </div>
    </CRTEffect>
  );
};

export default Index;
