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
  CloverPit = 'CLOVER_PIT',
}

export interface GameSettings {
  volume: number;
  isVoiceEnabled: boolean; // Keep for UI toggle but logic is removed
  theme: TableTheme;
  apiKey?: string;
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

export enum ArtifactTier {
  Common = 'COMMON',
  Rare = 'RARE', 
  Epic = 'EPIC',
  Legendary = 'LEGENDARY',
  Cursed = 'CURSED',
}

export enum ArtifactSet {
  GamblerCollection = 'GAMBLER_COLLECTION', // Luck-based bonuses
  ShadowPact = 'SHADOW_PACT',               // Risk/reward effects
  BloodOath = 'BLOOD_OATH',                 // Sacrifice for power
  FortuneFavor = 'FORTUNE_FAVOR',           // Betting bonuses
  None = 'NONE',
}

export enum ArtifactType {
  // === COMMON (White) - Basic stat boosts ===
  GoldenTouch = 'GOLDEN_TOUCH',         // +5% win bonus
  LuckyCoin = 'LUCKY_COIN',             // +2% wild card chance
  SafeBet = 'SAFE_BET',                 // Reduce loss by 10%
  ChipMagnet = 'CHIP_MAGNET',           // +$10 per win
  SmallShield = 'SMALL_SHIELD',         // Block 1 bust per run
  
  // === RARE (Blue) - Notable effects ===
  LuckySeven = 'LUCKY_SEVEN',           // 7 in hand = +$77 bonus
  AceInTheHole = 'ACE_IN_THE_HOLE',     // First Ace = can peek dealer
  DoubleDown = 'DOUBLE_DOWN_CHARM',     // Double costs 1.5x instead of 2x
  InsurancePlus = 'INSURANCE_PLUS',     // Insurance pays 3:1
  SplitMaster = 'SPLIT_MASTER',         // Free split once per round
  ComboStarter = 'COMBO_STARTER',       // Win streak starts at 2
  
  // === EPIC (Purple) - Powerful effects ===
  VampiricGamble = 'VAMPIRIC_GAMBLE',   // Win = heal 10% of bet
  TimeWarp = 'TIME_WARP',               // Undo last hit once per round
  CardCounter = 'CARD_COUNTER_ARTIFACT', // See next card in deck
  GhostHand = 'GHOST_HAND',             // 10% chance bust = push instead
  HighRollerBadge = 'HIGH_ROLLER_BADGE', // Bets of $200+ = +25% payout
  DealersBane = 'DEALERS_BANE',         // Dealer bust chance +5%
  
  // === LEGENDARY (Gold) - Game-changing ===
  PhoenixFeather = 'PHOENIX_FEATHER',   // Revive once at 50% bankroll
  FortuneFavor_Legendary = 'FORTUNE_FAVOR_LEGENDARY', // Crit wins (2x) on 21
  ShadowCloak = 'SHADOW_CLOAK',         // Boss traits reduced 50%
  InfiniteLoop = 'INFINITE_LOOP',       // Push = replay hand
  TheGodhand = 'THE_GODHAND',           // Start each hand with 20
  
