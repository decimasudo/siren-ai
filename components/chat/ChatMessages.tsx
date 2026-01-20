'use client';

import { Message } from '@/types';
import { useEffect, useRef } from 'react';

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  // Auto-scroll ref
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/40 text-center p-8">
        <p>Start a conversation with Siren~<br/>Press and hold the microphone or type below.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`message flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
        >
          {/* Header: Avatar + Name */}
          <div className={`flex items-center gap-2 mb-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            
            {/* Avatar Circle */}
            {msg.role === 'assistant' ? (
              // Siren's Avatar (Gradient)
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-siren-primary to-siren-secondary flex items-center justify-center shadow-lg shadow-siren-primary/20">
                <span className="text-[10px] text-white font-bold">S</span>
              </div>
            ) : (
              // User's Avatar (White/Gray)
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}

            {/* Name Label */}
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
              {msg.role === 'assistant' ? 'Siren' : 'You'}
            </span>
          </div>

          {/* Message Bubble */}
          <div className={`
            max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed
            ${msg.role === 'user' 
              ? 'bg-white/10 text-white rounded-tr-none' 
              : 'bg-siren-primary/10 border border-siren-primary/20 text-white/90 rounded-tl-none'}
          `}>
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}