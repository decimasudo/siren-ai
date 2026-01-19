export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface VoiceSettings {
  speed: number;
  pitch: number;
}

export interface SirenConfig {
  demoMode: boolean;
  voiceSettings: VoiceSettings;
}

export type ViewType = 'companion' | 'thrive' | 'play';
export type MoodType = 'great' | 'good' | 'okay' | 'tired' | 'stressed' | 'sad';

export interface StoryTheme {
  name: string;
  icon: string;
  prompts: string[];
}
