import { 
  Joker, 
  JokerRarity, 
  JokerTrigger, 
  JokerEffectType,
  JokerSlot 
} from './types';

/**
 * 🃏 JOKER DATA - Balatro-style modifiers
 * 
 * Rarities:
 * - Common (White): +10-20 mult
 * - Uncommon (Blue): +25-40 mult  
 * - Rare (Purple): +50-100 mult or special effects
 * - Legendary (Gold): Game-changing effects
 * - Cursed (Red): High power + drawback
 */

export const JOKERS: Joker[] = [
  // ============================================
  // COMMON JOKERS (Cost: $50-100)
  // ============================================
  {
    id: 'j_lucky_penny', name: 'Lucky Penny', icon: '🪙',
    description: '+15 mult on every win',
    rarity: JokerRarity.Common, trigger: JokerTrigger.OnWin, cost: 50,
    effect: { type: JokerEffectType.AddMult, value: 15 }
  },
  {
    id: 'j_face_value', name: 'Face Value', icon: '👑',
    description: '+10 mult per face card in hand',
    rarity: JokerRarity.Common, trigger: JokerTrigger.OnFaceCard, cost: 60,
    effect: { type: JokerEffectType.AddMult, value: 10, scaling: 1 }
  },
  {
    id: 'j_ace_hunter', name: 'Ace Hunter', icon: '🎯',
    description: '+20 mult when Ace is played',
    rarity: JokerRarity.Common, trigger: JokerTrigger.OnAce, cost: 70,
    effect: { type: JokerEffectType.AddMult, value: 20 }
  },
  {
    id: 'j_chip_magnet', name: 'Chip Magnet', icon: '🧲',
    description: '+$10 on every hand end',
    rarity: JokerRarity.Common, trigger: JokerTrigger.OnHandEnd, cost: 80,
    effect: { type: JokerEffectType.AddGold, value: 10 }
  },
  {
    id: 'j_seven_heaven', name: "Seven's Heaven", icon: '7️⃣',
    description: '+77 mult when 7 is played',
    rarity: JokerRarity.Common, trigger: JokerTrigger.OnSeven, cost: 75,
    effect: { type: JokerEffectType.AddMult, value: 77 }
  },
  {
    id: 'j_cushion', name: 'Safety Cushion', icon: '🛋️',
    description: 'Reduce losses by 15%',
    rarity: JokerRarity.Common, trigger: JokerTrigger.OnLose, cost: 60,
    effect: { type: JokerEffectType.ReduceLoss, value: 0.15 }
  },
  
  // ============================================
  // UNCOMMON JOKERS (Cost: $100-200)
  // ============================================
  {
    id: 'j_hot_streak', name: 'Hot Streak', icon: '🔥',
    description: '+25 mult per consecutive win',
    rarity: JokerRarity.Uncommon, trigger: JokerTrigger.OnConsecutiveWin, cost: 120,
    condition: { type: 'STREAK', comparison: 'GREATER', value: 0 },
    effect: { type: JokerEffectType.AddMult, value: 25, scaling: 1 }
  },
  {
    id: 'j_blackjack_artist', name: 'Blackjack Artist', icon: '🎨',
    description: '+100 mult on natural 21',
    rarity: JokerRarity.Uncommon, trigger: JokerTrigger.OnBlackjack, cost: 150,
    effect: { type: JokerEffectType.AddMult, value: 100 }
  },
  {
    id: 'j_push_specialist', name: 'Push Specialist', icon: '🤝',
    description: '+$50 on push instead of $0',
    rarity: JokerRarity.Uncommon, trigger: JokerTrigger.OnPush, cost: 100,
    effect: { type: JokerEffectType.AddGold, value: 50 }
  },
  {
    id: 'j_high_roller', name: 'High Roller', icon: '🎰',
    description: 'Bets over $100: +40 mult',
    rarity: JokerRarity.Uncommon, trigger: JokerTrigger.Always, cost: 180,
    condition: { type: 'BANKROLL', comparison: 'GREATER', value: 100 },
    effect: { type: JokerEffectType.AddMult, value: 40 }
  },
  {
    id: 'j_card_shark', name: 'Card Shark', icon: '🦈',
    description: '+5 mult for every card in hand',
    rarity: JokerRarity.Uncommon, trigger: JokerTrigger.OnCardPlayed, cost: 140,
    effect: { type: JokerEffectType.AddMult, value: 5, scaling: 1 }
  },
  {
    id: 'j_boss_slayer', name: 'Boss Slayer', icon: '⚔️',
    description: '+$200 on boss defeat',
    rarity: JokerRarity.Uncommon, trigger: JokerTrigger.OnBossDefeat, cost: 160,
    effect: { type: JokerEffectType.AddGold, value: 200 }
  },
  
  // ============================================
  // RARE JOKERS (Cost: $200-400)
  // ============================================
  {
    id: 'j_golden_touch', name: 'Golden Touch', icon: '✨',
    description: 'x1.5 mult on all hands',
    rarity: JokerRarity.Rare, trigger: JokerTrigger.Always, cost: 300,
    effect: { type: JokerEffectType.MultMult, value: 1.5 }
  },
  {
    id: 'j_kings_court', name: "King's Court", icon: '👸',
    description: 'All face cards: +30 mult each',
    rarity: JokerRarity.Rare, trigger: JokerTrigger.OnFaceCard, cost: 250,
    effect: { type: JokerEffectType.AddMult, value: 30, scaling: 1 }
  },
  {
    id: 'j_phoenix_feather', name: 'Phoenix Feather', icon: '🔥',
    description: 'On bust: 50% chance to save hand',
    rarity: JokerRarity.Rare, trigger: JokerTrigger.OnBust, cost: 350,
    effect: { type: JokerEffectType.ReduceLoss, value: 0.5 }
  },
  {
    id: 'j_number_crunch', name: 'Number Cruncher', icon: '🔢',
    description: '+15 mult per numbered card (2-10)',
    rarity: JokerRarity.Rare, trigger: JokerTrigger.OnCardPlayed, cost: 280,
    effect: { type: JokerEffectType.AddMult, value: 15, scaling: 1 }
  },
  {
    id: 'j_early_bird', name: 'Early Bird', icon: '🐦',
    description: '+50 mult on first hand of stage',
    rarity: JokerRarity.Rare, trigger: JokerTrigger.OnHandStart, cost: 220,
    effect: { type: JokerEffectType.AddMult, value: 50 }
  },
  {
    id: 'j_vampire', name: 'Vampire', icon: '🧛',
    description: 'Win: Heal 10% of bet',
    rarity: JokerRarity.Rare, trigger: JokerTrigger.OnWin, cost: 320,
    effect: { type: JokerEffectType.AddGold, value: 0.1, scaling: 1 }
  },
  
  // ============================================
  // LEGENDARY JOKERS (Cost: $500-1000)
  // ============================================
  {
    id: 'j_midas', name: 'Midas Touch', icon: '👆',
    description: 'x2 mult on all wins',
    rarity: JokerRarity.Legendary, trigger: JokerTrigger.OnWin, cost: 750,
    effect: { type: JokerEffectType.MultMult, value: 2 }
  },
  {
    id: 'j_lucky_21', name: 'Lucky 21', icon: '🍀',
    description: 'On 21: x3 payout',
    rarity: JokerRarity.Legendary, trigger: JokerTrigger.OnBlackjack, cost: 800,
    effect: { type: JokerEffectType.MultMult, value: 3 }
  },
  {
    id: 'j_infinity', name: 'Infinity', icon: '♾️',
    description: '+1 mult per $10 in bankroll',
    rarity: JokerRarity.Legendary, trigger: JokerTrigger.Always, cost: 600,
    effect: { type: JokerEffectType.AddMult, value: 1, scaling: 0.1 }
  },
  {
    id: 'j_boss_bane', name: 'Boss Bane', icon: '💀',
    description: 'Boss traits 50% less effective',
    rarity: JokerRarity.Legendary, trigger: JokerTrigger.Always, cost: 700,
    effect: { type: JokerEffectType.BossDebuff, value: 0.5 }
  },
  {
    id: 'j_time_lord', name: 'Time Lord', icon: '⏰',
    description: 'Undo last hit once per round',
    rarity: JokerRarity.Legendary, trigger: JokerTrigger.OnCardPlayed, cost: 900,
    effect: { type: JokerEffectType.ExtraCards, value: -1 }
  },
  {
    id: 'j_god_hand', name: 'God Hand', icon: '🙏',
    description: 'Always start with 20 points',
    rarity: JokerRarity.Legendary, trigger: JokerTrigger.OnHandStart, cost: 1000,
    effect: { type: JokerEffectType.CardTransform, value: 20 }
  },
  
  // ============================================
  // CURSED JOKERS (Cost: $300-500, with drawbacks)
  // ============================================
  {
    id: 'j_blood_pact', name: 'Blood Pact', icon: '🩸',
    description: 'x2 mult, but -10% bankroll on bust',
    rarity: JokerRarity.Cursed, trigger: JokerTrigger.Always, cost: 350,
    effect: { type: JokerEffectType.MultMult, value: 2 },
    drawback: 'Lose 10% bankroll on bust',
    drawbackEffect: { type: JokerEffectType.AddGold, value: -0.1 }
  },
  {
    id: 'j_demons_dice', name: "Demon's Dice", icon: '🎲',
    description: '50% chance: x3 payout OR lose bet',
    rarity: JokerRarity.Cursed, trigger: JokerTrigger.OnWin, cost: 400,
    effect: { type: JokerEffectType.MultMult, value: 3 },
    drawback: '50% chance to lose entire bet',
    drawbackEffect: { type: JokerEffectType.AddGold, value: -1 }
  },
  {
    id: 'j_soul_chain', name: 'Soul Chain', icon: '⛓️',
    description: '+$100 on win, but 2x loss on lose',
    rarity: JokerRarity.Cursed, trigger: JokerTrigger.OnWin, cost: 450,
    effect: { type: JokerEffectType.AddGold, value: 100 },
    drawback: 'Losses doubled',
    drawbackEffect: { type: JokerEffectType.ReduceLoss, value: -1 }
  },
  {
    id: 'j_glass_cannon', name: 'Glass Cannon', icon: '🔮',
    description: '+200 mult, but destroyed on bust',
    rarity: JokerRarity.Cursed, trigger: JokerTrigger.Always, cost: 500,
    effect: { type: JokerEffectType.AddMult, value: 200 },
    drawback: 'Destroyed when you bust',
    drawbackEffect: { type: JokerEffectType.DeckModify, value: 0 }
  },
  {
    id: 'j_void_walker', name: 'Void Walker', icon: '🌑',
    description: 'x1.5 mult, no pushes allowed (push = lose)',
    rarity: JokerRarity.Cursed, trigger: JokerTrigger.Always, cost: 380,
    effect: { type: JokerEffectType.MultMult, value: 1.5 },
    drawback: 'Push = Lose',
    drawbackEffect: { type: JokerEffectType.ReduceLoss, value: 1 }
  },
  {
    id: 'j_hungry_ghost', name: 'Hungry Ghost', icon: '👻',
    description: '+150 mult, but -$50 per hand',
    rarity: JokerRarity.Cursed, trigger: JokerTrigger.Always, cost: 420,
    effect: { type: JokerEffectType.AddMult, value: 150 },
    drawback: '-$50 every hand',
    drawbackEffect: { type: JokerEffectType.AddGold, value: -50 }
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get jokers by rarity
 */
export function getJokersByRarity(rarity: JokerRarity): Joker[] {
  return JOKERS.filter(j => j.rarity === rarity);
}

/**
 * Get random jokers for shop
 */
export function getRandomJokers(count: number, excludeIds: string[] = []): Joker[] {
  const available = JOKERS.filter(j => !excludeIds.includes(j.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get joker by ID
 */
export const JOKER_MAP = new Map<string, Joker>(
  JOKERS.map(j => [j.id, j])
);

export function getJokerById(id: string): Joker | undefined {
  return JOKER_MAP.get(id);
}

/**
 * Initial joker slots (5 slots, 2 locked initially)
 */
export function createInitialJokerSlots(): JokerSlot[] {
  return [
    { joker: null, isLocked: false },
    { joker: null, isLocked: false },
    { joker: null, isLocked: false },
    { joker: null, isLocked: true },
    { joker: null, isLocked: true },
  ];
}

/**
 * Rarity colors for UI
 */
export const JOKER_RARITY_COLORS: Record<JokerRarity, { bg: string; border: string; text: string }> = {
  [JokerRarity.Common]: { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700' },
  [JokerRarity.Uncommon]: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700' },
  [JokerRarity.Rare]: { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-700' },
  [JokerRarity.Legendary]: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700' },
  [JokerRarity.Cursed]: { bg: 'bg-red-100', border: 'border-red-600', text: 'text-red-700' },
};
