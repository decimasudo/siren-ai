'use client';

import { useState } from 'react';
import { FUN_FACTS } from '@/lib/constants';

interface FunFactsProps {
  onSpeak: (text: string) => void;
}

export function FunFacts({ onSpeak }: FunFactsProps) {
  const [fact, setFact] = useState(FUN_FACTS[0]);

  const getNewFact = () => {
    const newFact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
    setFact(newFact);
    onSpeak(`Did you know? ${newFact}`);
  };

  return (
    <div className="feature-card flex flex-col items-center text-center">
      <div className="mb-4 text-yellow-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
      </div>
      <h3 className="text-xl font-semibold mb-4">Fun Fact</h3>
      <p className="text-white/80 mb-6 min-h-[4rem]">{fact}</p>
      <button onClick={getNewFact} className="btn-secondary flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
        Tell Me More
      </button>
    </div>
  );
}