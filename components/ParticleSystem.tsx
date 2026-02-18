import React, { useEffect, useRef, useState, useCallback } from 'react';
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
 * ⚡ Bolt: ParticleSystem - Performance Optimized with Canvas
 * 
 * Replaced expensive DOM-based rendering (100+ motion.divs) with a single Canvas element.
 * Uses requestAnimationFrame for silky smooth 60fps animations without React overhead.
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
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);

  // Keep callback ref fresh
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Handle resize
  const updateSize = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
      canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
      canvasRef.current.style.width = `${window.innerWidth}px`;
      canvasRef.current.style.height = `${window.innerHeight}px`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [updateSize]);

  // Main Animation Loop
  useEffect(() => {
    if (!trigger || type === 'shockwave') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset
    updateSize(); // Ensure size is correct before starting
    const config = PARTICLE_CONFIGS[type];
    const count = config.count(INTENSITY_MULTIPLIERS[intensity]);
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const originX = origin.x * viewportWidth;
    const originY = origin.y * viewportHeight;

    // Initialize Particles
    particlesRef.current = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);
      const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];

      particlesRef.current.push({
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
        shape
      });
    }

    startTimeRef.current = performance.now();

    const animate = (time: number) => {
      if (!ctx || !canvas) return;
      const elapsed = time - startTimeRef.current;

      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onCompleteRef.current?.();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio); // Handle High DPI

      // Update and Draw
      particlesRef.current = particlesRef.current.map(p => {
        const newLife = p.life + 16.67; // Assuming 60fps
        const lifeProgress = newLife / p.maxLife;

        // Physics
        const newVx = p.vx * config.drag;
        const newVy = p.vy * config.drag + config.gravity;
        const newX = p.x + newVx;
        const newY = p.y + newVy;
        const newRotation = p.rotation + (p.vx * 2);

        // Opacity
        const newOpacity = lifeProgress > 0.7 ? 1 - (lifeProgress - 0.7) / 0.3 : 1;

        if (newLife >= p.maxLife || newOpacity <= 0) return null;

        // Draw
        ctx.save();
        ctx.translate(newX, newY);
        ctx.rotate((newRotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, newOpacity);
        ctx.fillStyle = p.color;

        switch (p.shape) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
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
            // Simple 5-point star
            const spikes = 5;
            const outerRadius = p.size / 2;
            const innerRadius = p.size / 4;
            let rot = Math.PI / 2 * 3;
            let x = 0;
            let y = 0;
            const step = Math.PI / spikes;

            ctx.beginPath();
            ctx.moveTo(0, -outerRadius);
            for(let i=0; i<spikes; i++){
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
            ctx.fill();
            break;
        }

        ctx.restore();

        return {
          ...p,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: newRotation,
          life: newLife,
          opacity: newOpacity,
          shape: p.shape // Keep shape
        };
      }).filter((p): p is Particle => p !== null);

      ctx.restore();

      if (particlesRef.current.length > 0) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        onCompleteRef.current?.();
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [trigger, type, intensity, origin, duration, updateSize]);

  // Special Case for Shockwave (keep as DOM for Framer Motion spring physics)
  if (type === 'shockwave') {
    return (
      <AnimatePresence>
        {trigger && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8, borderWidth: '4px' }}
            animate={{ scale: 4, opacity: 0, borderWidth: '0px' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: origin.x * window.innerWidth - 100,
              top: origin.y * window.innerHeight - 100,
              width: 200,
              height: 200,
              borderColor: 'white',
              borderStyle: 'solid',
              borderRadius: '50%',
              boxShadow: '0 0 60px rgba(255, 255, 255, 0.5)'
            }}
            onAnimationComplete={onComplete}
          />
        )}
      </AnimatePresence>
    );
  }

  // Canvas Render
  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[9999] ${trigger ? 'block' : 'hidden'}`}
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
 * ContinuousParticles - Optimized with Canvas for Rain/Snow
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
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>();

  const updateSize = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
      canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [updateSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = PARTICLE_CONFIGS[type];
    const densityMult = { low: 0.5, medium: 1, high: 2 }[density];
    const particleCount = Math.floor(config.count(densityMult));

    // Initialize
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
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
            shape: type === 'snow' ? 'circle' : 'square' // Simple mapping
        });
    }

    const animate = () => {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        particlesRef.current.forEach(p => {
            // Update
            p.x += p.vx;
            p.y += p.vy;

            // Reset loop
            if (p.y > window.innerHeight) {
                p.y = -20;
                p.x = Math.random() * window.innerWidth;
            }
            if (p.x > window.innerWidth) p.x = 0;
            if (p.x < 0) p.x = window.innerWidth;

            // Draw
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;

            if (type === 'snow') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.translate(p.x, p.y);
                ctx.rotate(15 * Math.PI / 180); // Rain slant
                ctx.fillRect(0, 0, p.size, p.size * 3); // Rain drop shape
                ctx.rotate(-15 * Math.PI / 180);
                ctx.translate(-p.x, -p.y);
            }
        });

        ctx.restore();
        requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [type, density, updateSize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ParticleSystem;
