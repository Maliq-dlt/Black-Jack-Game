import React, { createContext, useContext, useCallback, useState } from 'react';
import { Combo, ComboType } from '../components/ComboChainDisplay';
import { useComboSystem } from '../hooks/useComboSystem';

interface ComboContextType {
  // State
  combos: Combo[];
  activeCombos: Combo[];
  totalMultiplier: number;
  baseScore: number;
  finalScore: number;
  comboCount: number;
  recentCombo: Combo | null;
  
  // Actions
  activateCombo: (type: ComboType, customMultiplier?: number, customValue?: number) => string;
  deactivateCombo: (id: string) => void;
  deactivateAllCombos: () => void;
  updateComboMultiplier: (id: string, multiplier: number) => void;
  
  // Game-specific helpers
  checkHandCombos: (hand: HandAnalysis) => void;
  checkJokerSynergy: (jokerCount: number) => void;
  updateStreak: (streakCount: number) => void;
  
  // Calculations
  calculateFinalScore: (baseAmount: number) => number;
  
  // UI helpers
  showComboPopup: (combo: Combo) => void;
  hideComboPopup: () => void;
}

interface HandAnalysis {
  hasPair?: boolean;
  hasTwoPair?: boolean;
  hasThreeKind?: boolean;
  hasStraight?: boolean;
  hasFlush?: boolean;
  hasFullHouse?: boolean;
  hasFourKind?: boolean;
  hasStraightFlush?: boolean;
  hasRoyalFlush?: boolean;
  hasBlackjack?: boolean;
  hasLuckySeven?: boolean;
  hasAceHigh?: boolean;
  suitCount?: Record<string, number>;
}

const ComboContext = createContext<ComboContextType | null>(null);

/**
 * ComboProvider - Global combo state management
 * 
 * Usage:
 * <ComboProvider>
 *   <YourApp />
 * </ComboProvider>
 */
export const ComboProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentCombo, setRecentCombo] = useState<Combo | null>(null);
  const [popupTimeout, setPopupTimeout] = useState<NodeJS.Timeout | null>(null);

  const comboSystem = useComboSystem({
    maxCombos: 15,
    comboDecayTime: 0, // Combos don't expire automatically in this game
    onComboActivate: (combo) => {
      showComboPopup(combo);
    }
  });

  // Show combo popup
  const showComboPopup = useCallback((combo: Combo) => {
    setRecentCombo(combo);
    
    // Clear existing timeout
    if (popupTimeout) {
      clearTimeout(popupTimeout);
    }
    
    // Hide after 2 seconds
    const timeout = setTimeout(() => {
      setRecentCombo(null);
    }, 2000);
    
    setPopupTimeout(timeout);
  }, [popupTimeout]);

  // Hide combo popup
  const hideComboPopup = useCallback(() => {
    setRecentCombo(null);
    if (popupTimeout) {
      clearTimeout(popupTimeout);
    }
  }, [popupTimeout]);

  // Check hand for combos
  const checkHandCombos = useCallback((hand: HandAnalysis) => {
    // Clear existing hand-based combos first
    const handComboTypes: ComboType[] = [
      'pair', 'two_pair', 'three_kind', 'straight', 'flush',
      'full_house', 'four_kind', 'straight_flush', 'royal_flush',
      'blackjack', 'lucky_seven', 'ace_high', 'suit_bonus'
    ];
    
    comboSystem.activeCombos
      .filter(c => handComboTypes.includes(c.type))
      .forEach(c => comboSystem.deactivateCombo(c.id));

    // Check for new combos (in order of priority)
    if (hand.hasRoyalFlush) {
      comboSystem.activateCombo('royal_flush');
    } else if (hand.hasStraightFlush) {
      comboSystem.activateCombo('straight_flush');
    } else if (hand.hasFourKind) {
      comboSystem.activateCombo('four_kind');
    } else if (hand.hasFullHouse) {
      comboSystem.activateCombo('full_house');
    } else if (hand.hasFlush) {
      comboSystem.activateCombo('flush');
    } else if (hand.hasStraight) {
      comboSystem.activateCombo('straight');
    } else if (hand.hasThreeKind) {
      comboSystem.activateCombo('three_kind');
    } else if (hand.hasTwoPair) {
      comboSystem.activateCombo('two_pair');
    } else if (hand.hasPair) {
      comboSystem.activateCombo('pair');
    }

    // Other bonuses
    if (hand.hasBlackjack) {
      comboSystem.activateCombo('blackjack');
    }
    if (hand.hasLuckySeven) {
      comboSystem.activateCombo('lucky_seven');
    }
    if (hand.hasAceHigh) {
      comboSystem.activateCombo('ace_high');
    }

    // Suit bonus
    if (hand.suitCount) {
      const maxSuitCount = Math.max(...Object.values(hand.suitCount));
      if (maxSuitCount >= 3) {
        const multiplier = 1 + (maxSuitCount - 3) * 0.3;
        comboSystem.activateCombo('suit_bonus', multiplier);
      }
    }
  }, [comboSystem]);

  const value: ComboContextType = {
    ...comboSystem,
    recentCombo,
    checkHandCombos,
    showComboPopup,
    hideComboPopup
  };

  return (
    <ComboContext.Provider value={value}>
      {children}
    </ComboContext.Provider>
  );
};

/**
 * useComboContext - Hook untuk akses combo state dari mana saja
 */
export const useComboContext = () => {
  const context = useContext(ComboContext);
  if (!context) {
    throw new Error('useComboContext must be used within ComboProvider');
  }
  return context;
};

export default ComboContext;
