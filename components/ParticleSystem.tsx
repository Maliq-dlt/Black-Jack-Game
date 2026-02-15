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

type ShapeType = 'circle' | 'square' | 'diamond' | 'star';

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
  shape: ShapeType;
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
  shapes: ShapeType[];
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
 * - ⚡ Bolt Optimized: Uses HTML5 Canvas for high-performance rendering (no DOM/React overhead)
 */
export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  type,
  trigger,
  origin = { x: 0.5, y: 0.5 },
  intensity = 'medium',
  duration = 3000,
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
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
      const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
      
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
        maxLife: config.lifeRange[0] + Math.random() * (config.lifeRange[1] - config.lifeRange[0]),
        shape: shape
      });
    }

    return newParticles;
  }, [type, intensity, origin]);

  const drawParticle = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      const half = p.size / 2;

      switch (p.shape) {
          case 'circle':
              ctx.beginPath();
              ctx.arc(0, 0, half, 0, Math.PI * 2);
              ctx.fill();
              // Simulate shadow
              ctx.shadowColor = p.color;
              ctx.shadowBlur = p.size;
              break;
          case 'square':
              ctx.fillRect(-half, -half, p.size, p.size);
              break;
          case 'diamond':
              ctx.beginPath();
              ctx.moveTo(0, -half);
              ctx.lineTo(half, 0);
              ctx.lineTo(0, half);
              ctx.lineTo(-half, 0);
              ctx.closePath();
              ctx.fill();
              break;
          case 'star':
              // Simple 5-point star
              ctx.beginPath();
              const spikes = 5;
              const outerRadius = half;
              const innerRadius = half / 2;
              let rot = Math.PI / 2 * 3;
              let x = 0;
              let y = 0;
              let step = Math.PI / spikes;

              ctx.moveTo(0, 0 - outerRadius);
              for (let i = 0; i < spikes; i++) {
                  x = 0 + Math.cos(rot) * outerRadius;
                  y = 0 + Math.sin(rot) * outerRadius;
                  ctx.lineTo(x, y);
                  rot += step;

                  x = 0 + Math.cos(rot) * innerRadius;
                  y = 0 + Math.sin(rot) * innerRadius;
                  ctx.lineTo(x, y);
                  rot += step;
              }
              ctx.lineTo(0, 0 - outerRadius);
              ctx.closePath();
              ctx.fill();
              break;
      }

      ctx.restore();
  };

  useEffect(() => {
    // Handle resize
    const handleResize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (trigger) {
      particlesRef.current = createParticles();
      startTimeRef.current = performance.now();
      const config = PARTICLE_CONFIGS[type];

      if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
      }

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTimeRef.current;
        const ctx = canvasRef.current?.getContext('2d');

        if (!ctx || !canvasRef.current) return;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (elapsed > duration && particlesRef.current.length === 0) {
          onComplete?.();
          return;
        }

        // Update and draw particles
        // Filter in place by creating a new array only if needed, but for perf we just filter
        let activeParticles = 0;

        // Iterate backwards to allow safe removal if we were splicing,
        // but here we build a new list or just filter?
        // Filtering creates new arrays which is GC pressure.
        // Better to swap-remove or just map-filter.
        // Given existing pattern was map-filter, let's just loop and push to a temp array for next frame.

        const nextParticles: Particle[] = [];

        for (const p of particlesRef.current) {
            const newLife = p.life + 16; // approximate 60fps
            if (newLife >= p.maxLife) continue;

            const lifeProgress = newLife / p.maxLife;
            
            // Update position
            const newVx = p.vx * config.drag;
            const newVy = p.vy * config.drag + config.gravity;
            const newX = p.x + newVx;
            const newY = p.y + newVy;
            
            // Update rotation
            const newRotation = p.rotation + (p.vx * 2);

            // Fade out
            const newOpacity = lifeProgress > 0.7 ? 1 - (lifeProgress - 0.7) / 0.3 : 1;

            if (newOpacity <= 0) continue;

            // Update particle in place (conceptually), but we need new object for immutable ref?
            // Actually with useRef we can mutate objects if we want, but let's be clean.
            p.x = newX;
            p.y = newY;
            p.vx = newVx;
            p.vy = newVy;
            p.rotation = newRotation;
            p.life = newLife;
            p.opacity = newOpacity;

            drawParticle(ctx, p);
            nextParticles.push(p);
            activeParticles++;
        }

        particlesRef.current = nextParticles;

        if (activeParticles > 0 || elapsed <= duration) {
             animationRef.current = requestAnimationFrame(animate);
        } else {
             ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
             onComplete?.();
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
        // If trigger false, clear canvas?
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }
  }, [trigger, createParticles, duration, type, onComplete]);

  if (type === 'shockwave') {
    return (
      <AnimatePresence>
        {trigger && (
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
    <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ width: '100%', height: '100%' }}
    />
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
 * Note: Kept as separate DOM implementation for now as it's less performance critical
 * (lower count usually) and handles wrapping differently.
 * TODO: Port to canvas if density increases.
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
        // Need to cast shape or pick one, but for rain/snow config usually has 1 shape
        const shape = config.shapes[0];
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
        maxLife: Infinity,
        shape: shape
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
