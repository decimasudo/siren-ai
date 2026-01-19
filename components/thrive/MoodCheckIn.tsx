'use client';

import { useState } from 'react';
import { MoodType } from '@/types';
import { MOOD_RESPONSES } from '@/lib/constants';

interface MoodCheckInProps {
  onSpeak: (text: string) => void;
}

const MOODS: { type: MoodType; emoji: string; label: string }[] = [
  { type: 'great', emoji: '😊', label: 'Great' },
  { type: 'good', emoji: '🙂', label: 'Good' },
  { type: 'okay', emoji: '😐', label: 'Okay' },
  { type: 'tired', emoji: '😴', label: 'Tired' },
  { type: 'stressed', emoji: '😰', label: 'Stressed' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
];

export function MoodCheckIn({ onSpeak }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [response, setResponse] = useState<string>('');

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    const moodResponse = MOOD_RESPONSES[mood];
    setResponse(moodResponse);
    onSpeak(moodResponse);
  };

  return (
    <div className="feature-card">
      <h3 className="text-xl font-semibold mb-4">How are you feeling?</h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {MOODS.map(({ type, emoji, label }) => (
          <button
            key={type}
            onClick={() => handleMoodSelect(type)}
            className={`p-4 rounded-xl transition-all duration-300 ${
              selectedMood === type
                ? 'bg-siren-primary/40 scale-105'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="text-3xl mb-1">{emoji}</div>
            <div className="text-sm text-white/70">{label}</div>
          </button>
        ))}
      </div>
      {response && (
        <div className="p-4 bg-siren-primary/20 rounded-xl">
          <p className="text-white/90">{response}</p>
        </div>
      )}
    </div>
  );
}
