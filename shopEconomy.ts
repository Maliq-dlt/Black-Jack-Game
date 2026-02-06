import { Joker, Artifact, PowerUp } from './types';

/**
 * 🏪 SHOP ECONOMY SYSTEM
 * 
 * Reroll, sell, and interest mechanics for Balatro-style economy
 */

// ============================================
// ECONOMY CONSTANTS
// ============================================

export const ECONOMY_CONFIG = {
  // Reroll pricing
  rerollBaseCost: 5,
  rerollCostIncrement: 1,      // +$1 per reroll this shop visit
  maxRerollCost: 20,
  
  // Sell values (% of purchase price)
  jokerSellRate: 0.5,          // 50% of cost
  artifactSellRate: 0.4,       // 40% of cost
  powerUpSellRate: 0.3,        // 30% of cost
  
  // Interest system
  interestRate: 0.05,          // 5% per stage
  interestCap: 25,             // Max $25 interest
  interestThreshold: 5,        // Min $5 gold for interest
  
  // Shop items
  shopJokerSlots: 3,
  shopArtifactSlots: 2,
  shopPowerUpSlots: 2,
};

// ============================================
// SHOP STATE
// ============================================

export interface ShopState {
  currentRerollCost: number;
  rerollsUsed: number;
  jokerItems: Joker[];
  artifactItems: Artifact[];
  powerUpItems: PowerUp[];
  isRerollDisabled: boolean;
}

export function createInitialShopState(): ShopState {
  return {
    currentRerollCost: ECONOMY_CONFIG.rerollBaseCost,
    rerollsUsed: 0,
    jokerItems: [],
    artifactItems: [],
    powerUpItems: [],
    isRerollDisabled: false,
  };
}

// ============================================
// REROLL FUNCTIONS
// ============================================

/**
 * Calculate current reroll cost
 */
export function getRerollCost(rerollsUsed: number): number {
  const cost = ECONOMY_CONFIG.rerollBaseCost + (rerollsUsed * ECONOMY_CONFIG.rerollCostIncrement);
  return Math.min(cost, ECONOMY_CONFIG.maxRerollCost);
}

/**
 * Perform a reroll (returns new cost)
 */
export function performReroll(state: ShopState): ShopState {
  const newRerollsUsed = state.rerollsUsed + 1;
  return {
    ...state,
    rerollsUsed: newRerollsUsed,
    currentRerollCost: getRerollCost(newRerollsUsed),
  };
}

/**
 * Reset reroll count (on stage change)
 */
export function resetRerolls(state: ShopState): ShopState {
  return {
    ...state,
    rerollsUsed: 0,
    currentRerollCost: ECONOMY_CONFIG.rerollBaseCost,
  };
}

// ============================================
// SELL FUNCTIONS
// ============================================

/**
 * Get sell value for a joker
 */
export function getJokerSellValue(joker: Joker): number {
  return Math.floor(joker.cost * ECONOMY_CONFIG.jokerSellRate);
}

/**
 * Get sell value for an artifact
 */
export function getArtifactSellValue(artifact: Artifact): number {
  return Math.floor(artifact.cost * ECONOMY_CONFIG.artifactSellRate);
}

/**
 * Get sell value for a power-up
 */
export function getPowerUpSellValue(powerUp: PowerUp): number {
  return Math.floor(powerUp.cost * ECONOMY_CONFIG.powerUpSellRate);
}

// ============================================
// INTEREST FUNCTIONS
// ============================================

/**
 * Calculate interest earned based on current gold
 */
export function calculateInterest(currentGold: number): number {
  if (currentGold < ECONOMY_CONFIG.interestThreshold) return 0;
  
  const interest = Math.floor(currentGold * ECONOMY_CONFIG.interestRate);
  return Math.min(interest, ECONOMY_CONFIG.interestCap);
}

/**
 * Apply interest to gold
 */
export function applyInterest(currentGold: number): { newGold: number; interestEarned: number } {
  const interestEarned = calculateInterest(currentGold);
  return {
    newGold: currentGold + interestEarned,
    interestEarned,
  };
}

// ============================================
// SHOP TIER SYSTEM
// ============================================

export type ShopTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export const SHOP_TIER_CONFIG: Record<ShopTier, {
  minStage: number;
  jokerSlots: number;
  artifactSlots: number;
  legendaryChance: number;
  discountChance: number;
}> = {
  BRONZE: { minStage: 1, jokerSlots: 2, artifactSlots: 1, legendaryChance: 0.01, discountChance: 0.05 },
  SILVER: { minStage: 4, jokerSlots: 3, artifactSlots: 2, legendaryChance: 0.05, discountChance: 0.10 },
  GOLD: { minStage: 7, jokerSlots: 4, artifactSlots: 2, legendaryChance: 0.10, discountChance: 0.15 },
  PLATINUM: { minStage: 10, jokerSlots: 5, artifactSlots: 3, legendaryChance: 0.15, discountChance: 0.20 },
};

/**
 * Get shop tier based on stage
 */
export function getShopTier(stage: number): ShopTier {
  if (stage >= 10) return 'PLATINUM';
  if (stage >= 7) return 'GOLD';
  if (stage >= 4) return 'SILVER';
  return 'BRONZE';
}

// ============================================
// VOUCHER SYSTEM
// ============================================

export interface Voucher {
  id: string;
  name: string;
  description: string;
  effect: VoucherEffect;
  cost: number;          // Cost in tokens
  icon: string;
}

export type VoucherEffect = 
  | { type: 'REROLL_DISCOUNT'; value: number }
  | { type: 'EXTRA_SHOP_SLOT'; slotType: 'joker' | 'artifact' }
  | { type: 'INTEREST_BOOST'; value: number }
  | { type: 'SELL_BOOST'; value: number }
  | { type: 'FREE_REROLL'; count: number };

export const VOUCHERS: Voucher[] = [
  {
    id: 'v_clearance', name: 'Clearance Sale', icon: '🏷️',
    description: 'Rerolls cost $2 less',
    effect: { type: 'REROLL_DISCOUNT', value: 2 },
    cost: 5
  },
  {
    id: 'v_extra_joker', name: 'Joker Expansion', icon: '🃏',
    description: '+1 joker slot in shop',
    effect: { type: 'EXTRA_SHOP_SLOT', slotType: 'joker' },
    cost: 8
  },
  {
    id: 'v_savings', name: 'Savings Account', icon: '🏦',
    description: '+2% interest rate',
    effect: { type: 'INTEREST_BOOST', value: 0.02 },
    cost: 6
  },
  {
    id: 'v_pawn', name: 'Pawn Shop', icon: '💎',
    description: '+20% sell value',
    effect: { type: 'SELL_BOOST', value: 0.2 },
    cost: 7
  },
  {
    id: 'v_restock', name: 'Restock', icon: '🔄',
    description: '3 free rerolls',
    effect: { type: 'FREE_REROLL', count: 3 },
    cost: 4
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format gold display
 */
export function formatGold(amount: number): string {
  return amount >= 1000 ? `$${(amount / 1000).toFixed(1)}k` : `$${amount}`;
}

/**
 * Check if player can afford something
 */
export function canAfford(currentGold: number, cost: number): boolean {
  return currentGold >= cost;
}
