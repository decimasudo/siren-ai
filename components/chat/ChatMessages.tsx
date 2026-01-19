'use client';

import { Message } from '@/types';

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/40 text-center p-8">
        <p>Start a conversation with Siren~<br/>Press and hold the microphone or type below.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`message ${msg.role === 'user' ? 'user' : 'assistant'}`}
        >
          {msg.role === 'assistant' && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-siren-primary to-siren-secondary" />
              <span className="text-sm text-white/60">Siren</span>
            </div>
          )}
          <p className="text-white/90">{msg.content}</p>
        </div>
      ))}
    </div>
  );
}
