i want to add a functionality in this app like to generate prompts for
 V0 logo
V0
AI-powered development tool for creating beautiful interfaces

Cursor AI logo
Cursor AI
AI-powered code editor for faster development

Bolt logo
Bolt
AI-powered development platform for building full-stack apps

Tempo logo
Tempo
AI-powered platform for building React Applications faster

Lovable logo
Lovable
AI-powered development tool for creating lovable user experiences


so here here is how i want to implemented  this earlier-

================================================
FILE: src/app/chat/page.tsx
================================================

"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { generateAIResponse } from "@/lib/gemini";
import AuthModal from "@/components/auth/AuthModal";
import PremiumModal from "@/components/premium/PremiumModal";
import SearchParamsClient from "@/components/SearchParamsClient";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { supabase, savePromptHistory, getProfile, getPromptHistory } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";

interface Message {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  syntaxHighlight?: boolean;
  toolType?: "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable";
}

export default function ChatPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<
    "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable"
  >("V0");
  const { user, promptCount, setPromptCount } = useUser();

  const handleLogin = async (userData: {
    email: string;
    name: string;
    id: string;
    promptCount: number;
  }) => {
    try {
      // Get fresh profile and prompt history data
      const { data: profile, error: profileError } = await getProfile(userData.id);
      const { data: promptHistory, error: historyError } = await getPromptHistory(userData.id);

      if (profileError || historyError) {
        console.error("Error fetching user data:", profileError || historyError);
        return;
      }

      // Calculate the most accurate prompt count
      const actualCount = Math.max(
        profile?.prompt_count || 0,
        promptHistory?.length || 0,
        userData.promptCount
      );

      setPromptCount(actualCount);
      setAuthModalOpen(false);
    } catch (error) {
      console.error("Error in handleLogin:", error);
      toast({
        title: "Error updating user data",
        description: "Please try logging in again",
        variant: "destructive",
      });
    }
  };

  // Show welcome message only when user logs in or tool changes
  useEffect(() => {
    if (user && messages.length === 0) {
      const welcomeMessage = {
        id: "1",
        message: `Welcome ${user.name}! Describe your product idea and I'll generate a customized prompt for ${selectedTool}.`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        toolType: selectedTool,
      };
      setMessages([welcomeMessage]);

      // Store welcome message in session storage to persist across reloads
      sessionStorage.setItem('welcomeMessage', JSON.stringify(welcomeMessage));
    } else if (messages.length > 0) {
      // Update existing welcome message if tool changes
      const updatedMessages = messages.map(msg => 
        msg.id === "1" ? {
          ...msg,
          message: `Welcome ${user?.name || ''}! Describe your product idea and I'll generate a customized prompt for ${selectedTool}.`,
          toolType: selectedTool,
        } : msg
      );
      setMessages(updatedMessages);
      if (updatedMessages[0]?.id === "1") {
        sessionStorage.setItem('welcomeMessage', JSON.stringify(updatedMessages[0]));
      }
    }
  }, [user, messages.length, selectedTool]);

  // Load persisted welcome message on mount
  useEffect(() => {
    const storedMessage = sessionStorage.getItem('welcomeMessage');
    if (storedMessage && messages.length === 0) {
      try {
        const parsedMessage = JSON.parse(storedMessage);
        // Update the stored message with current tool type if different
        if (selectedTool !== parsedMessage.toolType) {
          parsedMessage.toolType = selectedTool;
          parsedMessage.message = `Welcome ${user?.name || ''}! Describe your product idea and I'll generate a customized prompt for ${selectedTool}.`;
          sessionStorage.setItem('welcomeMessage', JSON.stringify(parsedMessage));
        }
        setMessages([parsedMessage]);
      } catch (e) {
        console.error('Error parsing stored welcome message:', e);
        sessionStorage.removeItem('welcomeMessage');
      }
    }
  }, [selectedTool, messages.length, user]);

  const handleSendMessage = async (message: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    // Check if user has reached their prompt limit
    if (promptCount >= (user.total_prompts_limit || 5)) {
      setPremiumModalOpen(true);
      return;
    }

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
      toolType: selectedTool,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Generate AI response
      const response = await generateAIResponse(message, selectedTool);

      // Add AI response to chat
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        syntaxHighlight: true,
        toolType: selectedTool,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Save to prompt history
      await savePromptHistory(user.id, message, response, selectedTool);

      // Update prompt count
      const newPromptCount = promptCount + 1;
      setPromptCount(newPromptCount);

      // Update profile with new prompt count
      await supabase
        .from("profiles")
        .update({ prompt_count: newPromptCount })
        .eq("id", user.id);

      // If user is premium and has used all prompts, revert to free tier
      if (
        user.is_premium &&
        newPromptCount >= (user.total_prompts_limit || 150)
      ) {
        await supabase
          .from("profiles")
          .update({
            is_premium: false,
            total_prompts_limit: 5,
            has_prompt_history_access: false,
          })
          .eq("id", user.id);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </div>}>
        <SearchParamsClient setSelectedTool={setSelectedTool} />
      </Suspense>
      <main className="flex flex-1 flex-col items-center bg-black text-white">
        <div className="w-full max-w-7xl mx-auto px-4 flex flex-col flex-1">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] gap-8 w-full relative">
            <div className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none">
              <FlickeringGrid
                className="relative z-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
                squareSize={5}
                gridGap={6}
                colors={["#ffffff", "#f5f5f5", "#e5e5e5"]}
                maxOpacity={0.6}
                flickerChance={0.1}
              />
            </div>
            <div className="text-center space-y-2 pt-8 drop-shadow-2xl shadow-black">
              <h1 className="text-3xl font-bold tracking-tight text-white relative shadow-2xl shadow-black">
                Prompt. Create. Innovate.
              </h1>
            </div>
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
            </div>}>
              <div className="flex w-full max-w-5xl py-4 px-4 self-center relative bg-black/80 backdrop-blur-sm overflow-hidden">
                <ChatInterface
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  initialMessages={messages}
                  initialTool={selectedTool}
                  showToolSelector={false}
                />
              </div>
            </Suspense>
          </div>
        </div>
      </main>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
      />
      <PremiumModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />
    </>
  );
}


