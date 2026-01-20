'use client';

import { useState, useCallback } from 'react';
import { TRIVIA_QUESTIONS } from '@/lib/constants';

interface TriviaGameProps {
  onSpeak: (text: string) => void;
}

export function TriviaGame({ onSpeak }: TriviaGameProps) {
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = TRIVIA_QUESTIONS[questionIndex % TRIVIA_QUESTIONS.length];

  const handleAnswer = useCallback((index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === question.answer) {
      setScore(s => s + 10);
      onSpeak("Correct! Well done~");
    } else {
      onSpeak(`The answer was ${question.options[question.answer]}`);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      setQuestionIndex(i => i + 1);
    }, 2000);
  }, [question, onSpeak]);

  return (
    <div className="feature-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          Trivia
        </h3>
        <div className="px-4 py-2 bg-siren-primary/30 rounded-full flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Score: {score}
        </div>
      </div>

      <div className="mb-2 text-sm text-siren-secondary flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        {question.category}
      </div>
      <p className="text-lg mb-6">{question.question}</p>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => !showResult && handleAnswer(i)}
            disabled={showResult}
            className={`p-4 rounded-xl text-left transition-all ${
              showResult
                ? i === question.answer
                  ? 'bg-green-500/40'
                  : i === selectedAnswer
                  ? 'bg-red-500/40'
                  : 'bg-white/5'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}