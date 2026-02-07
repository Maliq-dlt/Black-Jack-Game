import { WildCardType, EventCardType, Rank } from './types';

export interface CardSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'wild' | 'event' | 'rank';
  effect: string;
  tip?: string;
}

// Wild Card Skills
export const WILD_CARD_SKILLS: Record<WildCardType, CardSkill | null> = {
  [WildCardType.None]: null,
  [WildCardType.BonusCash]: {
    id: 'bonus_cash',
    name: 'Jackpot Card',
    description: 'A gilded card blessed by fortune. Triggers bonus cash on victory.',
    icon: '💰',
    color: '#fbbf24',
    category: 'wild',
    effect: '+$50 bonus when you win with this card in your hand.',
    tip: 'Stack Jackpot Cards for massive bonus payouts!'
  },
  [WildCardType.Shielded]: {
    id: 'shielded',
    name: 'Shielded Card',
    description: 'Protected by ancient runes. Blocks one bust.',
    icon: '🛡️',
    color: '#3b82f6',
    category: 'wild',
    effect: 'If you would bust, this card negates the bust once.',
    tip: 'Hit aggressively when you have a Shield!'
  },
  [WildCardType.FreeHit]: {
    id: 'free_hit',
    name: 'Free Hit Card',
    description: 'A spectral card that allows risk-free hitting.',
    icon: '🎯',
    color: '#a855f7',
    category: 'wild',
    effect: 'Your next hit is free - if you bust, undo the hit.',
    tip: 'Use Free Hit when close to 21 for safe plays.'
  },
  [WildCardType.Gilded]: {
    id: 'gilded',
    name: 'Gilded Card',
    description: 'Touched by Midas. Increases your winnings.',
    icon: '✨',
    color: '#ec4899',
    category: 'wild',
    effect: '+25% win payout when this card is in your hand.',
    tip: 'Combine with high bets for maximum profit.'
  }
};

// Event Card Skills
export const EVENT_CARD_SKILLS: Record<EventCardType, CardSkill | null> = {
  [EventCardType.None]: null,
  [EventCardType.Jackpot]: {
    id: 'jackpot_event',
    name: 'JACKPOT',
    description: 'The ultimate prize! A massive bonus awaits the victor.',
    icon: '🎰',
    color: '#fbbf24',
    category: 'event',
    effect: '+$500 bonus when you win this hand!',
    tip: 'Play conservatively to secure the jackpot.'
  },
  [EventCardType.Curse]: {
    id: 'curse',
    name: 'CURSE',
    description: 'A dark omen. Drains your wealth instantly.',
    icon: '☠️',
    color: '#ef4444',
    category: 'event',
    effect: '-$100 immediately when this card is drawn.',
    tip: 'Some artifacts can block or convert curses.'
  },
  [EventCardType.DoubleDanger]: {
    id: 'double_danger',
    name: 'DOUBLE DANGER',
    description: 'High risk, high reward. Fortune favors the bold.',
    icon: '⚔️',
    color: '#f97316',
    category: 'event',
    effect: '2x win OR 2x loss on this hand.',
    tip: 'Only trigger when you have a strong hand!'
  },
  [EventCardType.FreePass]: {
    id: 'free_pass',
    name: 'FREE PASS',
    description: 'A lucky charm. Ties become victories.',
    icon: '🎫',
    color: '#22c55e',
    category: 'event',
    effect: 'Push (tie) becomes a Win.',
    tip: 'Great insurance against dealer blackjacks.'
  }
};

// Rank-based Skills (inherent card abilities)
export const RANK_SKILLS: Partial<Record<Rank, CardSkill>> = {
  [Rank.Ace]: {
    id: 'ace_flex',
    name: 'Ace Flexibility',
    description: 'The Ace adapts to your needs.',
    icon: '👑',
    color: '#a855f7',
    category: 'rank',
    effect: 'Value is 1 or 11, whichever is more favorable.',
    tip: 'Aces make soft hands - hard to bust!'
  },
  [Rank.Seven]: {
    id: 'lucky_seven',
    name: 'Lucky Seven',
    description: 'Fortune smiles on those who draw sevens.',
    icon: '🍀',
    color: '#22c55e',
    category: 'rank',
    effect: '+$77 bonus with Lucky Seven artifact equipped.',
    tip: 'Seek the Lucky Seven artifact in the shop!'
  },
  [Rank.Jack]: {
    id: 'face_jack',
    name: 'Jack',
    description: 'The cunning rogue. Always worth 10.',
    icon: '🃏',
    color: '#f59e0b',
    category: 'rank',
    effect: 'Fixed value of 10.',
    tip: 'Face cards are reliable for building strong hands.'
  },
  [Rank.Queen]: {
    id: 'face_queen',
    name: 'Queen',
    description: 'The noble ruler. Always worth 10.',
    icon: '👸',
    color: '#ec4899',
    category: 'rank',
    effect: 'Fixed value of 10.',
    tip: 'Pair with an Ace for instant Blackjack!'
  },
  [Rank.King]: {
    id: 'face_king',
    name: 'King',
    description: 'The sovereign power. Always worth 10.',
    icon: '🤴',
    color: '#8b5cf6',
    category: 'rank',
    effect: 'Fixed value of 10.',
    tip: 'The King commands respect at the table.'
  }
};

// Helper function to get all skills for a card
export const getCardSkills = (
  wildType?: WildCardType,
  eventType?: EventCardType,
  rank?: Rank
): CardSkill[] => {
  const skills: CardSkill[] = [];
  
  if (wildType && WILD_CARD_SKILLS[wildType]) {
    skills.push(WILD_CARD_SKILLS[wildType]!);
  }
  
  if (eventType && EVENT_CARD_SKILLS[eventType]) {
    skills.push(EVENT_CARD_SKILLS[eventType]!);
  }
  
  if (rank && RANK_SKILLS[rank]) {
    skills.push(RANK_SKILLS[rank]!);
  }
  
  return skills;
};

// Get primary skill for display
export const getPrimarySkill = (
  wildType?: WildCardType,
  eventType?: EventCardType,
  rank?: Rank
): CardSkill | null => {
  // Priority: Event > Wild > Rank
  if (eventType && EVENT_CARD_SKILLS[eventType]) {
    return EVENT_CARD_SKILLS[eventType];
  }
  if (wildType && WILD_CARD_SKILLS[wildType]) {
    return WILD_CARD_SKILLS[wildType];
  }
  if (rank && RANK_SKILLS[rank]) {
    return RANK_SKILLS[rank];
  }
  return null;
};
