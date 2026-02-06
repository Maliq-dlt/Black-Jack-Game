import { useCallback, useRef, useEffect } from 'react';

export type ShakeIntensity = 'light' | 'medium' | 'heavy' | 'extreme';
export type FlashColor = 'white' | 'gold' | 'red' | 'green' | 'purple' | 'blue' | 'custom';

interface ShakeConfig {
  x: number;
  y: number;
  rotation: number;
  duration: number;
  frequency: number; // shakes per second
}

interface FlashConfig {
  color: string;
  opacity: number;
  duration: number;
  fadeOut: number;
}

const SHAKE_PRESETS: Record<ShakeIntensity, ShakeConfig> = {
  light: {
    x: 4,
    y: 4,
    rotation: 1,
    duration: 200,
    frequency: 30
  },
  medium: {
    x: 10,
    y: 10,
    rotation: 3,
    duration: 350,
    frequency: 25
  },
  heavy: {
    x: 20,
    y: 20,
    rotation: 5,
    duration: 500,
    frequency: 20
  },
  extreme: {
    x: 35,
    y: 35,
    rotation: 8,
    duration: 800,
    frequency: 15
  }
};

const FLASH_PRESETS: Record<FlashColor, FlashConfig> = {
  white: { color: '#ffffff', opacity: 0.4, duration: 150, fadeOut: 300 },
  gold: { color: '#ffd700', opacity: 0.5, duration: 200, fadeOut: 400 },
  red: { color: '#dc2626', opacity: 0.5, duration: 200, fadeOut: 300 },
  green: { color: '#22c55e', opacity: 0.4, duration: 150, fadeOut: 300 },
  purple: { color: '#a855f7', opacity: 0.5, duration: 200, fadeOut: 400 },
  blue: { color: '#3b82f6', opacity: 0.4, duration: 150, fadeOut: 300 },
  custom: { color: '#ffffff', opacity: 0.5, duration: 200, fadeOut: 300 }
};

// Global state for tracking active effects
const activeEffects = {
  shake: false,
  flash: false
};

