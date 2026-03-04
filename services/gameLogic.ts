import { Card, Suit, Rank, Hand, WildCardType, EventCardType } from '../types';
import { CARD_VALUES } from '../constants';
import { generateId } from './idUtils';

export const createDeck = (extraChance: number = 0, excludedRanks: string[] = []): Card[] => {
  const suits = [Suit.Hearts, Suit.Diamonds, Suit.Clubs, Suit.Spades];
  const ranks = Object.values(Rank);
  let deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      if (excludedRanks.includes(rank)) continue;
      const isWild = Math.random() < (0.15 + extraChance);
      let wildType = WildCardType.None;
      
      if (isWild) {
        const types = [WildCardType.BonusCash, WildCardType.Shielded, WildCardType.FreeHit, WildCardType.Gilded];
        wildType = types[Math.floor(Math.random() * types.length)];
      }

      // Event Card Chance (5% per card)
      const isEvent = Math.random() < 0.05;
      let eventType = EventCardType.None;
      if (isEvent) {
        const eventTypes = [EventCardType.Jackpot, EventCardType.DoubleDanger, EventCardType.FreePass];
        eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      }

      deck.push({
        suit,
        rank,
        value: CARD_VALUES[rank],
        id: generateId(`${rank}-${suit}`),
        wildType,
        eventType
      });
    }
  }
  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const calculateScore = (cards: Card[]): { score: number; isSoft: boolean } => {
  let score = 0;
  let aces = 0;

  for (const card of cards) {
    score += card.value;
    if (card.rank === Rank.Ace) {
      aces += 1;
    }
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return { score, isSoft: aces > 0 && score <= 21 }; // Simplified isSoft check
};

export const createHand = (bet: number = 0): Hand => ({
  id: generateId('hand'),
  cards: [],
  bet,
  isActive: true,
  isBusted: false,
  isStood: false,
  isDoubled: false,
  isBlackjack: false,
  score: 0,
  hasAce: false,
});
