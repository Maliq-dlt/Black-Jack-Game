import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ParticleType = 
  | 'confetti' 
  | 'coins' 
  | 'sparkle' 
  | 'card_burst'
  | 'gold_shower'
  | 'level_up'
  | 'joker_trigger'
  | 'combo_chain'
  | 'shockwave'
  | 'fireworks'
  | 'rain'
  | 'snow';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  type: ParticleType;
  trigger: boolean;
  origin?: { x: number; y: number };
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
  duration?: number;
  onComplete?: () => void;
}

// Particle configurations
const PARTICLE_CONFIGS: Record<ParticleType, {
  count: (intensity: number) => number;
  colors: string[];
  gravity: number;
  drag: number;
  sizeRange: [number, number];
  speedRange: [number, number];
  lifeRange: [number, number];
  shapes: ('circle' | 'square' | 'diamond' | 'star')[];
}> = {
  confetti: {
    count: (i) => 30 * i,
    colors: ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899'],
    gravity: 0.3,
    drag: 0.99,
    sizeRange: [6, 12],
    speedRange: [5, 15],
    lifeRange: [2000, 4000],
    shapes: ['square']
  },
  coins: {
    count: (i) => 20 * i,
    colors: ['#eab308', '#ca8a04', '#fbbf24', '#fcd34d'],
    gravity: 0.5,
    drag: 0.98,
    sizeRange: [12, 20],
    speedRange: [8, 20],
    lifeRange: [2500, 4500],
    shapes: ['circle']
  },
  sparkle: {
    count: (i) => 25 * i,
    colors: ['#ffffff', '#fef3c7', '#dbeafe', '#fce7f3'],
    gravity: -0.1,
    drag: 0.97,
    sizeRange: [3, 8],
    speedRange: [2, 8],
    lifeRange: [1500, 3000],
    shapes: ['star']
  },
  card_burst: {
    count: (i) => 15 * i,
    colors: ['#d4d4d8', '#a1a1aa', '#ffffff', '#71717a'],
    gravity: 0.4,
    drag: 0.98,
    sizeRange: [20, 35],
    speedRange: [10, 25],
    lifeRange: [2000, 3500],
    shapes: ['square']
  },
  gold_shower: {
    count: (i) => 40 * i,
    colors: ['#eab308', '#fbbf24', '#fcd34d', '#f59e0b'],
    gravity: 0.6,
    drag: 0.99,
    sizeRange: [8, 16],
    speedRange: [10, 25],
    lifeRange: [3000, 5000],
    shapes: ['circle', 'diamond']
  },
  level_up: {
    count: (i) => 35 * i,
    colors: ['#eab308', '#fbbf24', '#ffffff', '#fef3c7'],
    gravity: -0.2,
    drag: 0.96,
    sizeRange: [4, 12],
    speedRange: [5, 15],
    lifeRange: [2500, 4000],
    shapes: ['star', 'circle']
  },
  joker_trigger: {
    count: (i) => 20 * i,
    colors: ['#a855f7', '#c084fc', '#e9d5ff', '#ffffff'],
    gravity: 0.2,
    drag: 0.97,
    sizeRange: [6, 14],
    speedRange: [8, 18],
    lifeRange: [2000, 3500],
    shapes: ['star', 'diamond']
  },
  combo_chain: {
    count: (i) => 25 * i,
    colors: ['#22c55e', '#4ade80', '#86efac', '#ffffff'],
    gravity: 0.3,
    drag: 0.98,
    sizeRange: [5, 12],
    speedRange: [6, 16],
    lifeRange: [2000, 3500],
    shapes: ['circle', 'star']
  },
  shockwave: {
    count: () => 1,
    colors: ['#ffffff'],
    gravity: 0,
    drag: 1,
    sizeRange: [0, 0],
    speedRange: [0, 0],
    lifeRange: [600, 800],
    shapes: ['circle']
  },
  fireworks: {
    count: (i) => 50 * i,
    colors: ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#ffffff'],
    gravity: 0.15,
    drag: 0.98,
    sizeRange: [3, 8],
    speedRange: [15, 30],
    lifeRange: [1500, 2500],
    shapes: ['circle']
  },
  rain: {
    count: (i) => 60 * i,
    colors: ['#60a5fa', '#3b82f6', '#2563eb'],
    gravity: 0.8,
    drag: 1,
    sizeRange: [2, 4],
    speedRange: [15, 25],
    lifeRange: [1000, 2000],
    shapes: ['square']
  },
  snow: {
    count: (i) => 50 * i,
    colors: ['#ffffff', '#f3f4f6', '#e5e7eb'],
    gravity: 0.2,
    drag: 0.99,
    sizeRange: [4, 10],
    speedRange: [2, 6],
    lifeRange: [4000, 8000],
    shapes: ['circle']
  }
};

const INTENSITY_MULTIPLIERS = {
  low: 1,
  medium: 1.5,
  high: 2.5,
  extreme: 4
};

/**
 * ParticleSystem - Advanced particle effects
 * 
 * Features:
 * - 12+ particle types
 * - Physics-based movement
 * - Configurable intensity
 * - Auto-cleanup
 */
