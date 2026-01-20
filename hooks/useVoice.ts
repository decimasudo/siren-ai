'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// PRIORITY LIST - UPDATED FOR CHROME/SAFARI/EDGE PREFERENCES
const PREFERRED_VOICES = [
  'Google UK English Female',       // Chrome Preferred
  'Karen',                          // Safari Preferred (Mac)
  'Microsoft Sonia Online (Natural)', // Edge Preferred
  'Microsoft Ava Online (Natural)',
  'Martha', 
  'Serena',
  'Samantha', 
  'Google US English',
  'English United Kingdom',
];

interface UseVoiceReturn {
  isListening: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  togglePause: () => void;
  currentVoice: string | undefined;
  
  // New exports for the Dropdown
  voices: SpeechSynthesisVoice[]; 
  setVoiceByName: (name: string) => void;

  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
}

export function useVoice(): UseVoiceReturn {
  // --- State ---
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Voice State
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Settings
  const [rate, setRate] = useState(0.9); 
  const [pitch, setPitch] = useState(1.0); 

  // --- Refs ---
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // --- 1. Initialize Voice (TTS) ---
  useEffect(() => {
    if (typeof window === 'undefined') return;
    synthRef.current = window.speechSynthesis;

    const getPreferredVoice = (available: SpeechSynthesisVoice[]) => {
      // 1. Search for specific names in our priority list
      for (const name of PREFERRED_VOICES) {
        const found = available.find((v) => v.name.includes(name));
        if (found) return found;
      }
      
      // 2. Fallback: Try to find ANY "UK English" Female voice
      const ukFemale = available.find(v => v.lang === 'en-GB' && (v.name.includes('Female') || v.name.includes('Woman')));
      if (ukFemale) return ukFemale;

      // 3. Fallback: Any "Natural" English voice
      const natural = available.find(v => v.name.includes('Natural') && v.lang.startsWith('en'));
      if (natural) return natural;

      // 4. Last Resort: Default
      return available.find(v => v.default) || available[0];
    };

    const loadVoices = () => {
      const voices = synthRef.current?.getVoices() || [];
      if (voices.length > 0) {
        setAvailableVoices(voices); // Store all voices
        
        // Only set default if one hasn't been chosen yet
        if (!voice) {
            const best = getPreferredVoice(voices);
            setVoice(best);
        }
      }
    };

    loadVoices();
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
  }, [voice]);

  // Helper to manually set voice from dropdown
  const setVoiceByName = (name: string) => {
    const selected = availableVoices.find(v => v.name === name);
    if (selected) {
        setVoice(selected);
        console.log("Manually selected:", selected.name);
    }
  };

  // --- 2. Initialize Recognition (STT) ---
  const initRecognition = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false; 
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
      }
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    return recognition;
  }, []);

  // --- 3. Actions ---

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.log('Recognition start error:', e);
    }
  }, [initRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!synthRef.current || !text) return;
    
    return new Promise((resolve) => {
      synthRef.current?.cancel();
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;
      
      utterance.rate = rate;
      utterance.pitch = pitch;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        resolve();
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        resolve();
      };

      synthRef.current?.speak(utterance);
    });
  }, [voice, rate, pitch]);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    if (synthRef.current?.paused) {
      synthRef.current.resume();
      setIsPaused(false);
    } else {
      synthRef.current?.pause();
      setIsPaused(true);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    isPaused,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    togglePause,
    
    currentVoice: voice?.name,
    voices: availableVoices, // Exporting the list
    setVoiceByName,          // Exporting the setter
    
    rate,
    setRate,
    pitch,
    setPitch,
  };
}