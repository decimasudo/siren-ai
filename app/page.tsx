'use client';

import { useState, useEffect, useRef } from 'react';
import { ViewType } from '@/types';
import { useVoice } from '@/hooks/useVoice';
import { useChat } from '@/hooks/useChat';
import { Orb } from '@/components/ui/Orb';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { VoiceButton } from '@/components/chat/VoiceButton';
import { AffirmationCard } from '@/components/thrive/AffirmationCard';
import { MoodCheckIn } from '@/components/thrive/MoodCheckIn';
import { SleepStories } from '@/components/thrive/SleepStories';
import { TriviaGame } from '@/components/play/TriviaGame';
import { FunFacts } from '@/components/play/FunFacts';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('companion');
  const [demoMode, setDemoMode] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const hasGreetedRef = useRef(false); // Track if we have already greeted the user

  const voice = useVoice();
  const chat = useChat(demoMode);

  // Check if we're in demo mode on mount
  useEffect(() => {
    // In production, API key is on server - check if API works
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test', history: [] }),
    }).then(res => {
      if (res.ok) setDemoMode(false);
    }).catch(() => {});
  }, []);

  // Greeting on first visit, ONLY when the correct voice is ready
  useEffect(() => {
    // We wait until:
    // 1. We haven't greeted yet
    // 2. A voice has been selected (ensuring we don't use the robotic default)
    if (!hasGreetedRef.current && voice.selectedVoice) {
      // Mark as greeted immediately to prevent double greeting
      hasGreetedRef.current = true;
      
      voice.speak("Hey there! I'm Siren, your chill voice companion. Ready to chat, relax, or have some fun? What's up?");
    }
  }, [voice.selectedVoice, voice.speak]);

  // Handle voice input
  useEffect(() => {
    if (voice.transcript) {
      handleSendMessage(voice.transcript);
    }
  }, [voice.transcript]);

  const handleSendMessage = async (message: string) => {
    const response = await chat.sendMessage(message);
    if (response) {
      voice.speak(response);
    }
  };

  const handleVoiceStart = () => {
    voice.stopSpeaking();
    voice.startListening();
  };

  const handleVoiceStop = () => {
    voice.stopListening();
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-siren-primary to-siren-secondary bg-clip-text text-transparent">
          Siren
        </h1>
        
        {/* Navigation */}
        <nav className="flex gap-2">
          {(['companion', 'thrive', 'play'] as ViewType[]).map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`nav-pill ${currentView === view ? 'active' : ''}`}
            >
              {view === 'companion' && '💬'}
              {view === 'thrive' && '🧘'}
              {view === 'play' && '🎮'}
              <span className="ml-2 capitalize hidden sm:inline">{view}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={() => setShowSetup(true)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          ⚙️
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Orb Section */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center p-8">
          <Orb
            isListening={voice.isListening}
            isSpeaking={voice.isSpeaking}
            isThinking={chat.isLoading}
            isPaused={voice.isPaused}
          />
          
          <div className="mt-8 flex items-center gap-4">
            <VoiceButton
              isListening={voice.isListening}
              onMouseDown={handleVoiceStart}
              onMouseUp={handleVoiceStop}
              disabled={voice.isSpeaking}
            />
            {voice.isSpeaking && (
              <button
                onClick={voice.togglePause}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border ${
                  voice.isPaused 
                    ? 'bg-green-500/20 hover:bg-green-500/30 border-green-500/30' 
                    : 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/30'
                }`}
              >
                {voice.isPaused ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-300">
                    <polygon points="5,3 19,12 5,21 5,3"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-300">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  </svg>
                )}
              </button>
            )}
            <span className="text-white/50 text-sm">Hold to speak</span>
          </div>

          {demoMode && (
            <div className="mt-4 px-4 py-2 bg-yellow-500/20 rounded-lg text-yellow-300 text-sm">
              Demo Mode - Configure API key for full experience
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:w-1/2 flex flex-col border-l border-white/10">
          {currentView === 'companion' && (
            <>
              <ChatMessages messages={chat.messages} />
              <ChatInput onSend={handleSendMessage} disabled={chat.isLoading} />
            </>
          )}

          {currentView === 'thrive' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <h2 className="text-2xl font-semibold">Thrive Mode 🧘</h2>
              <MoodCheckIn onSpeak={voice.speak} />
              <AffirmationCard onSpeak={voice.speak} />
              <SleepStories onPlayStory={voice.speak} demoMode={demoMode} />
            </div>
          )}

          {currentView === 'play' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <h2 className="text-2xl font-semibold">Play Mode 🎮</h2>
              <TriviaGame onSpeak={voice.speak} />
              <FunFacts onSpeak={voice.speak} />
            </div>
          )}
        </div>
      </div>

      {/* Setup Modal */}
      {showSetup && (
        <div className="modal-overlay" onClick={() => setShowSetup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-6">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Mode</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDemoMode(true)}
                    className={`flex-1 py-3 rounded-xl transition-all ${
                      demoMode ? 'bg-siren-primary' : 'bg-white/10'
                    }`}
                  >
                    Demo
                  </button>
                  <button
                    onClick={() => setDemoMode(false)}
                    className={`flex-1 py-3 rounded-xl transition-all ${
                      !demoMode ? 'bg-siren-primary' : 'bg-white/10'
                    }`}
                  >
                    API
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Voice</label>
                <select
                  value={voice.selectedVoice?.name || ''}
                  onChange={(e) => {
                    const selected = voice.voices.find(v => v.name === e.target.value);
                    if (selected) voice.setSelectedVoice(selected);
                  }}
                  className="w-full bg-siren-dark border border-white/20 rounded-xl px-4 py-3 text-white"
                >
                  {voice.voices.map((v) => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Speech Rate: {voice.rate.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voice.rate}
                  onChange={(e) => voice.setRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Speech Pitch: {voice.pitch.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={voice.pitch}
                  onChange={(e) => voice.setPitch(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <button
                onClick={() => voice.speak("Hello, I am Siren. Nice to meet you~")}
                className="btn-secondary w-full"
              >
                Test Voice
              </button>
            </div>

            <button
              onClick={() => setShowSetup(false)}
              className="mt-6 btn-primary w-full"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}