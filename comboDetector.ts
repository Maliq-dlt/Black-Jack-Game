import { 
  Card, 
  Rank, 
  ComboType, 
  ComboBonus, 
  ScoringChain,
  CardEnhancement
} from './types';

/**
 * 📈 COMBO DETECTION & SCORING CHAINS
 * 
 * Detects poker-like patterns in blackjack hands for bonus multipliers.
 */

// ============================================
// COMBO BONUS DEFINITIONS
// ============================================

export const COMBO_BONUSES: ComboBonus[] = [
  {
    type: ComboType.Blackjack,
    name: 'Blackjack!',
    description: 'Natural 21 with 2 cards',
    multBonus: 100,
    goldBonus: 50,
    icon: '🃏'
  },
  {
    type: ComboType.Perfect21,
    name: 'Perfect 21',
    description: 'Exactly 21 points',
    multBonus: 50,
    goldBonus: 25,
    icon: '🎯'
  },
  {
    type: ComboType.Pair,
    name: 'Pair',
    description: 'Two cards of same rank',
    multBonus: 20,
    goldBonus: 10,
    icon: '👯'
  },
  {
    type: ComboType.ThreeOfAKind,
    name: 'Triple',
    description: 'Three cards of same rank',
    multBonus: 75,
    goldBonus: 40,
    icon: '🔱'
  },
  {
    type: ComboType.Suited,
    name: 'Suited Hand',
    description: 'All cards same suit',
    multBonus: 30,
    goldBonus: 15,
    icon: '♠️'
  },
  {
    type: ComboType.Sequential,
    name: 'Run',
    description: 'Cards in sequence',
    multBonus: 40,
    goldBonus: 20,
    icon: '📈'
  },
  {
    type: ComboType.FiveCards,
    name: 'Five Card Charlie',
    description: '5+ cards without busting',
    multBonus: 150,
    goldBonus: 100,
    icon: '🖐️'
  },
  {
    type: ComboType.LowBall,
    name: 'Low Ball',
    description: 'Win with 17 or less',
    multBonus: 25,
    goldBonus: 15,
    icon: '👇'
  },
  {
    type: ComboType.HighRoller,
    name: 'High Roller',
    description: 'Win with 20 or 21',
    multBonus: 15,
    goldBonus: 10,
    icon: '🎰'
  },
  {
    type: ComboType.DoubleDown,
    name: 'Double Down Win',
    description: 'Won after doubling',
    multBonus: 35,
    goldBonus: 20,
    icon: '⬇️'
  },
];

// ============================================
// RANK VALUE HELPERS
// ============================================

const RANK_VALUES: Record<Rank, number> = {
  [Rank.Two]: 2, [Rank.Three]: 3, [Rank.Four]: 4, [Rank.Five]: 5,
  [Rank.Six]: 6, [Rank.Seven]: 7, [Rank.Eight]: 8, [Rank.Nine]: 9,
  [Rank.Ten]: 10, [Rank.Jack]: 11, [Rank.Queen]: 12, [Rank.King]: 13,
  [Rank.Ace]: 14,
};

function getCardValue(card: Card): number {
  return RANK_VALUES[card.rank];
}

// ============================================
// COMBO DETECTION FUNCTIONS
// ============================================

/**
 * Detect all combos in a hand
 */
// ⚡ Bolt: Optimized detectCombos to use a single O(N) pass for collecting
// suit/rank frequencies and numeric values, removing redundant array traversals.
// Previously, detectCombos called hasPair, hasThreeOfAKind, isSuited, and isSequential
// separately, causing multiple iterations over the playerCards array. This optimization
// consolidates all checks into a single iteration, using a Map and tracking flags.
export function detectCombos(
  playerCards: Card[], 
  handValue: number,
  isBlackjack: boolean,
  didDoubleDown: boolean
): ComboType[] {
  const combos: ComboType[] = [];
  
  // Blackjack
  if (isBlackjack && playerCards.length === 2) {
    combos.push(ComboType.Blackjack);
  }
  
  // Perfect 21
  if (handValue === 21 && !isBlackjack) {
    combos.push(ComboType.Perfect21);
  }

  // --- O(N) Single Pass for Hand Analysis ---
  const len = playerCards.length;
  if (len >= 2) {
    let hasPair = false;
    let hasThree = false;
    let firstSuit = playerCards[0].suit;
    let isSuited = true;

    // Fast path: manual hash maps instead of Object.values which adds overhead
    const rankCounts = new Map<string, number>();
    const numericValues: number[] = new Array(len);

    for (let i = 0; i < len; i++) {
      const card = playerCards[i];

      // Rank tracking
      const count = (rankCounts.get(card.rank) || 0) + 1;
      rankCounts.set(card.rank, count);
      if (count === 2) hasPair = true;
      if (count === 3) hasThree = true;

      // Suit tracking
      if (isSuited && card.suit !== firstSuit) {
        isSuited = false;
      }

      // Numeric values for sequence
      numericValues[i] = getCardValue(card);
    }

    if (hasPair) combos.push(ComboType.Pair);
    if (hasThree) combos.push(ComboType.ThreeOfAKind);
    if (isSuited) combos.push(ComboType.Suited);

    // Sequential
    if (len >= 3) {
      numericValues.sort((a, b) => a - b);
      let isSeq = true;
      for (let i = 1; i < len; i++) {
        if (numericValues[i] !== numericValues[i - 1] + 1) {
          isSeq = false;
          break;
        }
      }
      if (isSeq) combos.push(ComboType.Sequential);
    }
  }
  
  // Five card charlie
  if (playerCards.length >= 5 && handValue <= 21) {
    combos.push(ComboType.FiveCards);
  }
  
  // Low ball
  if (handValue <= 17 && handValue > 0) {
    combos.push(ComboType.LowBall);
  }
  
  // High roller
  if (handValue >= 20 && handValue <= 21) {
    combos.push(ComboType.HighRoller);
  }
  
  // Double down win
  if (didDoubleDown) {
    combos.push(ComboType.DoubleDown);
  }
  
  return combos;
}