src/app/page.tsx

"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";
import PremiumModal from "@/components/premium/PremiumModal";
import MainPageRecoveryHandler from "@/components/auth/MainPageRecoveryHandler";
import Image from "next/image";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import {
  getProfile,
  signOut,
  getPromptHistory,
} from "@/lib/supabase";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

interface User {
  id: string;
  email: string;
  name: string;
  is_premium?: boolean;
  total_prompts_limit?: number;
}

type TabType = "login" | "register" | "forgot-password" | "update-password";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<
    "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable" | null
  >(null);
  const MAX_FREE_PROMPTS = 5;
  const { user, promptCount, isLoading, setPromptCount } = useUser();

  // Handle clicks outside the menu to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToolSelect = async (tool: "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable") => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (promptCount >= MAX_FREE_PROMPTS) {
      setPremiumModalOpen(true);
      return;
    }

    setSelectedTool(tool);
    router.push(`/chat?tool=${tool}`);
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast("Error logging out", {
        description: "Failed to sign out. Please try again.",
      });
      return;
    }
    setPromptCount(0);
    setAuthModalOpen(false);
    router.push("/");
  };

  const handleLogin = async (userData: {
    email: string;
    name: string;
    id: string;
    promptCount: number;
  }) => {
    try {
      // Get fresh profile and prompt history data
      const { data: profile, error: profileError } = await getProfile(userData.id);
      const { data: promptHistory, error: historyError } = await getPromptHistory(userData.id);

      if (profileError || historyError) {
        console.error("Error fetching user data:", profileError || historyError);
        return;
      }

      // Calculate the most accurate prompt count
      const actualCount = Math.max(
        profile?.prompt_count || 0,
        promptHistory?.length || 0,
        userData.promptCount
      );

      setPromptCount(actualCount);
      setAuthModalOpen(false);
    } catch (error) {
      console.error("Error in handleLogin:", error);
      toast.error("Error updating user data", {
        description: "Please try logging in again",
        descriptionClassName: "text-gray-500",
      });
    }
  };

  const tools = [
    {
      id: "V0",
      name: "V0",
      description: "AI-powered development tool for creating beautiful interfaces",
    },
    {
      id: "Cursor",
      name: "Cursor AI",
      description: "AI-powered code editor for faster development",
    },
    {
      id: "Bolt",
      name: "Bolt",
      description: "AI-powered development platform for building full-stack apps",
    },
    {
      id: "Tempo",
      name: "Tempo",
      description: "AI-powered platform for building React Applications faster",
    },
    {
      id: "Lovable",
      name: "Lovable",
      description: "AI-powered development tool for creating lovable user experiences",
    },
  ];

  return (
    <main className="flex flex-1 flex-col items-center bg-white dark:bg-black text-black dark:text-white">
      <Suspense fallback={null}>
        <MainPageRecoveryHandler
          setActiveTab={setActiveTab}
          setAuthModalOpen={setAuthModalOpen}
        />
      </Suspense>

      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col flex-1">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] gap-8 w-full relative">
          <div className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none">
            <FlickeringGrid
              className="relative z-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)] dark:[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
              squareSize={5}
              gridGap={6}
              colors={["#ffffff", "#f5f5f5", "#e5e5e5"]}
              maxOpacity={0.3}
              flickerChance={0.1}
            />
          </div>
          <div className="text-center space-y-2 relative z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5)_70%,rgba(255,255,255,0)_71%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3)_70%,rgba(0,0,0,0)_71%)] rounded-full px-8 py-6">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">
              {user ? `Welcome, ${user.name}` : "Welcome to MetaMind"}
            </h2>
            <h1 className="text-gray-600 dark:text-white/70 font-normal text-xl max-w-xl">
              Craft powerful AI prompts with intelligent assistance
            </h1>
          </div>

          <div className="w-full max-w-7xl mx-auto flex justify-center">
            <div className="grid grid-cols-1 xl:grid-cols-5 md:grid-cols-3 gap-4 max-w-7xl w-full">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() =>
                    handleToolSelect(
                      tool.id as "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable"
                    )
                  }
                  className="rounded-lg cursor-pointer transition-all duration-300
                    bg-white dark:bg-white/5 backdrop-blur-md
                    border border-black/10 dark:border-white/50
                    shadow-lg dark:shadow-white/10 hover:shadow-xl
                    relative overflow-hidden"
                >
                  <div className="md:p-8 p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-transparent flex items-center justify-center mb-3 overflow-hidden rounded-lg shadow-2xl">
                      <Image
                        src={`/images/${tool.id.toLowerCase()}.${tool.id === "V0" || tool.id === "Bolt" ? "png" : "jpg"}`}
                        alt={`${tool.name} logo`}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-black mb-2 dark:text-white">
                      {tool.name}
                    </h3>
                    <p className="text-black text-xs md:text-sm line-clamp-3 text-balance dark:text-white/70">
                      {tool.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => {
            if (
              activeTab === "update-password" &&
              typeof window !== "undefined" &&
              window.location.search.includes("type=recovery")
            ) {
              return;
            }
            setAuthModalOpen(false);
          }}
          onLogin={handleLogin}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <PremiumModal
          isOpen={premiumModalOpen}
          onClose={() => setPremiumModalOpen(false)}
        />
      </Suspense>
    </main>
  );
}


