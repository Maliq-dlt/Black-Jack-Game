export enum Suit {
  Hearts = '♥',
  Diamonds = '♦',
  Clubs = '♣',
  Spades = '♠',
}

export enum Rank {
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
  Ace = 'A',
}

export enum WildCardType {
  None = 'NONE',
  BonusCash = 'BONUS_CASH',
  Shielded = 'SHIELDED',
  FreeHit = 'FREE_HIT',
  Gilded = 'GILDED',
}

export enum EventCardType {
  None = 'NONE',
  Jackpot = 'JACKPOT', // Win = +$500 bonus
  Curse = 'CURSE', // Lose $100 instantly
  DoubleDanger = 'DOUBLE_DANGER', // 2x win or 2x loss
  FreePass = 'FREE_PASS', // Push becomes win
}

export interface AscensionModifier {
  label: string;
  description: string;
}

export enum AchievementType {
  FirstWin = 'FIRST_WIN',
  TenWins = 'TEN_WINS',
  FiftyWins = 'FIFTY_WINS',
  FirstBlackjack = 'FIRST_BLACKJACK',
  TenBlackjacks = 'TEN_BLACKJACKS',
  BeatBoss = 'BEAT_BOSS',
  BeatFiveBosses = 'BEAT_FIVE_BOSSES',
  ReachStage10 = 'REACH_STAGE_10',
  ReachStage20 = 'REACH_STAGE_20',
  Earn10k = 'EARN_10K',
  Earn100k = 'EARN_100K',
  PerfectRun = 'PERFECT_RUN', // Win 10 hands in a row
  HighRoller = 'HIGH_ROLLER', // Bet $500+ and win
  Collector = 'COLLECTOR', // Own 5 artifacts
}

export interface Achievement {
  id: string;
  type: AchievementType;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number; // timestamp
}

export interface LifetimeStats {
  totalWins: number;
  totalLosses: number;
  totalBlackjacks: number;
  totalEarnings: number;
  highestBankroll: number;
  highestStreak: number;
  currentStreak: number;
  bossesDefeated: number;
  highestStage: number;
  totalRunsCompleted: number;
  achievements: Achievement[];
}

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
  id: string;
  wildType?: WildCardType;
  eventType?: EventCardType;
}

export interface Hand {
  id: string; // Unique ID for React keys (crucial for split animation)
  cards: Card[];
  bet: number;
  isActive: boolean; // For split hands
  isBusted: boolean;
  isStood: boolean;
  isDoubled: boolean;
  isBlackjack: boolean;
  hasShield?: boolean;
  isGilded?: boolean;
  score: number;
  hasAce: boolean; // tracks if soft
}

export interface ChipData {
  value: number;
  id: string;
  color: 'red' | 'blue' | 'green' | 'black' | 'purple';
}

export enum GamePhase {
  Betting = 'BETTING',
  Dealing = 'DEALING',
  PlayerTurn = 'PLAYER_TURN',
  DealerTurn = 'DEALER_TURN',
  Evaluation = 'EVALUATION',
  GameOver = 'GAME_OVER',
}

export enum GameResult {
  Win = 'WIN',
  Loss = 'LOSS',
  Push = 'PUSH',
  Blackjack = 'BLACKJACK',
  Bust = 'BUST',
  DealerBust = 'DEALER_BUST',
  None = 'NONE',
}

export enum TableTheme {
  ClassicGreen = 'CLASSIC_GREEN',
  MidnightBlue = 'MIDNIGHT_BLUE',
  CrimsonRoyale = 'CRIMSON_ROYALE',
  CyberNeon = 'CYBER_NEON',
}

export interface GameSettings {
  volume: number;
  isVoiceEnabled: boolean; // Keep for UI toggle but logic is removed
  theme: TableTheme;
}

export enum PowerUpType {
  Peek = 'PEEK',
  Transmute = 'TRANSMUTE',
  Shield = 'SHIELD',
}

export interface PowerUp {
  id: string;
  type: PowerUpType;
  name: string;
  description: string;
  cost: number;
}

export enum ArtifactType {
  GoldenTouch = 'GOLDEN_TOUCH',
  LuckySeven = 'LUCKY_SEVEN',
  LuckyCoin = 'LUCKY_COIN',
  AceInTheHole = 'ACE_IN_THE_HOLE',
  VampiricGamble = 'VAMPIRIC_GAMBLE',
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  name: string;
  description: string;
  cost: number;
}

export interface PrestigeUpgrades {
  extraStartingCash: number; // e.g., 0, 500, 1000
  bonusInventorySlots: number; // e.g., 0, 1, 2
  increasedWildChance: number; // e.g., 0, 0.05, 0.1
}

export interface MetaProgression {
  totalPrestigePoints: number;
  spentPrestigePoints: number;
  upgrades: PrestigeUpgrades;
}

export enum BossTrait {
  DealerWinsPush = 'DEALER_WINS_PUSH',
  HiddenCardBuff = 'HIDDEN_CARD_BUFF', // Dealer hidden card is always at least a 10
  GreedyDealer = 'GREEDY_DEALER', // Dealer hits on soft 17 and soft 18
  TaxCollector = 'TAX_COLLECTOR', // Every hit costs the player $10 extra
}

export interface GameState {
  deck: Card[];
  dealerHand: Hand;
  playerHands: Hand[];
  activeHandIndex: number; // For splitting
  bankroll: number;
  currentBet: number;
  currentBetChips: ChipData[]; // Visual stack of chips
  phase: GamePhase;
  insuranceBet: number;
  insuranceAvailable: boolean;
  history: string[]; // Log of events
  dealerMessage: string; // AI commentary
  isGameStarted: boolean; // For Landing Screen
  settings: GameSettings;
  inventory: PowerUp[];
  artifacts: Artifact[];
  isShopOpen: boolean;
  
  // Roguelike Progression
  currentStage: number;
  consecutiveWins: number;
  lifetimeEarnings: number;
  totalRefills: number;
  
  // Meta-Progression
  meta: MetaProgression;

  // Deck Customization
  removedRanks: string[];

  // Ascension
  ascensionLevel: number;
  highestStageReached: number;
  
  // Boss Mechanics
  isBossRound: boolean;
  activeBossTrait: BossTrait | null;
  rareArtifactChoices: Artifact[] | null;
}
