'use client';

interface VoiceButtonProps {
  isListening: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
  disabled?: boolean;
}

export function VoiceButton({ isListening, onMouseDown, onMouseUp, disabled }: VoiceButtonProps) {
  return (
    <button
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
      disabled={disabled}
      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
        isListening 
          ? 'bg-siren-secondary shadow-lg shadow-siren-secondary/50 scale-110' 
          : 'bg-white/10 hover:bg-white/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={isListening ? 'text-white' : 'text-white/80'}
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    </button>
  );
}
