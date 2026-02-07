import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * ============================================
 * PHASE 2: Holographic & Shader Effects
 * ============================================
 * 
 * Medium Effort Upgrade
 * - Holographic foil untuk rare+ cards
 * - Chromatic aberration
 * - Glitch effects untuk cursed items
 * - Animated shaders
 */

interface HolographicCardProps {
  children: React.ReactNode;
  rarity: 'rare' | 'epic' | 'legendary';
  className?: string;
  onClick?: () => void;
}

/**
 * HolographicCard - Card dengan rainbow foil effect
 */
export const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  rarity,
  className = '',
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking untuk holographic effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 150, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform untuk holographic gradient
  const gradientX = useTransform(smoothX, [0, 1], [0, 100]);
  const gradientY = useTransform(smoothY, [0, 1], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  // Rarity-based glow colors
  const glowColors = {
    rare: 'rgba(59, 130, 246, 0.5)',
    epic: 'rgba(168, 85, 247, 0.5)',
    legendary: 'rgba(234, 179, 8, 0.6)'
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative rounded-xl overflow-hidden cursor-pointer
        ${className}
      `}
      style={{
        boxShadow: isHovered 
          ? `0 0 40px ${glowColors[rarity]}, 0 0 80px ${glowColors[rarity]}` 
          : `0 0 20px ${glowColors[rarity]}`,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
    >
      {/* Base card */}
      <div className="relative z-10 bg-zinc-900">
        {children}
      </div>

      {/* Holographic overlay */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              ${useTransform(smoothX, [0, 1], [135, 315])}deg,
              transparent 0%,
              rgba(255, 0, 128, 0.15) 15%,
              rgba(0, 255, 255, 0.15) 30%,
              rgba(255, 255, 0, 0.15) 45%,
              rgba(255, 0, 255, 0.15) 60%,
              rgba(0, 255, 0, 0.15) 75%,
              transparent 100%
            )
          `,
          mixBlendMode: 'color-dodge'
        }}
      />

      {/* Secondary shimmer */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at ${gradientX}% ${gradientY}%,
              rgba(255, 255, 255, 0.3) 0%,
              transparent 50%
            )
          `,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Animated border */}
      <motion.div
        className="absolute inset-0 z-40 pointer-events-none rounded-xl border-2"
        animate={{
          borderColor: isHovered 
            ? ['#eab308', '#f59e0b', '#eab308'] 
            : 'transparent',
          boxShadow: isHovered
            ? [
                'inset 0 0 20px rgba(234, 179, 8, 0.3)',
                'inset 0 0 40px rgba(234, 179, 8, 0.5)',
                'inset 0 0 20px rgba(234, 179, 8, 0.3)'
              ]
            : 'none'
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

/**
 * GlitchEffect - Glitch effect untuk cursed items
 */
interface GlitchEffectProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  trigger?: boolean;
  className?: string;
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  children,
  intensity = 'medium',
  trigger = true,
  className = ''
}) => {
  const intensityConfig = {
    low: { offset: 2, frequency: 0.3 },
    medium: { offset: 4, frequency: 0.5 },
    high: { offset: 8, frequency: 0.8 }
  };

  const config = intensityConfig[intensity];

  return (
    <div className={`relative ${className}`}>
      {/* Main content */}
      <motion.div
        animate={trigger ? {
          x: [0, -config.offset, config.offset, 0],
          skewX: [0, -2, 2, 0]
        } : {}}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatType: 'reverse',
          repeatDelay: config.frequency
        }}
      >
        {children}
      </motion.div>

      {/* Red channel */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{ color: '#ff0000' }}
        animate={trigger ? {
          x: [0, config.offset, -config.offset, 0],
          opacity: [0, 0.5, 0]
        } : { opacity: 0 }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: config.frequency
        }}
      >
        {children}
      </motion.div>

      {/* Cyan channel */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{ color: '#00ffff' }}
        animate={trigger ? {
          x: [0, -config.offset, config.offset, 0],
          opacity: [0, 0.5, 0]
        } : { opacity: 0 }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: config.frequency,
          delay: 0.05
        }}
      >
        {children}
      </motion.div>

      {/* Scanline glitch */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        animate={trigger ? {
          y: ['-100%', '100%']
        } : { y: '-100%' }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: config.frequency * 2
        }}
      >
        <div 
          className="w-full h-1 bg-red-500/50"
          style={{ boxShadow: '0 0 10px #ff0000' }}
        />
      </motion.div>
    </div>
  );
};

/**
 * ChromaticAberration - RGB split effect
 */
interface ChromaticAberrationProps {
  children: React.ReactNode;
  intensity?: number;
  trigger?: boolean;
  className?: string;
}

export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  children,
  intensity = 5,
  trigger = false,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Normal content */}
      <div className="relative z-10">{children}</div>

      {/* Aberration layers */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{ color: '#ff0000' }}
        animate={trigger ? {
          x: [-intensity, intensity, -intensity],
          opacity: [0.3, 0.5, 0.3]
        } : {
          x: 0,
          opacity: 0
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{ color: '#00ff00' }}
        animate={trigger ? {
          x: [intensity, -intensity, intensity],
          opacity: [0.3, 0.5, 0.3]
        } : {
          x: 0,
          opacity: 0
        }}
        transition={{ duration: 0.2, delay: 0.03 }}
      >
        {children}
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{ color: '#0000ff' }}
        animate={trigger ? {
          x: [-intensity * 0.5, intensity * 0.5, -intensity * 0.5],
          opacity: [0.3, 0.5, 0.3]
        } : {
          x: 0,
          opacity: 0
        }}
        transition={{ duration: 0.2, delay: 0.06 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/**
 * AnimatedBorder - Rotating gradient border
 */
interface AnimatedBorderProps {
  children: React.ReactNode;
  colors?: string[];
  speed?: number;
  className?: string;
}

export const AnimatedBorder: React.FC<AnimatedBorderProps> = ({
  children,
  colors = ['#eab308', '#f59e0b', '#fbbf24', '#fcd34d'],
  speed = 3,
  className = ''
}) => {
  const gradient = `conic-gradient(from 0deg, ${colors.join(', ')}, ${colors[0]})`;

  return (
    <div className={`relative p-[3px] rounded-xl ${className}`}>
      {/* Animated border */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: gradient,
          animation: `spin ${speed}s linear infinite`
        }}
      />
      
      {/* Inner content */}
      <div className="relative bg-zinc-900 rounded-xl overflow-hidden">
        {children}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/**
 * PulseGlow - Pulsing glow effect
 */
interface PulseGlowProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  speed?: number;
  className?: string;
}

export const PulseGlow: React.FC<PulseGlowProps> = ({
  children,
  color = '#eab308',
  intensity = 0.5,
  speed = 2,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Glow layer */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: [
            `0 0 20px ${color}${Math.round(intensity * 100).toString(16).padStart(2, '0')}`,
            `0 0 40px ${color}${Math.round(intensity * 150).toString(16).padStart(2, '0')}`,
            `0 0 20px ${color}${Math.round(intensity * 100).toString(16).padStart(2, '0')}`
          ]
        }}
        transition={{ duration: speed, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HolographicCard;