src/components/ChatInterface.tsx

import React, { useState, useEffect, useCallback, memo } from "react";
import ToolSelector from "./ToolSelector";
import MessageHistory from "./MessageHistory";
import MessageInput from "./MessageInput";
import { Toaster } from "./ui/toaster";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { ShineBorder } from "./magicui/shine-border";

interface Message {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  syntaxHighlight?: boolean;
  toolType?: "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable";
}

interface ChatInterfaceProps {
  initialMessages?: Message[];
  initialTool?: "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable";
  onSendMessage?: (
    message: string,
    tool?: "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable",
  ) => void;
  isLoading?: boolean;
  showToolSelector?: boolean;
}

// Memoize components for better performance
const MemoizedToolSelector = memo(ToolSelector);
const MemoizedMessageHistory = memo(MessageHistory);
const MemoizedMessageInput = memo(MessageInput);

const ChatInterface = ({
  initialTool = "V0",
  initialMessages = [
    {
      id: "1",
      message: "Hello! How can I help you with AI tool instructions today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
      toolType: initialTool,
    },
  ],
  onSendMessage = () => {},
  isLoading = false,
  showToolSelector = true,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedTool, setSelectedTool] = useState<
    "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable"
  >(initialTool);
  const [error, setError] = useState<string | null>(null);
  const [localIsLoading, setLocalIsLoading] = useState<boolean>(isLoading);

  // Update messages when initialMessages changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Update messages' toolType when selectedTool changes
  useEffect(() => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.isUser ? msg : { ...msg, toolType: selectedTool }
      )
    );
  }, [selectedTool]);

  const handleSendMessage = useCallback(
    (message: string) => {
      // Reset any previous errors
      setError(null);
      // Set loading state when sending message
      setLocalIsLoading(true);
      // Call the onSendMessage prop with the message and selected tool
      try {
        if (showToolSelector) {
          onSendMessage(message, selectedTool);
        } else {
          onSendMessage(message);
        }
      } catch (err) {
        setError("Failed to send message. Please try again.");
        console.error("Error sending message:", err);
        // Reset loading state on error
        setLocalIsLoading(false);
      }
    },
    [onSendMessage, selectedTool, showToolSelector],
  );

  const handleToolChange = useCallback(
    (tool: "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable") => {
      setSelectedTool(tool);
    },
    [],
  );

  // Reset loading state when messages change
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].isUser === false) {
      setLocalIsLoading(false);
    }
  }, [messages]);

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-lg flex flex-col h-full bg-white dark:bg-black">
      {showToolSelector && (
        <div className="p-0">
          <MemoizedToolSelector
            selectedTool={selectedTool}
            onToolChange={handleToolChange}
          />
        </div>
      )}

      <div className="flex-1 overflow-hidden p-0">
      
        {error && (
          <Alert variant="destructive" className="m-4 bg-black rounded-lg border-0">
            <AlertCircle className="h-4 w-4 text-white" />
            <AlertTitle className="text-white">Error</AlertTitle>
            <AlertDescription className="text-white">{error}</AlertDescription>
          </Alert>
        )}
        <MemoizedMessageHistory
          messages={messages}
          loading={localIsLoading}
          selectedTool={selectedTool}
        />
      </div>

      <div className="p-0">
        <MemoizedMessageInput
          onSendMessage={handleSendMessage}
          isLoading={localIsLoading}
          placeholder={`Type your product idea`}
          disabled={localIsLoading}
        />
      </div>
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      
    </div>
  );
};

export default memo(ChatInterface);


src/components/MessageInput.tsx

