import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * ============================================
 * PHASE 1: Ambient Background Effects
 * ============================================
 * 
 * High Impact, Low Effort Upgrade
 * - Floating particles (dust motes, sparkles)
 * - Parallax layers
 * - Vignette effect
 * - Subtle texture overlays
 */

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface AmbientParticlesProps {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

/**
 * AmbientParticles - Floating particles untuk background
 * 
 * Usage:
 * <AmbientParticles count={50} color="#eab308" />
 */
export const AmbientParticles: React.FC<AmbientParticlesProps> = ({
  count = 30,
  color = '#eab308',
  minSize = 2,
  maxSize = 6,
  className = ''
}) => {
  // Generate particles sekali saja dengan useMemo
  const particles = useMemo<FloatingParticle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.4
    }));
  }, [count, minSize, maxSize]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${color}`
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

/**
 * VignetteOverlay - Dark edges untuk focus
 */
interface VignetteOverlayProps {
  intensity?: number;
  color?: string;
  className?: string;
}

export const VignetteOverlay: React.FC<VignetteOverlayProps> = ({
  intensity = 0.7,
  color = '#000000',
  className = ''
}) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(ellipse at center, transparent 0%, transparent 40%, ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')} 100%)`
      }}
    />
  );
};

/**
 * NoiseTexture - Subtle grain overlay
 */
interface NoiseTextureProps {
  opacity?: number;
  className?: string;
}

export const NoiseTexture: React.FC<NoiseTextureProps> = ({
  opacity = 0.03,
  className = ''
}) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay'
      }}
    />
  );
};

/**
 * Scanlines - Retro CRT effect (optional)
 */
interface ScanlinesProps {
  opacity?: number;
  lineHeight?: number;
  className?: string;
}

export const Scanlines: React.FC<ScanlinesProps> = ({
  opacity = 0.03,
  lineHeight = 2,
  className = ''
}) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent ${lineHeight}px,
          rgba(0, 0, 0, 0.1) ${lineHeight}px,
          rgba(0, 0, 0, 0.1) ${lineHeight * 2}px
        )`
      }}
    />
  );
};

/**
 * ParallaxBackground - Background dengan parallax effect
 */
interface ParallaxLayer {
  image?: string;
  color?: string;
  speed: number;
  opacity?: number;
}

interface ParallaxBackgroundProps {
  layers: ParallaxLayer[];
  className?: string;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  layers,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className={`fixed inset-0 overflow-hidden ${className}`}>
      {layers.map((layer, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{
            backgroundImage: layer.image ? `url(${layer.image})` : undefined,
            backgroundColor: layer.color,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: layer.opacity ?? 1
          }}
          animate={{
            x: mousePosition.x * layer.speed * 20,
            y: mousePosition.y * layer.speed * 20
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
        />
      ))}
    </div>
  );
};

/**
 * GameBackground - Complete background setup
 */
interface GameBackgroundProps {
  showParticles?: boolean;
  showVignette?: boolean;
  showNoise?: boolean;
  showScanlines?: boolean;
  particleColor?: string;
  particleCount?: number;
  className?: string;
}

export const GameBackground: React.FC<GameBackgroundProps> = ({
  showParticles = true,
  showVignette = true,
  showNoise = true,
  showScanlines = false,
  particleColor = '#eab308',
  particleCount = 30,
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 ${className}`}>
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #1a1a2e 0%, #0a0a0a 50%, #000000 100%)'
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #eab308 0%, transparent 70%)',
            filter: 'blur(100px)',
            top: '-20%',
            left: '-10%'
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
            filter: 'blur(80px)',
            bottom: '-10%',
            right: '-5%'
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Optional effects */}
      {showParticles && (
        <AmbientParticles 
          count={particleCount} 
          color={particleColor}
        />
      )}
      {showVignette && <VignetteOverlay intensity={0.6} />}
      {showNoise && <NoiseTexture opacity={0.02} />}
      {showScanlines && <Scanlines opacity={0.02} />}
    </div>
  );
};

export default GameBackground;
