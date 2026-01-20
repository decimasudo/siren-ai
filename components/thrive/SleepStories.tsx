'use client';

import { useState } from 'react';
import { STORY_THEMES } from '@/lib/constants';

interface SleepStoriesProps {
  onPlayStory: (story: string) => void;
  demoMode: boolean;
}

// Icons for Themes
const ThemeIcons = {
  nature: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>, // Wind/Nature
  fantasy: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>, // Sparkle/Magic
  ocean: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M2 16h20"/><path d="M2 8h20"/><path d="M2 20h20"/><path d="M2 4h20"/></svg>, // Waves
  cozy: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M9 5v2"/></svg>, // Coffee/Mug
};

export function SleepStories({ onPlayStory, demoMode }: SleepStoriesProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>('nature');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStory, setCurrentStory] = useState<string | null>(null);

  const generateStory = async (prompt: string) => {
    setIsGenerating(true);
    setCurrentStory(prompt);

    try {
      if (demoMode) {
        const demoStory = `Close your eyes and imagine ${prompt}. The air around you is perfectly still and peaceful. You feel completely safe, completely relaxed. With each breath, you sink deeper into comfort. All your worries drift away like clouds on a gentle breeze. Let yourself drift... let yourself rest... Sweet dreams~`;
        onPlayStory(demoStory);
      } else {
        const response = await fetch('/api/story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        if (response.ok) {
          const data = await response.json();
          onPlayStory(data.story);
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const theme = STORY_THEMES[selectedTheme as keyof typeof STORY_THEMES];

  return (
    <div className="feature-card">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        Sleep Stories
      </h3>
      
      {/* Theme selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {Object.entries(STORY_THEMES).map(([key, t]) => {
          const Icon = ThemeIcons[key as keyof typeof ThemeIcons];
          return (
            <button
              key={key}
              onClick={() => setSelectedTheme(key)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedTheme === key
                  ? 'bg-siren-primary text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Icon /> {t.name}
            </button>
          );
        })}
      </div>

      {/* Story list */}
      <div className="space-y-3">
        {theme.prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => generateStory(prompt)}
            disabled={isGenerating}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              currentStory === prompt && isGenerating
                ? 'bg-siren-primary/30'
                : 'bg-white/5 hover:bg-white/10'
            } disabled:opacity-50`}
          >
            <div className="flex items-center gap-3">
              <div className="text-white/60">
                 {/* Re-use the theme icon for list items */}
                 {ThemeIcons[selectedTheme as keyof typeof ThemeIcons]()}
              </div>
              <div>
                <div className="font-medium capitalize text-sm md:text-base">{prompt}</div>
                <div className="text-xs text-white/50">~3 min • AI generated</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {isGenerating && (
        <div className="mt-4 text-center text-white/60 flex items-center justify-center gap-2">
          <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          Creating your story~ Please wait...
        </div>
      )}
    </div>
  );
}