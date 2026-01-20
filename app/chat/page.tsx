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
import Link from 'next/link'; // Added for the "Back" button if needed

// Inline Icons for Navbar
const Icons = {
  Companion: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  ),
  Thrive: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  ),
  Play: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  ),
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/> 
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
};

export default function ChatPage() {
  const [currentView, setCurrentView] = useState<ViewType>('companion');
  const [demoMode, setDemoMode] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const hasGreetedRef = useRef(false);

  const voice = useVoice();
  const chat = useChat(demoMode);

  useEffect(() => {
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test', history: [] }),
    }).then(res => {
      if (res.ok) setDemoMode(false);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    // Only greet if we haven't greeted yet and voice is ready
    if (!hasGreetedRef.current && voice.selectedVoice) {
      hasGreetedRef.current = true;
      voice.speak("Hey there! I'm Siren, your chill voice companion. Ready to chat, relax, or have some fun? What's up?");
    }
  }, [voice.selectedVoice, voice.speak]);

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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
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