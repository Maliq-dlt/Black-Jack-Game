import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * ============================================
 * PHASE 1: Enhanced Card with 3D Tilt & Glow
 * ============================================
 * 
 * High Impact, Low Effort Upgrade
 * - 3D tilt effect saat hover
 * - Dynamic glow berdasarkan rarity
 * - Smooth spring animations
 */

interface Card3DProps {
  children: React.ReactNode;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'cursed';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

// Rarity glow configurations
const RARITY_GLOW = {
  common: {
    boxShadow: '0 0 20px rgba(148, 163, 184, 0.3), 0 0 40px rgba(148, 163, 184, 0.1)',
    borderColor: 'rgba(148, 163, 184, 0.5)'
  },
  uncommon: {
    boxShadow: '0 0 25px rgba(34, 197, 94, 0.4), 0 0 50px rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(34, 197, 94, 0.6)'
  },
  rare: {
    boxShadow: '0 0 25px rgba(59, 130, 246, 0.4), 0 0 50px rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.6)'
  },
  epic: {
    boxShadow: '0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)',
    borderColor: 'rgba(168, 85, 247, 0.7)'
  },
  legendary: {
    boxShadow: '0 0 35px rgba(234, 179, 8, 0.6), 0 0 70px rgba(234, 179, 8, 0.4), 0 0 100px rgba(234, 179, 8, 0.2)',
    borderColor: 'rgba(234, 179, 8, 0.8)'
  },
  cursed: {
    boxShadow: '0 0 35px rgba(220, 38, 38, 0.6), 0 0 70px rgba(220, 38, 38, 0.4), inset 0 0 30px rgba(220, 38, 38, 0.2)',
    borderColor: 'rgba(220, 38, 38, 0.8)'
  }
};

/**
 * EnhancedCard3D - Card dengan 3D tilt effect
 * 
 * Usage:
 * <EnhancedCard3D rarity="legendary" onClick={handleClick}>
 *   <YourCardContent />
 * </EnhancedCard3D>
 */
export const EnhancedCard3D: React.FC<Card3DProps> = ({
  children,
  rarity = 'common',
  className = '',
  onClick,
  disabled = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position untuk tilt calculation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring config untuk smooth movement
  const springConfig = { stiffness: 300, damping: 30 };
  
  // Transform mouse position ke rotation
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || disabled) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize ke -0.5 sampai 0.5
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  // Handle mouse leave - reset
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const glow = RARITY_GLOW[rarity];

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default'
      }}
      whileHover={!disabled ? {
        scale: 1.05,
        z: 50
      } : {}}
      whileTap={!disabled && onClick ? {
        scale: 0.98
      } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative rounded-xl overflow-hidden
        transition-all duration-300
        ${className}
      `}
    >
      {/* Glow effect layer */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: isHovered ? glow.boxShadow : 'none',
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none border-2"
        animate={{
          borderColor: isHovered ? glow.borderColor : 'transparent',
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
          transform: 'translateX(-100%)'
        }}
        animate={isHovered ? {
          transform: 'translateX(200%)'
        } : {
          transform: 'translateX(-100%)'
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

/**
 * HolographicCard - Card dengan holographic foil effect
 * Untuk kartu legendary/epic
 */
interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = '',
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setGradientPosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative rounded-xl overflow-hidden cursor-pointer
        ${className}
      `}
      style={{
        boxShadow: '0 0 40px rgba(234, 179, 8, 0.4), 0 0 80px rgba(234, 179, 8, 0.2)'
      }}
    >
      {/* Holographic gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-60"
        style={{
          background: `
            radial-gradient(
              circle at ${gradientPosition.x}% ${gradientPosition.y}%,
              rgba(255, 0, 128, 0.3) 0%,
              rgba(0, 255, 255, 0.3) 25%,
              rgba(255, 255, 0, 0.3) 50%,
              rgba(255, 0, 255, 0.3) 75%,
              transparent 100%
            )
          `,
          mixBlendMode: 'color-dodge'
        }}
      />

      {/* Rainbow border */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none z-10"
        style={{
          background: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }}
      />

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </motion.div>
  );
};

/**
 * AnimatedBorderCard - Card dengan animated border
 */
interface AnimatedBorderCardProps {
  children: React.ReactNode;
  color?: string;
  speed?: number;
  className?: string;
}

export const AnimatedBorderCard: React.FC<AnimatedBorderCardProps> = ({
  children,
  color = '#eab308',
  speed = 3,
  className = ''
}) => {
  return (
    <div className={`relative rounded-xl ${className}`}>
      {/* Animated border using conic gradient */}
      <div
        className="absolute -inset-[2px] rounded-xl"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${color}, transparent, ${color}, transparent)`,
          animation: `spin ${speed}s linear infinite`
        }}
      />
      
      {/* Inner content */}
      <div className="relative bg-zinc-900 rounded-xl">
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

export default EnhancedCard3D;
