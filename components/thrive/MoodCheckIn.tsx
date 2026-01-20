'use client';

import { useState } from 'react';
import { MoodType } from '@/types';
import { MOOD_RESPONSES } from '@/lib/constants';

interface MoodCheckInProps {
  onSpeak: (text: string) => void;
}

// Custom Icons for Moods
const Icons = {
  great: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>,
  good: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>,
  okay: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="15" y2="15"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>,
  tired: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 9h6"/><path d="M12 16h.01"/></svg>,
  stressed: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 9v.01"/><path d="M8 9v.01"/><path d="M12 18a4 4 0 0 1-4-2.5"/><path d="M16 15.5A4 4 0 0 1 12 18"/></svg>,
  sad: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 9v.01"/><path d="M8 9v.01"/><path d="M9.5 16a3.5 3.5 0 0 1 5 0"/></svg>,
};

const MOODS: { type: MoodType; icon: keyof typeof Icons; label: string }[] = [
  { type: 'great', icon: 'great', label: 'Great' },
  { type: 'good', icon: 'good', label: 'Good' },
  { type: 'okay', icon: 'okay', label: 'Okay' },
  { type: 'tired', icon: 'tired', label: 'Tired' },
  { type: 'stressed', icon: 'stressed', label: 'Stressed' },
  { type: 'sad', icon: 'sad', label: 'Sad' },
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
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.28 3.6-2.34 3.6-4.44C22.59 7.05 20.5 5 18 5c-1.8 0-3.29.9-4 2.15C13.29 5.9 11.8 5 10 5c-2.5 0-4.59 2.05-4.59 4.56 0 2.1 2.11 3.16 3.6 4.44C7.51 15.28 6.5 16.5 6.5 18c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5c0-1.5-1-2.72-2.5-3.28C12.5 14.16 14.16 14.5 19 14z"/></svg>
        How are you feeling?
      </h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {MOODS.map(({ type, icon, label }) => {
          const Icon = Icons[icon];
          return (
            <button
              key={type}
              onClick={() => handleMoodSelect(type)}
              className={`p-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 ${
                selectedMood === type
                  ? 'bg-siren-primary/40 scale-105'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white/80"><Icon /></div>
              <div className="text-sm text-white/70">{label}</div>
            </button>
          );
        })}
      </div>
      {response && (
        <div className="p-4 bg-siren-primary/20 rounded-xl">
          <p className="text-white/90">{response}</p>
        </div>
      )}
    </div>
  );
}