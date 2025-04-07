import { AIModel } from '../config/apiConfig';

export interface TerminalCommand {
  command: string;
  description: string;
  handler: (args: string[]) => { message: string; isCommand: boolean; shouldSendMessage: boolean };
}

export const createTerminalCommands = (
  setIsPromptMode: (mode: boolean) => void,
  setSelectedModel: (model: AIModel) => void,
  setSelectedSubModel: (subModel: string) => void,
  handleSendMessage: (message: string, model: AIModel, subModel: string, counter: number) => void,
  setMessages: (messages: any[]) => void
): TerminalCommand[] => {
  return [
    {
      command: 'clear',
      description: 'Clear the chat screen',
      handler: () => {
        setMessages([]);
        return { 
          message: 'Chat cleared', 
          isCommand: true,
          shouldSendMessage: false
        };
      }
    },
    {
      command: 'mode',
      description: 'Switch between chat and prompt modes',
      handler: (args) => {
        if (args[0] === 'prompt') {
          setIsPromptMode(true);
          localStorage.setItem('chatMode', 'prompt');
          return { 
            message: 'Switched to prompt mode', 
            isCommand: true,
            shouldSendMessage: false
          };
        } else if (args[0] === 'chat') {
          setIsPromptMode(false);
          localStorage.setItem('chatMode', 'chat');
          return { 
            message: 'Switched to chat mode', 
            isCommand: true,
            shouldSendMessage: false
          };
        } else {
          return { 
            message: 'Invalid mode. Use: mode [prompt|chat]', 
            isCommand: true,
            shouldSendMessage: true
          };
        }
      }
    },
    {
      command: 'model',
      description: 'Switch between AI models',
      handler: (args) => {
        const validModels = ['openai', 'claude', 'gemini', 'deepseek', 'grok'];
        if (validModels.includes(args[0])) {
          setSelectedModel(args[0] as AIModel);
          setSelectedSubModel(args[0] === 'openai' ? 'gpt-4' : 
                            args[0] === 'claude' ? 'claude-3-opus' :
                            args[0] === 'gemini' ? 'gemini-pro' :
                            args[0] === 'deepseek' ? 'deepseek-chat' : 'grok-1');
          return { 
            message: `Switched to ${args[0]} model`, 
            isCommand: true,
            shouldSendMessage: false
          };
        } else {
          return { 
            message: 'Invalid model. Use: model [openai|claude|gemini|deepseek|grok]', 
            isCommand: true,
            shouldSendMessage: true
          };
        }
      }
    },
    {
      command: 'help',
      description: 'Show available commands',
      handler: () => {
        return { 
          message: `
Available commands:
- clear: Clear the chat screen
- mode [prompt|chat]: Switch between chat and prompt modes
- model [openai|claude|gemini|deepseek|grok]: Switch between AI models
- help: Show this help message
          `.trim(),
          isCommand: true,
          shouldSendMessage: true
        };
      }
    }
  ];
};

export const handleTerminalCommand = (
  input: string,
  commands: TerminalCommand[]
): { message: string; isCommand: boolean; shouldSendMessage: boolean } => {
  if (!input.startsWith('/')) return { message: '', isCommand: false, shouldSendMessage: false };
  
  const [command, ...args] = input.slice(1).split(' ');
  const cmd = commands.find(c => c.command === command);
  
  if (cmd) {
    return cmd.handler(args);
  }
  
  return { 
    message: `Unknown command: ${command}. Use /help to see available commands.`,
    isCommand: true,
    shouldSendMessage: true
  };
}; 