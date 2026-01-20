'use client';

import { useState } from 'react';
import { AFFIRMATIONS } from '@/lib/constants';

interface AffirmationCardProps {
  onSpeak: (text: string) => void;
}

export function AffirmationCard({ onSpeak }: AffirmationCardProps) {
  const [affirmation, setAffirmation] = useState(AFFIRMATIONS[0]);

  const getNewAffirmation = () => {
    const newAffirmation = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    setAffirmation(newAffirmation);
    onSpeak(newAffirmation);
  };

  return (
    <div className="feature-card text-center">
      <div className="flex justify-center mb-4 text-siren-accent">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-4">Daily Affirmation</h3>
      <p className="text-white/80 italic mb-6">"{affirmation}"</p>
      <button onClick={getNewAffirmation} className="btn-secondary flex items-center gap-2 mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
        New Affirmation
      </button>
    </div>
  );
}