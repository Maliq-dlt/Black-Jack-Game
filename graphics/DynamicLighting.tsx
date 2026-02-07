import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

/**
 * ============================================
 * PHASE 3: Dynamic Lighting System
 * ============================================
 * 
 * High Effort Upgrade
 * - Mouse-following light source
 * - Ambient lighting changes
 * - Spotlight effects
 * - Glow dan bloom simulation
 */

interface LightSource {
  id: string;
  x: number;
  y: number;
  color: string;
  intensity: number;
  radius: number;
  flicker?: boolean;
}

interface DynamicLightingProps {
  children: React.ReactNode;
  lights?: LightSource[];
  ambientIntensity?: number;
  ambientColor?: string;
  className?: string;
}

/**
 * DynamicLighting - Container dengan dynamic lighting effects
 * 
 * Usage:
 * <DynamicLighting lights={[
 *   { id: '1', x: 50, y: 50, color: '#eab308', intensity: 0.5, radius: 300 }
 * ]}>
 *   <YourContent />
 * </DynamicLighting>
 */
export const DynamicLighting: React.FC<DynamicLightingProps> = ({
  children,
  lights = [],
  ambientIntensity = 0.3,
  ambientColor = '#1a1a2e',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  // Mouse tracking untuk dynamic light
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate gradient string dari semua lights
  const generateLightGradient = () => {
    const gradientParts = lights.map(light => {
      const x = light.x;
      const y = light.y;
      const radius = light.radius;
      const color = light.color;
      const alpha = Math.floor(light.intensity * 255).toString(16).padStart(2, '0');
      
      return `radial-gradient(circle at ${x}% ${y}%, ${color}${alpha} 0%, transparent ${radius}px)`;
    });

    // Tambah ambient light
    const ambientAlpha = Math.floor(ambientIntensity * 255).toString(16).padStart(2, '0');
    gradientParts.unshift(`radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${ambientColor}${ambientAlpha} 0%, transparent 400px)`);

    return gradientParts.join(', ');
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
    >
      {/* Lighting overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: generateLightGradient(),
          mixBlendMode: 'screen'
        }}
      />

      {/* Shadow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, transparent 0%, rgba(0,0,0,0.4) 100%)`,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};

/**
 * FlickeringLight - Light source dengan flicker effect
 */
interface FlickeringLightProps {
  color?: string;
  baseIntensity?: number;
  flickerAmount?: number;
  flickerSpeed?: number;
  className?: string;
}

export const FlickeringLight: React.FC<FlickeringLightProps> = ({
  color = '#eab308',
  baseIntensity = 0.5,
  flickerAmount = 0.2,
  flickerSpeed = 0.1,
  className = ''
}) => {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      animate={{
        opacity: [
          baseIntensity - flickerAmount,
          baseIntensity + flickerAmount,
          baseIntensity - flickerAmount
        ],
        scale: [1, 1.05, 1]
      }}
      transition={{
        duration: flickerSpeed,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(20px)'
      }}
    />
  );
};

/**
 * Spotlight - Directional spotlight effect
 */
interface SpotlightProps {
  targetX: number;
  targetY: number;
  color?: string;
  intensity?: number;
  angle?: number;
  className?: string;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  targetX,
  targetY,
  color = '#ffffff',
  intensity = 0.6,
  angle = 30,
  className = ''
}) => {
  const alpha = Math.floor(intensity * 255).toString(16).padStart(2, '0');

  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `conic-gradient(from ${angle}deg at ${targetX}% ${targetY}%, ${color}${alpha} 0deg, transparent 60deg)`,
        mixBlendMode: 'overlay'
      }}
    />
  );
};

/**
 * GlowEffect - Element dengan glow effect
 */
interface GlowEffectProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  spread?: number;
  pulse?: boolean;
  className?: string;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  color = '#eab308',
  intensity = 0.5,
  spread = 20,
  pulse = false,
  className = ''
}) => {
  const glowStyle = {
    boxShadow: `0 0 ${spread}px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`,
  };

  if (pulse) {
    return (
      <motion.div
        className={className}
        animate={{
          boxShadow: [
            `0 0 ${spread}px ${color}${Math.floor(intensity * 100).toString(16).padStart(2, '0')}`,
            `0 0 ${spread * 1.5}px ${color}${Math.floor(intensity * 200).toString(16).padStart(2, '0')}`,
            `0 0 ${spread}px ${color}${Math.floor(intensity * 100).toString(16).padStart(2, '0')}`
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={className} style={glowStyle}>
      {children}
    </div>
  );
};

/**
 * BloomOverlay - Post-processing bloom simulation
 */
interface BloomOverlayProps {
  intensity?: number;
  threshold?: number;
  className?: string;
}

export const BloomOverlay: React.FC<BloomOverlayProps> = ({
  intensity = 0.5,
  threshold = 0.8,
  className = ''
}) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-[100] ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 50%, transparent ${threshold * 100}%, rgba(255,255,255,${intensity * 0.1}) 100%)`,
        mixBlendMode: 'screen',
        filter: 'blur(50px)'
      }}
    />
  );
};

/**
 * RimLight - Rim lighting effect untuk cards/elements
 */
interface RimLightProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const RimLight: React.FC<RimLightProps> = ({
  children,
  color = '#eab308',
  intensity = 0.5,
  position = 'top',
  className = ''
}) => {
  const gradientDirections = {
    top: '180deg',
    bottom: '0deg',
    left: '90deg',
    right: '270deg'
  };

  const alpha = Math.floor(intensity * 255).toString(16).padStart(2, '0');

  return (
    <div className={`relative ${className}`}>
      {/* Rim light */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-inherit"
        style={{
          background: `linear-gradient(${gradientDirections[position]}, ${color}${alpha} 0%, transparent 30%)`,
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/**
 * CandleLight - Candle flicker effect
 */
export const CandleLight: React.FC<{
  x: number;
  y: number;
  color?: string;
  className?: string;
}> = ({ x, y, color = '#ff6b35', className = '' }) => {
  return (
    <div 
      className={`absolute pointer-events-none ${className}`}
      style={{ left: x, top: y }}
    >
      {/* Flame */}
      <motion.div
        className="relative"
        animate={{
          scaleY: [1, 1.1, 0.9, 1],
          scaleX: [1, 0.95, 1.05, 1],
          rotate: [-2, 2, -2, 2, 0]
        }}
        transition={{ duration: 0.2, repeat: Infinity }}
      >
        <div 
          className="w-4 h-8 rounded-full"
          style={{
            background: `linear-gradient(to top, ${color}, #ffeb3b)`,
            boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`
          }}
        />
      </motion.div>

      {/* Light glow */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          filter: 'blur(20px)'
        }}
        animate={{
          opacity: [0.6, 0.8, 0.6],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
    </div>
  );
};

/**
 * LightningFlash - Lightning flash effect
 */
export const LightningFlash: React.FC<{
  trigger: boolean;
  onComplete?: () => void;
}> = ({ trigger, onComplete }) => {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0, 0.5, 0, 0.3, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={onComplete}
          className="fixed inset-0 pointer-events-none z-[999] bg-white"
          style={{ mixBlendMode: 'overlay' }}
        />
      )}
    </AnimatePresence>
  );
};

export default DynamicLighting;
