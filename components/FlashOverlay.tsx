import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type FlashType = 'white' | 'gold' | 'red' | 'green' | 'purple' | 'blue' | 'custom';

interface FlashOverlayProps {
  isActive: boolean;
  type?: FlashType;
  customColor?: string;
  opacity?: number;
  duration?: number;
  fadeOutDuration?: number;
  onComplete?: () => void;
}

const FLASH_COLORS: Record<FlashType, string> = {
  white: '#ffffff',
  gold: '#ffd700',
  red: '#dc2626',
  green: '#22c55e',
  purple: '#a855f7',
  blue: '#3b82f6',
  custom: '#ffffff'
};

/**
 * FlashOverlay - Komponen flash effect yang bisa dikontrol via props
 * 
 * Usage:
 * <FlashOverlay 
 *   isActive={showFlash} 
 *   type="gold" 
 *   onComplete={() => setShowFlash(false)} 
 * />
 *
 * ⚡ Bolt: Wrapped in React.memo to prevent expensive re-renders when parent state updates
 */
export const FlashOverlay: React.FC<FlashOverlayProps> = React.memo(({
  isActive,
  type = 'white',
  customColor,
  opacity = 0.5,
  duration = 150,
  fadeOutDuration = 300,
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      
      // Start fade out after duration
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(fadeTimer);
    }
  }, [isActive, duration]);

  const handleAnimationComplete = useCallback(() => {
    if (!isVisible && onComplete) {
      onComplete();
    }
  }, [isVisible, onComplete]);

  const color = customColor || FLASH_COLORS[type];

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? opacity : 0 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: isVisible ? 0.05 : fadeOutDuration / 1000,
            ease: isVisible ? 'easeOut' : 'easeInOut'
          }}
          onAnimationComplete={handleAnimationComplete}
          className="fixed inset-0 pointer-events-none z-[9999]"
          style={{ backgroundColor: color }}
        />
      )}
    </AnimatePresence>
  );
});

/**
 * MultiFlashOverlay - Untuk efek flash berulang (seperti win celebration)
 */
interface MultiFlashOverlayProps {
  flashes: Array<{
    type: FlashType;
    delay: number;
    opacity?: number;
    duration?: number;
  }>;
  onComplete?: () => void;
}

export const MultiFlashOverlay: React.FC<MultiFlashOverlayProps> = ({
  flashes,
  onComplete
}) => {
  const [activeFlashes, setActiveFlashes] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    flashes.forEach((flash, index) => {
      const timer = setTimeout(() => {
        setActiveFlashes(prev => new Set([...prev, index]));
        
        // Remove after flash duration
        const removeTimer = setTimeout(() => {
          setActiveFlashes(prev => {
            const next = new Set(prev);
            next.delete(index);
            return next;
          });
        }, (flash.duration || 150) + 100);
        
        timers.push(removeTimer);
      }, flash.delay);
      
      timers.push(timer);
    });

    // Complete after all flashes
    const maxDelay = Math.max(...flashes.map(f => f.delay + (f.duration || 150)));
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, maxDelay + 500);
    
    timers.push(completeTimer);

    return () => timers.forEach(clearTimeout);
  }, [flashes, onComplete]);

  return (
    <>
      {flashes.map((flash, index) => (
        activeFlashes.has(index) && (
          <FlashOverlay
            key={index}
            isActive={true}
            type={flash.type}
            opacity={flash.opacity || 0.5}
            duration={flash.duration || 150}
          />
        )
      ))}
    </>
  );
};

/**
 * ShockwaveEffect - Efek gelombang kejut dari titik tertentu
 */
interface ShockwaveEffectProps {
  originX: number;
  originY: number;
  color?: string;
  size?: number;
  isActive: boolean;
  onComplete?: () => void;
}

export const ShockwaveEffect: React.FC<ShockwaveEffectProps> = ({
  originX,
  originY,
  color = '#ffd700',
  size = 300,
  isActive,
  onComplete
}) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ 
            width: 0, 
            height: 0, 
            opacity: 0.8,
            x: originX,
            y: originY
          }}
          animate={{ 
            width: size, 
            height: size, 
            opacity: 0,
            x: originX - size / 2,
            y: originY - size / 2
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onAnimationComplete={onComplete}
          className="fixed pointer-events-none z-[9998] rounded-full border-4"
          style={{ 
            borderColor: color,
            boxShadow: `0 0 30px ${color}, inset 0 0 30px ${color}`
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default FlashOverlay;
