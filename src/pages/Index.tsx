
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ChatArea from '../components/ChatArea';
import InputSection from '../components/InputSection';

interface Message {
  id: number;
  text: string;
  isAi: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Amp AI, your retro-futuristic assistant. How can I help you today?",
      isAi: true
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(2);

  const simulateResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // List of possible AI responses
    const responses = [
      "I've processed your request with my 8-bit logic circuits. How else can I assist you?",
      "Interesting input! My pixel-based algorithms are working on a solution for you.",
      "Beep boop! That's a great question. Let me calculate the most optimal response...",
      "My retro processors are analyzing your request. Is there anything specific you're looking for?",
      "According to my database, that's a fascinating topic! Would you like to know more?",
      "I've saved your input to my primitive memory banks. What shall we discuss next?",
      `"${userMessage}" - I find this intriguing! Let's explore this further.`,
      "My 8-bit wisdom suggests that we should delve deeper into this subject. What do you think?"
    ];
    
    // Choose a random response
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Simulate typing delay (1.5 to 3 seconds)
    const typingDelay = 1500 + Math.random() * 1500;
    
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: messageIdCounter + 1,
          text: randomResponse,
          isAi: true
        }
      ]);
      setMessageIdCounter(prev => prev + 2);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleSendMessage = (message: string) => {
    // Add user message
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: messageIdCounter,
        text: message,
        isAi: false
      }
    ]);
    setMessageIdCounter(prev => prev + 1);
    
    // Simulate AI response
    simulateResponse(message);
  };

  // Sound effects for UI interactions (subtle blips and bloops)
  useEffect(() => {
    const handleClick = () => {
      // This would play a sound effect in a full implementation
      console.log("Click sound effect would play here");
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-amp-blue overflow-hidden">
      <Header />
      <ChatArea messages={messages} isTyping={isTyping} />
      <InputSection onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Index;