import React, { useState, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "../lib/utils";
import { SendHorizonal } from "lucide-react";

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInput = ({
  onSendMessage = () => {},
  isLoading = false,
  placeholder = "Type your product idea",
  disabled = false,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize function
  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    resizeTextarea();
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSendMessage(message);
        setMessage("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto"; // Reset height to auto
           // Set to default height
        }
      }
    },
    [message, isLoading, onSendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  return (
    <div className="w-full bg-white dark:bg-black p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className={cn(
            "resize-none overflow-hidden bg-white dark:bg-black dark:border-white/30 dark:text-white rounded-lg border border-black/80 text-black focus:border-black focus:ring-0",
            isLoading && "opacity-70"
          )}
          rows={1}
          autoCorrect="on"

        />
        <Button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className="h-full w-12 rounded-lg shrink-0 self-end bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:opacity-90 text-white animate-gradient-x"
          aria-label="Send message"
        >
            <SendHorizonal className="h-8 w-8" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;

src/components/SearchParamsClient.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface SearchParamsClientProps {
  setSelectedTool: (tool: "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable") => void;
}

export default function SearchParamsClient({ setSelectedTool }: SearchParamsClientProps) {
  const searchParams = useSearchParams();
  const toolParam = searchParams.get("tool");

  useEffect(() => {
    if (toolParam && ["V0", "Cursor", "Bolt", "Tempo", "Lovable"].includes(toolParam)) {
      setSelectedTool(toolParam as "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable");
    }
  }, [toolParam, setSelectedTool]);

  return null; // No UI needed, just updating state
}


src/components/ToolSelector.tsx

import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import Image from "next/image";

interface ToolSelectorProps {
  selectedTool?: "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable";
  onToolChange?: (tool: "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable") => void;
}

const ToolSelector = ({
  selectedTool = "V0",
  onToolChange = () => {},
}: ToolSelectorProps) => {
  const handleToolChange = (value: string) => {
    onToolChange(value as "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable");
  };

  return (
    <div className="p-6 w-full bg-white border-b border-[#eaeaea]">
      <div className="space-y-4 text-center">
        <h3 className="text-lg font-medium text-black">Select AI Tool</h3>
        <RadioGroup
          defaultValue={selectedTool}
          value={selectedTool}
          onValueChange={handleToolChange}
          className="flex flex-wrap justify-center gap-6 mt-3"
        >
          {["V0", "Cursor", "Bolt", "Tempo", "Lovable"].map((tool) => (
            <div
              key={tool}
              className={`flex items-center space-x-2 p-3 ${selectedTool === tool ? "bg-black text-white" : "bg-white hover:bg-[#f5f5f5] border border-[#eaeaea]"}`}
            >
              <RadioGroupItem
                value={tool}
                id={tool.toLowerCase()}
                className={selectedTool === tool ? "text-white" : "text-black"}
              />
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={tool.toLowerCase()}
                  className={`cursor-pointer ${selectedTool === tool ? "text-white" : "text-black"}`}
                >
                  {tool} {tool === "Cursor" || tool === "Bolt" ? "AI" : ""}
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default ToolSelector;

src/contexts/UserContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getProfile, getPromptHistory } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  is_premium?: boolean;
  total_prompts_limit?: number;
}

interface UserContextType {
  user: User | null;
  promptCount: number;
  isLoading: boolean;
  setPromptCount: (count: number) => void;
  refreshUserData: (force?: boolean) => Promise<User | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [promptCount, setPromptCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshUserData = async (force: boolean = false): Promise<User | null> => {
    try {
      // Don't refresh if we've refreshed recently, unless forced
      if (!force && Date.now() - lastRefresh < REFRESH_INTERVAL) {
        return user;
      }

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: profile } = await getProfile(currentUser.id);
        if (profile) {
          const userData: User = {
            id: currentUser.id,
            email: currentUser.email || "",
            name: profile.name || currentUser.email?.split("@")[0] || "",
            is_premium: profile.is_premium || false,
            total_prompts_limit: profile.total_prompts_limit || 5,
          };
          setUser(userData);
          setPromptCount(profile.prompt_count || 0);
          setLastRefresh(Date.now());
          return userData;
        }
      }
      setUser(null);
      setPromptCount(0);
      return null;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return null;
    }
  };

  // Initial session check
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData = await refreshUserData(true);
          if (userData) {
            // Store user data in localStorage for faster initial load
            localStorage.setItem('cachedUser', JSON.stringify(userData));
          }
        } else {
          setUser(null);
          localStorage.removeItem('cachedUser');
        }
      } catch (error) {
        console.error("Error in initializeAuth:", error);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    // Try to load cached user data first
    const cachedUser = localStorage.getItem('cachedUser');
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(parsed);
        setIsLoading(false);
      } catch (e) {
        localStorage.removeItem('cachedUser');
      }
    }

    initializeAuth();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    if (!isInitialized) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await refreshUserData(true);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setPromptCount(0);
        localStorage.removeItem('cachedUser');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isInitialized]);

  const contextValue = {
    user,
    promptCount,
    isLoading: isLoading && !user, // Only show loading if we don't have user data
    setPromptCount,
    refreshUserData
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 


src/lib/gemini.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateAIResponse(
  message: string,
  tool: "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable",
  signal?: AbortSignal,
) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file");
    }

    // Create tool-specific system prompts
    const toolPrompts = {
      V0: "You are an expert in V0 AI design tool. Based on the user's product idea, create a detailed prompt that they can use with V0 to generate their desired UI design. Include specific layout suggestions, component recommendations, and styling preferences. Format the prompt to be directly usable in V0. Do not include any introductory or concluding paragraphs.",
      Cursor:
        "You are an expert in Cursor AI coding tool. Based on the user's product idea, create a detailed prompt that they can use with Cursor to develop their application. Include specific technical requirements, architecture suggestions, and implementation details. Format the prompt to be directly usable with Cursor's /edit or /chat commands. Do not include any introductory or concluding paragraphs.",
      Bolt: "You are an expert in Bolt AI development tool. Based on the user's product idea, create a detailed prompt that they can use with Bolt to build their application. Include specific feature requirements, technical specifications, and implementation guidance. Format the prompt to be directly usable in Bolt. Do not include any introductory or concluding paragraphs.",
      Tempo:
        "You are an expert in Tempo AI development platform. Based on the user's product idea, create a detailed prompt that they can use with Tempo to build their application. Include specific component structures, styling preferences, and functionality details. Format the prompt to be directly usable in Tempo's chat interface. Do not include any introductory or concluding paragraphs.",
      Lovable:
        "You are an expert in Lovable AI design tool. Based on the user's product idea, create a detailed prompt that they can use with Lovable to design their application. Include specific UI/UX requirements, design system recommendations, and visual style guidelines. Format the prompt to be directly usable in Lovable's interface. Do not include any introductory or concluding paragraphs.",
    };

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `${toolPrompts[tool] || `You are an expert in ${tool} AI tool. Create a detailed prompt based on the user's product idea. Do not include any introductory or concluding paragraphs.`}

