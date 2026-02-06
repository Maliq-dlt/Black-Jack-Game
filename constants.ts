import { Suit, Rank, TableTheme } from './types';

export const CARD_VALUES: Record<Rank, number> = {
  [Rank.Two]: 2,
  [Rank.Three]: 3,
  [Rank.Four]: 4,
  [Rank.Five]: 5,
  [Rank.Six]: 6,
  [Rank.Seven]: 7,
  [Rank.Eight]: 8,
  [Rank.Nine]: 9,
  [Rank.Ten]: 10,
  [Rank.Jack]: 10,
  [Rank.Queen]: 10,
  [Rank.King]: 10,
  [Rank.Ace]: 11,
};

export const INITIAL_BANKROLL = 2500;
export const BLACKJACK_PAYOUT = 1.5;
export const DEALER_STAND_ON = 17;
export const ANIMATION_DELAY = 600;

export const SUIT_COLORS = {
  [Suit.Hearts]: 'text-[#8b0000]',
  [Suit.Diamonds]: 'text-[#8b0000]',
  [Suit.Clubs]: 'text-[#1a1a1a]',
  [Suit.Spades]: 'text-[#1a1a1a]',
};

export const THEME_COLORS: Record<TableTheme, { bg: string, accent: string }> = {
  [TableTheme.ClassicGreen]: {
    bg: 'radial-gradient(circle at center, #1a231a 0%, #0d1a0d 60%, #050a05 100%)',
    accent: '#1a231a'
  },
  [TableTheme.MidnightBlue]: {
    bg: 'radial-gradient(circle at center, #0c0e12 0%, #06070a 60%, #020202 100%)',
    accent: '#0c0e12'
  },
  [TableTheme.CrimsonRoyale]: {
    bg: 'radial-gradient(circle at center, #2e0a0a 0%, #1a0505 60%, #0a0202 100%)',
    accent: '#2e0a0a'
  },
  [TableTheme.CyberNeon]: {
    bg: 'radial-gradient(circle at center, #0a0a1a 0%, #050510 60%, #020205 100%)',
    accent: '#0a0a1a'
  }
};