  // === CURSED (Red) - High risk, high reward ===
  BloodPact = 'BLOOD_PACT',             // +50% wins, but lose 10% on bust
  DemonDice = 'DEMON_DICE',             // Random: 3x payout OR lose bet
  SoulChain = 'SOUL_CHAIN',             // Wins give +$100, losses cost 2x
  CursedDeck = 'CURSED_DECK',           // All cards wild, but -$20 per hit
  VoidTouch = 'VOID_TOUCH',             // No push possible: always win or lose
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  name: string;
  description: string;
  cost: number;
  tier: ArtifactTier;
  set?: ArtifactSet;
  isActive?: boolean;     // For active artifacts with cooldown
  cooldown?: number;      // Turns until can use again
  isCursed?: boolean;     // Has negative side effects
  drawback?: string;      // Description of curse drawback
}

export interface SetBonus {
  set: ArtifactSet;
  requiredCount: number;
  bonusName: string;
  bonusDescription: string;
}

// === SKILL TREE SYSTEM ===

export enum SpecializationPath {
  DealerKiller = 'DEALER_KILLER',   // Boss damage bonuses
  HighRoller = 'HIGH_ROLLER',       // Betting multipliers
  Survivor = 'SURVIVOR',             // Defensive abilities
  None = 'NONE',
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  path: SpecializationPath;
  tier: number;                      // 1-5, higher = more powerful
  cost: number;                      // Prestige points required
  prerequisite?: string;             // ID of required skill
  isUnlocked: boolean;
  effect: {
    type: 'BONUS' | 'ABILITY' | 'PASSIVE';
    value: number;
    target: string;                  // What the skill affects
  };
  icon: string;
}

export interface SkillTree {
  unlockedSkills: string[];          // IDs of unlocked skills
  currentPath: SpecializationPath;
  pathProgress: Record<SpecializationPath, number>; // Points spent per path
}

export interface PrestigeUpgrades {
  // Original upgrades
  extraStartingCash: number;
  bonusInventorySlots: number;
  increasedWildChance: number;
  
  // New Skill Tree upgrades
  bossRewardMultiplier: number;      // +% boss rewards
  criticalWinChance: number;         // % chance for 2x win
  bustProtectionChance: number;      // % chance to survive bust
  betMultiplierBonus: number;        // +% on all bets
  startingArtifactSlots: number;     // # of artifacts at run start
  heatMeterReduction: number;        // Reduce heat buildup
}

export interface MetaProgression {
  totalPrestigePoints: number;
  spentPrestigePoints: number;
  upgrades: PrestigeUpgrades;
  skillTree: SkillTree;
  totalRuns: number;
  highestStageEver: number;
}

export enum BossTrait {
  // Original traits
  DealerWinsPush = 'DEALER_WINS_PUSH',
  HiddenCardBuff = 'HIDDEN_CARD_BUFF',
  GreedyDealer = 'GREEDY_DEALER',
  TaxCollector = 'TAX_COLLECTOR',
  
  // New Boss traits
  Perfectionist = 'PERFECTIONIST',        // Always hits to 19+
  WildSwings = 'WILD_SWINGS',             // Random multipliers (0.5x - 3x)
  CardCounter = 'CARD_COUNTER',           // Can see 1 player card
  CursedTouch = 'CURSED_TOUCH',           // Push = lose card from deck
  DoubleStakes = 'DOUBLE_STAKES',         // Double bet each round
  ChipThief = 'CHIP_THIEF',               // Steals 10% chips on bust
  PhantomCards = 'PHANTOM_CARDS',         // Can make 1 card invisible
  MirrorPlay = 'MIRROR_PLAY',             // Copies player's last action
  CardSwapper = 'CARD_SWAPPER',           // Swaps random cards
  TheHouse = 'THE_HOUSE',                 // Final boss - multiple traits
}

export enum BossPersonality {
  Aggressive = 'AGGRESSIVE',
  Defensive = 'DEFENSIVE',
  Unpredictable = 'UNPREDICTABLE',
  Calculating = 'CALCULATING',
  Intimidating = 'Intimidating',
}

export type BossPhase = 'intro' | 'phase1' | 'phase2' | 'phase3' | 'enraged' | 'defeated';

export interface BossAbility {
  id: string;
  name: string;
  description: string;
  icon: string;
  cooldown: number;
  lastUsed: number;
}

export interface BossDialogue {
  intro: string[];
  playerWin: string[];
  playerLose: string[];
  playerBust: string[];
  dealerBust: string[];
  taunt: string[];
  special: string[]; // When using special ability
}

export interface BossData {
  id: string;
  name: string;
  title: string;
  traits: BossTrait[];
  personality: BossPersonality;
  dialogue: BossDialogue | Record<BossPhase, string[]>;
  stageAppears: number;
  rewardMultiplier: number;
  maxHealth: number;
  currentHealth: number;
  phase: BossPhase;
  abilities: BossAbility[];
  visualTheme: {
    primaryColor: string;
    secondaryColor: string;
    icon: string;
  };
}

export interface HeatMeter {
  level: number; // 0-100
  consecutiveWins: number;
  difficultyModifier: number; // 1.0 = normal, 1.5 = hard, etc.
  isHot: boolean; // Triggers special events when hot
}

// === SHOP SYSTEM ===

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'joker' | 'consumable' | 'voucher' | 'booster' | 'service';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'cursed';
  icon: string;
  stock?: number;
  maxStock?: number;
  discount?: number;
  isOnSale?: boolean;
  isLocked?: boolean;
  unlockRequirement?: string;
}