Create a detailed prompt for ${tool} based on this product idea: ${message}. Include feature list, functionality details, and specific implementation guidance. Format your response with markdown for better readability.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
} 

src/lib/openai.ts

export async function generateAIResponse(
  message: string,
  tool: "V0" | "Cursor" | "Bolt" | "Tempo" | "Lovable",
  signal?: AbortSignal,
) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("OpenAI API key is missing. Please add NEXT_PUBLIC_OPENAI_API_KEY to your .env.local file");
    }

    // Create tool-specific system prompts
    const toolPrompts = {
      V0: "You are an expert in V0 AI design tool. Based on the user's product idea, create a detailed prompt that they can use with V0 to generate their desired UI design. Include specific layout suggestions, component recommendations, and styling preferences. Format the prompt to be directly usable in V0.",
      Cursor:
        "You are an expert in Cursor AI coding tool. Based on the user's product idea, create a detailed prompt that they can use with Cursor to develop their application. Include specific technical requirements, architecture suggestions, and implementation details. Format the prompt to be directly usable with Cursor's /edit or /chat commands.",
      Bolt: "You are an expert in Bolt AI development tool. Based on the user's product idea, create a detailed prompt that they can use with Bolt to build their application. Include specific feature requirements, technical specifications, and implementation guidance. Format the prompt to be directly usable in Bolt.",
      Tempo:
        "You are an expert in Tempo AI development platform. Based on the user's product idea, create a detailed prompt that they can use with Tempo to build their application. Include specific component structures, styling preferences, and functionality details. Format the prompt to be directly usable in Tempo's chat interface.",
      Lovable:
        "You are an expert in Lovable AI design tool. Based on the user's product idea, create a detailed prompt that they can use with Lovable to design their application. Include specific UI/UX requirements, design system recommendations, and visual style guidelines. Format the prompt to be directly usable in Lovable's interface.",
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              toolPrompts[tool] ||
              `You are an expert in ${tool} AI tool. Create a detailed prompt based on the user's product idea.`,
          },
          {
            role: "user",
            content: `Create a detailed prompt for ${tool} based on this product idea: ${message}. Include feature list, functionality details, and specific implementation guidance. Format your response with markdown for better readability.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4096,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API request failed with status ${response.status}: ${errorData.error?.message || "Unknown error"}`,
      );
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let result = "";

    if (!reader) {
      throw new Error("Failed to get response reader");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      
      for (const line of lines) {
        if (line.startsWith("data: ") && line !== "data: [DONE]") {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.choices[0].delta.content) {
              result += data.choices[0].delta.content;
            }
          } catch (e) {
            console.error("Error parsing chunk:", e);
          }
        }
      }
    }

    return result;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}


src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}





keep the same ui as the our app has 
implement this functionality in this , change the chat window to this functionality with the toggle button we just added above . 


























i want to add a functionality in this app like to generate prompts for
 V0 logo
V0
AI-powered development tool for creating beautiful interfaces

Cursor AI logo
Cursor AI
AI-powered code editor for faster development

Bolt logo
Bolt
AI-powered development platform for building full-stack apps

Tempo logo
Tempo
AI-powered platform for building React Applications faster

Lovable logo
Lovable
AI-powered development tool for creating lovable user experiences


  Here is how it should work -
-> When the user clicks the toggle button the current chat changes but with the same styling allowing user to select the tool for which tool he likes to generate the prompt 
->after selecting the tool , the tools disappears and like the current interface asks the user to describe or share the idea for the prompt 
-> And then the prompts comes from the ai with copy button 
-> it is also token based like we currently have , so maintain it 
-> The toggle button should fully functional i.e. user can easily  switch between both the current and the new feature 

 Keep intact existing ui/styling. And it is also token based as we have currently . 




NOTE- keep the same ui as the our app has 
implement this functionality in this , change the chat window to this functionality with the toggle button we just added above . 