export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  type,
  trigger,
  origin = { x: 0.5, y: 0.5 },
  intensity = 'medium',
  duration = 3000,
  onComplete
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const createParticles = useCallback(() => {
    const config = PARTICLE_CONFIGS[type];
    const intensityMult = INTENSITY_MULTIPLIERS[intensity];
    const count = config.count(intensityMult);
    
    const newParticles: Particle[] = [];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const originX = origin.x * viewportWidth;
    const originY = origin.y * viewportHeight;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);
      
      newParticles.push({
        id: Date.now() + i,
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === 'fireworks' ? 10 : 0),
        size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
        rotation: Math.random() * 360,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        opacity: 1,
        life: 0,
        maxLife: config.lifeRange[0] + Math.random() * (config.lifeRange[1] - config.lifeRange[0])
      });
    }

    return newParticles;
  }, [type, intensity, origin]);

  useEffect(() => {
    if (trigger) {
      const newParticles = createParticles();
      setParticles(newParticles);
      startTimeRef.current = performance.now();

      const config = PARTICLE_CONFIGS[type];

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTimeRef.current;

        if (elapsed > duration) {
          setParticles([]);
          onComplete?.();
          return;
        }

        setParticles(prevParticles => {
          // ⚡ Bolt: Use a single-pass loop to avoid O(N) array allocation overhead from chained map/filter in requestAnimationFrame
          const nextParticles = [];
          for (let i = 0; i < prevParticles.length; i++) {
            const p = prevParticles[i];
            const newLife = p.life + 16;
            const lifeProgress = newLife / p.maxLife;
            
            // Fade out near end of life
            const newOpacity = Math.max(0, lifeProgress > 0.7 ? 1 - (lifeProgress - 0.7) / 0.3 : 1);

            if (newLife < p.maxLife && newOpacity > 0) {
              // Update position
              const newVx = p.vx * config.drag;
              const newVy = p.vy * config.drag + config.gravity;

              nextParticles.push({
                ...p,
                x: p.x + newVx,
                y: p.y + newVy,
                vx: newVx,
                vy: newVy,
                rotation: p.rotation + (p.vx * 2),
                life: newLife,
                opacity: newOpacity
              });
            }
          }
          return nextParticles;
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [trigger, createParticles, duration, type, onComplete]);

  const config = PARTICLE_CONFIGS[type];

  const renderParticle = (particle: Particle) => {
    const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
    
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: particle.x,
      top: particle.y,
      width: particle.size,
      height: particle.size,
      backgroundColor: particle.color,
      opacity: particle.opacity,
      transform: `rotate(${particle.rotation}deg)`,
      pointerEvents: 'none'
    };

    switch (shape) {
      case 'circle':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              borderRadius: '50%',
              boxShadow: `0 0 ${particle.size}px ${particle.color}`
            }}
          />
        );
      case 'square':
        return (
          <div
            key={particle.id}
            style={baseStyle}
          />
        );
      case 'diamond':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            }}
          />
        );
      case 'star':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
            }}
          />
        );
      default:
        return null;
    }
  };

  if (type === 'shockwave') {
    return (
      <AnimatePresence>
        {trigger && particles.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: origin.x * window.innerWidth - 100,
              top: origin.y * window.innerHeight - 100,
              width: 200,
              height: 200,
              border: '4px solid white',
              borderRadius: '50%',
              boxShadow: '0 0 60px rgba(255, 255, 255, 0.5)'
            }}
          />
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderParticle(particle)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * ParticleBurst - One-shot particle burst at click position
 */
interface ParticleBurstProps {
  x: number;
  y: number;
  type?: ParticleType;
  onComplete?: () => void;
}

export const ParticleBurst: React.FC<ParticleBurstProps> = ({
  x,
  y,
  type = 'sparkle',
  onComplete
}) => {
  const [trigger, setTrigger] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTrigger(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <ParticleSystem
      type={type}
      trigger={trigger}
      origin={{ x: x / window.innerWidth, y: y / window.innerHeight }}
      intensity="medium"
      duration={2000}
    />
  );
};

/**
 * ContinuousParticles - Particles yang terus berjalan (rain, snow)
 */
interface ContinuousParticlesProps {
  type: 'rain' | 'snow';
  density?: 'low' | 'medium' | 'high';
}

export const ContinuousParticles: React.FC<ContinuousParticlesProps> = ({
  type,
  density = 'medium'
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  const densityMult = { low: 0.5, medium: 1, high: 2 }[density];

  useEffect(() => {
    const config = PARTICLE_CONFIGS[type];
    const particleCount = Math.floor(config.count(densityMult));

    // Initialize particles
    const initialParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),
        size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
        rotation: Math.random() * 360,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        opacity: 0.5 + Math.random() * 0.5,
        life: 0,
        maxLife: Infinity
      });
    }
    setParticles(initialParticles);

    const animate = () => {
      setParticles(prevParticles => 
        prevParticles.map(p => {
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;

          // Reset if out of bounds
          if (newY > window.innerHeight) {
            newY = -20;
            newX = Math.random() * window.innerWidth;
          }
          if (newX > window.innerWidth) newX = 0;
          if (newX < 0) newX = window.innerWidth;

          return {
            ...p,
            x: newX,
            y: newY
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, densityMult]);

  const config = PARTICLE_CONFIGS[type];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: type === 'rain' ? particle.size * 3 : particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            borderRadius: type === 'snow' ? '50%' : '0',
            transform: type === 'rain' ? 'rotate(15deg)' : 'none'
          }}
        />
      ))}
    </div>
  );
};

export default ParticleSystem;
