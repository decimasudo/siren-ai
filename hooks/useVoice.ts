'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Priority list for "Calm/Natural" Voices
const PREFERRED_VOICES = [
  'Microsoft Sonia Online (Natural)',
  'Microsoft Ava Online (Natural)', 
  'Ava (Premium)', 
  'Ava (Enhanced)',
  'Victoria',
  'Google US English', 
  'Google UK English Female',
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
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  // Settings for calm persona
  const [rate, setRate] = useState(0.9); // Slightly slower for clarity
  const [pitch, setPitch] = useState(1.0); 

  // --- Refs ---
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // --- 1. Initialize Voice (TTS) ---
  useEffect(() => {
    if (typeof window === 'undefined') return;
    synthRef.current = window.speechSynthesis;

    const getPreferredVoice = (available: SpeechSynthesisVoice[]) => {
      // 1. Try exact matches from our "Calm" list
      for (const name of PREFERRED_VOICES) {
        const found = available.find((v) => v.name.includes(name));
        if (found) return found;
      }
      // 2. Try "Natural" keywords
      const natural = available.find(v => v.name.includes('Natural') && v.lang.startsWith('en'));
      if (natural) return natural;

      // 3. Fallback to any Female English voice
      return available.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Woman'))) 
             || available.find(v => v.default) 
             || available[0];
    };

    const loadVoices = () => {
      const voices = synthRef.current?.getVoices() || [];
      if (voices.length > 0) {
        setVoice(getPreferredVoice(voices));
      }
    };

    loadVoices();
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
  }, []);

  // --- 2. Initialize Recognition (STT) ---
  const initRecognition = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after one sentence
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
      // If already started, this might throw, so we catch it
      recognitionRef.current?.start();
    } catch (e) {
      console.log('Recognition already started or failed:', e);
    }
  }, [initRecognition]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!synthRef.current || !text) return;
    
    return new Promise((resolve) => {
      synthRef.current?.cancel(); // Stop previous
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
    rate,
    setRate,
    pitch,
    setPitch,
  };
}