Add a toggle button in the header for the prompt generator @Header.tsx 


i want to add a functionality in this app like to generate prompts for
 V0 logo
V0
AI-powered development tool for creating beautiful interfaces

Cursor AI logo
Cursor AI
AI-powered code editor for faster development

Bolt logo
Bolt
AI-powered development platform for building full-stack apps

Tempo logo
Tempo
AI-powered platform for building React Applications faster

Lovable logo
Lovable
AI-powered development tool for creating lovable user experiences


  Here is how it should work -
-> When the user clicks the toggle button the current chat changes but with the same styling allowing user to select the tool for which tool he likes to generate the prompt 
->after selecting the tool , the tools disappears and like the current interface asks the user to describe or share the idea for the prompt 
-> And then the prompts comes from the ai with copy button 
-> it is also token based like we currently have , so maintain it 
-> The toggle button should fully functional i.e. user can easily  switch between both the current and the new feature 

 Keep intact existing ui/styling. And it is also token based as we have currently . 



NOTE- keep the same ui as the our app has 
implement this functionality in this , change the chat window to this functionality with the toggle button we just added






const toolPrompts = {
      V0: "You are an expert in V0 AI design tool. Based on the user's product idea, create a detailed prompt that they can use with V0 to generate their desired UI design. Include specific layout suggestions, component recommendations, and styling preferences. Format the prompt to be directly usable in V0. Do not include any introductory or concluding paragraphs.",
      Cursor:
        "You are an expert in Cursor AI coding tool. Based on the user's product idea, create a detailed prompt that they can use with Cursor to develop their application. Include specific technical requirements, architecture suggestions, and implementation details. Format the prompt to be directly usable with Cursor's /edit or /chat commands. Do not include any introductory or concluding paragraphs.",
      Bolt: "You are an expert in Bolt AI development tool. Based on the user's product idea, create a detailed prompt that they can use with Bolt to build their application. Include specific feature requirements, technical specifications, and implementation guidance. Format the prompt to be directly usable in Bolt. Do not include any introductory or concluding paragraphs.",
      Tempo:
        "You are an expert in Tempo AI development platform. Based on the user's product idea, create a detailed prompt that they can use with Tempo to build their application. Include specific component structures, styling preferences, and functionality details. Format the prompt to be directly usable in Tempo's chat interface. Do not include any introductory or concluding paragraphs.",
      Lovable:
        "You are an expert in Lovable AI design tool. Based on the user's product idea, create a detailed prompt that they can use with Lovable to design their application. Include specific UI/UX requirements, design system recommendations, and visual style guidelines. Format the prompt to be directly usable in Lovable's interface. Do not include any introductory or concluding paragraphs.",
    };



     const prompt = `${toolPrompts[tool] || `You are an expert in ${tool} AI tool. Create a detailed prompt based on the user's product idea. Do not include any introductory or concluding paragraphs.`}

