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
    <div className="feature-card">
      <div className="text-4xl mb-4">💡</div>
      <h3 className="text-xl font-semibold mb-4">Fun Fact</h3>
      <p className="text-white/80 mb-6">{fact}</p>
      <button onClick={getNewFact} className="btn-secondary">
        Tell Me More
      </button>
    </div>
  );
}
