import React, { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import { Message } from '@/config/apiConfig';

interface ChatHistoryProps {
  userId: string;
  onSelectChat: (messages: Message[]) => void;
}

interface ChatMessage {
  id: string;
  message: string;
  is_ai: boolean;
  model: string;
  token_count: {
    input: number;
    output: number;
  };
  created_at: string;
  conversation_id: string;
}

interface Conversation {
  id: string;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageTime: string;
}

const ChatHistory = ({ userId, onSelectChat }: ChatHistoryProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChatHistory();
  }, [userId]);

  const loadChatHistory = async () => {
    try {
      console.log('Loading chat history for user:', userId);
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat history:', error);
        throw error;
      }

      console.log('Fetched chat history:', data);

      // Group messages by conversation
      const groupedMessages = data.reduce((acc: { [key: string]: ChatMessage[] }, message) => {
        const conversationId = message.conversation_id || message.id;
        if (!acc[conversationId]) {
          acc[conversationId] = [];
        }
        acc[conversationId].push(message);
        return acc;
      }, {});

      // Convert grouped messages to conversations
      const conversationList = Object.entries(groupedMessages).map(([id, messages]) => {
        const sortedMessages = messages.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        return {
          id,
          messages: sortedMessages,
          lastMessage: sortedMessages[sortedMessages.length - 1].message,
          lastMessageTime: sortedMessages[sortedMessages.length - 1].created_at
        };
      });

      console.log('Processed conversations:', conversationList);
      setConversations(conversationList);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast('Failed to load chat history', {
        style: {
          background: '#f44336',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('conversation_id', conversationId);

      if (error) throw error;

      setConversations(conversations.filter(conv => conv.id !== conversationId));
      toast('Chat deleted successfully', {
        style: {
          background: '#4CAF50',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast('Failed to delete chat', {
        style: {
          background: '#f44336',
          color: '#fff',
        },
      });
    }
  };

  const handleSelectChat = async (conversationId: string) => {
    try {
      const conversation = conversations.find(conv => conv.id === conversationId);
      if (!conversation) return;

      // Convert the chat history data to the Message format
      const formattedMessages: Message[] = conversation.messages.map((chat, index) => ({
        id: index + 1,
        text: chat.message,
        isAi: chat.is_ai,
        tokenCount: chat.token_count,
        model: chat.model
      }));

      onSelectChat(formattedMessages);
    } catch (error) {
      console.error('Error loading chat:', error);
      toast('Failed to load chat', {
        style: {
          background: '#f44336',
          color: '#fff',
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-amp-cyan">Loading chat history...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-amp-cyan">
        <h2 className="text-amp-cyan font-pixel">Chat History</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {conversations.length === 0 ? (
            <div className="text-center text-amp-gray py-4">
              No chat history yet
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center justify-between p-3 bg-amp-dark-blue rounded-lg border border-amp-cyan hover:bg-amp-dark-blue/80 transition-colors"
              >
                <Button
                  variant="ghost"
                  className="flex-1 text-left text-amp-cyan hover:text-amp-gray"
                  onClick={() => handleSelectChat(conversation.id)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span className="truncate">
                    {conversation.lastMessage.substring(0, 50)}
                    {conversation.lastMessage.length > 50 ? '...' : ''}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-400"
                  onClick={() => handleDeleteChat(conversation.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistory; 