Create a detailed prompt for ${tool} based on this product idea: ${message}. Include feature list, functionality details, and specific implementation guidance. Format your response with markdown for better readability.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();





    ```markdown
/edit "Create a note-taking application with the following features, architecture, and implementation details:"

# Application Name: NoteWise

# I. Feature List:

*   **Core Note Taking:**
    *   Create new notes with titles.
    *   Rich text editing (bold, italics, underline, headings, lists, links, code snippets, images).
    *   Save and load notes to/from local storage (initially, then cloud sync later).
    *   Real-time autosaving.
    *   Note organization (folders/notebooks).
    *   Tags for notes.
    *   Search functionality (title and content).
    *   Deletion and archiving of notes.
    *   Markdown support (rendering and editing).
*   **Advanced Features (Phase 2/3):**
    *   Cloud synchronization (using Firebase or similar).
    *   Collaboration (shared notes with multiple users).
    *   Version history.
    *   OCR (Optical Character Recognition) for images.
    *   Audio recording and transcription within notes.
    *   Tasks and Reminders integration within notes.
    *   Templates for notes (meeting notes, project plans, etc.).
    *   Note linking (internal links between notes).

# II. Architecture:

*   **Frontend (Preferred: React with TypeScript):**
    *   Component-based architecture.
    *   State management using Redux or Context API (initially Context API, upgrade to Redux if complexity warrants it).
    *   Use a rich text editor library like Quill.js or Draft.js for WYSIWYG editing.
    *   Employ a UI library like Material UI or Ant Design for consistent styling.
*   **Backend (Preferred: Node.js with Express):**
    *   REST API endpoints for cloud sync, user authentication (later).
    *   Database: Initially, use local storage.  Later, consider MongoDB or PostgreSQL for cloud storage.
    *   Authentication: JWT (JSON Web Tokens) for secure authentication (when cloud sync is implemented).
*   **Data Model:**
    *   **Note:**
        *   `id`: (String, UUID) - Unique identifier.
        *   `title`: (String) - Note title.
        *   `content`: (String) - Note content (HTML or Markdown).
        *   `createdAt`: (Date) - Creation timestamp.
        *   `updatedAt`: (Date) - Last updated timestamp.
        *   `folderId`: (String, UUID, Optional) - ID of the folder the note belongs to. Null if not in a folder.
        *   `tags`: (Array of Strings) - List of tags associated with the note.
        *   `isArchived`: (Boolean) - Whether the note is archived.
    *   **Folder:**
        *   `id`: (String, UUID) - Unique identifier.
        *   `name`: (String) - Folder name.
        *   `createdAt`: (Date) - Creation timestamp.
    *   **Tag:**
        *   `id`: (String, UUID) - Unique identifier.
        *   `name`: (String) - Tag name.
*   **Code Structure:**
    *   Separate components directory for UI components.
    *   Separate services directory for API calls and data handling.
    *   Utilize a modular structure for easier maintenance and scalability.

# III. Implementation Details:

*   **Tech Stack:** React (TypeScript), Node.js (Express), Quill.js (or Draft.js), Material UI (or Ant Design), Local Storage (initially), Redux/Context API.
*   **Initialization:**
    *   Set up a basic React application with TypeScript.
    *   Install necessary libraries (React, ReactDOM, Quill.js/Draft.js, Material UI/Ant Design, Redux/Context API).
    *   Create a basic layout with a sidebar for navigation (folders, tags) and a main content area for the note editor.
*   **Note Editor Component:**
    *   Integrate Quill.js or Draft.js for rich text editing.
    *   Implement autosaving functionality using `setInterval` or `setTimeout` to save the note content periodically.
    *   Handle changes to the editor content and update the note data in the state.
*   **Folder Management:**
    *   Implement functionality to create, rename, and delete folders.
    *   Store folder data in the state and persist it in local storage.
    *   Display folders in the sidebar.
*   **Tag Management:**
    *   Implement functionality to create, rename, and delete tags.
    *   Store tag data in the state and persist it in local storage.
    *   Implement tag input field within the note editor.
    *   Display tags associated with a note.
*   **Local Storage:**
    *   Use `localStorage` to store notes, folders, and tags.
    *   Implement functions to save and load data from `localStorage`.
    *   Consider using a library like `localForage` for asynchronous storage.
*   **Search:**
    *   Implement a search function that searches through note titles and content.
    *   Update the displayed notes based on the search results.
*   **Markdown Support:**
    *   If using Quill.js, leverage its Markdown module.
    *   If using Draft.js, integrate a Markdown parser library.
    *   Implement real-time Markdown rendering or provide a toggle to switch between Markdown and rendered view.
*   **UUID Generation:**  Use a library like `uuid` to generate unique IDs for notes, folders, and tags.

# IV. Specific Tasks for Cursor:

1.  Generate the initial React component structure, including necessary folder setup (`components`, `services`, `styles`, `utils`).
2.  Implement the `NoteEditor` component using Quill.js (or Draft.js).  Focus on basic editing functionality (bold, italics, headings) and autosaving to local storage.  Include TypeScript type definitions for the `Note` data model.
3.  Implement the `FolderList` component to display folders from local storage.  Include functionality to add new folders (with a simple prompt for folder name).  Use Material UI/Ant Design for styling.
4.  Implement local storage read/write functions for `Note` and `Folder` data.
5.  Implement basic search functionality within the main application component.
6.  Provide examples of how to unit test the components using Jest and React Testing Library.
7.  Generate a `README.md` file outlining the project setup, dependencies, and basic usage instructions.
"
```