export interface ShopState {
  items: ShopItem[];
  rerollCost: number;
  rerollCount: number;
  interestRate: number;
  maxInterest: number;
  saleItemId?: string;
  lastRestock: number;
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
  activeBossTraits: BossTrait[]; // For bosses with multiple traits
  currentBossId: string | null; // ID of current boss
  rareArtifactChoices: Artifact[] | null;
  
  // Heat Meter System
  heatMeter: HeatMeter;

  // Shop System
  shopState: ShopState;
  
  // Daily Challenge
  activeChallenge?: DailyChallenge;
}

// === DAILY CHALLENGE SYSTEM ===

export enum ChallengeModifier {
  // Card modifiers
  FaceCardsFive = 'FACE_CARDS_FIVE',           // All face cards worth 5
  AcesOnly = 'ACES_ONLY',                       // Aces are always 11
  NoSplit = 'NO_SPLIT',                         // Cannot split
  NoDouble = 'NO_DOUBLE',                       // Cannot double down
  
  // Dealer modifiers
  DealerHits17 = 'DEALER_HITS_17',             // Dealer hits on 17
  DealerShowsAll = 'DEALER_SHOWS_ALL',         // Dealer shows both cards
  AggressiveDealer = 'AGGRESSIVE_DEALER',      // Dealer always hits to 18+
  
  // Betting modifiers
  MinBet100 = 'MIN_BET_100',                   // Minimum bet is $100
  MaxBet50 = 'MAX_BET_50',                     // Maximum bet is $50
  DoubleBets = 'DOUBLE_BETS',                  // All bets doubled
  
  // Special modifiers
  OneLife = 'ONE_LIFE',                        // Bust = game over
  TimePressure = 'TIME_PRESSURE',              // 10 seconds per decision
  BlindPlay = 'BLIND_PLAY',                    // Can't see dealer's up card
  Chaos = 'CHAOS',                             // Random card values
}

export enum ChallengeDifficulty {
  Easy = 'EASY',
  Medium = 'MEDIUM',
  Hard = 'HARD',
  Nightmare = 'NIGHTMARE',
}

export interface DailyChallenge {
  id: string;
  date: string;                                // YYYY-MM-DD format
  name: string;
  description: string;
  modifiers: ChallengeModifier[];
  difficulty: ChallengeDifficulty;
  targetStage: number;                         // Stage to reach for completion
  rewards: {
    prestigePoints: number;
    tokens: number;
    specialReward?: string;                    // Unique reward description
  };
  isCompleted: boolean;
  bestScore?: number;
}

export interface ChallengeProgress {
  challengeId: string;
  currentStage: number;
  startedAt: number;                           // Timestamp
  attemptsToday: number;
  maxAttempts: number;
}

// === RUN MODE SYSTEM ===

