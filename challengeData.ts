import { DailyChallenge, ChallengeDifficulty, ChallengeModifier } from './types';

/**
 * Daily Challenge Generator
 * Creates deterministic daily challenges based on date
 */

// Modifier pools by difficulty
const EASY_MODIFIERS: ChallengeModifier[] = [
  ChallengeModifier.DealerHits17,
  ChallengeModifier.MinBet100,
];

const MEDIUM_MODIFIERS: ChallengeModifier[] = [
  ChallengeModifier.FaceCardsFive,
  ChallengeModifier.NoDouble,
  ChallengeModifier.AggressiveDealer,
];

const HARD_MODIFIERS: ChallengeModifier[] = [
  ChallengeModifier.AcesOnly,
  ChallengeModifier.NoSplit,
  ChallengeModifier.BlindPlay,
  ChallengeModifier.DoubleBets,
];

const NIGHTMARE_MODIFIERS: ChallengeModifier[] = [
  ChallengeModifier.OneLife,
  ChallengeModifier.TimePressure,
  ChallengeModifier.Chaos,
];

// Challenge templates
const CHALLENGE_TEMPLATES = [
  {
    name: 'The Grind',
    description: 'Reach stage {target} with limited resources',
    difficulty: ChallengeDifficulty.Easy,
    targetStage: 5,
    modifierCount: 1,
  },
  {
    name: 'High Stakes',
    description: 'Survive with mandatory high bets',
    difficulty: ChallengeDifficulty.Medium,
    targetStage: 7,
    modifierCount: 2,
  },
  {
    name: 'Blind Faith',
    description: 'Navigate without seeing dealer cards',
    difficulty: ChallengeDifficulty.Hard,
    targetStage: 10,
    modifierCount: 2,
  },
  {
    name: "Devil's Bargain",
    description: 'One mistake and you lose everything',
    difficulty: ChallengeDifficulty.Nightmare,
    targetStage: 5,
    modifierCount: 3,
  },
  {
    name: 'Chaos Mode',
    description: 'Nothing is as it seems',
    difficulty: ChallengeDifficulty.Nightmare,
    targetStage: 3,
    modifierCount: 2,
  },
];

// Rewards by difficulty
const REWARDS = {
  [ChallengeDifficulty.Easy]: { prestigePoints: 2, tokens: 50 },
  [ChallengeDifficulty.Medium]: { prestigePoints: 5, tokens: 100 },
  [ChallengeDifficulty.Hard]: { prestigePoints: 10, tokens: 200 },
  [ChallengeDifficulty.Nightmare]: { prestigePoints: 25, tokens: 500, specialReward: 'Exclusive Cursed Artifact' },
};

/**
 * Generate a deterministic daily challenge based on date
 */
export function generateDailyChallenge(date: Date = new Date()): DailyChallenge {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = dateToSeed(dateStr);
  
  // Select template based on day of week (cycling through templates)
  const templateIndex = seed % CHALLENGE_TEMPLATES.length;
  const template = CHALLENGE_TEMPLATES[templateIndex];
  
  // Get modifiers based on difficulty
  const modifiers = getModifiersForDifficulty(template.difficulty, template.modifierCount, seed);
  
  // Get rewards
  const rewards = REWARDS[template.difficulty];
  
  return {
    id: `daily_${dateStr}`,
    date: dateStr,
    name: template.name,
    description: template.description.replace('{target}', template.targetStage.toString()),
    modifiers,
    difficulty: template.difficulty,
    targetStage: template.targetStage,
    rewards,
    isCompleted: false,
  };
}

/**
 * Convert date string to a numeric seed
 */
function dateToSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get modifiers for a given difficulty
 */
function getModifiersForDifficulty(
  difficulty: ChallengeDifficulty, 
  count: number, 
  seed: number
): ChallengeModifier[] {
  let pool: ChallengeModifier[] = [];
  
  switch (difficulty) {
    case ChallengeDifficulty.Easy:
      pool = [...EASY_MODIFIERS];
      break;
    case ChallengeDifficulty.Medium:
      pool = [...EASY_MODIFIERS, ...MEDIUM_MODIFIERS];
      break;
    case ChallengeDifficulty.Hard:
      pool = [...MEDIUM_MODIFIERS, ...HARD_MODIFIERS];
      break;
    case ChallengeDifficulty.Nightmare:
      pool = [...HARD_MODIFIERS, ...NIGHTMARE_MODIFIERS];
      break;
  }
  
  // Shuffle based on seed and pick 'count' modifiers
  const shuffled = pool.sort(() => (seed % 2) - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get modifier display info
 */
export const MODIFIER_INFO: Record<ChallengeModifier, { name: string; icon: string; description: string }> = {
  [ChallengeModifier.FaceCardsFive]: { name: 'Weak Faces', icon: '👤', description: 'All face cards worth 5' },
  [ChallengeModifier.AcesOnly]: { name: 'High Aces', icon: '🅰️', description: 'Aces always count as 11' },
  [ChallengeModifier.NoSplit]: { name: 'No Split', icon: '🚫', description: 'Cannot split pairs' },
  [ChallengeModifier.NoDouble]: { name: 'No Double', icon: '✋', description: 'Cannot double down' },
  [ChallengeModifier.DealerHits17]: { name: 'Greedy Dealer', icon: '🎰', description: 'Dealer hits on 17' },
  [ChallengeModifier.DealerShowsAll]: { name: 'Open Cards', icon: '👁️', description: 'Dealer shows both cards' },
  [ChallengeModifier.AggressiveDealer]: { name: 'Aggressive AI', icon: '😈', description: 'Dealer hits to 18+' },
  [ChallengeModifier.MinBet100]: { name: 'High Stakes', icon: '💰', description: 'Minimum bet is $100' },
  [ChallengeModifier.MaxBet50]: { name: 'Low Stakes', icon: '🪙', description: 'Maximum bet is $50' },
  [ChallengeModifier.DoubleBets]: { name: '2x Bets', icon: '💸', description: 'All bets doubled' },
  [ChallengeModifier.OneLife]: { name: 'One Life', icon: '💀', description: 'Any bust = game over' },
  [ChallengeModifier.TimePressure]: { name: 'Speed Run', icon: '⏱️', description: '10s per decision' },
  [ChallengeModifier.BlindPlay]: { name: 'Blind Faith', icon: '🙈', description: "Can't see dealer's up card" },
  [ChallengeModifier.Chaos]: { name: 'Chaos', icon: '🌀', description: 'Random card values' },
};

/**
 * Get difficulty color
 */
export const DIFFICULTY_COLORS: Record<ChallengeDifficulty, string> = {
  [ChallengeDifficulty.Easy]: '#22c55e',    // Green
  [ChallengeDifficulty.Medium]: '#eab308',  // Yellow
  [ChallengeDifficulty.Hard]: '#ef4444',    // Red
  [ChallengeDifficulty.Nightmare]: '#7c3aed', // Purple
};
