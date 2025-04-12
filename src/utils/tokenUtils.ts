
// Utility functions for token estimation and handling

// Helper function to estimate token count
export const estimateTokens = (text: string): number => {
  // Rough estimate: ~4 chars per token for English text
  return Math.ceil(text.length / 4);
};

// Function to check if the user is asking about model identity
export const checkModelIdentityQuestion = (text: string): boolean => {
  const identityQuestions = [
    /which (ai|model|llm)/i,
    /what (ai|model|llm)/i,
    /who are you/i,
    /what's your name/i,
    /what is your name/i,
    /are you (claude|openai|gemini|gpt|bard|anthropic)/i,
    /which version/i,
    /made by (anthropic|google|openai)/i,
    /developed by/i,
    /created by/i
  ];
  
  return identityQuestions.some(regex => regex.test(text));
};

// Get standardized identity response
export const getIdentityResponse = (): string => {
  return "I am Rovyk by Neural Paths. I'm here to assist you with any questions or tasks you might have.";
};

// Simulated AI response for when real APIs are unavailable
export const simulateResponse = (userMessage: string) => {
  // Check if user is asking about model identity
  if (checkModelIdentityQuestion(userMessage)) {
    const response = getIdentityResponse();
    return {
      text: response,
      tokenCount: {
        input: estimateTokens(userMessage),
        output: estimateTokens(response)
      }
    };
  }
  
  // List of possible startup-related AI responses
  const responses = [
    "Based on current market trends, startups in this sector typically raise between $1-3M for their seed round.",
    "Venture capital firms usually look for startups with a clear path to profitability within 3-5 years.",
    "For early-stage startups, angel investors often provide capital in exchange for 10-20% equity.",
    "Series A funding typically ranges from $2M to $15M, depending on the industry and growth potential.",
    "The average valuation multiple for SaaS startups is currently 6-10x ARR.",
    "Accelerator programs like Y Combinator take about 7% equity in exchange for mentorship and initial funding.",
    "Term sheets typically include liquidation preferences, anti-dilution provisions, and board seat allocations.",
    "For B2B startups, demonstrating a strong CAC to LTV ratio is crucial when pitching to investors.",
    `Regarding "${userMessage}", many founders overlook the importance of proper cap table management.`,
    "When structuring equity for early employees, a 4-year vesting schedule with a 1-year cliff is standard practice."
  ];
  
  // Choose a random response
  const response = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    text: response,
    tokenCount: {
      input: estimateTokens(userMessage),
      output: estimateTokens(response)
    }
  };
};
