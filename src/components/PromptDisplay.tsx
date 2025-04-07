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
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = prompt;
      
      // Make the textarea out of viewport
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      
      // Focus and select the text
      textArea.focus();
      textArea.select();
      
      try {
        // Try using the modern clipboard API first
        await navigator.clipboard.writeText(prompt);
      } catch (err) {
        // Fallback to the older execCommand method
        document.execCommand('copy');
      }
      
      // Clean up
      document.body.removeChild(textArea);
      
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
    <div className="bg-amp-dark-blue/50 p-2 sm:p-3 md:p-4 rounded-lg border border-amp-cyan/20 w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
        <h3 className="font-pixel text-amp-cyan text-sm sm:text-base md:text-lg break-words">
          Generated Prompt for {toolName}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-amp-cyan hover:text-amp-cyan/80 self-end sm:self-auto"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="bg-black/20 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm text-amp-gray overflow-x-auto">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-amp-cyan text-base sm:text-lg md:text-xl font-bold mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-amp-cyan text-sm sm:text-base md:text-lg font-semibold mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-amp-cyan text-xs sm:text-sm md:text-base font-medium mb-2">{children}</h3>,
            p: ({ children }) => <p className="mb-2 last:mb-0 break-words">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1 last:mb-0">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1 last:mb-0">{children}</ol>,
            li: ({ children }) => <li className="mb-1 last:mb-0 break-words">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children }) => (
              <code className="bg-black/30 px-1 py-0.5 rounded text-amp-cyan break-words">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-black/30 p-2 rounded overflow-x-auto mb-2 last:mb-0 text-amp-cyan whitespace-pre-wrap">
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