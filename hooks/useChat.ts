'use client';

import { useState, useCallback } from 'react';
import { Message } from '@/types';
import { DEMO_RESPONSES } from '@/lib/constants';

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<string>;
  clearMessages: () => void;
}

export function useChat(demoMode: boolean = false): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string): Promise<string> => {
    if (!content.trim()) return '';
    
    setIsLoading(true);
    
    // Add user message
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      let aiResponse: string;
      
      if (demoMode) {
        // Demo mode - use pre-written responses
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
        aiResponse = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
      } else {
        // API mode
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            history: messages.slice(-8),
          }),
        });
        
        if (!response.ok) {
          throw new Error('API request failed');
        }
        
        const data = await response.json();
        aiResponse = data.response;
      }
      
      // Add AI response
      const assistantMessage: Message = { role: 'assistant', content: aiResponse };
      setMessages(prev => [...prev, assistantMessage]);
      
      return aiResponse;
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = "Hmm, I had trouble connecting~ Could you try again?";
      setMessages(prev => [...prev, { role: 'assistant', content: errorResponse }]);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  }, [messages, demoMode]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
}