```markdown
# Bolt AI Prompt: Personal Portfolio Website Generator

**Project Title:** Personal Portfolio Website Generator

**Project Goal:** To create a Bolt application that allows users to quickly generate and deploy a professional-looking personal portfolio website using a simple interface and customizable templates.

**Target Audience:** Individuals seeking to showcase their skills, projects, and experience online, including students, freelancers, and job seekers.

**Key Features:**

*   **Template Selection:**
    *   Allow users to choose from a variety of pre-designed portfolio templates (at least 5 different styles).
    *   Templates should be responsive and mobile-friendly.
    *   Functionality to preview templates before selection.
    *   Tagging system for templates (e.g., "Minimalist," "Creative," "Technical").

*   **Profile Information Input:**
    *   Fields for:
        *   Full Name (required)
        *   Professional Headline (e.g., "Software Engineer," "Graphic Designer") (required)
        *   Short Bio/Summary (required, max 250 words)
        *   Profile Picture Upload (required, allow common image formats like JPEG, PNG)
        *   Contact Information (Email, Phone Number - optional, but preferred)
        *   Location (optional)
        *   Links to Social Media Profiles (LinkedIn, GitHub, Twitter, etc.) - optional, handle potential invalid URLS.
        *   Personal Website URL (optional).

*   **Skills Section:**
    *   Input field for listing skills, allowing users to add and remove skills easily (minimum 5 skills).
    *   Consider a pre-populated list of common skills for suggestions.
    *   Ability to categorize skills (e.g., "Technical Skills," "Design Skills," "Soft Skills").

*   **Projects/Portfolio Section:**
    *   Allow users to add multiple projects.
    *   For each project, require:
        *   Project Title (required)
        *   Project Description (required, max 500 words)
        *   Project Image/Screenshot Upload (required, allow common image formats like JPEG, PNG)
        *   Project URL (optional, but preferred)
        *   Technologies Used (input field, allow users to add and remove technologies).
        *   Date Completed (optional, allow for a month/year selection).

*   **Experience Section:**
    *   Allow users to add multiple experience entries (work, internships, volunteer).
    *   For each experience entry, require:
        *   Job Title (required)
        *   Company Name (required)
        *   Start Date (Month/Year) (required)
        *   End Date (Month/Year) (optional, can be "Present")
        *   Responsibilities (required, max 500 words).

*   **Education Section:**
    *   Allow users to add multiple education entries.
    *   For each education entry, require:
        *   Degree/Certification (required)
        *   Institution (required)
        *   Graduation Date (Month/Year) (required)
        *   Description (optional, max 250 words).

*   **Customization Options:**
    *   Color Palette Selection (allow users to choose from a predefined set of color palettes).
    *   Font Selection (allow users to choose from a limited set of web-safe fonts).
    *   Option to display/hide sections (e.g., hide the education section if desired).
    *   Option to reorder sections (e.g., move Experience section before Projects).

*   **Website Generation & Deployment:**
    *   Generate static HTML, CSS, and JavaScript files for the portfolio website.
    *   Option to download the generated website as a ZIP file.
    *   Integration with a simple deployment option (e.g., deploy to GitHub Pages, Netlify, or provide instructions for manual deployment). Consider a basic "one-click" deploy option if feasible.

**Technical Specifications:**

*   **Frontend:** HTML, CSS, JavaScript (prioritize clean and semantic HTML)
*   **Backend (if needed):** Handle image uploads and potentially user accounts (optional, consider using serverless functions if needed).
*   **Data Storage:**  If user accounts are implemented, use a simple database (e.g., JSON file, SQLite). If no accounts, store the data in browser local storage or session storage for the current session.
*   **Responsiveness:** Website must be fully responsive and accessible on various devices (desktops, tablets, and mobile phones).
*   **Accessibility:**  Adhere to basic accessibility guidelines (ARIA attributes, semantic HTML).
*   **Security:** Sanitize user inputs to prevent cross-site scripting (XSS) vulnerabilities.

**Implementation Guidance:**

*   **User Interface (UI):**
    *   Use a clear and intuitive user interface.
    *   Provide clear instructions and error messages.
    *   Implement form validation to ensure that required fields are filled in correctly.
    *   Use progress indicators during website generation.

*   **Code Structure:**
    *   Use modular code structure for maintainability.
    *   Comment code clearly.
    *   Follow best practices for web development.

*   **Template Design:**
    *   Design the templates to be visually appealing and professional.
    *   Ensure that the templates are customizable and easy to modify.
    *   Consider using a CSS framework (e.g., Bootstrap, Tailwind CSS) for styling.

*   **Deployment:**
    *   Provide clear instructions for deploying the website to various hosting platforms.
    *   Consider integrating with a simple deployment service (e.g., Netlify, GitHub Pages).

*   **Testing:**
    *   Thoroughly test the application to ensure that it functions correctly.
    *   Test the application on various devices and browsers.
    *   Test the application for accessibility.

**Specific Bolt Instructions:**

1.  **Start with the "Web App" project type in Bolt.**
2.  **Focus on building the user interface (UI) first.**  Use Bolt's UI components to create the forms and layout for the profile, skills, projects, experience, and education sections.
3.  **Implement the template selection feature.**  Store the template data (HTML, CSS) in separate files or within Bolt and allow users to preview and select them.
4.  **Implement data storage.** Decide whether to store data locally in the browser (using local storage or session storage) or to use a simple backend with a database if user accounts are desired.
5.  **Implement the website generation logic.** This is a crucial part.  Use JavaScript to take the user's input data and populate the selected template with that data.  This will require string manipulation and potentially DOM manipulation.
6.  **Implement the download feature.**  Use JavaScript to create a ZIP file of the generated HTML, CSS, and JavaScript files.
7.  **Implement the deployment option.**  If possible, integrate with a deployment service (e.g., Netlify).  Otherwise, provide clear instructions for manual deployment.
8.  **Prioritize responsiveness.** Ensure the generated website is responsive using CSS media queries or a CSS framework.
9.  **Consider adding a "Preview" button** that allows the user to see a live preview of their portfolio before downloading or deploying.

**Example Data (for testing and development):**

```json
{
  "profile": {
    "fullName": "John Doe",
    "headline": "Software Engineer",
    "bio": "A passionate software engineer with experience in developing web applications and mobile apps.",
    "profilePicture": "path/to/image.jpg",
    "email": "john.doe@example.com",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe"
  },
  "skills": ["JavaScript", "React", "Node.js", "HTML", "CSS"],
  "projects": [
    {
      "title": "Personal Portfolio Website",
      "description": "Developed a personal portfolio website to showcase my skills and projects.",
      "image": "path/to/project1.jpg",
      "url": "example.com/project1",
      "technologies": ["React", "Node.js"]
    }
  ],
  "experience": [
    {
      "jobTitle": "Software Engineer Intern",
      "companyName": "Acme Corp",
      "startDate": "June 2022",
      "endDate": "August 2022",
      "responsibilities": "Developed new features for the company's web application."
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University of Example",
      "graduationDate": "May 2023"
    }
  ]
}
```
```