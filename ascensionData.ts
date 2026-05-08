import { 
  RunMode, 
  RunModeConfig, 
  AscensionLevel, 
  AscensionModifierType 
} from './types';

/**
 * Run Mode Configurations
 */
export const RUN_MODES: RunModeConfig[] = [
  {
    mode: RunMode.Standard,
    name: 'Standard Run',
    description: 'The classic experience. 10 stages, 3 bosses.',
    icon: '🎴',
    color: '#22c55e',
    stages: 10,
    features: {
      allowSaves: true,
      allowRetries: true,
      timer: false,
      bonusRewards: 0,
      difficultyMod: 1,
    },
  },
  {
    mode: RunMode.Endless,
    name: 'Endless Mode',
    description: 'How far can you go? Infinite stages with scaling difficulty.',
    icon: '♾️',
    color: '#8b5cf6',
    stages: 'infinite',
    features: {
      allowSaves: true,
      allowRetries: true,
      timer: false,
      bonusRewards: 50,
      difficultyMod: 1.1,
    },
    unlockRequirement: 'Beat Stage 10 once',
  },
  {
    mode: RunMode.SpeedRun,
    name: 'Speed Run',
    description: 'Beat 10 stages as fast as possible. Time is money!',
    icon: '⏱️',
    color: '#f59e0b',
    stages: 10,
    features: {
      allowSaves: false,
      allowRetries: false,
      timer: true,
      bonusRewards: 100,
      difficultyMod: 0.9,
    },
    unlockRequirement: 'Beat Stage 10 in under 10 minutes',
  },
  {
    mode: RunMode.Ironman,
    name: 'Ironman',
    description: 'One bust and it\'s all over. For the bold.',
    icon: '💀',
    color: '#dc2626',
    stages: 10,
    features: {
      allowSaves: false,
      allowRetries: false,
      timer: false,
      bonusRewards: 200,
      difficultyMod: 0.8,
    },
    unlockRequirement: 'Complete Standard Run without busting',
  },
  {
    mode: RunMode.Practice,
    name: 'Practice',
    description: 'No stakes, no rewards. Perfect your strategy.',
    icon: '📘',
    color: '#6b7280',
    stages: 10,
    features: {
      allowSaves: true,
      allowRetries: true,
      timer: false,
      bonusRewards: -100, // No rewards
      difficultyMod: 1,
    },
  },
];

/**
 * 20 Ascension Levels
 * Each level adds modifiers that increase difficulty but also rewards
 */
export const ASCENSION_LEVELS: AscensionLevel[] = [
  // Tier 1: Getting Harder (1-5)
  {
    level: 1, name: 'Novice', icon: '⭐',
    modifiers: [AscensionModifierType.HigherMinBet],
    rewardMultiplier: 1.1,
    unlockRequirement: 'Beat Stage 10',
  },
  {
    level: 2, name: 'Apprentice', icon: '⭐',
    modifiers: [AscensionModifierType.HigherMinBet, AscensionModifierType.HigherPrices],
    rewardMultiplier: 1.2,
    unlockRequirement: 'Beat Ascension 1',
  },
  {
    level: 3, name: 'Journeyman', icon: '⭐',
    modifiers: [AscensionModifierType.DealerHitsHigher],
    rewardMultiplier: 1.3,
    unlockRequirement: 'Beat Ascension 2',
  },
  {
    level: 4, name: 'Expert', icon: '⭐',
    modifiers: [AscensionModifierType.DealerHitsHigher, AscensionModifierType.LessBankroll],
    rewardMultiplier: 1.4,
    unlockRequirement: 'Beat Ascension 3',
  },
  {
    level: 5, name: 'Master', icon: '⭐⭐',
    modifiers: [AscensionModifierType.MoreBossTraits],
    rewardMultiplier: 1.5,
    unlockRequirement: 'Beat Ascension 4',
  },
  
  // Tier 2: Serious Challenge (6-10)
  {
    level: 6, name: 'Veteran', icon: '⭐⭐',
    modifiers: [AscensionModifierType.MoreBossTraits, AscensionModifierType.DoubleHeat],
    rewardMultiplier: 1.6,
    unlockRequirement: 'Beat Ascension 5',
  },
  {
    level: 7, name: 'Elite', icon: '⭐⭐',
    modifiers: [AscensionModifierType.LessArtifacts, AscensionModifierType.HigherPrices],
    rewardMultiplier: 1.7,
    unlockRequirement: 'Beat Ascension 6',
  },
  {
    level: 8, name: 'Champion', icon: '⭐⭐',
    modifiers: [AscensionModifierType.DealerBlackjack, AscensionModifierType.LessBankroll],
    rewardMultiplier: 1.8,
    unlockRequirement: 'Beat Ascension 7',
  },
  {
    level: 9, name: 'Legend', icon: '⭐⭐',
    modifiers: [AscensionModifierType.NoWildCards],
    rewardMultiplier: 1.9,
    unlockRequirement: 'Beat Ascension 8',
  },
  {
    level: 10, name: 'Mythic', icon: '⭐⭐⭐',
    modifiers: [AscensionModifierType.NoWildCards, AscensionModifierType.PermanentCurse],
    rewardMultiplier: 2.0,
    unlockRequirement: 'Beat Ascension 9',
  },
  
  // Tier 3: Brutal (11-15)
  {
    level: 11, name: 'Nightmare', icon: '💀',
    modifiers: [AscensionModifierType.DealerStartsWith, AscensionModifierType.DoubleHeat],
    rewardMultiplier: 2.2,
    unlockRequirement: 'Beat Ascension 10',
  },
  {
    level: 12, name: 'Inferno', icon: '💀',
    modifiers: [AscensionModifierType.DealerStartsWith, AscensionModifierType.LessShopItems],
    rewardMultiplier: 2.4,
    unlockRequirement: 'Beat Ascension 11',
  },
  {
    level: 13, name: 'Torment', icon: '💀',
    modifiers: [AscensionModifierType.MoreBossTraits, AscensionModifierType.PermanentCurse],
    rewardMultiplier: 2.6,
    unlockRequirement: 'Beat Ascension 12',
  },
  {
    level: 14, name: 'Agony', icon: '💀',
    modifiers: [AscensionModifierType.LessBankroll, AscensionModifierType.HigherMinBet, AscensionModifierType.NoWildCards],
    rewardMultiplier: 2.8,
    unlockRequirement: 'Beat Ascension 13',
  },
  {
    level: 15, name: 'Despair', icon: '💀💀',
    modifiers: [AscensionModifierType.DealerBlackjack, AscensionModifierType.DoubleHeat, AscensionModifierType.LessArtifacts],
    rewardMultiplier: 3.0,
    unlockRequirement: 'Beat Ascension 14',
  },
  
  // Tier 4: Impossible (16-20)
  {
    level: 16, name: 'Abyss', icon: '🔥',
    modifiers: [AscensionModifierType.DealerHitsHigher, AscensionModifierType.DealerBlackjack, AscensionModifierType.NoWildCards],
    rewardMultiplier: 3.5,
    unlockRequirement: 'Beat Ascension 15',
  },
  {
    level: 17, name: 'Oblivion', icon: '🔥',
    modifiers: [AscensionModifierType.DealerStartsWith, AscensionModifierType.PermanentCurse, AscensionModifierType.HigherPrices],
    rewardMultiplier: 4.0,
    unlockRequirement: 'Beat Ascension 16',
  },
  {
    level: 18, name: 'Annihilation', icon: '🔥',
    modifiers: [AscensionModifierType.MoreBossTraits, AscensionModifierType.LessBankroll, AscensionModifierType.LessShopItems, AscensionModifierType.DoubleHeat],
    rewardMultiplier: 4.5,
    unlockRequirement: 'Beat Ascension 17',
  },
  {
    level: 19, name: 'Extinction', icon: '🔥💀',
    modifiers: [
      AscensionModifierType.DealerBlackjack, 
      AscensionModifierType.NoWildCards, 
      AscensionModifierType.LessArtifacts,
      AscensionModifierType.PermanentCurse
    ],
    rewardMultiplier: 5.0,
    unlockRequirement: 'Beat Ascension 18',
  },
  {
    level: 20, name: 'DAMNATION', icon: '👑',
    modifiers: [
      AscensionModifierType.DealerStartsWith,
      AscensionModifierType.DealerHitsHigher,
      AscensionModifierType.DealerBlackjack,
      AscensionModifierType.NoWildCards,
      AscensionModifierType.PermanentCurse
    ],
    rewardMultiplier: 10.0,
    unlockRequirement: 'Beat Ascension 19',
  },
];