export enum RunMode {
  Standard = 'STANDARD',           // Default 10-stage run
  Endless = 'ENDLESS',             // Infinite stages, scaling difficulty
  SpeedRun = 'SPEED_RUN',          // Timed run, beat 10 stages fastest
  Ironman = 'IRONMAN',             // One life, no saves
  Practice = 'PRACTICE',           // No rewards, unlimited retries
}

export interface RunModeConfig {
  mode: RunMode;
  name: string;
  description: string;
  icon: string;
  color: string;
  stages: number | 'infinite';
  features: {
    allowSaves: boolean;
    allowRetries: boolean;
    timer: boolean;
    bonusRewards: number;          // % multiplier
    difficultyMod: number;         // 1 = normal
  };
  unlockRequirement?: string;      // What to unlock this mode
}

// === ASCENSION SYSTEM ===

export enum AscensionModifierType {
  // Dealer buffs
  DealerStartsWith = 'DEALER_STARTS_WITH',     // Dealer starts with specific card
  DealerHitsHigher = 'DEALER_HITS_HIGHER',     // Dealer hits on higher values
  DealerBlackjack = 'DEALER_BLACKJACK_BUFF',   // More dealer blackjacks
  
  // Player nerfs
  LessBankroll = 'LESS_BANKROLL',              // Start with less money
  HigherMinBet = 'HIGHER_MIN_BET',             // Higher minimum bet
  LessArtifacts = 'LESS_ARTIFACTS',            // Fewer artifact slots
  
  // Shop changes
  HigherPrices = 'HIGHER_PRICES',              // Shop costs more
  LessShopItems = 'LESS_SHOP_ITEMS',           // Fewer items in shop
  
  // Boss buffs
  MoreBossTraits = 'MORE_BOSS_TRAITS',         // Bosses have extra traits
  DoubleHeat = 'DOUBLE_HEAT',                  // Heat builds 2x faster
  
  // Special
  NoWildCards = 'NO_WILD_CARDS',               // Wild cards disabled
  PermanentCurse = 'PERMANENT_CURSE',          // Random curse applied
}

export interface AscensionLevel {
  level: number;                               // 1-20
  name: string;
  modifiers: AscensionModifierType[];
  rewardMultiplier: number;                    // 1.0 = base, 2.0 = double
  unlockRequirement: string;
  icon: string;
}

// === JOKER SYSTEM (Balatro-style) ===

export enum JokerRarity {
  Common = 'COMMON',
  Uncommon = 'UNCOMMON',
  Rare = 'RARE',
  Legendary = 'LEGENDARY',
  Cursed = 'CURSED',
}

export enum JokerTrigger {
  // Card-based triggers
  OnCardPlayed = 'ON_CARD_PLAYED',           // When any card is played
  OnSpecificCard = 'ON_SPECIFIC_CARD',       // When specific rank/suit is played
  OnFaceCard = 'ON_FACE_CARD',               // When J/Q/K is played
  OnAce = 'ON_ACE',                          // When Ace is played
  OnSeven = 'ON_SEVEN',                      // When 7 is played
  
  // Hand-based triggers
  OnHandStart = 'ON_HAND_START',             // At start of each hand
  OnHandEnd = 'ON_HAND_END',                 // At end of each hand
  OnBlackjack = 'ON_BLACKJACK',              // When player hits 21
  OnBust = 'ON_BUST',                        // When player busts
  OnPush = 'ON_PUSH',                        // On push result
  
  // Game-based triggers
  OnWin = 'ON_WIN',                          // When player wins
  OnLose = 'ON_LOSE',                        // When player loses
  OnConsecutiveWin = 'ON_CONSECUTIVE_WIN',   // On win streak
  OnBossDefeat = 'ON_BOSS_DEFEAT',           // When boss is defeated
  
  // Passive triggers
  Always = 'ALWAYS',                         // Always active
  OnShopEnter = 'ON_SHOP_ENTER',             // When entering shop
}

