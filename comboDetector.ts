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
  
  // Pair detection
  if (hasPair(playerCards)) {
    combos.push(ComboType.Pair);
  }
  
  // Three of a kind
  if (hasThreeOfAKind(playerCards)) {
    combos.push(ComboType.ThreeOfAKind);
  }
  
  // Suited hand
  if (isSuited(playerCards)) {
    combos.push(ComboType.Suited);
  }
  
  // Sequential
  if (isSequential(playerCards)) {
    combos.push(ComboType.Sequential);
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

/**
 * Check for pair
 */
function hasPair(cards: Card[]): boolean {
  const ranks = cards.map(c => c.rank);
  return ranks.some((r, i) => ranks.indexOf(r) !== i);
}

/**
 * Check for three of a kind
 */
function hasThreeOfAKind(cards: Card[]): boolean {
  const rankCounts: Record<string, number> = {};
  cards.forEach(c => {
    rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1;
  });
  return Object.values(rankCounts).some(count => count >= 3);
}

/**
 * Check if all cards are same suit
 */
function isSuited(cards: Card[]): boolean {
  if (cards.length < 2) return false;
  return cards.every(c => c.suit === cards[0].suit);
}

/**
 * Check if cards form a sequence
 */
function isSequential(cards: Card[]): boolean {
  if (cards.length < 3) return false;
  const values = cards.map(getCardValue).sort((a, b) => a - b);
  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i - 1] + 1) return false;
  }
  return true;
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
    const bonus = COMBO_BONUSES_MAP.get(combo);
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
  return COMBO_BONUSES_MAP.get(type);
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

export const COMBO_BONUSES_MAP = new Map<ComboType, ComboBonus>(
  COMBO_BONUSES.map(bonus => [bonus.type, bonus])
);
