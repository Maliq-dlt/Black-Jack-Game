import { useState, useCallback, useMemo, useRef } from 'react';
import { Combo, ComboType } from '../components/ComboChainDisplay';

// Combo definitions with base multipliers
const COMBO_DEFINITIONS: Record<ComboType, { baseMultiplier: number; baseValue: number; priority: number }> = {
  pair: { baseMultiplier: 1.5, baseValue: 10, priority: 1 },
  two_pair: { baseMultiplier: 2, baseValue: 20, priority: 2 },
  three_kind: { baseMultiplier: 3, baseValue: 30, priority: 3 },
  straight: { baseMultiplier: 4, baseValue: 40, priority: 4 },
  flush: { baseMultiplier: 5, baseValue: 50, priority: 5 },
  full_house: { baseMultiplier: 7, baseValue: 70, priority: 6 },
  four_kind: { baseMultiplier: 10, baseValue: 100, priority: 7 },
  straight_flush: { baseMultiplier: 15, baseValue: 150, priority: 8 },
  royal_flush: { baseMultiplier: 25, baseValue: 250, priority: 9 },
  blackjack: { baseMultiplier: 2.5, baseValue: 50, priority: 10 },
  lucky_seven: { baseMultiplier: 1.3, baseValue: 7, priority: 1 },
  ace_high: { baseMultiplier: 1.2, baseValue: 5, priority: 1 },
  suit_bonus: { baseMultiplier: 1.5, baseValue: 15, priority: 2 },
  streak: { baseMultiplier: 1.5, baseValue: 25, priority: 3 },
  joker_synergy: { baseMultiplier: 2, baseValue: 50, priority: 4 }
};

interface UseComboSystemOptions {
  maxCombos?: number;
  comboDecayTime?: number; // ms before combo expires
  onComboActivate?: (combo: Combo) => void;
  onComboExpire?: (combo: Combo) => void;
}

interface UseComboSystemReturn {
  // State
  combos: Combo[];
  activeCombos: Combo[];
  totalMultiplier: number;
  baseScore: number;
  finalScore: number;
  comboCount: number;
  
  // Actions
  activateCombo: (type: ComboType, customMultiplier?: number, customValue?: number) => string;
  deactivateCombo: (id: string) => void;
  deactivateAllCombos: () => void;
  updateComboMultiplier: (id: string, multiplier: number) => void;
  
  // Calculations
  calculateFinalScore: (baseAmount: number) => number;
  
  // Batch operations
  activateMultipleCombos: (types: ComboType[]) => string[];
  
  // Joker synergy
  checkJokerSynergy: (jokerCount: number) => void;
  
  // Streak
  updateStreak: (streakCount: number) => void;
}

/**
 * useComboSystem - Hook untuk mengelola combo chain
 * 
 * Usage:
 * const {
 *   combos,
 *   activeCombos,
 *   totalMultiplier,
 *   activateCombo,
 *   deactivateCombo
 * } = useComboSystem();
 */
