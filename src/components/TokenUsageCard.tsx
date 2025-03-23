
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: number;
  text: string;
  isAi: boolean;
  tokenCount?: {
    input: number;
    output: number;
  };
}

interface TokenUsageCardProps {
  messages: Message[];
}

const TokenUsageCard = ({ messages }: TokenUsageCardProps) => {
  // Calculate estimated token usage
  const estimateTokens = (text: string): number => {
    // Rough estimate: ~4 chars per token for English text
    return Math.ceil(text.length / 4);
  };
  
  // Get the latest conversation (last user message and AI response)
  const getLatestConversation = () => {
    const userMessages = messages.filter(m => !m.isAi);
    const aiMessages = messages.filter(m => m.isAi);
    
    if (userMessages.length === 0) return null;
    
    const lastUserMessage = userMessages[userMessages.length - 1];
    const lastAiMessage = aiMessages[aiMessages.length - 1];
    
    return {
      user: lastUserMessage,
      ai: lastAiMessage,
      userTokens: estimateTokens(lastUserMessage.text),
      aiTokens: lastAiMessage ? estimateTokens(lastAiMessage.text) : 0,
    };
  };
  
  // Get total token usage for the entire conversation
  const getTotalTokenUsage = () => {
    const userTokens = messages
      .filter(m => !m.isAi)
      .reduce((sum, m) => sum + estimateTokens(m.text), 0);
      
    const aiTokens = messages
      .filter(m => m.isAi)
      .reduce((sum, m) => sum + estimateTokens(m.text), 0);
      
    return { userTokens, aiTokens, total: userTokens + aiTokens };
  };
  
  const latestConversation = getLatestConversation();
  const totalUsage = getTotalTokenUsage();
  
  return (
    <Card className="w-[250px] h-auto bg-amp-blue border-0 relative overflow-hidden">
      {/* Gradient Border */}
      <div className="absolute inset-0 p-[2px] rounded-lg bg-gradient-to-br from-green-400 to-blue-500 -z-10" />
      <div className="absolute inset-[2px] bg-amp-blue rounded-lg -z-5" />
      
      <CardHeader className="pb-2">
        <CardTitle className="text-amp-cyan text-xl font-pixel">Token Usage</CardTitle>
      </CardHeader>
      
      <CardContent className="text-amp-gray">
        <div className="space-y-6">
          {latestConversation && (
            <div className="space-y-2">
              <h3 className="text-amp-cyan text-sm">Latest Exchange</h3>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <span>User Input:</span>
                <span className="text-green-400">{latestConversation.userTokens} tokens</span>
                <span>AI Response:</span>
                <span className="text-blue-400">{latestConversation.aiTokens} tokens</span>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-amp-cyan text-sm">Session Totals</h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span>User Input:</span>
              <span className="text-green-400">{totalUsage.userTokens} tokens</span>
              <span>AI Output:</span>
              <span className="text-blue-400">{totalUsage.aiTokens} tokens</span>
              <span className="font-semibold">Total:</span>
              <span className="text-amp-cyan font-semibold">{totalUsage.total} tokens</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenUsageCard;
