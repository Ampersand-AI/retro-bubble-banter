import React from 'react';
import { Button } from './ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from './ui/use-toast';
import ReactMarkdown from 'react-markdown';

interface PromptDisplayProps {
  prompt: string;
  toolName: string;
}

const PromptDisplay = ({ prompt, toolName }: PromptDisplayProps) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy prompt",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-amp-dark-blue/50 p-4 rounded-lg border border-amp-cyan/20">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-pixel text-amp-cyan">Generated Prompt for {toolName}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-amp-cyan hover:text-amp-cyan/80"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="bg-black/20 p-3 rounded-md font-mono text-sm text-amp-gray overflow-hidden">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-amp-cyan text-lg font-bold mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-amp-cyan text-base font-semibold mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-amp-cyan text-sm font-medium mb-2">{children}</h3>,
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1 last:mb-0">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1 last:mb-0">{children}</ol>,
            li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children }) => (
              <code className="bg-black/30 px-1 py-0.5 rounded text-amp-cyan">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-black/30 p-2 rounded overflow-x-auto mb-2 last:mb-0 text-amp-cyan">
                {children}
              </pre>
            ),
          }}
        >
          {prompt}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default PromptDisplay; 