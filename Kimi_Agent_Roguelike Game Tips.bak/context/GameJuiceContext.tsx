import React, { createContext, useContext, useRef, useCallback } from 'react';
import { ShakeContainerRef, ShakeIntensity } from '../components/ShakeContainer';
import { FlashType } from '../components/FlashOverlay';

// Types
interface JuiceEffect {
  id: string;
  type: 'shake' | 'flash' | 'combo';
  config: unknown;
}

interface GameJuiceContextType {
  // Shake methods
  shake: (intensity?: ShakeIntensity) => void;
  shakeSequence: (intensities: ShakeIntensity[]) => void;
  
  // Flash methods
  flash: (type?: FlashType, customColor?: string) => void;
  multiFlash: (flashes: Array<{ type: FlashType; delay: number }>) => void;
  
  // Combo effects
  win: (isBigWin?: boolean) => void;
  loss: (isCritical?: boolean) => void;
  joker: () => void;
  boss: () => void;
  levelUp: () => void;
  blackjack: () => void;
  bust: () => void;
  
  // Register container ref
  registerContainer: (ref: React.RefObject<ShakeContainerRef>) => void;
}

const GameJuiceContext = createContext<GameJuiceContextType | null>(null);

/**
 * GameJuiceProvider - Provider untuk mengelola efek game secara global
 * 
 * Usage:
 * <GameJuiceProvider>
 *   <YourApp />
 * </GameJuiceProvider>
 * 
 * Then in any component:
 * const { shake, flash, win } = useGameJuiceContext();
 */
export const GameJuiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<React.RefObject<ShakeContainerRef> | null>(null);
  const flashCallbacks = useRef<Set<(type: FlashType, color?: string) => void>>(new Set());

  // Register container
  const registerContainer = useCallback((ref: React.RefObject<ShakeContainerRef>) => {
    containerRef.current = ref;
  }, []);

  // Register flash callback (untuk FlashOverlay komponen)
  const registerFlashCallback = useCallback((callback: (type: FlashType, color?: string) => void) => {
    flashCallbacks.current.add(callback);
    return () => flashCallbacks.current.delete(callback);
  }, []);

  // Shake methods
  const shake = useCallback((intensity: ShakeIntensity = 'medium') => {
    containerRef.current?.current?.shake(intensity);
  }, []);

  const shakeSequence = useCallback((intensities: ShakeIntensity[]) => {
    containerRef.current?.current?.shakeSequence(intensities);
  }, []);

  // Flash methods
  const flash = useCallback((type: FlashType = 'white', customColor?: string) => {
    flashCallbacks.current.forEach(cb => cb(type, customColor));
  }, []);

  const multiFlash = useCallback((flashes: Array<{ type: FlashType; delay: number }>) => {
    flashes.forEach(({ type, delay }) => {
      setTimeout(() => flash(type), delay);
    });
  }, [flash]);

  // Preset combo effects
  const win = useCallback((isBigWin: boolean = false) => {
    if (isBigWin) {
      shakeSequence(['extreme', 'heavy', 'medium']);
      multiFlash([
        { type: 'gold', delay: 0 },
        { type: 'white', delay: 150 },
        { type: 'gold', delay: 300 }
      ]);
    } else {
      shake('medium');
      flash('green');
    }
  }, [shake, shakeSequence, flash, multiFlash]);

  const loss = useCallback((isCritical: boolean = false) => {
    if (isCritical) {
      shake('extreme');
      flash('red');
    } else {
      shake('medium');
      flash('red');
    }
  }, [shake, flash]);

  const joker = useCallback(() => {
    shake('light');
    flash('purple');
  }, [shake, flash]);

  const boss = useCallback(() => {
    shake('heavy');
    flash('red');
  }, [shake, flash]);

  const levelUp = useCallback(() => {
    shake('medium');
    multiFlash([
      { type: 'gold', delay: 0 },
      { type: 'white', delay: 200 }
    ]);
  }, [shake, multiFlash]);

  const blackjack = useCallback(() => {
    shake('heavy');
    multiFlash([
      { type: 'gold', delay: 0 },
      { type: 'white', delay: 200 },
      { type: 'gold', delay: 400 }
    ]);
  }, [shake, multiFlash]);

  const bust = useCallback(() => {
    shake('heavy');
    flash('red');
  }, [shake, flash]);

  const value = {
    shake,
    shakeSequence,
    flash,
    multiFlash,
    win,
    loss,
    joker,
    boss,
    levelUp,
    blackjack,
    bust,
    registerContainer
  };

  return (
    <GameJuiceContext.Provider value={value}>
      {children}
    </GameJuiceContext.Provider>
  );
};

/**
 * useGameJuiceContext - Hook untuk mengakses game juice dari mana saja
 */
export const useGameJuiceContext = () => {
  const context = useContext(GameJuiceContext);
  if (!context) {
    throw new Error('useGameJuiceContext must be used within GameJuiceProvider');
  }
  return context;
};

export default GameJuiceContext;
