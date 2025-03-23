
// API configuration and constants

// API Keys for different AI providers
export const API_KEYS = {
  openai: "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",
  claude: "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",
  gemini: "AIzaSyBNEgVxG47UOOOzPuOkVVxrb66aQOaZDFo"
};

// Default submodels for each AI provider
export const DEFAULT_SUBMODELS = {
  openai: 'gpt-4o',
  claude: 'claude-3-opus',
  gemini: 'gemini-1.5-pro'
};

export type Message = {
  id: number;
  text: string;
  isAi: boolean;
  tokenCount?: {
    input: number;
    output: number;
  };
};

export type AIModel = 'openai' | 'claude' | 'gemini';