export const ASCENSION_LEVELS_MAP = new Map<number, AscensionLevel>(
  ASCENSION_LEVELS.map(a => [a.level, a])
);

export const RUN_MODES_MAP = new Map<RunMode, RunModeConfig>(
  RUN_MODES.map(r => [r.mode, r])
);

/**
 * Get ascension level by number
 */
export function getAscensionLevel(level: number): AscensionLevel | undefined {
  return ASCENSION_LEVELS_MAP.get(level);
}

/**
 * Get run mode config
 */
export function getRunModeConfig(mode: RunMode): RunModeConfig | undefined {
  return RUN_MODES_MAP.get(mode);
}

/**
 * Modifier display info
 */
export const ASCENSION_MODIFIER_INFO: Record<AscensionModifierType, { name: string; icon: string; description: string }> = {
  [AscensionModifierType.DealerStartsWith]: { name: 'Head Start', icon: '🎴', description: 'Dealer starts with a face card' },
  [AscensionModifierType.DealerHitsHigher]: { name: 'Greedy Dealer', icon: '📈', description: 'Dealer hits on 18' },
  [AscensionModifierType.DealerBlackjack]: { name: 'Lucky Dealer', icon: '🃏', description: '+10% dealer blackjack chance' },
  [AscensionModifierType.LessBankroll]: { name: 'Poverty', icon: '💸', description: 'Start with 50% less gold' },
  [AscensionModifierType.HigherMinBet]: { name: 'High Stakes', icon: '💰', description: 'Minimum bet is $50' },
  [AscensionModifierType.LessArtifacts]: { name: 'Light Pockets', icon: '🎒', description: '-1 artifact slot' },
  [AscensionModifierType.HigherPrices]: { name: 'Inflation', icon: '📊', description: 'Shop prices +50%' },
  [AscensionModifierType.LessShopItems]: { name: 'Scarcity', icon: '🏪', description: 'Shop has fewer items' },
  [AscensionModifierType.MoreBossTraits]: { name: 'Empowered Bosses', icon: '👹', description: 'Bosses have +1 trait' },
  [AscensionModifierType.DoubleHeat]: { name: 'Hot Streak', icon: '🔥', description: 'Heat builds 2x faster' },
  [AscensionModifierType.NoWildCards]: { name: 'No Luck', icon: '🚫', description: 'Wild cards disabled' },
  [AscensionModifierType.PermanentCurse]: { name: 'Cursed', icon: '☠️', description: 'Random permanent curse' },
};
