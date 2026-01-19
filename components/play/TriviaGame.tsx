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
        <h3 className="text-xl font-semibold">🎯 Trivia</h3>
        <div className="px-4 py-2 bg-siren-primary/30 rounded-full">
          Score: {score}
        </div>
      </div>

      <div className="mb-2 text-sm text-siren-secondary">{question.category}</div>
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
