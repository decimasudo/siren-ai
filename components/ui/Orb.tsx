/* components/ui/Orb.tsx */
'use client';

import { useEffect, useRef } from 'react';

interface OrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  isPaused?: boolean;
  statusText?: string;
}

export function Orb({ isListening, isSpeaking, isThinking, isPaused = false, statusText }: OrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- CONFIGURATION ---
    const PARTICLE_COUNT = 800;
    const BASE_RADIUS = 120; 
    const PERSPECTIVE = 400;
    
    // --- STATE VARIABLES ---
    let particles: { baseX: number; baseY: number; baseZ: number; phase: number }[] = [];
    let angleY = 0;
    let angleX = 0;
    let time = 0;
    let pulseWave = 0; 
    let animationFrameId: number;

    // --- INITIALIZATION ---
    const initParticles = () => {
      particles = [];
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const theta = 2 * Math.PI * i / goldenRatio;
        const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
        
        const x = Math.cos(theta) * Math.sin(phi);
        const y = Math.sin(theta) * Math.sin(phi);
        const z = Math.cos(phi);

        particles.push({ 
          baseX: x, 
          baseY: y,
          baseZ: z,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    // --- RENDER LOOP ---
    const render = () => {
      canvas.width = 400;
      canvas.height = 400;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Slower time increment for smoother global movement
      time += 0.01; 
      
      // Rotation Logic
      let rotationSpeed = 0.002;
      if (isThinking) rotationSpeed = 0.02;
      if (isListening) rotationSpeed = 0.001;
      
      angleY += rotationSpeed;
      angleX = Math.sin(time * 0.5) * 0.05; 

      const primaryColor = '124, 58, 237'; // Purple
      const secondaryColor = '45, 212, 191'; // Teal

      // --- 1. DRAW OUTER PULSE RING (Slow & Sure) ---
      if (isSpeaking && !isPaused) {
        // TWEAK 1: Reduced speed from 0.015 to 0.008 for a "slow but sure" pulse
        pulseWave += 0.008; 
        if (pulseWave > 1) pulseWave = 0;

        // Radius moves outwards
        const ringRadius = BASE_RADIUS + (pulseWave * 100);
        // Opacity fades out
        const ringAlpha = Math.max(0, 1 - pulseWave); 

        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(centerX, centerY, ringRadius - 20, centerX, centerY, ringRadius);
        gradient.addColorStop(0, `rgba(${secondaryColor}, 0)`);
        gradient.addColorStop(0.5, `rgba(${secondaryColor}, ${ringAlpha * 0.25})`);
        gradient.addColorStop(1, `rgba(${secondaryColor}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Thin elegant line
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${secondaryColor}, ${ringAlpha * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        pulseWave = 0;
      }

      // --- 2. DRAW PARTICLES ---
      particles.forEach(p => {
        let currentRadius = BASE_RADIUS;
        
        // --- DEFORMATION LOGIC ---
        if (isSpeaking && !isPaused) {
            // TWEAK 2: Reduced frequency from 4 to 1.5 for slow, deep breathing
            const breath = Math.sin(time * 1.5) * 6; 
            currentRadius += breath;
            
            // Subtle organic movement
            currentRadius += Math.sin(p.baseY * 0.5 + time * 1.5) * 2;
        } else if (isListening) {
            currentRadius += Math.sin(time * 1.5) * 3; 
        } else if (isThinking) {
            currentRadius += Math.sin(time * 20 + p.phase) * 2;
        }

        const px = p.baseX * currentRadius;
        const py = p.baseY * currentRadius;
        const pz = p.baseZ * currentRadius;

        // 3D Rotation
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = px * cosY - pz * sinY;
        const z1 = pz * cosY + px * sinY;

        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = py * cosX - z1 * sinX;
        const z2 = z1 * cosX + py * sinX;

        // Projection
        const scale = PERSPECTIVE / (PERSPECTIVE + z2);
        const x2d = x1 * scale + centerX;
        const y2d = y2 * scale + centerY;

        if (scale > 0) {
          const size = Math.max(0.4, 1.8 * scale); 
          const alpha = Math.max(0.1, (scale - 0.4)); 

          ctx.beginPath();
          ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
          
          const colorMix = (Math.sin(angleY + p.baseY) + 1) / 2; 
          
          if (isListening) {
             ctx.fillStyle = `rgba(${secondaryColor}, ${alpha})`;
          } else if (isSpeaking) {
             // TWEAK 3: Slowed down the flash effect (time * 3 instead of 10)
             const flash = Math.max(0, Math.sin(time * 3)); 
             ctx.fillStyle = `rgba(${secondaryColor}, ${alpha + flash * 0.15})`;
          } else {
             ctx.fillStyle = colorMix > 0.5 
              ? `rgba(${primaryColor}, ${alpha})`
              : `rgba(${secondaryColor}, ${alpha})`;
          }
          
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    initParticles();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isListening, isSpeaking, isThinking, isPaused]);

  const getStatusText = () => {
    if (isThinking) return 'Processing...';
    if (isListening) return 'Listening...';
    if (isSpeaking) return isPaused ? 'Paused' : 'Speaking...';
    return 'Ready';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative w-[400px] h-[400px] flex items-center justify-center">
        {/* Glow Background */}
        <div className={`absolute inset-0 bg-siren-primary/10 blur-[50px] rounded-full transition-all duration-1000 ${
          isSpeaking ? 'scale-125 opacity-30' : 'scale-90 opacity-10'
        }`} />
        
        <canvas 
          ref={canvasRef} 
          className="relative z-10 w-full h-full"
        />
      </div>

      <div className="h-8 mt-[-20px] flex items-center justify-center z-20">
        <p className={`text-lg font-medium tracking-widest uppercase transition-all duration-300 ${
          isListening ? 'text-siren-secondary animate-pulse' : 
          isSpeaking ? 'text-siren-accent' : 
          'text-white/40'
        }`}>
          {statusText || getStatusText()}
        </p>
      </div>
    </div>
  );
}