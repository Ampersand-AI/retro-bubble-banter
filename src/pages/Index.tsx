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
import ChatHistory from '@/components/ChatHistory';

interface TokenUsage {
  total: number;
  limit: number;
  remaining: number;
}

const Index = () => {
  // State for models and API status
  const [selectedModel, setSelectedModel] = useState<AIModel>('openai');
  const [selectedSubModel, setSelectedSubModel] = useState<string>(DEFAULT_SUBMODELS.openai);
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
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Message[]>([]);

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

    // Get the current message's token count
    const userTokenCount = Math.ceil(message.length / 4);
    
    // Check if we have enough tokens
    if (tokenUsage.remaining < userTokenCount) {
      setShowSubscriptionDialog(true);
      return;
    }

    // Update token usage in Supabase
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
        // Skip the first greeting message
        if (lastMessage.isAi && lastMessage.tokenCount && messages.length > 1) {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserProfile({
      id: '',
      email: '',
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

  const handleSubscribe = () => {
    // Implement subscription logic here
    toast({
      title: "Coming Soon",
      description: "Subscription feature will be available soon!",
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

  const handleSelectChat = (messages: Message[]) => {
    setSelectedChat(messages);
    setMessages(messages);
    setShowChatHistory(false);
  };

  return (
    <CRTEffect>
      <div className="min-h-screen bg-amp-blue overflow-hidden">
        <Header 
          selectedModel={selectedModel} 
          onModelChange={handleModelChange}
          apiStatus={apiStatus}
          messages={messages}
          onTokenStatsClick={() => setShowTokenStats(true)}
          onChatHistoryClick={() => setShowChatHistory(!showChatHistory)}
        />
        {showApiStatus && <APIStatus apiStatus={apiStatus} />}
        
        <div className="flex h-[calc(100vh-4rem)] pt-16">
          {/* Chat History Sidebar */}
          <div className={`fixed left-0 top-16 bottom-0 w-64 bg-amp-dark-blue border-r border-amp-cyan transition-transform duration-300 z-40 ${showChatHistory ? 'translate-x-0' : '-translate-x-full'}`}>
            {session?.user && (
              <ChatHistory 
                userId={session.user.id} 
                onSelectChat={handleSelectChat}
              />
            )}
          </div>

          {/* Main Chat Area */}
          <div className={`flex-1 flex flex-col transition-all duration-300 ${showChatHistory ? 'ml-64' : 'ml-0'}`}>
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
              <ChatArea messages={messages} isTyping={isTyping} />
              <InputSection 
                onSendMessage={handleSendUserMessage} 
                selectedModel={selectedModel}
                selectedSubModel={selectedSubModel}
                onSubModelChange={handleSubModelChange}
                isAuthenticated={isAuthenticated}
                onAuthSuccess={handleAuthSuccess}
              />
            </div>
          </div>
        </div>

        <TokenStatsDialog
          open={showTokenStats}
          onOpenChange={setShowTokenStats}
          onLogout={handleLogout}
          onSignIn={handleSignInClick}
          userProfile={userProfile}
          tokenUsage={tokenUsage}
          isAuthenticated={isAuthenticated}
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
          userProfile={userProfile}
        />
      </div>
    </CRTEffect>
  );
};

export default Index;
