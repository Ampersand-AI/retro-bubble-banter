import { API_KEYS, Message } from '../config/apiConfig';
import { estimateTokens, simulateResponse } from '../utils/tokenUtils';

type ClaudeMessage = {
  role: string;
  content: string;
};

// OpenAI API fetch function
export const fetchOpenAIResponse = async (userMessage: string, subModel: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.openai}`
      },
      body: JSON.stringify({
        model: subModel || 'gpt-4o-mini',
        messages: [
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return {
        text: `Error: ${errorData.error?.message || "Unknown error with OpenAI API"}`,
        tokenCount: {
          input: estimateTokens(userMessage),
          output: 0
        }
      };
    }
    
    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || simulateResponse(userMessage).text;
    
    return {
      text: aiResponse,
      tokenCount: {
        input: data.usage?.prompt_tokens || estimateTokens(userMessage),
        output: data.usage?.completion_tokens || estimateTokens(aiResponse)
      }
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      text: `Error communicating with OpenAI. Please try again.`,
      tokenCount: {
        input: estimateTokens(userMessage),
        output: 0
      }
    };
  }
};

// Claude API fetch function
export const fetchClaudeResponse = async (userMessage: string | ClaudeMessage[], subModel: string) => {
  try {
    // Format messages for Claude API
    const formattedMessages = Array.isArray(userMessage)
      ? userMessage.map(msg => ({
          role: msg.role || 'user',
          content: msg.content || ''
        }))
      : [{ role: 'user', content: userMessage }]

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claude-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`,
        'x-test-request': 'true'
      },
      body: JSON.stringify({
        messages: formattedMessages,
        model: subModel || 'claude-3.7-sonnet'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error details:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle both old and new response formats
    if (typeof userMessage === 'string') {
      return {
        text: data.content[0].text,
        tokenCount: {
          input: data.usage?.input_tokens || 0,
          output: data.usage?.output_tokens || 0
        }
      };
    } else {
      return {
        role: data.role || 'assistant',
        content: data.content[0].text,
        timestamp: new Date().toISOString(),
        model: data.model,
        stop_reason: data.stop_reason,
        stop_sequence: data.stop_sequence
      };
    }
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
};

// Gemini API fetch function
export const fetchGeminiResponse = async (userMessage: string, subModel: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${subModel || 'gemini-1.5-flash'}:generateContent?key=${API_KEYS.gemini}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: userMessage }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 1000
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return {
        text: `Error: ${errorData.error?.message || "Unknown error with Gemini API"}`,
        tokenCount: {
          input: estimateTokens(userMessage),
          output: 0
        }
      };
    }
    
    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || simulateResponse(userMessage).text;
    
    return {
      text: aiResponse,
      tokenCount: {
        input: data.usage?.prompt_tokens || estimateTokens(userMessage),
        output: data.usage?.completion_tokens || estimateTokens(aiResponse)
      }
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      text: `Error communicating with Gemini. Please try again.`,
      tokenCount: {
        input: estimateTokens(userMessage),
        output: 0
      }
    };
  }
};

// DeepSeek API fetch function
export const fetchDeepSeekResponse = async (userMessage: string, subModel: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.deepseek}`
      },
      body: JSON.stringify({
        model: subModel || 'deepseek-chat',
        messages: [
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("DeepSeek API error:", errorData);
      return {
        text: `Error: ${errorData.error?.message || "Unknown error with DeepSeek API"}`,
        tokenCount: {
          input: estimateTokens(userMessage),
          output: 0
        }
      };
    }
    
    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || simulateResponse(userMessage).text;
    
    return {
      text: aiResponse,
      tokenCount: {
        input: data.usage?.prompt_tokens || estimateTokens(userMessage),
        output: data.usage?.completion_tokens || estimateTokens(aiResponse)
      }
    };
  } catch (error) {
    console.error("DeepSeek API error:", error);
    return {
      text: `Error communicating with DeepSeek. Please try again.`,
      tokenCount: {
        input: estimateTokens(userMessage),
        output: 0
      }
    };
  }
};

// Grok API fetch function
export const fetchGrokResponse = async (userMessage: string, subModel: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.grok}`
      },
      body: JSON.stringify({
        model: subModel || 'grok-1',
        messages: [
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Grok API error:", errorData);
      return {
        text: `Error: ${errorData.error?.message || "Unknown error with Grok API"}`,
        tokenCount: {
          input: estimateTokens(userMessage),
          output: 0
        }
      };
    }
    
    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || simulateResponse(userMessage).text;
    
    return {
      text: aiResponse,
      tokenCount: {
        input: data.usage?.prompt_tokens || estimateTokens(userMessage),
        output: data.usage?.completion_tokens || estimateTokens(aiResponse)
      }
    };
  } catch (error) {
    console.error("Grok API error:", error);
    return {
      text: `Error communicating with Grok. Please try again.`,
      tokenCount: {
        input: estimateTokens(userMessage),
        output: 0
      }
    };
  }
};