export enum JokerEffectType {
  AddMult = 'ADD_MULT',                      // +X to multiplier
  MultMult = 'MULT_MULT',                    // Xn multiplier
  AddGold = 'ADD_GOLD',                      // +$ gold
  ReduceLoss = 'REDUCE_LOSS',                // Reduce loss %
  CardTransform = 'CARD_TRANSFORM',          // Change card properties
  DeckModify = 'DECK_MODIFY',                // Add/remove cards from deck
  BossDebuff = 'BOSS_DEBUFF',                // Reduce boss effectiveness
  ExtraCards = 'EXTRA_CARDS',                // Draw extra cards
}

export interface JokerCondition {
  type: 'HAND_CONTAINS' | 'HAND_VALUE' | 'STREAK' | 'BANKROLL' | 'STAGE' | 'NONE';
  value?: string | number;
  comparison?: 'EQUALS' | 'GREATER' | 'LESS' | 'CONTAINS';
}

export interface JokerEffect {
  type: JokerEffectType;
  value: number;
  scaling?: number;                          // Optional scaling per condition
}

export interface Joker {
  id: string;
  name: string;
  description: string;
  rarity: JokerRarity;
  trigger: JokerTrigger;
  condition?: JokerCondition;
  effect: JokerEffect;
  cost: number;
  icon: string;
  isSold?: boolean;                          // Track if sold
  isActive?: boolean;                        // For equipped jokers
  
  // Cursed joker specifics
  drawback?: string;                         // Negative effect description
  drawbackEffect?: JokerEffect;              // Negative effect
}

export interface JokerSlot {
  joker: Joker | null;
  isLocked: boolean;                         // Locked slots require unlock
}

// === CARD ENHANCEMENT SYSTEM ===

export enum CardEnhancement {
  None = 'NONE',
  Polished = 'POLISHED',           // +5 to base value
  Lucky = 'LUCKY',                 // 20% chance to draw again
  Burning = 'BURNING',             // Deals damage on boss
  Ghost = 'GHOST',                 // Counts as any suit
  Golden = 'GOLDEN',               // +$20 when played
  Cursed = 'CURSED',               // -5 to value
  Wild = 'WILD',                   // Can be any rank
  Steel = 'STEEL',                 // x1.5 mult when played
  Glass = 'GLASS',                 // x2 mult, destroys on bust
}

export interface EnhancedCard {
  rank: Rank;
  suit: Suit;
  enhancement: CardEnhancement;
  isMarkedForRemoval?: boolean;
  isDuplicated?: boolean;
}

export interface DeckModification {
  type: 'REMOVE' | 'DUPLICATE' | 'ENHANCE' | 'TRANSFORM';
  targetRank?: Rank;
  targetSuit?: Suit;
  enhancement?: CardEnhancement;
  newRank?: Rank;
  cost: number;
}

// === COMBO/SCORING CHAIN SYSTEM ===

export enum ComboType {
  Pair = 'PAIR',                   // Two of same rank
  ThreeOfAKind = 'THREE_OF_A_KIND',
  Suited = 'SUITED',               // All cards same suit
  Sequential = 'SEQUENTIAL',       // Cards in sequence (5-6-7)
  Perfect21 = 'PERFECT_21',        // Exactly 21
  FiveCards = 'FIVE_CARDS',        // 5+ cards without bust
  LowBall = 'LOW_BALL',            // Win with 17 or less
  HighRoller = 'HIGH_ROLLER',      // Win with 20 or 21
  Blackjack = 'BLACKJACK',         // Natural 21 (2 cards)
  DoubleDown = 'DOUBLE_DOWN',      // Win after double
}

export interface ComboBonus {
  type: ComboType;
  name: string;
  description: string;
  multBonus: number;               // Added to multiplier
  goldBonus: number;               // Added gold
  icon: string;
}

export interface ScoringChain {
  consecutiveWins: number;
  combosTriggered: ComboType[];
  totalMultiplier: number;
  streakBonus: number;             // Mult bonus from streak
}
