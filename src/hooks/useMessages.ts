import { useState, useCallback } from 'react';
import { Message, AIModel } from '../config/apiConfig';
import { estimateTokens, checkModelIdentityQuestion, getIdentityResponse } from '../utils/tokenUtils';
import { 
  fetchOpenAIResponse, 
  fetchClaudeResponse, 
  fetchGeminiResponse,
  fetchDeepSeekResponse,
  fetchGrokResponse 
} from '../services/apiService';
import { supabase } from '@/lib/supabase';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to Rovyk by Ampersand! You can experience various premium AI models at a fraction of the cost.",
      isAi: true,
      tokenCount: {
        input: 0,
        output: 0  // Set to 0 to not count tokens for welcome message
      }
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(2);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const addMessage = useCallback(async (message: Message) => {
    console.log('Adding message:', message);
    setMessages(prevMessages => [...prevMessages, message]);

    // Save message to chat history if it's not the welcome message
    if (message.id !== 1) {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('Current user:', user);
        
        if (userError) {
          console.error('Error getting user:', userError);
          throw userError;
        }

        if (user) {
          console.log('Current conversation ID:', currentConversationId);
          
          // If this is the first message in a conversation, create a new conversation ID
          if (!currentConversationId) {
            console.log('Creating new conversation');
            const conversationId = crypto.randomUUID();
            console.log('Generated conversation ID:', conversationId);
            
            // First, insert the message with the new conversation ID
            const { error: insertError } = await supabase
              .from('chat_history')
              .insert({
                user_id: user.id,
                message: message.text,
                is_ai: message.isAi,
                model: message.model || 'default',
                token_count: message.tokenCount,
                conversation_id: conversationId
              });

            if (insertError) {
              console.error('Error inserting message:', insertError);
              throw insertError;
            }

            // Then fetch the inserted message to get the conversation ID
            const { data: insertedMessage, error: fetchError } = await supabase
              .from('chat_history')
              .select('conversation_id')
              .eq('user_id', user.id)
              .eq('message', message.text)
              .single();

            if (fetchError) {
              console.error('Error fetching inserted message:', fetchError);
              throw fetchError;
            }

            if (insertedMessage) {
              console.log('Set conversation ID:', insertedMessage.conversation_id);
              setCurrentConversationId(insertedMessage.conversation_id);
            }
          } else {
            console.log('Adding message to existing conversation:', currentConversationId);
            const { error } = await supabase
              .from('chat_history')
              .insert({
                user_id: user.id,
                message: message.text,
                is_ai: message.isAi,
                model: message.model || 'default',
                token_count: message.tokenCount,
                conversation_id: currentConversationId
              });

            if (error) {
              console.error('Error adding message to conversation:', error);
              throw error;
            }
          }
        }
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [currentConversationId]);

  const setMessagesWithReset = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
    setCurrentConversationId(null); // Reset conversation ID when loading a new chat
  }, []);

  const addModelSwitchMessage = useCallback((model: AIModel, counter: number) => {
    const switchMessage = {
      id: counter,
      text: `Switched to ${model.charAt(0).toUpperCase() + model.slice(1)} model.`,
      isAi: true,
      tokenCount: {
        input: 0,
        output: 0  // Set to 0 to not count tokens for model switch messages
      }
    };
    
    addMessage(switchMessage);
    return counter + 1;
  }, [addMessage]);

  const handleSendMessage = useCallback(async (message: string, model: AIModel, subModel: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: messageIdCounter,
      text: message,
      isAi: false,
      model: subModel,
      tokenCount: {
        input: estimateTokens(message),
        output: 0
      }
    };

    setMessageIdCounter(prev => prev + 1);
    await addMessage(userMessage);

    setIsTyping(true);

    try {
      let response;
      switch (model) {
        case 'openai':
          response = await fetchOpenAIResponse(message, subModel);
          break;
        case 'claude':
          response = await fetchClaudeResponse(message, subModel);
          break;
        case 'gemini':
          response = await fetchGeminiResponse(message, subModel);
          break;
        case 'deepseek':
          response = await fetchDeepSeekResponse(message, subModel);
          break;
        case 'grok':
          response = await fetchGrokResponse(message, subModel);
          break;
        default:
          response = await fetchOpenAIResponse(message, subModel);
      }

      const aiMessage: Message = {
        id: messageIdCounter + 1,
        text: response.text,
        isAi: true,
        model: subModel,
        tokenCount: response.tokenCount
      };

      setMessageIdCounter(prev => prev + 2);
      await addMessage(aiMessage);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: messageIdCounter + 1,
        text: "Sorry, I encountered an error. Please try again.",
        isAi: true,
        model: subModel,
        tokenCount: {
          input: 0,
          output: 0
        }
      };
      setMessageIdCounter(prev => prev + 2);
      await addMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  }, [messageIdCounter, addMessage]);

  return {
    messages,
    isTyping,
    messageIdCounter,
    setMessageIdCounter,
    addModelSwitchMessage,
    handleSendMessage,
    setMessages: setMessagesWithReset
  };
};
