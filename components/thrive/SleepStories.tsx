'use client';

import { useState } from 'react';
import { STORY_THEMES } from '@/lib/constants';

interface SleepStoriesProps {
  onPlayStory: (story: string) => void;
  demoMode: boolean;
}

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
      <h3 className="text-xl font-semibold mb-4">🌙 Sleep Stories</h3>
      
      {/* Theme selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.entries(STORY_THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setSelectedTheme(key)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedTheme === key
                ? 'bg-siren-primary text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {t.icon} {t.name}
          </button>
        ))}
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
              <span className="text-2xl">{theme.icon}</span>
              <div>
                <div className="font-medium capitalize">{prompt}</div>
                <div className="text-sm text-white/50">~3 min • AI generated</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {isGenerating && (
        <div className="mt-4 text-center text-white/60">
          Creating your story~ Please wait...
        </div>
      )}
    </div>
  );
}
