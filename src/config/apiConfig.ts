// API configuration and constants

// API Keys for different AI providers
export const API_KEYS = {
  openai: import.meta.env.VITE_OPENAI_API_KEY,
  claude: import.meta.env.VITE_CLAUDE_API_KEY,
  gemini: import.meta.env.VITE_GEMINI_API_KEY,
  deepseek: import.meta.env.VITE_DEEPSEEK_API_KEY,
  grok: import.meta.env.VITE_GROK_API_KEY
};

// Validate that all required environment variables are present
const missingKeys = Object.entries(API_KEYS)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error(
    `Missing required environment variables: ${missingKeys.join(', ')}. ` +
    'Please check your .env file and ensure all API keys are set.'
  );
}

// Default submodels for each AI provider
export const DEFAULT_SUBMODELS = {
  openai: 'gpt-4o',
  claude: 'claude-3-7-sonnet',
  gemini: 'gemini-2.0-flash',
  deepseek: 'Deepseek-V3',
  grok: 'grok-1'
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

export type AIModel = 'openai' | 'claude' | 'gemini' | 'deepseek' | 'grok';
