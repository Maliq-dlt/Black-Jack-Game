import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ============================================
 * PHASE 2: Animated Boss Battle System
 * ============================================
 * 
 * Medium Effort Upgrade
 * - Animated boss sprites
 * - Phase transition cutscenes
 * - Warning indicators
 * - Screen distortion effects
 */

export type BossPhase = 'intro' | 'phase1' | 'phase2' | 'phase3' | 'enraged' | 'defeated';

interface BossData {
  id: string;
  name: string;
  title: string;
  icon: string;
  maxHealth: number;
  currentHealth: number;
  phase: BossPhase;
  color: string;
}

interface AnimatedBossBattleProps {
  boss: BossData;
  onPhaseChange?: (phase: BossPhase) => void;
}

/**
 * AnimatedBossSprite - Boss dengan idle dan attack animations
 */
export const AnimatedBossSprite: React.FC<{
  icon: string;
  phase: BossPhase;
  isAttacking?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ icon, phase, isAttacking = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-6xl',
    md: 'text-8xl',
    lg: 'text-9xl'
  };

  // Animation variants berdasarkan phase
  const idleAnimation = {
    phase1: {
      y: [0, -5, 0],
      rotate: [0, 2, -2, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
    },
    phase2: {
      y: [0, -8, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.02, 1],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    },
    phase3: {
      y: [0, -10, 0],
      rotate: [0, 8, -8, 0],
      scale: [1, 1.05, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
    },
    enraged: {
      y: [0, -15, 0],
      rotate: [0, 15, -15, 0],
      scale: [1, 1.1, 1],
      x: [-5, 5, -5, 5, 0],
      transition: { duration: 0.5, repeat: Infinity, ease: 'linear' }
    }
  };

  const attackAnimation = {
    scale: [1, 1.3, 0.9, 1],
    rotate: [0, -10, 10, 0],
    transition: { duration: 0.4, ease: 'easeOut' }
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]}`}
      animate={isAttacking ? attackAnimation : (idleAnimation[phase as keyof typeof idleAnimation] || idleAnimation.phase1)}
      style={{
        filter: phase === 'enraged' 
          ? 'drop-shadow(0 0 30px rgba(220, 38, 38, 0.8))' 
          : 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.5))'
      }}
    >
      {/* Glow effect untuk enraged */}
      {phase === 'enraged' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <span className="text-red-600 blur-xl">{icon}</span>
        </motion.div>
      )}
      
      {/* Main sprite */}
      <span className="relative z-10">{icon}</span>
    </motion.div>
  );
};

/**
 * PhaseTransition - Dramatic phase transition effect
 */
export const PhaseTransition: React.FC<{
  fromPhase: BossPhase;
  toPhase: BossPhase;
  bossName: string;
  onComplete?: () => void;
}> = ({ fromPhase, toPhase, bossName, onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const phaseNames: Record<BossPhase, string> = {
    intro: 'INTRO',
    phase1: 'PHASE 1',
    phase2: 'PHASE 2',
    phase3: 'PHASE 3',
    enraged: 'ENRAGED',
    defeated: 'DEFEATED'
  };

  const phaseColors: Record<BossPhase, string> = {
    intro: '#94a3b8',
    phase1: '#22c55e',
    phase2: '#3b82f6',
    phase3: '#a855f7',
    enraged: '#dc2626',
    defeated: '#eab308'
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
        >
          {/* Flash effect */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0, 0.5, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white"
          />

          {/* Screen shake container */}
          <motion.div
            animate={{
              x: [-5, 5, -5, 5, 0],
              y: [-3, 3, -3, 3, 0]
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            {/* Boss name */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-2xl text-zinc-400 mb-4 tracking-widest"
            >
              {bossName}
            </motion.div>

            {/* Phase indicator */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="text-7xl font-black mb-4"
              style={{ 
                color: phaseColors[toPhase],
                textShadow: `0 0 40px ${phaseColors[toPhase]}, 0 0 80px ${phaseColors[toPhase]}`
              }}
            >
              {toPhase === 'enraged' ? '🔥 ENRAGED! 🔥' : phaseNames[toPhase]}
            </motion.div>

            {/* Warning text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-zinc-300"
            >
              {toPhase === 'enraged' 
                ? 'THE BOSS IS GETTING SERIOUS!' 
                : 'PHASE TRANSITION'}
            </motion.div>

            {/* Animated line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="w-64 h-1 mx-auto mt-6"
              style={{ 
                background: `linear-gradient(90deg, transparent, ${phaseColors[toPhase]}, transparent)`
              }}
            />
          </motion.div>

          {/* Corner decorations */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="absolute w-20 h-20"
              style={{
                top: i < 2 ? '20px' : 'auto',
                bottom: i >= 2 ? '20px' : 'auto',
                left: i % 2 === 0 ? '20px' : 'auto',
                right: i % 2 === 1 ? '20px' : 'auto',
                borderTop: i < 2 ? `4px solid ${phaseColors[toPhase]}` : 'none',
                borderBottom: i >= 2 ? `4px solid ${phaseColors[toPhase]}` : 'none',
                borderLeft: i % 2 === 0 ? `4px solid ${phaseColors[toPhase]}` : 'none',
                borderRight: i % 2 === 1 ? `4px solid ${phaseColors[toPhase]}` : 'none'
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * WarningIndicator - Flashing warning untuk boss abilities
 */
export const WarningIndicator: React.FC<{
  message: string;
  duration?: number;
  onComplete?: () => void;
}> = ({ message, duration = 2000, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete || (() => {}), duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div
        animate={{
          backgroundColor: ['rgba(220, 38, 38, 0.8)', 'rgba(220, 38, 38, 0.4)', 'rgba(220, 38, 38, 0.8)']
        }}
        transition={{ duration: 0.3, repeat: Infinity }}
        className="px-8 py-4 rounded-xl border-2 border-red-500"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          className="flex items-center gap-3"
        >
          <span className="text-3xl">⚠️</span>
          <span className="text-xl font-bold text-white">{message}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/**
 * HealthBarSegments - Health bar dengan break points
 */
export const HealthBarSegments: React.FC<{
  current: number;
  max: number;
  segments?: number[];
  colors?: string[];
  height?: number;
}> = ({ 
  current, 
  max, 
  segments = [100, 70, 40, 15],
  colors = ['#22c55e', '#3b82f6', '#a855f7', '#dc2626'],
  height = 24
}) => {
  const percentage = (current / max) * 100;
  
  // Determine current color based on percentage
  let currentColor = colors[0];
  for (let i = 0; i < segments.length; i++) {
    if (percentage <= segments[i]) {
      currentColor = colors[i];
    }
  }

  return (
    <div className="w-full">
      {/* Segment indicators */}
      <div className="flex gap-1 mb-1">
        {segments.map((threshold, i) => (
          <div
            key={threshold}
            className="flex-1 h-1 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: percentage <= threshold ? colors[i] : '#374151'
            }}
          />
        ))}
      </div>

      {/* Main health bar */}
      <div 
        className="relative rounded-full overflow-hidden bg-zinc-800"
        style={{ height }}
      >
        {/* Background segments */}
        <div className="absolute inset-0 flex">
          {segments.map((threshold, i) => {
            const prevThreshold = i === 0 ? 100 : segments[i - 1];
            const width = prevThreshold - threshold;
            return (
              <div
                key={threshold}
                className="h-full border-r border-zinc-900/50"
                style={{ width: `${width}%` }}
              />
            );
          })}
        </div>

        {/* Health fill */}
        <motion.div
          className="h-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          style={{ 
            background: `linear-gradient(90deg, ${currentColor}, ${currentColor}dd)`
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
            }}
          />
        </motion.div>

        {/* Break point markers */}
        {segments.slice(1).map((threshold) => (
          <div
            key={threshold}
            className="absolute top-0 bottom-0 w-0.5 bg-zinc-900"
            style={{ left: `${threshold}%` }}
          />
        ))}
      </div>

      {/* Percentage text */}
      <div className="flex justify-between text-xs text-zinc-500 mt-1">
        <span>{percentage.toFixed(1)}%</span>
        <span>{current.toLocaleString()} / {max.toLocaleString()}</span>
      </div>
    </div>
  );
};

/**
 * DamageNumber - Floating damage numbers
 */
export const DamageNumber: React.FC<{
  amount: number;
  isCritical?: boolean;
  x: number;
  y: number;
  onComplete?: () => void;
}> = ({ amount, isCritical = false, x, y, onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: isCritical ? 1.5 : 1 }}
      animate={{ 
        opacity: 0, 
        y: -80,
        scale: isCritical ? 2 : 1.2
      }}
      transition={{ duration: 1, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="fixed pointer-events-none z-50 font-black"
      style={{ left: x, top: y }}
    >
      <span 
        className={isCritical ? 'text-red-500' : 'text-white'}
        style={{
          fontSize: isCritical ? '3rem' : '2rem',
          textShadow: isCritical 
            ? '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.5)' 
            : '0 0 10px rgba(0, 0, 0, 0.8)'
        }}
      >
        {isCritical && '💥 '}-{amount.toLocaleString()}
      </span>
    </motion.div>
  );
};

export default AnimatedBossSprite;
