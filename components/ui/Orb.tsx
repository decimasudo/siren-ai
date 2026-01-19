'use client';

interface OrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
}

export function Orb({ isListening, isSpeaking, isThinking }: OrbProps) {
  const getOrbClass = () => {
    if (isSpeaking) return 'speaking';
    if (isListening) return 'listening';
    if (isThinking) return 'animate-pulse';
    return '';
  };

  const getStatusText = () => {
    if (isSpeaking) return 'Speaking...';
    if (isListening) return 'Listening...';
    if (isThinking) return 'Thinking...';
    return 'Ready to listen~';
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className={`orb animate-float ${getOrbClass()}`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        
        {/* Inner glow rings */}
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <div className="absolute inset-8 rounded-full border border-white/5" />
        
        {/* Center sparkle */}
        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-white/40 rounded-full blur-sm" />
      </div>
      
      <p className={`text-white/70 text-lg transition-all duration-300 ${
        isListening ? 'text-siren-secondary' : 
        isSpeaking ? 'text-siren-accent' : ''
      }`}>
        {getStatusText()}
      </p>
    </div>
  );
}
