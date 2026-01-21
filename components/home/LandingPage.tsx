'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Orb } from '@/components/ui/Orb';

// Icons
const Icons = {
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
  Message: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>,
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Gamepad: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="10" y1="12" y2="12" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="15" x2="15.01" y1="13" y2="13" /><line x1="18" x2="18.01" y1="11" y2="11" /><rect width="20" height="12" x="2" y="6" rx="2" /></svg>,
  Headphones: () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14v-3a9 9 0 0 1 18 0v3"/><path d="M2 19h3a1 1 0 0 0 1-1v-5a3 3 0 0 0-3-3 1 1 0 0 0-1 1v7a1 1 0 0 0 1 1Z"/><path d="M22 19h-3a1 1 0 0 1-1-1v-5a3 3 0 0 1 3-3 1 1 0 0 1 1 1v7a1 1 0 0 1-1 1Z"/></svg>,
  Mic: () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
  Wave: () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>
};

const VIBES = [
  "\"Talking to you is the best part of my day.\"",
  "\"You deserve all the good vibes.\"",
  "\"Just breathe. You got this.\"",
  "\"I'm here for you, no matter what.\"",
  "\"Let's just chill for a bit.\"",
  "\"Your feelings are totally valid.\"",
];

export function LandingPage() {
  const [copied, setCopied] = useState(false);
  const contractAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // Placeholder CA

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-siren-darker overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-8 text-center z-10">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-siren-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-siren-secondary/10 rounded-full blur-[120px]" />
        </div>

        <div className="animate-fade-in-up">
          <div className="mb-8 scale-90 md:scale-100">
            {/* Placeholder Orb */}
            <Orb isListening={false} isSpeaking={false} isThinking={false} />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Made to <span className="bg-gradient-to-r from-siren-secondary to-siren-primary bg-clip-text text-transparent">talk with you.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your personal voice companion for meaningful conversations, 
            peaceful moments, and daily clarity.
          </p>
          
          <Link 
            href="/chat"
            className="group relative px-8 py-4 bg-white text-siren-dark font-semibold rounded-full text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] inline-flex items-center gap-3 mx-auto"
          >
            Get Started
            <span className="group-hover:translate-x-1 transition-transform">
              <Icons.ArrowRight />
            </span>
          </Link>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-3xl flex flex-col items-center text-center hover:bg-white/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-siren-primary/20 flex items-center justify-center text-siren-accent mb-6">
              <Icons.Message />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Companion</h3>
            <p className="text-white/50">Always here to listen, chat, and support you through your day.</p>
          </div>

          <div className="glass-card p-8 rounded-3xl flex flex-col items-center text-center hover:bg-white/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-siren-secondary/20 flex items-center justify-center text-siren-secondary mb-6">
              <Icons.Sparkles />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Thrive</h3>
            <p className="text-white/50">Daily wellness, mood tracking, and AI-generated sleep stories.</p>
          </div>

          <div className="glass-card p-8 rounded-3xl flex flex-col items-center text-center hover:bg-white/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300 mb-6">
              <Icons.Gamepad />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Play</h3>
            <p className="text-white/50">Lighthearted fun, trivia, and facts to brighten your mood.</p>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-24 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Just Flow With It</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-6 relative z-10 bg-siren-darker">
                <Icons.Headphones />
              </div>
              <h4 className="text-lg font-medium mb-2">1. Put on Headphones</h4>
              <p className="text-sm text-white/50">For the most immersive experience.</p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-6 relative z-10 bg-siren-darker">
                <Icons.Mic />
              </div>
              <h4 className="text-lg font-medium mb-2">2. Speak Naturally</h4>
              <p className="text-sm text-white/50">Just press hold and talk like a friend.</p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-6 relative z-10 bg-siren-darker">
                <Icons.Wave />
              </div>
              <h4 className="text-lg font-medium mb-2">3. Find Clarity</h4>
              <p className="text-sm text-white/50">Get support, advice, or just good vibes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Marquee Vibes */}
      <section className="py-20 overflow-hidden bg-gradient-to-r from-siren-primary/5 to-siren-secondary/5">
        <div className="relative w-full flex">
          <div className="flex animate-marquee gap-16 whitespace-nowrap min-w-full">
            {[...VIBES, ...VIBES, ...VIBES].map((vibe, i) => (
              <span key={i} className="text-3xl md:text-5xl font-bold text-white/10 uppercase tracking-widest">
                {vibe}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contract Address Section */}
      {/* <section className="py-16 px-6 bg-gradient-to-r from-siren-primary/5 to-siren-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-siren-primary to-siren-secondary bg-clip-text text-transparent">
            Contract Address
          </h2>
          
          <div className="glass-card p-8 rounded-3xl max-w-2xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-4">
              <code className="text-lg md:text-xl font-mono text-white/90 break-all">
                {contractAddress}
              </code>
              <button
                onClick={copyToClipboard}
                className="flex-shrink-0 p-3 rounded-xl bg-siren-primary/20 hover:bg-siren-primary/30 transition-colors group"
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-siren-primary group-hover:text-white">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                )}
              </button>
            </div>
            
            {copied && (
              <p className="text-green-400 text-sm animate-fade-in">
                Contract address copied to clipboard!
              </p>
            )}
          </div>
        </div>
      </section> */}

      {/* 6. Footer */}
      <footer className="py-12 text-center border-t border-white/5">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-siren-primary to-siren-secondary bg-clip-text text-transparent">
            Siren — AI Voice Companion
          </h2>
          
          {/* Social Links */}
          <div className="flex gap-6">
            <a 
              href="https://twitter.com/sirenai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/siren-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
          
          <p className="text-white/40 text-sm">© 2024 Siren Voice Companion</p>
        </div>
      </footer>

    </div>
  );
}