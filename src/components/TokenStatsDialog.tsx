
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Copy, Share2, Printer, X } from 'lucide-react';
import { AIModel } from './ModelSelect';
import { toast } from "@/components/ui/use-toast";

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

  // Current date and time for receipt
  const now = new Date();
  const dateTimeString = now.toLocaleString();

  const copyToClipboard = () => {
    let text = "ZACK AI TOKEN USAGE STATISTICS\n\n";
    
    Object.entries(tokenStatsByModel).forEach(([model, stats]) => {
      text += `${model.toUpperCase()} MODEL\n`;
      text += `Input: ${stats.input} tokens\n`;
      text += `Output: ${stats.output} tokens\n`;
      text += `Total: ${stats.input + stats.output} tokens\n\n`;
    });
    
    text += "GRAND TOTAL\n";
    text += `Input: ${totalInput} tokens\n`;
    text += `Output: ${totalOutput} tokens\n`;
    text += `Total: ${totalInput + totalOutput} tokens\n\n`;
    text += `Generated: ${dateTimeString}`;
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Token usage statistics have been copied to clipboard",
    });
  };

  const printStats = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Zack AI Token Usage</title>
            <style>
              body { font-family: monospace; padding: 20px; color: #e6e6e6; background-color: #1a1c21; }
              .container { max-width: 500px; margin: 0 auto; }
              .box { border: 1px solid #00ffff; padding: 16px; margin-bottom: 20px; border-radius: 8px; }
              .title { color: #00ffff; text-align: center; margin-bottom: 24px; }
              .model-name { color: #00ffff; font-size: 18px; margin-bottom: 8px; }
              .input { color: #ff4040; }
              .output { color: #ff8c00; }
              .total { color: #00ff00; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="title">Zack AI Token Usage Statistics</h1>
      `);
      
      Object.entries(tokenStatsByModel).forEach(([model, stats]) => {
        printWindow.document.write(`
          <div class="box">
            <h2 class="model-name">${model === 'unknown' ? 'Default' : model.charAt(0).toUpperCase() + model.slice(1)} Model</h2>
            <p class="input">Input: ${stats.input} tokens</p>
            <p class="output">Output: ${stats.output} tokens</p>
            <p class="total">Total: ${stats.input + stats.output} tokens</p>
          </div>
        `);
      });
      
      printWindow.document.write(`
          <div class="box">
            <h2 class="model-name">Grand Total</h2>
            <p class="input">Input: ${totalInput} tokens</p>
            <p class="output">Output: ${totalOutput} tokens</p>
            <p class="total">Total: ${totalInput + totalOutput} tokens</p>
          </div>
          <div class="footer">Generated: ${dateTimeString}</div>
        </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const shareStats = async () => {
    if (navigator.share) {
      try {
        let text = "ZACK AI TOKEN USAGE STATISTICS\n\n";
        
        Object.entries(tokenStatsByModel).forEach(([model, stats]) => {
          text += `${model.toUpperCase()} MODEL\n`;
          text += `Input: ${stats.input} tokens\n`;
          text += `Output: ${stats.output} tokens\n`;
          text += `Total: ${stats.input + stats.output} tokens\n\n`;
        });
        
        text += "GRAND TOTAL\n";
        text += `Input: ${totalInput} tokens\n`;
        text += `Output: ${totalOutput} tokens\n`;
        text += `Total: ${totalInput + totalOutput} tokens\n\n`;
        text += `Generated: ${dateTimeString}`;
        
        await navigator.share({
          title: 'Zack AI Token Usage',
          text: text
        });
      } catch (error) {
        toast({
          title: "Sharing failed",
          description: "Could not share the token statistics",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support the Web Share API",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-amp-blue border-2 border-amp-cyan text-amp-cyan p-6 max-w-md">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-pixel mb-4 text-center">Token Usage Statistics</DialogTitle>
          <DialogClose className="absolute right-4 top-4 text-amp-gray hover:text-amp-cyan">
            <X size={18} />
          </DialogClose>
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
          
          <div className="text-xs text-amp-gray mt-2 text-center">
            Generated: {dateTimeString}
          </div>
          
          <div className="flex justify-center space-x-4 mt-4">
            <button 
              onClick={copyToClipboard}
              className="flex items-center space-x-1 text-amp-cyan hover:text-amp-gray transition-colors"
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>
            <button 
              onClick={shareStats}
              className="flex items-center space-x-1 text-amp-cyan hover:text-amp-gray transition-colors"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
            <button 
              onClick={printStats}
              className="flex items-center space-x-1 text-amp-cyan hover:text-amp-gray transition-colors"
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenStatsDialog;
