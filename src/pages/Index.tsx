import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ChatArea from '../components/ChatArea';
import InputSection from '../components/InputSection';
import { toast } from "../components/ui/use-toast";
import CRTEffect from '../components/CRTEffect';
import APIStatus from '../components/APIStatus';
import TokenStatsDialog from '../components/TokenStatsDialog';
import AuthDialog from '../components/AuthDialog';
import SubscriptionDialog from '../components/SubscriptionDialog';
import { AIModel, DEFAULT_SUBMODELS } from '../config/apiConfig';
import { 
  testOpenAIApi, 
  testClaudeApi, 
  testGeminiApi,
  testDeepSeekApi,
  testGrokApi 
} from '../services/apiStatusService';
import { useMessages } from '../hooks/useMessages';
import { supabase, UserProfile } from '../lib/supabase';
import ToolSelect from '../components/ToolSelect';
import PromptDisplay from '../components/PromptDisplay';
import { Button } from '../components/ui/button';
import { createTerminalCommands, handleTerminalCommand as handleTerminalCommandUtil } from '../utils/terminalCommands';

interface TokenUsage {
  total: number;
  limit: number;
  remaining: number;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  logo: string;
}

const Index = () => {
  // State for models and API status
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini');
  const [selectedSubModel, setSelectedSubModel] = useState<string>(DEFAULT_SUBMODELS.gemini);
  const [apiStatus, setApiStatus] = useState<{[key in AIModel]: boolean}>({
    openai: false,
    claude: false,
    gemini: false,
    deepseek: false,
    grok: false
  });
  const [showApiStatus, setShowApiStatus] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showTokenStats, setShowTokenStats] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '',
    email: '',
    full_name: '',
    is_subscribed: false,
    subscription_tier: 'free',
    token_usage: {
      total: 0,
      limit: 5000,
      remaining: 5000
    }
  });
  const [tokenUsage, setTokenUsage] = useState<TokenUsage>({
    total: 0,
    limit: 1000, // Default limit for free users
    remaining: 1000
  });
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isPromptMode, setIsPromptMode] = useState(() => {
    const storedMode = localStorage.getItem('chatMode');
    return storedMode === 'prompt' ? true : false;
  });
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  // Use our custom hook for messages
  const { 
    messages, 
    isTyping, 
    messageIdCounter, 
    setMessageIdCounter, 
    addModelSwitchMessage, 
    handleSendMessage,
    setMessages
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
        const [openaiStatus, claudeStatus, geminiStatus, deepseekStatus, grokStatus] = await Promise.all([
          testOpenAIApi(),
          testClaudeApi(),
          testGeminiApi(),
          testDeepSeekApi(),
          testGrokApi()
        ]);
        
        setApiStatus({
          openai: openaiStatus,
          claude: claudeStatus,
          gemini: geminiStatus,
          deepseek: deepseekStatus,
          grok: grokStatus
        });
      } catch (error) {
        console.error("Error validating APIs:", error);
      }
    };
    
    validateApis();
  }, []);

  // Initialize Supabase auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user profile and token usage from Supabase
  useEffect(() => {
    const loadUserData = async () => {
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
          return;
        }

        if (profile) {
          setUserProfile(profile);
          setTokenUsage(profile.token_usage);
          setIsAuthenticated(true);
        }
      }
    };

    loadUserData();
  }, [session]);

  const handleModelChange = (model: AIModel) => {
    setSelectedModel(model);
    setSelectedSubModel(DEFAULT_SUBMODELS[model]);
    const newCounter = addModelSwitchMessage(model, messageIdCounter);
    setMessageIdCounter(newCounter);
  };

  const handleSubModelChange = (subModel: string) => {
    setSelectedSubModel(subModel);
    toast({
      title: `Model Updated`,
      description: `Now using ${subModel}`,
      duration: 2000
    });
  };

  const handleSendUserMessage = async (message: string) => {
    if (!session?.user) {
      setShowAuthDialog(true);
      return;
    }

    // Get the current message's token count (only count user input)
    const userTokenCount = Math.ceil(message.length / 4);
    
    // Check if we have enough tokens
    if (tokenUsage.remaining < userTokenCount) {
      setShowSubscriptionDialog(true);
      return;
    }

    // Update token usage in Supabase (only count user input)
    const newTotal = tokenUsage.total + userTokenCount;
    const newRemaining = Math.max(0, tokenUsage.limit - newTotal);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        token_usage: {
          total: newTotal,
          limit: tokenUsage.limit,
          remaining: newRemaining
        }
      })
      .eq('id', session.user.id);

    if (error) {
      console.error('Error updating token usage:', error);
      toast({
        title: "Error",
        description: "Failed to update token usage. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setTokenUsage(prev => ({
      ...prev,
      total: newTotal,
      remaining: newRemaining
    }));
    
    handleSendMessage(message, selectedModel, selectedSubModel, messageIdCounter);
  };

  // Update token usage when AI responds
  useEffect(() => {
    const updateTokenUsage = async () => {
      if (messages.length > 0 && session?.user) {
        const lastMessage = messages[messages.length - 1];
        // Skip the first greeting message and model switch messages
        if (lastMessage.isAi && lastMessage.tokenCount && messages.length > 1 && 
            !lastMessage.text.includes("Welcome to Rovyk") && 
            !lastMessage.text.includes("Switched to")) {
          // Only count AI output tokens
          const newTotal = tokenUsage.total + lastMessage.tokenCount.output;
          const newRemaining = Math.max(0, tokenUsage.limit - newTotal);
          
          const { error } = await supabase
            .from('profiles')
            .update({
              token_usage: {
                total: newTotal,
                limit: tokenUsage.limit,
                remaining: newRemaining
              }
            })
            .eq('id', session.user.id);

          if (error) {
            console.error('Error updating token usage:', error);
            return;
          }

          setTokenUsage(prev => ({
            ...prev,
            total: newTotal,
            remaining: newRemaining
          }));
        }
      }
    };

    updateTokenUsage();
  }, [messages, session]);

  const handleAuthSuccess = async (newUserProfile: UserProfile) => {
    try {
      console.log('Auth success, updating user profile:', newUserProfile);
      
      if (!newUserProfile.id) {
        console.error('No user ID in profile');
        throw new Error('Invalid user profile');
      }

      setUserProfile(newUserProfile);
      setTokenUsage(newUserProfile.token_usage);
      setIsAuthenticated(true);
      
      toast({
        title: "Success",
        description: "Welcome back!",
      });
    } catch (error: any) {
      console.error('Error handling auth success:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete authentication",
        variant: "destructive",
      });
    }
  };

  const handleInputAuthSuccess = (userProfile: {
    email: string;
    isSubscribed: boolean;
    subscriptionTier?: 'free' | 'pro' | 'enterprise';
  }) => {
    const newProfile: UserProfile = {
      id: '',  // This will be set by Supabase
      email: userProfile.email,
      full_name: '',  // This will be set by the user later
      is_subscribed: userProfile.isSubscribed,
      subscription_tier: userProfile.subscriptionTier || 'free',
      token_usage: {
        total: 0,
        limit: 5000,
        remaining: 5000
      }
    };
    handleAuthSuccess(newProfile);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserProfile({
      id: '',
      email: '',
      full_name: '',
      is_subscribed: false,
      subscription_tier: 'free',
      token_usage: {
        total: 0,
        limit: 5000,
        remaining: 5000
      }
    });
    setTokenUsage({
      total: 0,
      limit: 5000,
      remaining: 5000
    });
  };

  const handleSubscribe = async (tier: 'plus' | 'ultra') => {
    toast({
      title: "Coming Soon",
      description: `The ${tier.charAt(0).toUpperCase() + tier.slice(1)} subscription will be available soon!`,
    });
    setShowSubscriptionDialog(false);
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

  const handleSignInClick = () => {
    setShowAuthDialog(true);
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  const handleModeToggle = () => {
    setIsPromptMode(!isPromptMode);
    setSelectedTool(null);
    setGeneratedPrompt('');
  };

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handlePromptGeneration = async (description: string) => {
    if (!selectedTool || !session?.user) return;

    // Create commands object
    const commands = createTerminalCommands(
      setIsPromptMode,
      setSelectedModel,
      setSelectedSubModel,
      handleSendMessage,
      setMessages
    );

    // Check if the input is a command
    if (description.startsWith('/')) {
      const response = handleTerminalCommandUtil(description, commands);
      if (response.isCommand) {
        if (response.shouldSendMessage && response.message) {
          handleSendMessage(response.message, selectedModel, selectedSubModel, messageIdCounter);
        }
        return;
      }
    }

    setIsGeneratingPrompt(true);
    try {
      // Calculate input token usage (user's description)
      const inputTokenCount = Math.ceil(description.length / 4);
      
      if (tokenUsage.remaining < inputTokenCount) {
        setShowSubscriptionDialog(true);
        return;
      }

      // Generate prompt using the selected model
      const prompt = await generatePrompt(description, selectedTool, selectedModel);
      
      // Calculate output token usage (generated prompt)
      const outputTokenCount = Math.ceil(prompt.length / 4);
      const totalTokenCount = inputTokenCount + outputTokenCount;

      if (tokenUsage.remaining < totalTokenCount) {
        setShowSubscriptionDialog(true);
        return;
      }

      // Update token usage
      const newTotal = tokenUsage.total + totalTokenCount;
      const newRemaining = Math.max(0, tokenUsage.limit - newTotal);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          token_usage: {
            total: newTotal,
            limit: tokenUsage.limit,
            remaining: newRemaining
          }
        })
        .eq('id', session.user.id);

      if (error) throw error;

      setTokenUsage(prev => ({
        ...prev,
        total: newTotal,
        remaining: newRemaining
      }));

      // Show token usage in toast
      toast({
        title: "Token Usage",
        description: `Input: ${inputTokenCount} tokens | Output: ${outputTokenCount} tokens`,
        duration: 3000
      });

      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast({
        title: "Error",
        description: "Failed to generate prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const generatePrompt = async (description: string, tool: Tool, model: AIModel): Promise<string> => {
    const toolPrompts = {
      v0: "You are an expert in V0 AI design tool. Based on the user's product idea, create a detailed prompt that they can use with V0 to generate their desired UI design. Include specific layout suggestions, component recommendations, and styling preferences. Format the prompt to be directly usable in V0. Do not include any introductory or concluding paragraphs.",
      cursor: "You are an expert in Cursor AI coding tool. Based on the user's product idea, create a detailed prompt that they can use with Cursor to develop their application. Include specific technical requirements, architecture suggestions, and implementation details. Format the prompt to be directly usable with Cursor's /edit or /chat commands. Do not include any introductory or concluding paragraphs.",
      bolt: "You are an expert in Bolt AI development tool. Based on the user's product idea, create a detailed prompt that they can use with Bolt to build their application. Include specific feature requirements, technical specifications, and implementation guidance. Format the prompt to be directly usable in Bolt. Do not include any introductory or concluding paragraphs.",
      tempo: "You are an expert in Tempo AI development platform. Based on the user's product idea, create a detailed prompt that they can use with Tempo to build their application. Include specific component structures, styling preferences, and functionality details. Format the prompt to be directly usable in Tempo's chat interface. Do not include any introductory or concluding paragraphs.",
      lovable: "You are an expert in Lovable AI design tool. Based on the user's product idea, create a detailed prompt that they can use with Lovable to design their application. Include specific UI/UX requirements, design system recommendations, and visual style guidelines. Format the prompt to be directly usable in Lovable's interface. Do not include any introductory or concluding paragraphs.",
    };

    const systemPrompt = toolPrompts[tool.id] || 
      `You are an expert in ${tool.name} AI tool. Create a detailed prompt based on the user's product idea. Do not include any introductory or concluding paragraphs.`;

    const prompt = `${systemPrompt}

Create a detailed prompt for ${tool.name} based on this product idea: ${description}. Include feature list, functionality details, and specific implementation guidance. Format your response with markdown for better readability.`;

    try {
      // Make a direct API call to the selected model
      let response;
      switch (model) {
        case 'openai':
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: selectedSubModel,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7
            })
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'OpenAI API request failed');
          }
          const openaiData = await response.json();
          if (!openaiData.choices?.[0]?.message?.content) {
            throw new Error('Invalid response from OpenAI API');
          }
          return openaiData.choices[0].message.content;
        
        case 'claude':
          response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: selectedSubModel,
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 4000
            })
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Claude API request failed');
          }
          const claudeData = await response.json();
          if (!claudeData.content?.[0]?.text) {
            throw new Error('Invalid response from Claude API');
          }
          return claudeData.content[0].text;
        
        case 'gemini':
          response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Gemini API request failed');
          }
          const geminiData = await response.json();
          if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response from Gemini API');
          }
          return geminiData.candidates[0].content.parts[0].text;
        
        case 'deepseek':
          response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
              model: selectedSubModel,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7
            })
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'DeepSeek API request failed');
          }
          const deepseekData = await response.json();
          if (!deepseekData.choices?.[0]?.message?.content) {
            throw new Error('Invalid response from DeepSeek API');
          }
          return deepseekData.choices[0].message.content;
        
        case 'grok':
          response = await fetch('https://api.grok.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_GROK_API_KEY}`
            },
            body: JSON.stringify({
              model: selectedSubModel,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7
            })
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Grok API request failed');
          }
          const grokData = await response.json();
          if (!grokData.choices?.[0]?.message?.content) {
            throw new Error('Invalid response from Grok API');
          }
          return grokData.choices[0].message.content;
        
        default:
          throw new Error('Unsupported model');
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to generate prompt');
    }
  };

  const handleTerminalCommand = (command: string) => {
    const commands = createTerminalCommands(
      setIsPromptMode,
      setSelectedModel,
      setSelectedSubModel,
      handleSendMessage,
      setMessages
    );
    
    const response = handleTerminalCommandUtil(command, commands);
    if (response.isCommand && response.shouldSendMessage && response.message) {
      handleSendMessage(response.message, selectedModel, selectedSubModel, messageIdCounter);
    }
  };

  return (
    <CRTEffect>
      <div className="min-h-screen bg-amp-blue overflow-hidden flex flex-col items-center justify-center">
        <Header 
          selectedModel={selectedModel} 
          onModelChange={handleModelChange}
          apiStatus={apiStatus}
          messages={messages}
          onTokenStatsClick={() => setShowTokenStats(true)}
          onSubscribeClick={() => setShowSubscriptionDialog(true)}
          isAuthenticated={isAuthenticated}
          isPromptMode={isPromptMode}
          onModeToggle={handleModeToggle}
        />
        {showApiStatus && <APIStatus apiStatus={apiStatus} />}
        
        {isPromptMode ? (
          <div className="pt-16 px-4">
            {!selectedTool ? (
              <ToolSelect onToolSelect={handleToolSelect} />
            ) : !generatedPrompt ? (
              <div className="max-w-3xl mx-auto">
                <ChatArea 
                  messages={[
                    {
                      id: 1,
                      text: `Please describe what kind of prompt you'd like to generate for ${selectedTool.name}.`,
                      isAi: true
                    }
                  ]} 
                  isTyping={false} 
                />
                <InputSection 
                  onSendMessage={handlePromptGeneration}
                  selectedModel={selectedModel}
                  selectedSubModel={selectedSubModel}
                  onSubModelChange={handleSubModelChange}
                  isAuthenticated={isAuthenticated}
                  onAuthSuccess={handleInputAuthSuccess}
                />
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <PromptDisplay 
                  prompt={generatedPrompt}
                  toolName={selectedTool.name}
                />
                <Button
                  onClick={() => {
                    setGeneratedPrompt('');
                    setSelectedTool(null);
                  }}
                  className="mt-4 w-full bg-amp-dark-blue text-amp-cyan hover:bg-amp-cyan/10"
                >
                  Generate Another Prompt
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <ChatArea messages={messages} isTyping={isTyping} />
            <InputSection 
              onSendMessage={handleSendUserMessage} 
              selectedModel={selectedModel}
              selectedSubModel={selectedSubModel}
              onSubModelChange={handleSubModelChange}
              isAuthenticated={isAuthenticated}
              onAuthSuccess={handleInputAuthSuccess}
              onTerminalCommand={handleTerminalCommand}
            />
          </>
        )}

        <TokenStatsDialog
          open={showTokenStats}
          onOpenChange={setShowTokenStats}
          onLogout={handleLogout}
          onSignIn={handleSignInClick}
          userProfile={userProfile}
          tokenUsage={tokenUsage}
          isAuthenticated={isAuthenticated}
          onProfileUpdate={handleProfileUpdate}
        />
        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onAuthSuccess={handleAuthSuccess}
        />
        <SubscriptionDialog
          open={showSubscriptionDialog}
          onOpenChange={setShowSubscriptionDialog}
          onSubscribe={handleSubscribe}
          userId={session?.user?.id || ''}
        />
      </div>
    </CRTEffect>
  );
};

export default Index;
