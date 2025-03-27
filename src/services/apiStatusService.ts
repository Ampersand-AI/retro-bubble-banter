import { API_KEYS } from '../config/apiConfig';

// Test OpenAI API availability
export const testOpenAIApi = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEYS.openai}`
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.status === 200;
  } catch (error) {
    console.error("OpenAI API test error:", error);
    return false;
  }
};

// Test Claude API availability
export const testClaudeApi = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claude-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`,
        'x-test-request': 'true'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message.'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API test error details:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return true;
  } catch (error) {
    console.error('Claude API test error:', error);
    return false;
  }
};

// Test Gemini API availability
export const testGeminiApi = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${API_KEYS.gemini}`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.status === 200;
  } catch (error) {
    console.error("Gemini API error:", error);
    return false;
  }
};

export const testDeepSeekApi = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.deepseek}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1
      })
    });
    return response.ok;
  } catch (error) {
    console.error('DeepSeek API test failed:', error);
    return false;
  }
};

export const testGrokApi = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://api.x.ai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEYS.grok}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Grok API test failed:', error);
    return false;
  }
};
