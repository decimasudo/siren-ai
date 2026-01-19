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
      <div className="text-4xl mb-4">✨</div>
      <h3 className="text-xl font-semibold mb-4">Daily Affirmation</h3>
      <p className="text-white/80 italic mb-6">"{affirmation}"</p>
      <button onClick={getNewAffirmation} className="btn-secondary">
        New Affirmation
      </button>
    </div>
  );
}
