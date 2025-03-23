
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ChatArea from '../components/ChatArea';
import InputSection from '../components/InputSection';
import { AIModel } from '../components/ModelSelect';
import { toast } from "../components/ui/use-toast";
import CRTEffect from '../components/CRTEffect';
import APIStatus from '../components/APIStatus';

interface Message {
  id: number;
  text: string;
  isAi: boolean;
  tokenCount?: {
    input: number;
    output: number;
  };
}

// Use constants outside the component to improve performance
const API_KEYS = {
  openai: "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",
  claude: "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",
  gemini: "AIzaSyBNEgVxG47UOOOzPuOkVVxrb66aQOaZDFo"
};

// Default submodels for each AI provider
const DEFAULT_SUBMODELS = {
  openai: 'gpt-4o',
  claude: 'claude-3-opus',
  gemini: 'gemini-1.5-pro'
};

const STARTUP_SYSTEM_PROMPT = "You are an AI assistant that specializes in startups, investors, and investment types. You can answer questions about startups, investments, investor decks, deal types, venture capital firms, angel investors, and related topics.";

// Helper function to estimate token count
const estimateTokens = (text: string): number => {
  // Rough estimate: ~4 chars per token for English text
  return Math.ceil(text.length / 4);
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Zack AI, your retro-futuristic startup investment assistant. How can I help you today?",
      isAi: true,
      tokenCount: {
        input: 0,
        output: estimateTokens("Hello! I'm Zack AI, your retro-futuristic startup investment assistant. How can I help you today?")
      }
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(2);
  const [selectedModel, setSelectedModel] = useState<AIModel>('openai');
  const [selectedSubModel, setSelectedSubModel] = useState<string>(DEFAULT_SUBMODELS.openai);
  const [apiStatus, setApiStatus] = useState<{[key in AIModel]: boolean}>({
    openai: false,
    claude: false,
    gemini: false
  });
  const [showApiStatus, setShowApiStatus] = useState(false);

  // Update submodel when the main model changes
  useEffect(() => {
    setSelectedSubModel(DEFAULT_SUBMODELS[selectedModel]);
  }, [selectedModel]);

  // *** MOVED FUNCTION DECLARATIONS UP ***
  const fetchOpenAIResponse = useCallback(async (userMessage: string, subModel: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEYS.openai}`
        },
        body: JSON.stringify({
          model: subModel || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: STARTUP_SYSTEM_PROMPT },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 1000
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        return {
          text: `Error: ${errorData.error?.message || "Unknown error with OpenAI API"}`,
          tokenCount: {
            input: estimateTokens(userMessage) + estimateTokens(STARTUP_SYSTEM_PROMPT),
            output: 0
          }
        };
      }
      
      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || simulateResponse(userMessage).text;
      
      return {
        text: aiResponse,
        tokenCount: {
          input: data.usage?.prompt_tokens || estimateTokens(userMessage) + estimateTokens(STARTUP_SYSTEM_PROMPT),
          output: data.usage?.completion_tokens || estimateTokens(aiResponse)
        }
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      return {
        text: `Error communicating with OpenAI. Please try again.`,
        tokenCount: {
          input: estimateTokens(userMessage) + estimateTokens(STARTUP_SYSTEM_PROMPT),
          output: 0
        }
      };
    }
  }, []);

  const fetchClaudeResponse = useCallback(async (userMessage: string, subModel: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEYS.claude,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: subModel || 'claude-3-haiku-20240307',
          messages: [
            { role: 'system', content: STARTUP_SYSTEM_PROMPT },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 1000
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Claude API error:", errorData);
        return {
          text: `Error: ${errorData.error?.message || "Unknown error with Claude API"}`,
          tokenCount: {
            input: estimateTokens(userMessage) + estimateTokens(STARTUP_SYSTEM_PROMPT),
            output: 0
          }
        };
      }
      
      const data = await response.json();
      const aiResponse = data.content?.[0]?.text || simulateResponse(userMessage).text;
      
      return {
        text: aiResponse,
        tokenCount: {
          input: data.usage?.prompt_tokens || estimateTokens(userMessage) + estimateTokens(STARTUP_SYSTEM_PROMPT),
          output: data.usage?.completion_tokens || estimateTokens(aiResponse)
        }
      };
    } catch (error) {
      console.error("Claude API error:", error);
      return {
        text: `Error communicating with Claude. Please try again.`,
        tokenCount: {
          input: estimateTokens(userMessage) + estimateTokens(STARTUP_SYSTEM_PROMPT),
          output: 0
        }
      };
    }
  }, []);

  const fetchGeminiResponse = useCallback(async (userMessage: string, subModel: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${subModel || 'gemini-1.5-flash'}:generateContent?key=${API_KEYS.gemini}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: STARTUP_SYSTEM_PROMPT },
                { text: userMessage }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 1000
          }
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error:", errorData);
        return {
          text: `Error: ${errorData.error?.message || "Unknown error with Gemini API"}`,
          tokenCount: {
            input: estimateTokens(userMessage) + estimateTokens(STARTUP_SYSTEM_PROMPT),
            output: 0
          }
        };
      }
      
      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || simulateResponse(userMessage).text;
      
      return {
        text: aiResponse,
        tokenCount: {
          input: data.usage?.prompt_tokens || estimateTokens(userMessage) + estimateTokens(STARTUP_SYSTEM_PROMPT),
          output: data.usage?.completion_tokens || estimateTokens(aiResponse)
        }
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      return {
        text: `Error communicating with Gemini. Please try again.`,
        tokenCount: {
          input: estimateTokens(userMessage) + estimateTokens(STARTUP_SYSTEM_PROMPT),
          output: 0
        }
      };
    }
  }, []);

  // Define simulateResponse which is used in the fetch functions
  const simulateResponse = (userMessage: string) => {
    // List of possible startup-related AI responses
    const responses = [
      "Based on current market trends, startups in this sector typically raise between $1-3M for their seed round.",
      "Venture capital firms usually look for startups with a clear path to profitability within 3-5 years.",
      "For early-stage startups, angel investors often provide capital in exchange for 10-20% equity.",
      "Series A funding typically ranges from $2M to $15M, depending on the industry and growth potential.",
      "The average valuation multiple for SaaS startups is currently 6-10x ARR.",
      "Accelerator programs like Y Combinator take about 7% equity in exchange for mentorship and initial funding.",
      "Term sheets typically include liquidation preferences, anti-dilution provisions, and board seat allocations.",
      "For B2B startups, demonstrating a strong CAC to LTV ratio is crucial when pitching to investors.",
      `Regarding "${userMessage}", many founders overlook the importance of proper cap table management.`,
      "When structuring equity for early employees, a 4-year vesting schedule with a 1-year cliff is standard practice."
    ];
    
    // Choose a random response
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      text: response,
      tokenCount: {
        input: estimateTokens(userMessage) + estimateTokens(STARTUP_SYSTEM_PROMPT),
        output: estimateTokens(response)
      }
    };
  };

  // Check API status on load - optimized with useCallback
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

  const testOpenAIApi = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEYS.openai}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.status === 200;
    } catch (error) {
      console.error("OpenAI API test error:", error);
      return false;
    }
  }, []);

  const testClaudeApi = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEYS.claude,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [
            { role: 'user', content: 'Hi' }
          ]
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.status === 200;
    } catch (error) {
      console.error("Claude API test error:", error);
      return false;
    }
  }, []);

  const testGeminiApi = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${API_KEYS.gemini}`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.status === 200;
    } catch (error) {
      console.error("Gemini API error:", error);
      return false;
    }
  }, []);

  const isStartupRelated = (text: string) => {
    // Always return true now - we've expanded our knowledge base
    return true;
  };

  const handleModelChange = (model: AIModel) => {
    setSelectedModel(model);
    setSelectedSubModel(DEFAULT_SUBMODELS[model]);
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: messageIdCounter,
        text: `Switched to ${model.charAt(0).toUpperCase() + model.slice(1)} model.`,
        isAi: true,
        tokenCount: {
          input: 0,
          output: estimateTokens(`Switched to ${model.charAt(0).toUpperCase() + model.slice(1)} model.`)
        }
      }
    ]);
    setMessageIdCounter(prev => prev + 1);
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

  const fetchAIResponse = useCallback(async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      let response;
      
      if (!isStartupRelated(userMessage)) {
        // Return a canned response for non-startup related questions
        setTimeout(() => {
          setMessages(prevMessages => [
            ...prevMessages,
            {
              id: messageIdCounter + 1,
              text: "I'm limited to Startups Knowledge base. Please ask me about startups, investors, or investment types.",
              isAi: true,
              tokenCount: {
                input: estimateTokens(userMessage),
                output: estimateTokens("I'm limited to Startups Knowledge base. Please ask me about startups, investors, or investment types.")
              }
            }
          ]);
          setMessageIdCounter(prev => prev + 2);
          setIsTyping(false);
        }, 1000);
        return;
      }
      
      switch (selectedModel) {
        case 'openai':
          response = await fetchOpenAIResponse(userMessage, selectedSubModel);
          break;
        case 'claude':
          response = await fetchClaudeResponse(userMessage, selectedSubModel);
          break;
        case 'gemini':
          response = await fetchGeminiResponse(userMessage, selectedSubModel);
          break;
        default:
          // Fallback to simulated response
          response = simulateResponse(userMessage);
      }
      
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: messageIdCounter + 1,
          text: response.text,
          isAi: true,
          tokenCount: response.tokenCount
        }
      ]);
      setMessageIdCounter(prev => prev + 2);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: messageIdCounter + 1,
          text: "Sorry, I encountered an error while processing your request. Please try again.",
          isAi: true,
          tokenCount: {
            input: estimateTokens(userMessage),
            output: estimateTokens("Sorry, I encountered an error while processing your request. Please try again.")
          }
        }
      ]);
      setMessageIdCounter(prev => prev + 2);
    } finally {
      setIsTyping(false);
    }
  }, [selectedModel, selectedSubModel, messageIdCounter, fetchOpenAIResponse, fetchClaudeResponse, fetchGeminiResponse]);

  const handleSendMessage = useCallback((message: string) => {
    // Add user message
    const userMessageId = messageIdCounter;
    const userTokenCount = estimateTokens(message);
    
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: userMessageId,
        text: message,
        isAi: false,
        tokenCount: {
          input: userTokenCount,
          output: 0
        }
      }
    ]);
    setMessageIdCounter(prev => prev + 1);
    
    // Start typing animation
    setIsTyping(true);
    
    // Get AI response
    const fetchResponse = async () => {
      try {
        let response;
        
        if (!isStartupRelated(message)) {
          // Return a canned response for non-startup related questions
          setTimeout(() => {
            const cannedResponse = "I'm limited to Startups Knowledge base. Please ask me about startups, investors, or investment types.";
            setMessages(prevMessages => [
              ...prevMessages,
              {
                id: userMessageId + 1,
                text: cannedResponse,
                isAi: true,
                tokenCount: {
                  input: userTokenCount,
                  output: estimateTokens(cannedResponse)
                }
              }
            ]);
            setMessageIdCounter(prev => prev + 2);
            setIsTyping(false);
          }, 1000);
          return;
        }
        
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
          default:
            // Fallback to simulated response
            response = simulateResponse(message);
        }
        
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: userMessageId + 1,
            text: response.text,
            isAi: true,
            tokenCount: response.tokenCount
          }
        ]);
        setMessageIdCounter(prev => prev + 2);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: userMessageId + 1,
            text: "Sorry, I encountered an error while processing your request. Please try again.",
            isAi: true,
            tokenCount: {
              input: userTokenCount,
              output: estimateTokens("Sorry, I encountered an error while processing your request. Please try again.")
            }
          }
        ]);
        setMessageIdCounter(prev => prev + 2);
      } finally {
        setIsTyping(false);
      }
    };
    
    fetchResponse();
  }, [messageIdCounter, selectedModel, selectedSubModel, fetchOpenAIResponse, fetchClaudeResponse, fetchGeminiResponse, isStartupRelated]);

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
        />
        {showApiStatus && <APIStatus apiStatus={apiStatus} />}
        <ChatArea messages={messages} isTyping={isTyping} />
        <InputSection 
          onSendMessage={handleSendMessage} 
          selectedModel={selectedModel}
          selectedSubModel={selectedSubModel}
          onSubModelChange={handleSubModelChange}
        />
      </div>
    </CRTEffect>
  );
};

export default Index;
