
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIModel } from './ModelSelect';

interface TokenStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: Array<{
    id: number;
    text: string;
    isAi: boolean;
    tokenCount?: {
      input: number;
      output: number;
    };
  }>;
}

const TokenStatsDialog = ({ open, onOpenChange, messages }: TokenStatsDialogProps) => {
  // Calculate token stats by model
  const tokenStatsByModel: Record<AIModel | string, { input: number; output: number }> = {};
  let totalInput = 0;
  let totalOutput = 0;

  messages.forEach(message => {
    if (message.tokenCount) {
      // Extract model information (if available)
      let modelName: string = 'unknown';
      
      // Check if the message is about switching to a specific model
      if (message.isAi && message.text.startsWith('Switched to')) {
        const modelMatch = message.text.match(/Switched to (\w+) model/i);
        if (modelMatch && modelMatch[1]) {
          modelName = modelMatch[1].toLowerCase();
        }
      } else {
        // Try to infer model from previous messages
        for (let i = messages.indexOf(message) - 1; i >= 0; i--) {
          const prevMessage = messages[i];
          if (prevMessage.isAi && prevMessage.text.startsWith('Switched to')) {
            const modelMatch = prevMessage.text.match(/Switched to (\w+) model/i);
            if (modelMatch && modelMatch[1]) {
              modelName = modelMatch[1].toLowerCase();
              break;
            }
          }
        }
      }

      // Add to stats
      if (!tokenStatsByModel[modelName]) {
        tokenStatsByModel[modelName] = { input: 0, output: 0 };
      }
      
      tokenStatsByModel[modelName].input += message.tokenCount.input;
      tokenStatsByModel[modelName].output += message.tokenCount.output;
      
      totalInput += message.tokenCount.input;
      totalOutput += message.tokenCount.output;
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-amp-blue border-2 border-amp-cyan text-amp-cyan p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-pixel mb-4 text-center">Token Usage Statistics</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {Object.entries(tokenStatsByModel).map(([model, stats]) => (
            <div key={model} className="border border-amp-cyan p-3 rounded">
              <h3 className="text-lg capitalize mb-2">{model === 'unknown' ? 'Default' : model} Model</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-red-500">Input: {stats.input} tokens</div>
                <div className="text-orange-500">Output: {stats.output} tokens</div>
                <div className="text-amp-cyan col-span-2">Total: {stats.input + stats.output} tokens</div>
              </div>
            </div>
          ))}
          
          <div className="border-2 border-amp-cyan p-3 rounded mt-4 bg-amp-blue/50">
            <h3 className="text-lg font-bold mb-2">Grand Total</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-red-500">Input: {totalInput} tokens</div>
              <div className="text-orange-500">Output: {totalOutput} tokens</div>
              <div className="text-green-500 font-bold col-span-2">
                Total: {totalInput + totalOutput} tokens
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenStatsDialog;
