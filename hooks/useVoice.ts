'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
}

export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  // Default Settings for "Calm Anime" vibe
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.1); // Slightly higher pitch for lighter tone
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    synthRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      const availableVoices = synthRef.current?.getVoices() || [];
      const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
      setVoices(englishVoices);
      
      // Auto-select best "Calm Female/Anime" voice
      if (englishVoices.length > 0) {
        const preferred = 
          // 1. Top Tier: High quality natural voices
          englishVoices.find(v => v.name.includes('Microsoft Sonia Online (Natural)')) ||
          englishVoices.find(v => v.name.includes('Microsoft Ava Online (Natural)')) ||
          
          // 2. Reliable Standard Soft Voices
          englishVoices.find(v => v.name === 'Google US English') ||
          englishVoices.find(v => v.name.includes('Samantha')) ||
          
          // 3. Fallbacks
          englishVoices.find(v => v.name.includes('Microsoft Zira')) ||
          englishVoices.find(v => v.name.includes('Female')) ||
          englishVoices[0];

        if (preferred) {
          setSelectedVoice(preferred);
        }
      }
    };
    
    loadVoices();
    
    if (synthRef.current?.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = null;
      }
    };
  }, []);

  const initRecognition = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
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
    
    recognition.onerror = () => setIsListening(false);
    
    return recognition;
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.error('Recognition start error:', e);
    }
  }, [initRecognition]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!synthRef.current || !text) return;
    
    return new Promise((resolve) => {
      synthRef.current?.cancel();
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        resolve();
      };
      
      utterance.onpause = () => {
        setIsPaused(true);
      };
      
      utterance.onresume = () => {
        setIsPaused(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        resolve();
      };
      
      synthRef.current?.speak(utterance);
    });
  }, [selectedVoice, rate, pitch]);

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
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
  };
}