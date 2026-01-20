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
import Link from 'next/link';

// Inline Icons for Navbar (Lucid Style)
const Icons = {
  Companion: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  Thrive: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
  ),
  Play: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
  ),
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  )
};

export default function ChatPage() {
  const [currentView, setCurrentView] = useState<ViewType>('companion');
  const [demoMode, setDemoMode] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  
  const hasGreetedRef = useRef(false);

  const voice = useVoice();
  const chat = useChat(demoMode);

  // Initial checks
  useEffect(() => {
    // 1. Check API Mode
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test', history: [] }),
    }).then(res => {
      if (res.ok) setDemoMode(false);
    }).catch(() => {});

    // 2. Check Name in LocalStorage
    const savedName = localStorage.getItem('siren_username');
    if (savedName) {
      setUserName(savedName);
    } else {
      setIsOnboarding(true);
    }
  }, []);

  // Greeting Logic
  useEffect(() => {
    if (!hasGreetedRef.current && voice.selectedVoice) {
      hasGreetedRef.current = true;
      
      if (isOnboarding) {
        // First time ever: Ask for name
        voice.speak("Hello there. I don't think we've met properly yet. I'm Siren. What should I call you?");
        // We add a system message locally so the chat log reflects this
        chat.addLocalMessage("Hello there. I don't think we've met properly yet. I'm Siren. What should I call you?", 'assistant');
      } else if (userName) {
        // Returning user: Welcome back
        voice.speak(`Hey ${userName}, good to see you again. How are things going?`);
      } else {
        // Fallback
        voice.speak("Hey! Ready to chat? What's on your mind?");
      }
    }
  }, [voice.selectedVoice, voice.speak, isOnboarding, userName, chat]); // Added dependencies to ensure it fires correctly

  useEffect(() => {
    if (voice.transcript) {
      handleSendMessage(voice.transcript);
    }
  }, [voice.transcript]);

  const handleSendMessage = async (message: string) => {
    // Intercept message if we are in onboarding mode (waiting for name)
    if (isOnboarding) {
      // Basic extraction of name from "My name is X" or just "X"
      const name = message.replace(/my name is/i, '').replace(/it's/i, '').replace(/i am/i, '').trim();
      
      if (name.length > 0) {
        localStorage.setItem('siren_username', name);
        setUserName(name);
        setIsOnboarding(false);
        
        const welcomeMsg = `It's lovely to meet you, ${name}. I'm here if you want to chat, vent, or just relax. How are you feeling right now?`;
        
        // Update local UI
        chat.addLocalMessage(message, 'user');
        chat.addLocalMessage(welcomeMsg, 'assistant');
        voice.speak(welcomeMsg);
        return;
      }
    }

    // Normal chat flow
    const response = await chat.sendMessage(message, userName || undefined);
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
    <main className="min-h-screen flex flex-col animate-fade-in-up">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <Icons.Home />
          <span className="hidden sm:inline text-sm font-medium">Home</span>
        </Link>
        
        {/* Navigation */}
        <nav className="flex gap-2">
          <button
            onClick={() => setCurrentView('companion')}
            className={`nav-pill flex items-center gap-2 ${currentView === 'companion' ? 'active' : ''}`}
          >
            <Icons.Companion />
            <span className="capitalize hidden sm:inline">Companion</span>
          </button>
          <button
            onClick={() => setCurrentView('thrive')}
            className={`nav-pill flex items-center gap-2 ${currentView === 'thrive' ? 'active' : ''}`}
          >
            <Icons.Thrive />
            <span className="capitalize hidden sm:inline">Thrive</span>
          </button>
          <button
            onClick={() => setCurrentView('play')}
            className={`nav-pill flex items-center gap-2 ${currentView === 'play' ? 'active' : ''}`}
          >
            <Icons.Play />
            <span className="capitalize hidden sm:inline">Play</span>
          </button>
        </nav>

        <button
          onClick={() => setShowSetup(true)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Icons.Settings />
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
              <h2 className="text-2xl font-semibold">Thrive Mode</h2>
              <MoodCheckIn onSpeak={voice.speak} />
              <AffirmationCard onSpeak={voice.speak} />
              <SleepStories onPlayStory={voice.speak} demoMode={demoMode} />
            </div>
          )}

          {currentView === 'play' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <h2 className="text-2xl font-semibold">Play Mode</h2>
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
              
              {/* Reset Name Option */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Personalization</label>
                <div className="p-3 bg-white/5 rounded-xl flex justify-between items-center">
                   <span className="text-sm">Name: {userName || "Not set"}</span>
                   <button 
                     onClick={() => {
                       localStorage.removeItem('siren_username');
                       setUserName(null);
                       setIsOnboarding(true);
                     }}
                     className="text-xs text-red-400 hover:text-red-300"
                   >
                     Reset
                   </button>
                </div>
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