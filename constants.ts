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
  [Suit.Hearts]: 'text-[#dc2626]',    // Bright red for hearts
  [Suit.Diamonds]: 'text-[#dc2626]',  // Bright red for diamonds
  [Suit.Clubs]: 'text-[#e8dcc8]',     // Bone white for clubs
  [Suit.Spades]: 'text-[#e8dcc8]',    // Bone white for spades
};

export const THEME_COLORS: Record<TableTheme, { bg: string, accent: string }> = {
  [TableTheme.ClassicGreen]: {
    bg: 'radial-gradient(ellipse 120% 80% at 50% 30%, #1a1410 0%, #0f0c08 40%, #0a0806 70%, #050403 100%)',
    accent: '#d4a24c'
  },
  [TableTheme.MidnightBlue]: {
    bg: 'radial-gradient(ellipse at center, #0c0e12 0%, #06070a 60%, #020202 100%)',
    accent: '#0c0e12'
  },
  [TableTheme.CrimsonRoyale]: {
    bg: 'radial-gradient(ellipse at center, #2e0a0a 0%, #1a0505 60%, #0a0202 100%)',
    accent: '#8b1a1a'
  },
  [TableTheme.CyberNeon]: {
    bg: 'radial-gradient(ellipse at center, #0a0a1a 0%, #050510 60%, #020205 100%)',
    accent: '#0a0a1a'
  },
  [TableTheme.CloverPit]: {
    bg: 'radial-gradient(ellipse 100% 70% at 50% 35%, #1a2418 0%, #0f1610 40%, #080a08 70%, #040504 100%)',
    accent: '#3d5a3d'
  }
};

