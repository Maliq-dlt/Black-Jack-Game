import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateId } from '../services/idUtils';

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

interface ParticleEffectProps {
  type: 'confetti' | 'coins' | 'sparkle';
  trigger: boolean;
  onComplete?: () => void;
}

const COLORS = {
  confetti: ['#1a1a1a', '#2f3526', '#3a0a0a', '#0c0e0c'], // Ash and soot
  coins: ['#d9c5a3', '#704214', '#1a1a1a', '#8b0000'],   // Bone and Rusted Iron
  sparkle: ['#4fd1c5', '#81e6d9', '#e6fffa']            // Soul Wisps (cyan/ethereal)
};

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ type, trigger, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const count = type === 'confetti' ? 50 : type === 'coins' ? 20 : 15;
      const newParticles: Particle[] = [];
      
      for (let i = 0; i < count; i++) {
        const colors = COLORS[type];
        newParticles.push({
          id: generateId('particle'),
          x: Math.random() * 100,
          y: Math.random() * 20 - 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: type === 'coins' ? 24 : type === 'confetti' ? 8 + Math.random() * 8 : 4 + Math.random() * 4,
          rotation: Math.random() * 360
        });
      }
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, type, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: '-10vh',
              rotate: particle.rotation,
              opacity: 1,
              scale: 0
            }}
            animate={{
              y: '110vh',
              rotate: particle.rotation + 720,
              opacity: [1, 1, 0.8, 0],
              scale: [0.5, 1, 1.2, 0.8]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3 + Math.random() * 2,
              ease: 'linear'
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              clipPath: type === 'confetti' 
                ? 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' // Soot flakes
                : type === 'coins'
                ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Jagged bone shards
                : 'circle(50% at 50% 50%)',
              filter: type === 'sparkle' ? 'blur(4px)' : 'none',
              boxShadow: type === 'sparkle' 
                ? `0 0 ${particle.size * 2}px ${particle.color}` 
                : 'none'
            }}
          >
            {type === 'coins' && (
              <div className="w-full h-full border border-black/20 rounded-full opacity-30" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Animated Counter Component
interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, prefix = '$', className = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const diff = value - displayValue;
      const steps = 20;
      const stepValue = diff / steps;
      let current = displayValue;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        current += stepValue;
        setDisplayValue(Math.round(current * 100) / 100);
        
        if (step >= steps) {
          clearInterval(interval);
          setDisplayValue(value);
          setIsAnimating(false);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [value, displayValue]);

  const isPositiveChange = value > displayValue;

  return (
    <motion.span 
      className={className}
      animate={isAnimating ? {
        scale: [1, 1.1, 1],
        color: isPositiveChange ? ['#4ade80', '#22c55e', '#4ade80'] : ['#f87171', '#ef4444', '#f87171']
      } : {}}
      transition={{ duration: 0.3 }}
    >
      {prefix}{displayValue.toFixed(2)}
    </motion.span>
  );
};

// Result Banner Component
interface ResultBannerProps {
  result: 'WIN' | 'LOSE' | 'BLACKJACK' | 'PUSH' | 'BUST' | null;
  amount?: number;
}

export const ResultBanner: React.FC<ResultBannerProps> = ({ result, amount }) => {
  if (!result) return null;

  const config = {
    WIN: { text: 'YOU WIN!', color: 'from-green-600 to-green-800', glow: 'shadow-green-500/50' },
    LOSE: { text: 'YOU LOSE', color: 'from-red-600 to-red-800', glow: 'shadow-red-500/50' },
    BLACKJACK: { text: 'NATURAL 21', color: 'from-[#1a1a1a] to-[#3a0a0a]', glow: 'shadow-red-900/50' },
    PUSH: { text: 'STALEMATE', color: 'from-[#1a1a1a] to-[#2a2a2a]', glow: 'shadow-gray-900/50' },
    BUST: { text: 'THE DEBT RISES', color: 'from-[#3a0a0a] to-[#1a0a0a]', glow: 'shadow-red-950/80' }
  };

  const { text, color, glow } = config[result];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.2, opacity: 0, y: -100 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={`
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40
          px-16 py-8 parchment-bg border-4 border-[#3a0a0a]
          shadow-[0_0_100px_rgba(0,0,0,0.9)]
        `}
        style={{ clipPath: 'polygon(2% 1%, 98% 3%, 100% 95%, 97% 100%, 5% 98%, 0% 5%)' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        
        <motion.h1 
          className="text-5xl md:text-7xl font-black text-[#1a1a1a] text-center tracking-[0.2em] font-['Special_Elite'] uppercase"
          animate={{ x: [-1, 1, -1] }}
          transition={{ repeat: Infinity, duration: 0.1 }}
        >
          {text}
        </motion.h1>
        {amount !== undefined && amount !== 0 && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl text-center mt-4 font-['Special_Elite'] font-black ${amount > 0 ? 'text-[#2d4a22]' : 'text-[#8b0000]'}`}
          >
            {amount > 0 ? '+' : ''}{amount.toFixed(2)}
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ParticleEffect;
