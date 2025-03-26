import { useState, useCallback } from 'react';
import { Message, AIModel } from '../config/apiConfig';
import { estimateTokens, checkModelIdentityQuestion, getIdentityResponse } from '../utils/tokenUtils';
import { 
  fetchOpenAIResponse, 
  fetchClaudeResponse, 
  fetchGeminiResponse,
  fetchDeepSeekResponse,
  fetchGrokResponse 
} from '../services/apiService';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi, I'm Rovyk by Ampersand! You can experience various premium AI models at a fraction of the cost.",
      isAi: true,
      tokenCount: {
        input: 0,
        output: 0  // Set to 0 to not count the greeting message
      }
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(2);

  const addMessage = useCallback((message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  }, []);

  const addModelSwitchMessage = useCallback((model: AIModel, counter: number) => {
    const switchMessage = {
      id: counter,
      text: `Switched to ${model.charAt(0).toUpperCase() + model.slice(1)} model.`,
      isAi: true,
      tokenCount: {
        input: 0,
        output: 0  // Set to 0 to not count the model switch message
      }
    };
    
    addMessage(switchMessage);
    return counter + 1;
  }, [addMessage]);

  const handleSendMessage = useCallback(async (
    message: string, 
    selectedModel: AIModel, 
    selectedSubModel: string, 
    currentCounter: number
  ) => {
    // Add user message
    const userMessageId = currentCounter;
    const userTokenCount = estimateTokens(message);
    
    addMessage({
      id: userMessageId,
      text: message,
      isAi: false,
      tokenCount: {
        input: userTokenCount,
        output: 0  // User messages always have 0 output tokens
      }
    });
    
    setMessageIdCounter(userMessageId + 1);
    
    // Start typing animation
    setIsTyping(true);
    
    try {
      // Check if this is an identity question and override with standard response
      if (checkModelIdentityQuestion(message)) {
        const identityResponse = getIdentityResponse();
        
        setTimeout(() => {
          addMessage({
            id: userMessageId + 1,
            text: identityResponse,
            isAi: true,
            tokenCount: {
              input: 0,  // AI messages always have 0 input tokens
              output: estimateTokens(identityResponse)
            }
          });
          
          setMessageIdCounter(userMessageId + 2);
          setIsTyping(false);
        }, 1000); // Short delay to simulate thinking
        
        return;
      }
      
      let response;
      
      switch (selectedModel) {
        case 'openai':
          response = await fetchOpenAIResponse(message, selectedSubModel);
          break;
        case 'claude':
          response = await fetchClaudeResponse(message, selectedSubModel);
          break;
        case 'gemini':
          response = await fetchGeminiResponse(message, selectedSubModel);
          break;
        case 'deepseek':
          response = await fetchDeepSeekResponse(message, selectedSubModel);
          break;
        case 'grok':
          response = await fetchGrokResponse(message, selectedSubModel);
          break;
        default:
          // This shouldn't happen with TypeScript's type checking
          throw new Error('Invalid model selected');
      }
      
      addMessage({
        id: userMessageId + 1,
        text: response.text,
        isAi: true,
        tokenCount: {
          input: 0,  // AI messages always have 0 input tokens
          output: response.tokenCount.output
        }
      });
      
      setMessageIdCounter(userMessageId + 2);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      
      addMessage({
        id: userMessageId + 1,
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        isAi: true,
        tokenCount: {
          input: 0,  // AI messages always have 0 input tokens
          output: estimateTokens("Sorry, I encountered an error while processing your request. Please try again.")
        }
      });
      
      setMessageIdCounter(userMessageId + 2);
    } finally {
      setIsTyping(false);
    }
  }, [addMessage]);

  return {
    messages,
    isTyping,
    messageIdCounter,
    setMessageIdCounter,
    addMessage,
    addModelSwitchMessage,
    handleSendMessage
  };
};