// ============================================
// SCORING CHAIN FUNCTIONS
// ============================================

/**
 * Calculate total bonus from combos
 */
export function calculateComboBonus(combos: ComboType[]): { mult: number; gold: number } {
  let mult = 0;
  let gold = 0;
  
  combos.forEach(combo => {
    const bonus = COMBO_BONUSES.find(b => b.type === combo);
    if (bonus) {
      mult += bonus.multBonus;
      gold += bonus.goldBonus;
    }
  });
  
  return { mult, gold };
}

/**
 * Calculate streak bonus
 */
export function calculateStreakBonus(consecutiveWins: number): number {
  if (consecutiveWins < 2) return 0;
  // 10 mult per win in streak, capped at 100
  return Math.min(consecutiveWins * 10, 100);
}

/**
 * Create initial scoring chain
 */
export function createScoringChain(): ScoringChain {
  return {
    consecutiveWins: 0,
    combosTriggered: [],
    totalMultiplier: 0,
    streakBonus: 0,
  };
}

/**
 * Update scoring chain after a hand
 */
export function updateScoringChain(
  chain: ScoringChain,
  didWin: boolean,
  combos: ComboType[]
): ScoringChain {
  if (didWin) {
    const consecutiveWins = chain.consecutiveWins + 1;
    const streakBonus = calculateStreakBonus(consecutiveWins);
    const { mult } = calculateComboBonus(combos);
    
    return {
      consecutiveWins,
      combosTriggered: combos,
      totalMultiplier: mult + streakBonus,
      streakBonus,
    };
  } else {
    // Reset on loss
    return createScoringChain();
  }
}

/**
 * Get combo info for display
 */
export function getComboInfo(type: ComboType): ComboBonus | undefined {
  return COMBO_BONUSES.find(b => b.type === type);
}

// ============================================
// CARD ENHANCEMENT EFFECTS
// ============================================

export const ENHANCEMENT_EFFECTS: Record<CardEnhancement, { name: string; description: string; icon: string; cost: number }> = {
  [CardEnhancement.None]: { name: 'None', description: 'No enhancement', icon: '', cost: 0 },
  [CardEnhancement.Polished]: { name: 'Polished', description: '+5 to base value', icon: '💎', cost: 200 },
  [CardEnhancement.Lucky]: { name: 'Lucky', description: '20% chance to draw again', icon: '🍀', cost: 300 },
  [CardEnhancement.Burning]: { name: 'Burning', description: 'Deals damage to boss', icon: '🔥', cost: 400 },
  [CardEnhancement.Ghost]: { name: 'Ghost', description: 'Counts as any suit', icon: '👻', cost: 350 },
  [CardEnhancement.Golden]: { name: 'Golden', description: '+$20 when played', icon: '✨', cost: 250 },
  [CardEnhancement.Cursed]: { name: 'Cursed', description: '-5 to value', icon: '☠️', cost: -100 },
  [CardEnhancement.Wild]: { name: 'Wild', description: 'Can be any rank', icon: '🌈', cost: 500 },
  [CardEnhancement.Steel]: { name: 'Steel', description: 'x1.5 mult when played', icon: '🔩', cost: 450 },
  [CardEnhancement.Glass]: { name: 'Glass', description: 'x2 mult, destroys on bust', icon: '🔮', cost: 400 },
};
