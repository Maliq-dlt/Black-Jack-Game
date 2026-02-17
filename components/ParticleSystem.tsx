import React, { useEffect, useRef, useState } from 'react';
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
  rotationSpeed: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  shape: 'circle' | 'square' | 'diamond' | 'star';
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
 * ⚡ Bolt: Canvas-based ParticleSystem for high-performance rendering.
 * Replaces previous DOM-based implementation to eliminate React reconciliation overhead
 * for hundreds of particles per frame.
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

  // Helper to draw specific shapes
  const drawShape = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    
    ctx.beginPath();
    
    if (p.shape === 'circle') {
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    } else if (p.shape === 'square') {
      ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
    } else if (p.shape === 'diamond') {
      ctx.moveTo(0, -p.size / 2);
      ctx.lineTo(p.size / 2, 0);
      ctx.lineTo(0, p.size / 2);
      ctx.lineTo(-p.size / 2, 0);
      ctx.closePath();
    } else if (p.shape === 'star') {
      const spikes = 5;
      const outerRadius = p.size / 2;
      const innerRadius = p.size / 4;
      let rot = (Math.PI / 2) * 3;
      let x = 0;
      let y = 0;
      const step = Math.PI / spikes;

      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outerRadius;
        y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(0, -outerRadius);
      ctx.closePath();
    }

    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    // Shockwave is handled by separate component/branch below
    if (type === 'shockwave') return;

    if (trigger && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle Resize
      const updateSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      updateSize();
      window.addEventListener('resize', updateSize);

      // Initialize Particles
      const config = PARTICLE_CONFIGS[type];
      const intensityMult = INTENSITY_MULTIPLIERS[intensity];
      const count = config.count(intensityMult);

      const newParticles: Particle[] = [];
      const originX = origin.x * canvas.width;
      const originY = origin.y * canvas.height;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);

        newParticles.push({
          id: i,
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (type === 'fireworks' ? 10 : 0),
          size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          color: config.colors[Math.floor(Math.random() * config.colors.length)],
          opacity: 1,
          life: 0,
          maxLife: config.lifeRange[0] + Math.random() * (config.lifeRange[1] - config.lifeRange[0]),
          shape: config.shapes[Math.floor(Math.random() * config.shapes.length)]
        });
      }

      particlesRef.current = newParticles;
      startTimeRef.current = performance.now();

      // Animation Loop
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTimeRef.current;

        if (elapsed > duration) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particlesRef.current = [];
          onComplete?.();
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let activeParticles = 0;

        particlesRef.current.forEach(p => {
          if (p.life >= p.maxLife) return;

          activeParticles++;

          // Physics
          p.vx *= config.drag;
          p.vy = p.vy * config.drag + config.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          p.life += 16; // approximate frame time

          // Fade out
          const lifeProgress = p.life / p.maxLife;
          if (lifeProgress > 0.7) {
            p.opacity = 1 - (lifeProgress - 0.7) / 0.3;
          }

          if (p.opacity > 0) {
            drawShape(ctx, p);
          }
        });

        if (activeParticles === 0 && elapsed > 500) { // Safety buffer
           onComplete?.();
           return;
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        window.removeEventListener('resize', updateSize);
      };
    }
  }, [trigger, type, intensity, origin, duration, onComplete]);

  // Special case for Shockwave (keep as DOM/Framer Motion for now)
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

  // Canvas container
  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[9999] ${!trigger ? 'hidden' : ''}`}
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
 * ContinuousParticles - Particles that run continuously (rain, snow)
 * Kept as DOM-based for now as it wasn't the main bottleneck target,
 * but simplified slightly.
 */
interface ContinuousParticlesProps {
  type: 'rain' | 'snow';
  density?: 'low' | 'medium' | 'high';
}

interface ContinuousParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

export const ContinuousParticles: React.FC<ContinuousParticlesProps> = ({
  type,
  density = 'medium'
}) => {
  const [particles, setParticles] = useState<ContinuousParticle[]>([]);
  const animationRef = useRef<number | null>(null);

  const densityMult = { low: 0.5, medium: 1, high: 2 }[density];

  useEffect(() => {
    const config = PARTICLE_CONFIGS[type];
    const particleCount = Math.floor(config.count(densityMult));

    // Initialize particles
    const initialParticles: ContinuousParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),
        size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        opacity: 0.5 + Math.random() * 0.5,
      });
    }
    setParticles(initialParticles);

    const animate = () => {
      setParticles(prevParticles => 
        prevParticles.map(p => {
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;

          if (newY > window.innerHeight) {
            newY = -20;
            newX = Math.random() * window.innerWidth;
          }
          if (newX > window.innerWidth) newX = 0;
          if (newX < 0) newX = window.innerWidth;

          return { ...p, x: newX, y: newY };
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