export const useGameJuice = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const shakeFrameRef = useRef<number | null>(null);
  const flashElementRef = useRef<HTMLDivElement | null>(null);

  // Initialize container reference
  useEffect(() => {
    containerRef.current = document.getElementById('game-container') as HTMLElement;
    
    return () => {
      if (shakeFrameRef.current) {
        cancelAnimationFrame(shakeFrameRef.current);
      }
    };
  }, []);

  /**
   * Screen shake effect with customizable intensity
   */
  const screenShake = useCallback((
    intensity: ShakeIntensity = 'medium',
    customConfig?: Partial<ShakeConfig>
  ) => {
    const config = { ...SHAKE_PRESETS[intensity], ...customConfig };
    const container = containerRef.current || document.body;
    
    if (activeEffects.shake) {
      // Cancel existing shake
      if (shakeFrameRef.current) {
        cancelAnimationFrame(shakeFrameRef.current);
      }
    }
    
    activeEffects.shake = true;
    const startTime = Date.now();
    const originalTransform = (container as HTMLElement).style.transform;
    
    const shake = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= config.duration) {
        // Reset transform
        (container as HTMLElement).style.transform = originalTransform;
        activeEffects.shake = false;
        return;
      }
      
      // Calculate dampening (shake reduces over time)
      const progress = elapsed / config.duration;
      const dampening = Math.pow(1 - progress, 2); // Quadratic ease-out
      
      // Generate random offset
      const offsetX = (Math.random() - 0.5) * config.x * 2 * dampening;
      const offsetY = (Math.random() - 0.5) * config.y * 2 * dampening;
      const rotation = (Math.random() - 0.5) * config.rotation * 2 * dampening;
      
      // Apply transform
      (container as HTMLElement).style.transform = 
        `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
      
      // Schedule next frame
      const frameDelay = 1000 / config.frequency;
      setTimeout(() => {
        shakeFrameRef.current = requestAnimationFrame(shake);
      }, frameDelay);
    };
    
    shake();
  }, []);

  /**
   * Flash effect with customizable color
   */
  const flash = useCallback((
    color: FlashColor = 'white',
    customConfig?: Partial<FlashConfig>
  ) => {
    const config = { 
      ...FLASH_PRESETS[color], 
      ...customConfig,
      color: customConfig?.color || FLASH_PRESETS[color].color
    };
    
    // Remove existing flash
    if (flashElementRef.current) {
      flashElementRef.current.remove();
    }
    
    // Create flash element
    const flashEl = document.createElement('div');
    flashEl.className = 'fixed inset-0 pointer-events-none z-[9999] transition-opacity';
    flashEl.style.backgroundColor = config.color;
    flashEl.style.opacity = String(config.opacity);
    flashEl.style.transitionDuration = `${config.fadeOut}ms`;
    
    document.body.appendChild(flashEl);
    flashElementRef.current = flashEl;
    
    // Trigger fade out
    setTimeout(() => {
      flashEl.style.opacity = '0';
    }, config.duration);
    
    // Remove after fade
    setTimeout(() => {
      flashEl.remove();
      if (flashElementRef.current === flashEl) {
        flashElementRef.current = null;
      }
    }, config.duration + config.fadeOut);
  }, []);

  /**
   * Hit stop - brief pause for impact
   */
  const hitStop = useCallback((duration: number = 80) => {
    const container = containerRef.current || document.body;
    
    // Pause animations
    const animatedElements = container.querySelectorAll('*');
    const originalStates: Map<Element, string> = new Map();
    
    animatedElements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.animationName !== 'none') {
        originalStates.set(el, (el as HTMLElement).style.animationPlayState);
        (el as HTMLElement).style.animationPlayState = 'paused';
      }
    });
    
    // Resume after duration
    setTimeout(() => {
      originalStates.forEach((state, el) => {
        (el as HTMLElement).style.animationPlayState = state || 'running';
      });
    }, duration);
  }, []);

  /**
   * Combo effect - shake + flash together
   */
  const comboEffect = useCallback((
    shakeIntensity: ShakeIntensity = 'heavy',
    flashColor: FlashColor = 'gold'
  ) => {
    screenShake(shakeIntensity);
    flash(flashColor);
    hitStop(100);
  }, [screenShake, flash, hitStop]);

  /**
   * Win celebration effect
   */
  const winCelebration = useCallback((isBigWin: boolean = false) => {
    if (isBigWin) {
      // Triple shake for big wins
      screenShake('extreme');
      setTimeout(() => screenShake('heavy'), 200);
      setTimeout(() => screenShake('medium'), 400);
      
      // Multiple flashes
      flash('gold');
      setTimeout(() => flash('white', { opacity: 0.3 }), 150);
      setTimeout(() => flash('gold', { opacity: 0.4 }), 300);
    } else {
      screenShake('medium');
      flash('green');
    }
    hitStop(120);
  }, [screenShake, flash, hitStop]);

  /**
   * Loss impact effect
   */
  const lossImpact = useCallback((isCritical: boolean = false) => {
    if (isCritical) {
      screenShake('extreme');
      flash('red', { opacity: 0.6, duration: 300 });
    } else {
      screenShake('medium');
      flash('red', { opacity: 0.4 });
    }
    hitStop(100);
  }, [screenShake, flash, hitStop]);

  /**
   * Joker trigger effect
   */
  const jokerTrigger = useCallback(() => {
    screenShake('light');
    flash('purple');
    hitStop(60);
  }, [screenShake, flash, hitStop]);

  /**
   * Boss appear effect
   */
  const bossAppear = useCallback(() => {
    screenShake('heavy');
    flash('red', { opacity: 0.5, duration: 400, fadeOut: 600 });
    hitStop(200);
  }, [screenShake, flash, hitStop]);

  /**
   * Level up effect
   */
  const levelUp = useCallback(() => {
    screenShake('medium');
    flash('gold', { opacity: 0.6, duration: 300, fadeOut: 500 });
    setTimeout(() => flash('white', { opacity: 0.3 }), 200);
    hitStop(150);
  }, [screenShake, flash, hitStop]);

  /**
   * Blackjack celebration
   */
  const blackjackCelebration = useCallback(() => {
    screenShake('heavy');
    flash('gold', { opacity: 0.7, duration: 250 });
    setTimeout(() => flash('white', { opacity: 0.4 }), 200);
    setTimeout(() => flash('gold', { opacity: 0.5 }), 400);
    hitStop(150);
  }, [screenShake, flash, hitStop]);

  /**
   * Bust effect
   */
  const bustEffect = useCallback(() => {
    screenShake('heavy');
    flash('red', { opacity: 0.5, duration: 300 });
    hitStop(120);
  }, [screenShake, flash, hitStop]);

  return {
    screenShake,
    flash,
    hitStop,
    comboEffect,
    winCelebration,
    lossImpact,
    jokerTrigger,
    bossAppear,
    levelUp,
    blackjackCelebration,
    bustEffect
  };
};

export default useGameJuice;
