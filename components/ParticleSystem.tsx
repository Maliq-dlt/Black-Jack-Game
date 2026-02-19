import React, { useEffect, useRef, useCallback, useState } from 'react';
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
 * ⚡ Bolt Optimization: Replaced DOM-based particle rendering with HTML5 Canvas.
 * This drastically improves performance by avoiding React reconciliation and DOM updates
 * for hundreds of particles every frame.
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

  // Shockwave is handled via DOM/Framer Motion to preserve specific effect
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
        maxLife: config.lifeRange[0] + Math.random() * (config.lifeRange[1] - config.lifeRange[0]),
        shape: config.shapes[Math.floor(Math.random() * config.shapes.length)]
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

    switch (p.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        if (type === 'coins' || type === 'gold_shower') {
             ctx.shadowBlur = p.size / 2;
             ctx.shadowColor = p.color;
        }
        break;
      case 'square':
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        break;
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.lineTo(p.size / 2, 0);
        ctx.lineTo(0, p.size / 2);
        ctx.lineTo(-p.size / 2, 0);
        ctx.closePath();
        ctx.fill();
        break;
      case 'star':
        const spikes = 5;
        const outer = p.size / 2;
        const inner = p.size / 4;
        let rot = Math.PI / 2 * 3;
        let x = 0;
        let y = 0;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(0, -outer);
        for (let i = 0; i < spikes; i++) {
            x = Math.cos(rot) * outer;
            y = Math.sin(rot) * outer;
            ctx.lineTo(x, y);
            rot += step;

            x = Math.cos(rot) * inner;
            y = Math.sin(rot) * inner;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(0, -outer);
        ctx.closePath();
        ctx.fill();
        break;
    }
    ctx.restore();
  };

  useEffect(() => {
    if (trigger && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle DPI
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      particlesRef.current = createParticles();
      startTimeRef.current = performance.now();

      const config = PARTICLE_CONFIGS[type];

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTimeRef.current;

        if (elapsed > duration) {
          particlesRef.current = [];
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
          onComplete?.();
          return;
        }

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Update and draw particles
        const activeParticles: Particle[] = [];

        for (const p of particlesRef.current) {
            const newLife = p.life + 16;
            const lifeProgress = newLife / p.maxLife;
            
            // Update position
            const newVx = p.vx * config.drag;
            const newVy = p.vy * config.drag + config.gravity;
            const newX = p.x + newVx;
            const newY = p.y + newVy;
            
            // Update rotation
            const newRotation = p.rotation + (p.vx * 2);

            // Fade out near end of life
            const newOpacity = lifeProgress > 0.7 ? 1 - (lifeProgress - 0.7) / 0.3 : 1;

            if (newLife < p.maxLife && newOpacity > 0) {
                // Update particle in place (or create new object)
                // Since we are iterating, creating new object is safer for React mentality,
                // but since we don't expose state, mutation is fine if careful.
                // However, let's just create new object to be safe.
                const updatedParticle: Particle = {
                  ...p,
                  x: newX,
                  y: newY,
                  vx: newVx,
                  vy: newVy,
                  rotation: newRotation,
                  life: newLife,
                  opacity: Math.max(0, newOpacity)
                };

                drawParticle(ctx, updatedParticle);
                activeParticles.push(updatedParticle);
            }
        }

        particlesRef.current = activeParticles;

        if (particlesRef.current.length > 0) {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, rect.width, rect.height);
            onComplete?.();
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [trigger, createParticles, duration, type, onComplete]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            // Context scale needs to be reset after resize
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.scale(dpr, dpr);
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
 * ContinuousParticles - Optimized with Canvas
 */
interface ContinuousParticlesProps {
  type: 'rain' | 'snow';
  density?: 'low' | 'medium' | 'high';
}

export const ContinuousParticles: React.FC<ContinuousParticlesProps> = ({
  type,
  density = 'medium'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  const densityMult = { low: 0.5, medium: 1, high: 2 }[density];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

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
        maxLife: Infinity,
        shape: type === 'snow' ? 'circle' : 'square' // Simplify shapes for rain/snow
      });
    }
    particlesRef.current = initialParticles;

    const animate = () => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      particlesRef.current.forEach(p => {
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;

          // Reset if out of bounds
          if (newY > window.innerHeight) {
            newY = -20;
            newX = Math.random() * window.innerWidth;
          }
          if (newX > window.innerWidth) newX = 0;
          if (newX < 0) newX = window.innerWidth;

          p.x = newX;
          p.y = newY;

          // Draw
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;

          if (type === 'snow') {
             ctx.beginPath();
             ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
             ctx.fill();
          } else {
             // Rain
             ctx.save();
             ctx.translate(p.x, p.y);
             ctx.rotate(15 * Math.PI / 180);
             ctx.fillRect(0, 0, p.size, p.size * 3);
             ctx.restore();
          }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, densityMult]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.scale(dpr, dpr);
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ParticleSystem;
