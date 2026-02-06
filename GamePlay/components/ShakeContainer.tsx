import React, { useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion, useAnimation, AnimationControls } from 'framer-motion';

export type ShakeIntensity = 'light' | 'medium' | 'heavy' | 'extreme';

interface ShakeConfig {
  x: number;
  y: number;
  rotation: number;
  duration: number;
  transition: number;
}

const SHAKE_CONFIGS: Record<ShakeIntensity, ShakeConfig> = {
  light: {
    x: 5,
    y: 5,
    rotation: 2,
    duration: 0.2,
    transition: 0.03
  },
  medium: {
    x: 12,
    y: 12,
    rotation: 4,
    duration: 0.35,
    transition: 0.025
  },
  heavy: {
    x: 25,
    y: 25,
    rotation: 7,
    duration: 0.5,
    transition: 0.02
  },
  extreme: {
    x: 40,
    y: 40,
    rotation: 10,
    duration: 0.8,
    transition: 0.015
  }
};

export interface ShakeContainerRef {
  shake: (intensity?: ShakeIntensity) => Promise<void>;
  shakeSequence: (intensities: ShakeIntensity[]) => Promise<void>;
  pulse: () => Promise<void>;
  bounce: () => Promise<void>;
}

interface ShakeContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onShakeStart?: () => void;
  onShakeEnd?: () => void;
}

/**
 * ShakeContainer - Komponen wrapper yang bisa di-shake
 * 
 * Usage dengan ref:
 * const shakeRef = useRef<ShakeContainerRef>(null);
 * <ShakeContainer ref={shakeRef}>
 *   <YourContent />
 * </ShakeContainer>
 * 
 * // Trigger shake
 * shakeRef.current?.shake('heavy');
 */
export const ShakeContainer = forwardRef<ShakeContainerRef, ShakeContainerProps>(
  ({ children, className = '', id, onShakeStart, onShakeEnd }, ref) => {
    const controls = useAnimation();
    const isShakingRef = useRef(false);

    const shake = useCallback(async (intensity: ShakeIntensity = 'medium') => {
      if (isShakingRef.current) return;
      
      isShakingRef.current = true;
      onShakeStart?.();
      
      const config = SHAKE_CONFIGS[intensity];
      const startTime = Date.now();
      const duration = config.duration * 1000;
      
      const animate = async () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        if (progress >= 1) {
          await controls.start({
            x: 0,
            y: 0,
            rotate: 0,
            transition: { duration: 0.1 }
          });
          isShakingRef.current = false;
          onShakeEnd?.();
          return;
        }
        
        // Dampening effect
        const dampening = Math.pow(1 - progress, 2);
        
        const offsetX = (Math.random() - 0.5) * config.x * 2 * dampening;
        const offsetY = (Math.random() - 0.5) * config.y * 2 * dampening;
        const rotation = (Math.random() - 0.5) * config.rotation * 2 * dampening;
        
        await controls.start({
          x: offsetX,
          y: offsetY,
          rotate: rotation,
          transition: { duration: config.transition }
        });
        
        requestAnimationFrame(animate);
      };
      
      await animate();
    }, [controls, onShakeStart, onShakeEnd]);

    const shakeSequence = useCallback(async (intensities: ShakeIntensity[]) => {
      for (const intensity of intensities) {
        await shake(intensity);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }, [shake]);

    const pulse = useCallback(async () => {
      await controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.2 }
      });
    }, [controls]);

    const bounce = useCallback(async () => {
      await controls.start({
        y: [0, -10, 0],
        transition: { 
          duration: 0.4,
          times: [0, 0.5, 1],
          ease: 'easeOut'
        }
      });
    }, [controls]);

    useImperativeHandle(ref, () => ({
      shake,
      shakeSequence,
      pulse,
      bounce
    }));

    return (
      <motion.div
        id={id}
        animate={controls}
        className={className}
        style={{ willChange: 'transform' }}
      >
        {children}
      </motion.div>
    );
  }
);

ShakeContainer.displayName = 'ShakeContainer';

/**
 * ShakeOnEvent - Komponen yang shake otomatis saat event tertentu
 */
interface ShakeOnEventProps {
  children: React.ReactNode;
  trigger: boolean;
  intensity?: ShakeIntensity;
  className?: string;
  onShakeComplete?: () => void;
}

export const ShakeOnEvent: React.FC<ShakeOnEventProps> = ({
  children,
  trigger,
  intensity = 'medium',
  className = '',
  onShakeComplete
}) => {
  const shakeRef = useRef<ShakeContainerRef>(null);
  const hasTriggeredRef = useRef(false);

  React.useEffect(() => {
    if (trigger && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      shakeRef.current?.shake(intensity).then(() => {
        onShakeComplete?.();
        hasTriggeredRef.current = false;
      });
    }
  }, [trigger, intensity, onShakeComplete]);

  return (
    <ShakeContainer ref={shakeRef} className={className}>
      {children}
    </ShakeContainer>
  );
};

/**
 * GameContainer - Container utama game dengan shake support global
 */
interface GameContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const GameContainer = forwardRef<ShakeContainerRef, GameContainerProps>(
  ({ children, className = '' }, ref) => {
    return (
      <ShakeContainer
        ref={ref}
        id="game-container"
        className={`relative min-h-screen overflow-hidden ${className}`}
      >
        {children}
      </ShakeContainer>
    );
  }
);

GameContainer.displayName = 'GameContainer';

export default ShakeContainer;