export const useComboSystem = (options: UseComboSystemOptions = {}): UseComboSystemReturn => {
  const {
    maxCombos = 10,
    comboDecayTime = 5000,
    onComboActivate,
    onComboExpire
  } = options;

  const [combos, setCombos] = useState<Combo[]>([]);
  const comboTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const idCounterRef = useRef(0);

  // Generate unique combo ID
  const generateId = useCallback(() => {
    idCounterRef.current += 1;
    return `combo-${Date.now()}-${idCounterRef.current}`;
  }, []);

  // Get combo config
  const getComboConfig = useCallback((type: ComboType) => {
    return COMBO_DEFINITIONS[type];
  }, []);

  // Activate a combo
  const activateCombo = useCallback((
    type: ComboType,
    customMultiplier?: number,
    customValue?: number
  ): string => {
    const config = getComboConfig(type);
    const id = generateId();
    
    const newCombo: Combo = {
      id,
      type,
      name: type.toUpperCase().replace(/_/g, ' '),
      description: '',
      multiplier: customMultiplier ?? config.baseMultiplier,
      baseValue: customValue ?? config.baseValue,
      icon: '',
      color: '',
      isActive: true,
      triggeredAt: Date.now()
    };

    setCombos(prev => {
      // Check if same type already exists
      const existingIndex = prev.findIndex(c => c.type === type && c.isActive);
      
      if (existingIndex >= 0) {
        // Update existing combo
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          multiplier: Math.max(updated[existingIndex].multiplier, newCombo.multiplier),
          triggeredAt: Date.now()
        };
        return updated;
      }

      // Add new combo
      const newCombos = [...prev, newCombo];
      
      // Limit max combos
      if (newCombos.length > maxCombos) {
        return newCombos.slice(-maxCombos);
      }
      
      return newCombos;
    });

    // Clear existing timer if any
    const existingTimer = comboTimersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set expiration timer
    if (comboDecayTime > 0) {
      const timer = setTimeout(() => {
        deactivateCombo(id);
        const combo = combos.find(c => c.id === id);
        if (combo) {
          onComboExpire?.(combo);
        }
      }, comboDecayTime);
      
      comboTimersRef.current.set(id, timer);
    }

    onComboActivate?.(newCombo);
    return id;
  }, [generateId, getComboConfig, maxCombos, comboDecayTime, onComboActivate, onComboExpire, combos]);

  // Deactivate a combo
  const deactivateCombo = useCallback((id: string) => {
    // Clear timer
    const timer = comboTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      comboTimersRef.current.delete(id);
    }

    setCombos(prev => 
      prev.map(c => c.id === id ? { ...c, isActive: false } : c)
    );
  }, []);

  // Deactivate all combos
  const deactivateAllCombos = useCallback(() => {
    // Clear all timers
    comboTimersRef.current.forEach(timer => clearTimeout(timer));
    comboTimersRef.current.clear();

    setCombos(prev => 
      prev.map(c => ({ ...c, isActive: false }))
    );
  }, []);

  // Update combo multiplier
  const updateComboMultiplier = useCallback((id: string, multiplier: number) => {
    setCombos(prev =>
      prev.map(c => c.id === id ? { ...c, multiplier } : c)
    );
  }, []);

  // Activate multiple combos at once
  const activateMultipleCombos = useCallback((types: ComboType[]): string[] => {
    return types.map(type => activateCombo(type));
  }, [activateCombo]);

  // Computed values
  const activeCombos = useMemo(() => 
    combos.filter(c => c.isActive).sort((a, b) => a.triggeredAt - b.triggeredAt),
    [combos]
  );

  const totalMultiplier = useMemo(() => {
    if (activeCombos.length === 0) return 1;
    return activeCombos.reduce((acc, combo) => acc * combo.multiplier, 1);
  }, [activeCombos]);

  const baseScore = useMemo(() => 
    activeCombos.reduce((acc, combo) => acc + combo.baseValue, 0),
    [activeCombos]
  );

  const finalScore = useMemo(() => 
    baseScore * totalMultiplier,
    [baseScore, totalMultiplier]
  );

  const comboCount = activeCombos.length;

  // Check joker synergy
  const checkJokerSynergy = useCallback((jokerCount: number) => {
    const synergyId = combos.find(c => c.type === 'joker_synergy' && c.isActive)?.id;
    
    if (jokerCount >= 2) {
      const multiplier = 1.5 + (jokerCount - 2) * 0.5;
      if (synergyId) {
        updateComboMultiplier(synergyId, multiplier);
      } else {
        activateCombo('joker_synergy', multiplier);
      }
    } else if (synergyId) {
      deactivateCombo(synergyId);
    }
  }, [activateCombo, deactivateCombo, updateComboMultiplier, combos]);

  // Update streak combo
  const updateStreak = useCallback((streakCount: number) => {
    const streakId = combos.find(c => c.type === 'streak' && c.isActive)?.id;
    
    if (streakCount >= 2) {
      const multiplier = 1.5 + (streakCount - 2) * 0.3;
      if (streakId) {
        updateComboMultiplier(streakId, Math.min(multiplier, 5));
      } else {
        activateCombo('streak', Math.min(multiplier, 5));
      }
    } else if (streakId) {
      deactivateCombo(streakId);
    }
  }, [activateCombo, deactivateCombo, updateComboMultiplier, combos]);

  // Calculate final score
  const calculateFinalScore = useCallback((baseAmount: number): number => {
    return Math.floor(baseAmount * totalMultiplier);
  }, [totalMultiplier]);

  return {
    combos,
    activeCombos,
    totalMultiplier,
    baseScore,
    finalScore,
    comboCount,
    activateCombo,
    deactivateCombo,
    deactivateAllCombos,
    updateComboMultiplier,
    calculateFinalScore,
    activateMultipleCombos,
    checkJokerSynergy,
    updateStreak
  };
};

export default useComboSystem;
