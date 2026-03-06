import React, { useState, useEffect, useCallback } from 'react';
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion';
import { GamePhase, GameState, Hand, Card, GameResult, Rank, Suit, ChipData, TableTheme, GameSettings, PowerUp, Artifact, PowerUpType, ArtifactType, WildCardType, BossTrait, MetaProgression, PrestigeUpgrades, EventCardType, LifetimeStats, Achievement, AchievementType, ShopItem, ShopState } from './types';
import { INITIAL_BANKROLL, BLACKJACK_PAYOUT, DEALER_STAND_ON, ANIMATION_DELAY } from './constants';
import { createDeck, shuffleDeck, calculateScore, createHand } from './services/gameLogic';
import { detectCombos } from './comboDetector';
import { getDealerCommentary } from './services/geminiService';
import CardComponent from './components/CardComponent';
import Chip from './components/Chip';
import { ParticleEffect, AnimatedCounter, ResultBanner } from './components/ParticleEffect';
import BossRewardOverlay from './components/BossRewardOverlay';
import RunSummary from './components/RunSummary';
import DeckViewer from './components/DeckViewer';
import { LandingScreen, SettingsModal } from './components/LandingScreen';
import { EnhancedShop } from './components/EnhancedShop';
import { SoundEngine } from './services/SoundEngine';
import { THEME_COLORS } from './constants';
import StatsScreen from './components/StatsScreen';
import AchievementPopup, { ACHIEVEMENTS, createAchievement } from './components/AchievementPopup';
import { BossBattlePhases, BossAbility, BossPhase } from './components/BossBattlePhases';
import { FlashType } from './components/FlashOverlay';
import { ParticleType } from './components/ParticleSystem';
import { BOSS_DATA, getBossForStage, isBossStage, getBossDialogue } from './bossData';
import { SkillTreeScreen } from './components/SkillTreeScreen';
import { SpecializationPath } from './types';

// GamePlay Upgrade Components
import { GameContainer } from './components/ShakeContainer';
import { FlashOverlay } from './components/FlashOverlay';
import { ParticleSystem } from './components/ParticleSystem';
import { NumberCounter } from './components/NumberCounter';
import { AchievementQueue } from './components/AchievementNotification';
import { ComboPopup } from './components/ComboChainDisplay';
import { Tooltip } from './components/Tooltip';
import { useGameJuiceContext } from './context/GameJuiceContext';
import { useComboContext } from './context/ComboContext';
import CardSkillPopup from './components/CardSkillPopup';

// Graphics Upgrade Phase 1
import { GlobalStyles, GameBackground } from './graphics';

// Icons
const RefreshIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;

const App: React.FC = () => {
  // --- Persistence ---
  const loadMeta = (): MetaProgression => {
    const defaults: MetaProgression = {
      totalPrestigePoints: 10,
      spentPrestigePoints: 0,
      upgrades: { 
        extraStartingCash: 0, 
        bonusInventorySlots: 0, 
        increasedWildChance: 0,
        bossRewardMultiplier: 0,
        criticalWinChance: 0,
        bustProtectionChance: 0,
        betMultiplierBonus: 0,
        startingArtifactSlots: 0,
        heatMeterReduction: 0
      },
      skillTree: {
        unlockedSkills: [],
        currentPath: SpecializationPath.None,
        pathProgress: {
          [SpecializationPath.DealerKiller]: 0,
          [SpecializationPath.HighRoller]: 0,
          [SpecializationPath.Survivor]: 0,
          [SpecializationPath.None]: 0
        }
      },
      totalRuns: 0,
      highestStageEver: 0
    };
    const saved = localStorage.getItem('royale_blackjack_meta');
    if (!saved) return defaults;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...defaults,
        ...parsed,
        upgrades: { ...defaults.upgrades, ...(parsed.upgrades || {}) },
        skillTree: { ...defaults.skillTree, ...(parsed.skillTree || {}) }
      };
    } catch {
      return defaults;
    }
  };

  const loadSettings = (): GameSettings => {
    const defaults: GameSettings = {
      volume: 0.5,
      isVoiceEnabled: false,
      theme: TableTheme.ClassicGreen,
      apiKey: ''
    };
    const saved = localStorage.getItem('royale_blackjack_settings');
    if (!saved) return defaults;
    try {
      return { ...defaults, ...JSON.parse(saved) };
    } catch {
      return defaults;
    }
  };

  const loadStats = (): LifetimeStats => {
    const defaults: LifetimeStats = {
      totalWins: 0,
      totalLosses: 0,
      totalBlackjacks: 0,
      totalEarnings: 0,
      highestBankroll: INITIAL_BANKROLL,
      highestStreak: 0,
      currentStreak: 0,
      bossesDefeated: 0,
      highestStage: 0,
      totalRunsCompleted: 0,
      achievements: []
    };
    const saved = localStorage.getItem('royale_blackjack_stats');
    if (!saved) return defaults;
    try {
      return { ...defaults, ...JSON.parse(saved) };
    } catch {
      return defaults;
    }
  };

  // --- State ---
  const initialMeta = loadMeta();
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    dealerHand: createHand(),
    playerHands: [createHand()],
    activeHandIndex: 0,
    bankroll: INITIAL_BANKROLL,
    currentBet: 0,
    currentBetChips: [],
    phase: GamePhase.Betting,
    insuranceBet: 0,
    insuranceAvailable: false,
    history: [],
    dealerMessage: "Welcome to the high rollers table. Place your bets.",
    isGameStarted: false,
    settings: loadSettings(),
    inventory: [],
    artifacts: [],
    isShopOpen: false,
    currentStage: 1,
    consecutiveWins: 0,
    lifetimeEarnings: INITIAL_BANKROLL,
    totalRefills: 0,
    isBossRound: false,
    activeBossTrait: null,
    activeBossTraits: [],
    currentBossId: null,
    rareArtifactChoices: null,
    meta: initialMeta,
    removedRanks: [],
    ascensionLevel: initialMeta.upgrades?.extraStartingCash > 0 ? 1 : 0,
    highestStageReached: 0,
    heatMeter: {
      level: 0,
      consecutiveWins: 0,
      difficultyModifier: 1.0,
      isHot: false
    },
    shopState: {
      items: [],
      rerollCost: 100,
      rerollCount: 0,
      interestRate: 0.05,
      maxInterest: 250,
      lastRestock: Date.now()
    }
  });

  const [peakBankroll, setPeakBankroll] = useState(INITIAL_BANKROLL);
  const [isRunSummaryOpen, setIsRunSummaryOpen] = useState(false);
  const [isDeckViewerOpen, setIsDeckViewerOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSkillTreeOpen, setIsSkillTreeOpen] = useState(false);
  const [lifetimeStats, setLifetimeStats] = useState<LifetimeStats>(loadStats);
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);
  const [selectedCardForInfo, setSelectedCardForInfo] = useState<{ card: Card; position: { x: number; y: number } } | null>(null);

  // ⚡ Bolt: Stable callback for CardComponent to prevent breaking React.memo
  const handleCardClick = useCallback((card: Card, event: React.MouseEvent) => {
    setSelectedCardForInfo({ card, position: { x: event.clientX, y: event.clientY } });
  }, []);

  // Persist Meta-Progression and Stats
  useEffect(() => {
    localStorage.setItem('royale_blackjack_meta', JSON.stringify(gameState.meta));
  }, [gameState.meta]);

  useEffect(() => {
    localStorage.setItem('royale_blackjack_stats', JSON.stringify(lifetimeStats));
  }, [lifetimeStats]);

  useEffect(() => {
    localStorage.setItem('royale_blackjack_settings', JSON.stringify(gameState.settings));
  }, [gameState.settings]);

  useEffect(() => {
    if (gameState.bankroll > peakBankroll) {
        setPeakBankroll(gameState.bankroll);
    }
    if (gameState.bankroll === 0 && gameState.isGameStarted) {
        setIsRunSummaryOpen(true);
    }
  }, [gameState.bankroll, peakBankroll, gameState.isGameStarted]);

  // --- Achievement Checker ---
  const checkAchievements = useCallback((stats: LifetimeStats, isWin: boolean, isBJ: boolean, betAmount: number, isAnyBoss: boolean) => {
    const currentAchievements = [...stats.achievements];
    const unlockAchievement = (type: AchievementType) => {
      if (!currentAchievements.some(a => a.type === type)) {
        const newAch = createAchievement(type);
        currentAchievements.push(newAch);
        setPendingAchievement(newAch);
      }
    };

    // Check conditions
    if (stats.totalWins >= 1) unlockAchievement(AchievementType.FirstWin);
    if (stats.totalWins >= 10) unlockAchievement(AchievementType.TenWins);
    if (stats.totalWins >= 50) unlockAchievement(AchievementType.FiftyWins);
    if (stats.totalBlackjacks >= 1) unlockAchievement(AchievementType.FirstBlackjack);
    if (stats.totalBlackjacks >= 10) unlockAchievement(AchievementType.TenBlackjacks);
    if (stats.bossesDefeated >= 1) unlockAchievement(AchievementType.BeatBoss);
    if (stats.bossesDefeated >= 5) unlockAchievement(AchievementType.BeatFiveBosses);
    if (stats.highestStage >= 10) unlockAchievement(AchievementType.ReachStage10);
    if (stats.highestStage >= 20) unlockAchievement(AchievementType.ReachStage20);
    if (stats.totalEarnings >= 10000) unlockAchievement(AchievementType.Earn10k);
    if (stats.totalEarnings >= 100000) unlockAchievement(AchievementType.Earn100k);
    if (stats.highestStreak >= 10) unlockAchievement(AchievementType.PerfectRun);
    if (isWin && betAmount >= 500) unlockAchievement(AchievementType.HighRoller);
    if (gameState.artifacts.length >= 5) unlockAchievement(AchievementType.Collector);

    return currentAchievements;
  }, [gameState.artifacts.length]);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const soundEngine = SoundEngine.getInstance();
  
  // Particle & UI Effect States
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCoins, setShowCoins] = useState(false);
  const [resultBanner, setResultBanner] = useState<'WIN' | 'LOSE' | 'BLACKJACK' | 'PUSH' | 'BUST' | null>(null);
  const [lastWinAmount, setLastWinAmount] = useState(0);
  const [totalHandsPlayed, setTotalHandsPlayed] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  
  // --- Sound & Effects Synchronization ---
  
  useEffect(() => {
    soundEngine.setVolume(gameState.settings.volume);
  }, [gameState.settings.volume]);

  // Initialize Deck
  useEffect(() => {
    setGameState(prev => ({ ...prev, deck: createDeck() }));
  }, []);

  const getChipColor = (value: number): 'red' | 'green' | 'black' | 'purple' => {
      switch (value) {
          case 5: return 'red';
          case 25: return 'green';
          case 100: return 'black';
          case 500: return 'purple';
          default: return 'red';
      }
  };

  // Update Scores Helper
  const updateHandScore = (hand: Hand): Hand => {
    const { score, isSoft } = calculateScore(hand.cards);
    return { 
      ...hand, 
      score, 
      isBusted: score > 21,
      isBlackjack: score === 21 && hand.cards.length === 2 && !hand.cards.some(c => c.rank === Rank.Ten || c.rank === Rank.Jack || c.rank === Rank.Queen || c.rank === Rank.King) // Loose def for initial check, stricter in eval
    };
  };

  // Betting Actions
  const placeBet = (amount: number) => {
    if (gameState.bankroll >= amount) {
      const newChip: ChipData = {
          value: amount,
          id: Math.random().toString(36),
          color: getChipColor(amount)
      };

      setGameState(prev => ({
        ...prev,
        bankroll: prev.bankroll - amount,
        currentBet: prev.currentBet + amount,
        currentBetChips: [...prev.currentBetChips, newChip]
      }));
      soundEngine.playChipClick();
    }
  };

  const returnChip = (chip: ChipData) => {
    setGameState(prev => ({
      ...prev,
      bankroll: prev.bankroll + chip.value,
      currentBet: prev.currentBet - chip.value,
      currentBetChips: prev.currentBetChips.filter(c => c.id !== chip.id)
    }));
    soundEngine.playChipClick();
  };

  const clearBet = () => {
    if (gameState.currentBet === 0) return;
    
    setGameState(prev => ({
      ...prev,
      bankroll: prev.bankroll + prev.currentBet,
      currentBet: 0,
      currentBetChips: []
    }));
    soundEngine.playChipClick();
  };

  const dealGame = () => {
    if (gameState.currentBet === 0) return;

    let deck = [...gameState.deck];
    if (deck.length < 15) deck = createDeck(gameState.meta.upgrades.increasedWildChance, gameState.removedRanks); // Reshuffle if low
    
    // Lucky Seven Artifact Logic
    const hasLuckySeven = gameState.artifacts.some(a => a.type === ArtifactType.LuckySeven);
    const hasAceInTheHole = gameState.artifacts.some(a => a.type === ArtifactType.AceInTheHole);
    let playerOneCards: Card[] = [];
    let dealerCards: Card[] = [];
    // Boss Round Detection
    const isBoss = gameState.currentStage % 5 === 0;
    let bossTrait: BossTrait | null = null;
    let dMsg = "Your move.";

    if (isBoss) {
      const traits = Object.values(BossTrait);
      bossTrait = traits[Math.floor(Math.random() * traits.length)];
      dMsg = `BOSS ENCOUNTER! DEALER HAS TRAIT: ${bossTrait.replace(/_/g, ' ')}`;
    }

    if (hasLuckySeven || hasAceInTheHole) {
        let specialCard: Card;
        const targetRank = hasAceInTheHole ? Rank.Ace : Rank.Seven;
        const specialIndex = deck.findIndex(card => card.rank === targetRank);

        if (specialIndex !== -1) {
            specialCard = deck.splice(specialIndex, 1)[0];
        } else {
            specialCard = { 
                id: `special-generated-${Date.now()}`, 
                suit: Suit.Spades, 
                rank: targetRank, 
                value: targetRank === Rank.Ace ? 11 : 7 
            };
        }
        playerOneCards = [specialCard, deck.pop()!];
        const artName = hasAceInTheHole ? "ACE IN THE HOLE" : "LUCKY SEVEN";
        dMsg = isBoss ? `${dMsg} (${artName}!)` : `${artName} ARTIFACT: STARTING WITH A ${hasAceInTheHole ? 'A' : '7'}!`;
    } else {
        playerOneCards = [deck.pop()!, deck.pop()!];
    }
    
    dealerCards = [deck.pop()!, deck.pop()!];

    // HiddenCardBuff: Boss hidden card is always at least a 10
    if (isBoss && bossTrait === BossTrait.HiddenCardBuff) {
        if (dealerCards[0].value < 10) {
            // Replace with a 10 from the deck
            const tenIndex = deck.findIndex(c => c.value === 10);
            if (tenIndex !== -1) {
                const tenCard = deck.splice(tenIndex, 1)[0];
                deck.push(dealerCards[0]); // Return old card to deck
                dealerCards[0] = tenCard;
            }
        }
    }

    const luckyMessage = dMsg; // Alignment with previous failed replace
    const bossFinalTrait = bossTrait;
    const isBossFinal = isBoss;

    const newPlayerHand: Hand = {
      ...createHand(gameState.currentBet),
      cards: playerOneCards,
    };
    
    const newDealerHand: Hand = {
      ...createHand(0),
      cards: dealerCards,
      isStood: false,
      isBusted: false,
      isDoubled: false,
      isBlackjack: calculateScore(dealerCards).score === 21 && dealerCards.length === 2,
      score: calculateScore(dealerCards).score,
      hasAce: dealerCards.some(c => c.rank === Rank.Ace)
    };

    const updatedPlayerHand = updateHandScore(newPlayerHand);
    const updatedDealerHand = updateHandScore(newDealerHand);

    // Check for Dealer Ace (Insurance)
    const insurancePossible = dealerCards[1].rank === Rank.Ace;

    // Check for Instant Blackjack
    const playerHasBJ = updatedPlayerHand.score === 21;
    
    // Determine next phase
    let nextPhase = GamePhase.PlayerTurn;
    if (playerHasBJ) {
        nextPhase = GamePhase.Evaluation;
    }

    setGameState(prev => ({
      ...prev,
      deck,
      playerHands: [updatedPlayerHand],
      dealerHand: updatedDealerHand,
      phase: nextPhase,
      activeHandIndex: 0,
      dealerMessage: luckyMessage,
      isBossRound: isBossFinal,
      activeBossTrait: bossFinalTrait,
      currentBetChips: [] // Clear visual stack on deal
    }));
    
    // Check initial card effects
    playerOneCards.forEach(c => applyCardEffect(c, 0));
    
    soundEngine.playCardDeal();
  };

  // Player Actions
  const hit = () => {
    let deck = [...gameState.deck];
    if (deck.length === 0) deck = createDeck(gameState.meta.upgrades.increasedWildChance, gameState.removedRanks);
    const card = deck.pop()!;
    
    const hands = [...gameState.playerHands];
    const activeHand = hands[gameState.activeHandIndex];
    activeHand.cards.push(card);
    
    const updatedHand = updateHandScore(activeHand);
    hands[gameState.activeHandIndex] = updatedHand;

    if (gameState.activeBossTrait === BossTrait.TaxCollector) {
        setGameState(prev => ({ 
            ...prev, 
            bankroll: prev.bankroll - 10,
            dealerMessage: "TAX COLLECTOR: $10 FEE FOR HITTING!"
        }));
    }

    setGameState(prev => ({
      ...prev,
      deck,
      playerHands: hands,
    }));
    soundEngine.playCardDeal();
    applyCardEffect(card, gameState.activeHandIndex);

    if (updatedHand.isBusted) {
      juice.bust();
      handleHandEnd();
    } else if (updatedHand.score === 21) {
        juice.blackjack();
        stand(); 
    }
  };

  const stand = () => {
    const hands = [...gameState.playerHands];
    hands[gameState.activeHandIndex].isStood = true;
    
    setGameState(prev => ({ ...prev, playerHands: hands }));
    soundEngine.playCardFlip();
    handleHandEnd();
  };

  const doubleDown = () => {
    if (gameState.bankroll < gameState.currentBet) return;

    const betCost = gameState.playerHands[gameState.activeHandIndex].bet;
    const deck = [...gameState.deck];
    const card = deck.pop()!;
    
    const hands = [...gameState.playerHands];
    const activeHand = hands[gameState.activeHandIndex];
    
    activeHand.cards.push(card);
    activeHand.bet += betCost; // Double the bet
    activeHand.isDoubled = true;
    
    const updatedHand = updateHandScore(activeHand);
    hands[gameState.activeHandIndex] = updatedHand;

    setGameState(prev => ({
      ...prev,
      deck,
      playerHands: hands,
      bankroll: prev.bankroll - betCost,
    }));

    applyCardEffect(card, gameState.activeHandIndex);
    handleHandEnd();
  };

  const split = async () => {
    const activeHandIndex = gameState.activeHandIndex;
    const activeHand = gameState.playerHands[activeHandIndex];
    
    if (activeHand.cards.length !== 2) return;
    if (activeHand.cards[0].value !== activeHand.cards[1].value) return; 
    if (gameState.bankroll < activeHand.bet) return;

    // Use local deck reference to ensure consistency through async pauses
    let deck = [...gameState.deck];
    
    const cardA = activeHand.cards[0];
    const cardB = activeHand.cards[1]; // The one splitting away

    // Create two new hands
    const handA = createHand(activeHand.bet);
    handA.id = activeHand.id; // Keep original ID for the first hand to smooth animation (card A stays)
    handA.cards = [cardA];

    const handB = createHand(activeHand.bet);
    handB.cards = [cardB];

    // --- PHASE 1: Separate Hands (Visual Split) ---
    // The second card physically moves from Hand A position to Hand B position because Hand B is inserted
    setGameState(prev => {
        const newHands = [...prev.playerHands];
        newHands[activeHandIndex] = updateHandScore(handA);
        // Insert second hand next to first
        newHands.splice(activeHandIndex + 1, 0, updateHandScore(handB));
        
        return {
            ...prev,
            bankroll: prev.bankroll - activeHand.bet,
            playerHands: newHands,
            dealerMessage: "Splitting pairs..."
        };
    });

    // Wait for separation animation to complete (Cards flying apart)
    // 800ms gives time for the layout animation to separate the hands and the card to travel
    await new Promise(r => setTimeout(r, 800));

    // --- PHASE 2: Deal to Hand A ---
    const newCardA = deck.pop()!;
    handA.cards.push(newCardA);
    const handAUpdated = updateHandScore(handA);

    setGameState(prev => {
        const newHands = [...prev.playerHands];
        newHands[activeHandIndex] = handAUpdated;
        return { ...prev, deck, playerHands: newHands };
    });

    applyCardEffect(newCardA, activeHandIndex);

    // Wait for card deal animation to settle before dealing to B
    await new Promise(r => setTimeout(r, 800));

    // --- PHASE 3: Deal to Hand B ---
    const newCardB = deck.pop()!;
    handB.cards.push(newCardB);
    const handBUpdated = updateHandScore(handB);

    setGameState(prev => {
        const newHands = [...prev.playerHands];
        newHands[activeHandIndex + 1] = handBUpdated;
        return { 
            ...prev, 
            deck, 
            playerHands: newHands,
            dealerMessage: "Two hands in play."
        };
    });

    applyCardEffect(newCardB, activeHandIndex + 1);
  };

  const buyInsurance = () => {
     if (gameState.bankroll < gameState.currentBet / 2) return;
     setGameState(prev => ({
         ...prev,
         insuranceBet: prev.currentBet / 2,
         bankroll: prev.bankroll - (prev.currentBet / 2),
         insuranceAvailable: false,
         dealerMessage: "Insurance taken."
     }));
  };

  const skipInsurance = () => {
      setGameState(prev => ({ ...prev, insuranceAvailable: false }));
  };

  // Flow Control
  const handleHandEnd = () => {
    const nextIndex = gameState.playerHands.findIndex((h, i) => i > gameState.activeHandIndex && !h.isStood && !h.isBusted && !h.isBlackjack);
    
    if (nextIndex !== -1) {
      setGameState(prev => ({ ...prev, activeHandIndex: nextIndex }));
    } else {
      setGameState(prev => ({ ...prev, phase: GamePhase.DealerTurn }));
    }
  };

  // Dealer Logic
  useEffect(() => {
    if (gameState.phase === GamePhase.DealerTurn) {
        const allBustedOrBJ = gameState.playerHands.every(h => h.isBusted || (h.isBlackjack && h.cards.length === 2));
        
        if (allBustedOrBJ) {
             setGameState(prev => ({ ...prev, phase: GamePhase.Evaluation }));
             return;
        }

        const playDealer = async () => {
            let currentDeck = [...gameState.deck];
            let hand = { ...gameState.dealerHand };
            let handUpdate = updateHandScore(hand);

            // Greedy Dealer Trait: Hits on soft 17 and soft 18
            const dealerGreedy = gameState.activeBossTrait === BossTrait.GreedyDealer;
            const standThreshold = dealerGreedy ? 19 : DEALER_STAND_ON;

            while (handUpdate.score < standThreshold) {
                await new Promise(r => setTimeout(r, ANIMATION_DELAY));
                hand.cards.push(currentDeck.pop()!);
                handUpdate = updateHandScore(hand);
                
                setGameState(prev => ({
                    ...prev,
                    deck: currentDeck,
                    dealerHand: handUpdate
                }));
            }
            
            setTimeout(() => {
                setGameState(prev => ({ ...prev, phase: GamePhase.Evaluation }));
            }, ANIMATION_DELAY);
        };

        playDealer();
    }
  }, [gameState.phase]);

  // Evaluation Logic
  useEffect(() => {
      if (gameState.phase === GamePhase.Evaluation) {
          evaluateGame();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.phase]);

  const evaluateGame = async () => {
      let totalWinnings = 0;
      let dealerScore = gameState.dealerHand.score;
      const dealerBusted = dealerScore > 21;
      const dealerBJ = gameState.dealerHand.isBlackjack && gameState.dealerHand.cards.length === 2;

      if (dealerBJ) {
          juice.loss(true);
          if (gameState.insuranceBet > 0) {
              totalWinnings += gameState.insuranceBet * 3;
              juice.win(false);
          }
      }

      const hands = gameState.playerHands.map(hand => {
          let result = GameResult.Loss;
          let winAmount = 0;

          if (hand.isBusted) {
              const isBustShielded = hand.hasShield;
              if (isBustShielded) {
                  result = GameResult.Push; // Treat as push for visual simplicity
                  winAmount = hand.bet; // Return the bet
              } else {
                  result = GameResult.Bust;
              }
          } else {
              if (hand.isBlackjack && hand.cards.length === 2) {
                  if (dealerBJ) {
                      result = GameResult.Push;
                      winAmount = hand.bet;
                  } else {
                      result = GameResult.Blackjack;
                      winAmount = hand.bet + (hand.bet * BLACKJACK_PAYOUT);
                  }
              } else if (dealerBJ) {
                  result = GameResult.Loss;
              } else if (dealerBusted) {
                  result = GameResult.DealerBust;
                  winAmount = hand.bet * 2;
              } else if (hand.score > dealerScore) {              // Win
                  result = GameResult.Win;
                  const hasGoldenTouch = gameState.artifacts.some(a => a.type === ArtifactType.GoldenTouch);
                  const hasLuckyCoin = gameState.artifacts.some(a => a.type === ArtifactType.LuckyCoin);
                  const bonusMultiplier = (hasGoldenTouch ? 1.1 : 1.0) * (hand.isGilded ? 1.5 : 1.0) * (hasLuckyCoin ? 1.2 : 1.0);
                  winAmount = Math.floor(hand.bet * 2 * bonusMultiplier);
                  if (hasGoldenTouch || hand.isGilded || hasLuckyCoin) {
                      const msg = hand.isGilded ? "GILDED VICTORY!" : (hasLuckyCoin ? "LUCKY COIN: 1.2x WIN!" : "GOLDEN TOUCH: +10% WIN!");
                      setGameState(prev => ({ ...prev, dealerMessage: msg }));
                  }
              } else if (hand.score === dealerScore) {
                  const bossWinsPush = gameState.activeBossTrait === BossTrait.DealerWinsPush;
                  const hasVampiricGamble = gameState.artifacts.some(a => a.type === ArtifactType.VampiricGamble);
                  
                  if (bossWinsPush) {
                      result = GameResult.Loss;
                      winAmount = 0;
                  } else if (hasVampiricGamble) {
                      result = GameResult.Push;
                      winAmount = hand.bet + 200; // Vampiric Gamble bonus
                      setGameState(prev => ({ ...prev, dealerMessage: "VAMPIRIC GAMBLE: BLOOD TAX BONUS (+$200)!" }));
                  } else {
                      result = GameResult.Push;
                      winAmount = hand.bet;
                  }
              } else {
                  result = GameResult.Loss;
                  const hasVampiricGamble = gameState.artifacts.some(a => a.type === ArtifactType.VampiricGamble);
                  if (hasVampiricGamble) {
                      winAmount = -Math.floor(hand.bet * 0.1); // Vampiric penalty on top of losing bet (though technically bankroll is already deducted by bet)
                      // We'll deduct another 10% of the bet from bankroll
                      setGameState(prev => ({ ...prev, bankroll: prev.bankroll - Math.floor(hand.bet * 0.1), dealerMessage: "VAMPIRIC GAMBLE: BLOOD TAX PENALTY (-10% bankroll)!" }));
                  }
              }
          }
          totalWinnings += winAmount;

          // --- Combo Detection ---
          if (result !== GameResult.Loss && result !== GameResult.Bust) {
              const suitCounts: Record<string, number> = {};
              hand.cards.forEach(c => {
                  suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
              });

              const counts: Record<string, number> = {};
              hand.cards.forEach(c => {
                  counts[c.rank] = (counts[c.rank] || 0) + 1;
              });
              const freq = Object.values(counts);

              combo.checkHandCombos({
                  hasPair: freq.includes(2),
                  hasTwoPair: freq.filter(c => c === 2).length >= 2,
                  hasThreeKind: freq.includes(3),
                  hasFourKind: freq.includes(4),
                  hasFullHouse: freq.includes(3) && freq.includes(2),
                  hasBlackjack: hand.isBlackjack,
                  suitCount: suitCounts
              });
          }

          return { result, winAmount };
      });

      // Progression and Economy Tracking
      const netProfit = totalWinnings - (gameState.currentBet + gameState.insuranceBet);
      const isOverallWin = netProfit > 0;

      if (isOverallWin) {
          juice.win(netProfit > 500);
      } else if (netProfit < 0) {
          juice.loss(Math.abs(netProfit) > 500);
      }

      setGameState(prev => ({
          ...prev,
          lifetimeEarnings: prev.lifetimeEarnings + (isOverallWin ? netProfit : 0),
          consecutiveWins: isOverallWin ? prev.consecutiveWins + 1 : 0,
          currentStage: (isOverallWin && (prev.consecutiveWins + 1) % 5 === 0) 
            ? prev.currentStage + 1 
            : prev.currentStage,
          meta: {
              ...prev.meta,
              totalPrestigePoints: Math.floor((prev.lifetimeEarnings + (isOverallWin ? netProfit : 0)) / 1000)
          }
      }));

      // Update Lifetime Stats
      const hasBlackjack = hands.some(h => h.result === GameResult.Blackjack);
      setLifetimeStats(prev => {
          const newStats: LifetimeStats = {
              ...prev,
              totalWins: prev.totalWins + (isOverallWin ? 1 : 0),
              totalLosses: prev.totalLosses + (!isOverallWin ? 1 : 0),
              totalBlackjacks: prev.totalBlackjacks + (hasBlackjack ? 1 : 0),
              totalEarnings: prev.totalEarnings + (isOverallWin ? netProfit : 0),
              highestBankroll: Math.max(prev.highestBankroll, gameState.bankroll + totalWinnings),
              currentStreak: isOverallWin ? prev.currentStreak + 1 : 0,
              highestStreak: Math.max(prev.highestStreak, isOverallWin ? prev.currentStreak + 1 : 0),
              bossesDefeated: prev.bossesDefeated + (gameState.isBossRound && isOverallWin ? 1 : 0),
              highestStage: Math.max(prev.highestStage, gameState.currentStage),
              totalRunsCompleted: prev.totalRunsCompleted,
              achievements: prev.achievements
          };
          newStats.achievements = checkAchievements(newStats, isOverallWin, hasBlackjack, gameState.currentBet, gameState.isBossRound && isOverallWin);
          return newStats;
      });

      // Boss Victory Reward logic
      if (gameState.isBossRound && isOverallWin) {
          setTimeout(() => {
              // Generate 3 random rare artifacts
              const allRare = [
                  { id: 'rare-1', type: ArtifactType.LuckyCoin, name: 'LUCKY COIN', description: 'Wins pay 1.2x instead of 2x', cost: 0 },
                  { id: 'rare-2', type: ArtifactType.AceInTheHole, name: 'ACE IN THE HOLE', description: 'Start hand with an Ace', cost: 0 },
                  { id: 'rare-3', type: ArtifactType.VampiricGamble, name: 'VAMPIRIC GAMBLE', description: '+$200 on Pushes, -10% Bankroll on Losses', cost: 0 }
              ].filter(a => !gameState.artifacts.some(owned => owned.type === a.type));

              if (allRare.length > 0) {
                  setGameState(prev => ({
                      ...prev,
                      rareArtifactChoices: allRare.slice(0, 3)
                  }));
              }
          }, 3000);
      }

      if (isOverallWin && (gameState.consecutiveWins + 1) % 5 === 0) {
          setTimeout(() => {
              setGameState(prev => ({ ...prev, dealerMessage: `PROMOTED! WELCOME TO TABLE LEVEL ${prev.currentStage}.` }));
          }, 1000);
      }

      // Random Discovery Chance (15% if overall win)
      if (isOverallWin && Math.random() < 0.15) {
          setTimeout(() => {
              setGameState(prev => ({ ...prev, dealerMessage: "SURPRISE DISCOVERY! COLLECT YOUR REWARD." }));
              // Logic for random item gift
              const items = [
                  { id: 'gift-1', name: 'Bonus Peek', type: PowerUpType.Peek, cost: 0, description: 'Oracle gift' },
                  { id: 'gift-2', name: 'Bonus Shield', type: PowerUpType.Shield, cost: 0, description: 'Divine protection' },
                  { id: 'gift-3', name: 'Bonus Transmute', type: PowerUpType.Transmute, cost: 0, description: 'Alchemist luck' }
              ];
              const gift = items[Math.floor(Math.random() * items.length)];
              setGameState(prev => ({
                  ...prev,
                  inventory: [...prev.inventory, gift as PowerUp],
                  dealerMessage: `DISCOVERY: YOU FOUND A ${gift.name.toUpperCase()}!`
              }));
              setShowConfetti(true);
              soundEngine.playWin();
          }, 2500);
      }

      const primaryResult = hands[0].result;
      const netWin = totalWinnings - (gameState.currentBet + gameState.insuranceBet);
      
      // Trigger visual effects based on result
      setLastWinAmount(netWin);
      setTotalHandsPlayed(prev => prev + 1);
      
      if (primaryResult === GameResult.Blackjack) {
          setResultBanner('BLACKJACK');
          setGlobalParticles({ trigger: true, type: 'confetti' });
          setTotalWins(prev => prev + 1);
          soundEngine.playBlackjack();
      } else if (primaryResult === GameResult.Win || primaryResult === GameResult.DealerBust) {
          setResultBanner('WIN');
          setTotalWins(prev => prev + 1);
          soundEngine.playWin();
          if (netWin >= 500) {
              setGlobalParticles({ trigger: true, type: 'coins' });
          }
      } else if (primaryResult === GameResult.Bust) {
          setResultBanner('BUST');
          soundEngine.playLose();
      } else if (primaryResult === GameResult.Push) {
          setResultBanner('PUSH');
      } else {
          setResultBanner('LOSE');
          soundEngine.playLose();
      }

      // Clear banner after delay
      setTimeout(() => setResultBanner(null), 2500);

      setGameState(prev => {
          const newState = {
              ...prev,
              bankroll: prev.bankroll + totalWinnings,
              phase: GamePhase.GameOver
          };

          // Damage Boss Logic
          if (prev.isBossRound && prev.currentBossId && netWin > 0) {
              const boss = BOSS_DATA.find(b => b.id === prev.currentBossId);
              if (boss) {
                  // Damage boss based on netWin
                  boss.currentHealth = Math.max(0, boss.currentHealth - netWin);
                  if (boss.currentHealth === 0) {
                      newState.dealerMessage = `DEFEATED: ${boss.name} HAS BEEN VANQUISHED!`;
                      // The BossBattlePhases component will also trigger onBossDefeated
                  }
              }
          }

          return newState;
      });
      
      const comment = await getDealerCommentary(
          gameState.settings.apiKey,
          gameState.playerHands[0], 
          gameState.dealerHand, 
          primaryResult, 
          netWin
      );
      
      setGameState(prev => ({ ...prev, dealerMessage: comment }));
  };

  const applyCardEffect = (card: Card, handIndex: number) => {
    if (!card.wildType || card.wildType === WildCardType.None) return;

    setGameState(prev => {
        const newHands = [...prev.playerHands];
        const activeHand = { ...newHands[handIndex] };
        if (!activeHand.cards) return prev; // Safety check

        let newBankroll = prev.bankroll;
        let message = prev.dealerMessage;

        switch (card.wildType) {
            case WildCardType.BonusCash:
                newBankroll += 50;
                message = "WILD CARD: +$50 BONUS CASH!";
                setShowCoins(true);
                break;
            case WildCardType.Shielded:
                activeHand.hasShield = true;
                message = "WILD CARD: BUST SHIELD ACTIVATED!";
                break;
            case WildCardType.FreeHit:
                newBankroll += 25;
                message = "WILD CARD: FREE HIT REBATE (+$25)!";
                break;
            case WildCardType.Gilded:
                activeHand.isGilded = true;
                message = "WILD CARD: GILDED HAND (1.5x Multiplier)!";
                break;
        }

        // Handle Event Cards
        if (card.eventType && card.eventType !== EventCardType.None) {
            switch (card.eventType) {
                case EventCardType.Jackpot:
                    newBankroll += 500;
                    message = "🎰 EVENT: JACKPOT CARD! +$500 INSTANT CASH!";
                    setShowCoins(true);
                    setShowConfetti(true);
                    break;
                case EventCardType.DoubleDanger:
                    activeHand.isGilded = true; // Reuse gilded for 2x effect
                    message = "⚠️ EVENT: DOUBLE DANGER! 2x WIN OR 2x LOSS!";
                    break;
                case EventCardType.FreePass:
                    activeHand.hasShield = true;
                    message = "🎟️ EVENT: FREE PASS! PUSH BECOMES WIN!";
                    break;
            }
        }

        newHands[handIndex] = activeHand;
        return {
            ...prev,
            bankroll: newBankroll,
            playerHands: newHands,
            dealerMessage: message
        };
    });
  };

  const resetGame = () => {
      setGameState(prev => ({
          ...prev,
          dealerHand: createHand(),
          playerHands: [createHand()],
          activeHandIndex: 0,
          currentBet: 0,
          currentBetChips: [],
          phase: GamePhase.Betting,
          insuranceBet: 0,
          insuranceAvailable: false,
          dealerMessage: "Place your bets."
      }));
  };

  const goToMenu = () => {
      setGameState(prev => ({
          ...prev,
          isGameStarted: false,
          dealerHand: createHand(),
          playerHands: [createHand()],
          activeHandIndex: 0,
          currentBet: 0,
          currentBetChips: [],
          phase: GamePhase.Betting,
          insuranceBet: 0,
          insuranceAvailable: false,
          dealerMessage: "Welcome back. Place your bets."
      }));
      setResultBanner(null);
  };

  // --- UI Renders ---

  const activeHand = gameState.playerHands[gameState.activeHandIndex];

  const canSplit = gameState.phase === GamePhase.PlayerTurn 
    && activeHand.cards.length === 2
    && activeHand.cards[0].rank === activeHand.cards[1].rank
    && gameState.bankroll >= activeHand.bet;

  const canDouble = gameState.phase === GamePhase.PlayerTurn 
    && activeHand.cards.length === 2
    && gameState.bankroll >= activeHand.bet;

  // --- UI Handlers ---

  const handleRemoveCard = (rank: string) => {
    if (gameState.bankroll >= 500 && !gameState.removedRanks.includes(rank)) {
        setGameState(prev => ({
            ...prev,
            bankroll: prev.bankroll - 500,
            removedRanks: [...prev.removedRanks, rank],
            dealerMessage: `PURGED: All ${rank}s have been removed from the deck.`
        }));
        soundEngine.playChipClick();
    }
  };

  const handleStartGame = () => {
    // Apply Ascension modifiers
    const ascMod = gameState.ascensionLevel;
    const startingCash = INITIAL_BANKROLL + gameState.meta.upgrades.extraStartingCash - (ascMod * 100); // Harder ascensions = less starting cash
    
    setGameState(prev => ({ 
        ...prev, 
        isGameStarted: true,
        bankroll: Math.max(startingCash, 500), // Minimum $500
        deck: createDeck(prev.meta.upgrades.increasedWildChance, prev.removedRanks)
    }));
    soundEngine.playChipClick();
  };

  const handleUpdateSettings = (settings: GameSettings) => {
    setGameState(prev => ({ ...prev, settings }));
  };

  const handleUpdateMeta = (meta: MetaProgression) => {
    setGameState(prev => ({ ...prev, meta }));
  };

  const handleSelectRareArtifact = (artifact: Artifact) => {
    setGameState(prev => ({
        ...prev,
        artifacts: [...prev.artifacts, artifact],
        rareArtifactChoices: null,
        dealerMessage: `CHOSEN: ${artifact.name}. YOUR POWER GROWS.`
    }));
    soundEngine.playWin();
  };

  const handleBuyPowerUp = (item: PowerUp) => {
    if (gameState.bankroll >= item.cost) {
      setGameState(prev => ({
        ...prev,
        bankroll: prev.bankroll - item.cost,
        inventory: [...prev.inventory, { ...item, id: Date.now().toString() }]
      }));
      soundEngine.playChipClick();
    }
  };

  const handleBuyArtifact = (item: Artifact) => {
    if (gameState.bankroll >= item.cost && !gameState.artifacts.some(a => a.type === item.type)) {
      setGameState(prev => ({
        ...prev,
        bankroll: prev.bankroll - item.cost,
        artifacts: [...prev.artifacts, item]
      }));
      soundEngine.playWin();
    }
  };

  const handleRefillTokens = () => {
    if (gameState.bankroll >= 1000) {
      setGameState(prev => ({
        ...prev,
        bankroll: prev.bankroll - 1000,
        totalRefills: prev.totalRefills + 1,
        dealerMessage: "ANOTHER SHAKE OF THE DICE. TOKENS REPLENISHED."
      }));
      soundEngine.playChipClick();
    }
  };


  const usePowerUp = (item: PowerUp) => {
    if (item.type === PowerUpType.Peek) {
      setGameState(prev => ({
        ...prev,
        dealerMessage: `THE ORACLE REVEALS: The dealer's hidden card is the ${gameState.dealerHand.cards[0].rank} of ${gameState.dealerHand.cards[0].suit}.`,
        inventory: prev.inventory.filter(i => i.id !== item.id)
      }));
      soundEngine.playWin();
    } else if (item.type === PowerUpType.Shield) {
      setGameState(prev => {
        const newHands = [...prev.playerHands];
        newHands[prev.activeHandIndex] = {
            ...newHands[prev.activeHandIndex],
            hasShield: true
        };
        return {
            ...prev,
            playerHands: newHands,
            dealerMessage: "BUST SHIELD ACTIVATED. YOUR BET IS PROTECTED.",
            inventory: prev.inventory.filter(i => i.id !== item.id)
        };
      });
      soundEngine.playWin();
    } else if (item.type === PowerUpType.Transmute) {
      setGameState(prev => {
        const currentHand = prev.playerHands[prev.activeHandIndex];
        if (currentHand.cards.length === 0) return prev;
        
        const newDeck = [...prev.deck];
        const newCard = newDeck.pop();
        if (!newCard) return prev;

        const newCards = [...currentHand.cards];
        newCards[newCards.length - 1] = newCard;
        
        const newHands = [...prev.playerHands];
        newHands[prev.activeHandIndex] = {
            ...currentHand,
            cards: newCards,
            score: calculateScore(newCards)
        };

        return {
            ...prev,
            deck: newDeck,
            playerHands: newHands,
            dealerMessage: "TRANSMUTATION COMPLETE. THE FATES HAVE CHANGED.",
            inventory: prev.inventory.filter(i => i.id !== item.id)
        };
      });
      soundEngine.playChipClick();
    }
  };

  // Safe check for API key presence to avoid crashes if process is undefined
  const hasApiKey = !!gameState.settings.apiKey;

  const currentTheme = THEME_COLORS[gameState.settings.theme];
  
  const juice = useGameJuiceContext();
  const combo = useComboContext();
  
  // Register container for juice effects
  const containerRef = React.useRef(null);
  useEffect(() => {
    juice.registerContainer(containerRef);
  }, [juice]);

  // --- Enhanced Shop Handlers ---
  const handleBuyShopItem = useCallback((item: ShopItem) => {
    // Determine which handler to use based on original item type
    // This is a bridge between the new generic item and old specific handlers
    const powerUps = ['peek_1', 'transmute_1', 'shield_1'];
    const artifactsIds = ['golden_touch', 'lucky_coin', 'chip_magnet', 'lucky_seven', 'ace_in_hole', 'combo_starter', 'vampiric_gamble', 'ghost_hand', 'high_roller_badge', 'phoenix_feather', 'shadow_cloak', 'blood_pact', 'demon_dice'];

    if (powerUps.includes(item.id)) {
      const pType = item.id === 'peek_1' ? PowerUpType.Peek : (item.id === 'transmute_1' ? PowerUpType.Transmute : PowerUpType.Shield);
      handleBuyPowerUp({ id: item.id, type: pType, name: item.name, description: item.description, cost: item.cost });
    } else if (artifactsIds.includes(item.id)) {
      // Find original artifact for more details if needed
      handleBuyArtifact({ id: item.id, name: item.name, description: item.description, cost: item.cost, type: item.id.toUpperCase() as any, tier: item.rarity.toUpperCase() as any });
    } else if (item.id.startsWith('purge-')) {
        const rank = item.id.replace('purge-', '');
        handleRemoveCard(rank);
    }
  }, [handleBuyPowerUp, handleBuyArtifact, handleRemoveCard]);
  const handleBossHealthChange = useCallback((health: number) => {
    setGameState(prev => {
        if (!prev.currentBossId) return prev;
        const boss = BOSS_DATA.find(b => b.id === prev.currentBossId);
        if (!boss) return prev;
        return {
            ...prev,
            // Logic to update health in our central data if we had a list, 
            // but for now we'll just track it in the active boss instance if needed.
            // Since BOSS_DATA is static, we might need to track current boss health in GameState.
        };
    });
  }, []);

  const handleBossPhaseChange = useCallback((phase: BossPhase) => {
      juice.flash('warning');
      juice.shake(2);
      soundEngine.playWin(); // Or a specific boss phase sound
  }, [juice]);

  const handleBossAbilityTrigger = useCallback((ability: BossAbility) => {
      juice.flash('error');
      juice.shake(3);
      setGameState(prev => ({ ...prev, dealerMessage: `BOSS ABILITY: ${ability.name}! ${ability.description}` }));
  }, [juice]);

  const [globalFlash, setGlobalFlash] = useState<{ active: boolean; type: FlashType; color?: string }>({ active: false, type: 'white' });
  const [globalParticles, setGlobalParticles] = useState<{ trigger: boolean; type: ParticleType; origin?: { x: number; y: number } }>({ trigger: false, type: 'sparkle' });

  useEffect(() => {
    return juice.registerFlashCallback((type, color) => {
      setGlobalFlash({ active: true, type, color });
    });
  }, [juice]);

  const handleBossDefeated = useCallback(() => {
      juice.winCelebration();
      setGameState(prev => ({
          ...prev,
          isBossRound: false,
          currentBossId: null,
          dealerMessage: "THE BOSS HAS FALLEN. YOU ARE VICTORIOUS!"
      }));
      setGlobalParticles({ trigger: true, type: 'fireworks' });
  }, [juice]);

  const handleRerollShop = useCallback(() => {
     setGameState(prev => {
         const newRerollCost = Math.floor(prev.shopState.rerollCost * 1.5);
         // In a real app we would generate new items here
         return {
             ...prev,
             bankroll: prev.bankroll - prev.shopState.rerollCost,
             shopState: {
                 ...prev.shopState,
                 rerollCost: newRerollCost,
                 rerollCount: prev.shopState.rerollCount + 1,
                 // Reset items to a new random set (simulated)
                 items: (prev.shopState.items || []).sort(() => Math.random() - 0.5)
             }
         };
     });
     juice.shake(1.5);
     soundEngine.playChipClick();
  }, [juice]);

  const updateShopState = useCallback((state: Partial<ShopState>) => {
      setGameState(prev => ({
          ...prev,
          shopState: { ...prev.shopState, ...state }
      }));
  }, []);

  const handleOpenShop = useCallback(() => {
    setGameState(prev => {
        // Generate new items if shop is empty or needs restock
        const needsRestock = prev.shopState.items.length === 0;
        if (needsRestock) {
            // Transform original items to new ShopItem format
            const consumables = [
                { id: 'peek_1', name: 'Oracle Eye', description: "Reveal dealer's hidden card.", cost: 150, type: 'consumable' as const, rarity: 'common' as const, icon: '👁️' },
                { id: 'transmute_1', name: 'Transmute', description: "Reroll last card.", cost: 250, type: 'consumable' as const, rarity: 'common' as const, icon: '🔄' },
                { id: 'shield_1', name: 'Bust Shield', description: "Prevents loss on bust.", cost: 400, type: 'consumable' as const, rarity: 'common' as const, icon: '🛡️' }
            ];
            
            const artifacts = [
                { id: 'golden_touch', name: 'Golden Touch', description: '+5% win bonus.', cost: 500, type: 'voucher' as const, rarity: 'common' as const, icon: '💰' },
                { id: 'lucky_coin', name: 'Lucky Coin', description: '+2% wild card chance.', cost: 400, type: 'voucher' as const, rarity: 'common' as const, icon: '🍀' },
                { id: 'chip_magnet', name: 'Chip Magnet', description: '+$10 per win.', cost: 350, type: 'voucher' as const, rarity: 'common' as const, icon: '🧲' }
            ].sort(() => Math.random() - 0.5).slice(0, 2);

            const purges = ['2', '3', '4', '5'].map(rank => ({
                id: `purge-${rank}`,
                name: `Purge ${rank}`,
                description: `Remove all ${rank}s from deck.`,
                cost: 500,
                type: 'service' as const,
                rarity: 'rare' as const,
                icon: '🔥',
                isLocked: prev.removedRanks.includes(rank)
            }));

            return {
                ...prev,
                isShopOpen: true,
                shopState: {
                    ...prev.shopState,
                    items: [...consumables, ...artifacts, ...purges]
                }
            };
        }
        return { ...prev, isShopOpen: true };
    });
  }, []);

  return (
    <GameContainer ref={containerRef} className="h-screen w-full">
      <div 
        className="h-full w-full text-[#e8dcc8] flex flex-col overflow-hidden transition-all duration-700 font-serif relative"
        style={{ background: currentTheme.bg }}
      >
        {/* Global FX Overlays */}
        <FlashOverlay />
        <ParticleSystem type="confetti" trigger={false} /> {/* Placeholder for global trigger control if needed */}
        
        {/* Global Notifications */}
        {combo.recentCombo && <ComboPopup combo={combo.recentCombo} />}
        
        {/* Wood texture overlay */}
      <div className="wood-texture" />
      {/* Candlelight vignette */}
      <div className="candle-vignette" />
      
      {/* Phase 1 Graphics: Global Styles & Ambient Background */}
      <GlobalStyles />
      <GameBackground showParticles={true} showVignette={false} showNoise={true} particleCount={25} />
      
      <AnimatePresence>
        {!gameState.isGameStarted && (
          <LandingScreen 
            onPlay={handleStartGame} 
            onOpenSettings={() => setIsSettingsOpen(true)} 
            meta={gameState.meta}
            onUpdateMeta={handleUpdateMeta}
          />
        )}
      </AnimatePresence>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={gameState.settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <EnhancedShop
        isOpen={gameState.isShopOpen}
        onClose={() => setGameState(prev => ({ ...prev, isShopOpen: false }))}
        bankroll={gameState.bankroll}
        shopState={gameState.shopState}
        onBuyItem={handleBuyShopItem}
        onReroll={handleRerollShop}
        onUpdateShopState={updateShopState}
      />

      <BossRewardOverlay 
        isOpen={!!gameState.rareArtifactChoices}
        choices={gameState.rareArtifactChoices}
        onSelect={handleSelectRareArtifact}
      />

      <RunSummary 
        isOpen={isRunSummaryOpen}
        onClose={() => {
            setIsRunSummaryOpen(false);
            setGameState(prev => ({ ...prev, isGameStarted: false })); // Go back to landing
        }}
        stats={{
            totalHands: totalHandsPlayed,
            totalWins: totalWins,
            peakBankroll: peakBankroll,
            lifetimeEarnings: Math.floor(gameState.lifetimeEarnings),
            refillsUsed: gameState.totalRefills,
            stagesReached: gameState.currentStage
        }}
      />

      <DeckViewer 
        isOpen={isDeckViewerOpen}
        onClose={() => setIsDeckViewerOpen(false)}
        deck={gameState.deck}
        removedRanks={gameState.removedRanks}
      />

      <StatsScreen
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={lifetimeStats}
      />

      <AchievementPopup
        achievement={pendingAchievement}
        onDismiss={() => setPendingAchievement(null)}
      />
      
      {/* Particle Effects */}
      <ParticleSystem 
        type={globalParticles.type} 
        trigger={globalParticles.trigger} 
        origin={globalParticles.origin}
        onComplete={() => setGlobalParticles(prev => ({ ...prev, trigger: false }))} 
      />
      <FlashOverlay 
        isActive={globalFlash.active} 
        type={globalFlash.type} 
        customColor={globalFlash.color}
        onComplete={() => setGlobalFlash(prev => ({ ...prev, active: false }))} 
      />
      
      {/* Notifications and Overlays */}
      <AchievementQueue achievements={[]} />
      <ComboPopup combo={combo.recentCombo} />
      
      {/* Result Banner */}
      <ResultBanner result={resultBanner} amount={lastWinAmount} />
      
      {/* Boss Battle UI */}
      {gameState.isBossRound && gameState.currentBossId && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4">
          <BossBattlePhases
            boss={BOSS_DATA.find(b => b.id === gameState.currentBossId) || BOSS_DATA[0]}
            onHealthChange={handleBossHealthChange}
            onPhaseChange={handleBossPhaseChange}
            onAbilityTrigger={handleBossAbilityTrigger}
            onBossDefeated={handleBossDefeated}
          />
        </div>
      )}
      
      {/* Header / Info Bar - Dark Wood Panel */}
      <div 
        className="w-full p-3 px-6 flex justify-between items-center z-10 relative"
        style={{
          background: 'linear-gradient(180deg, #1a1410 0%, #0f0c08 100%)',
          borderBottom: '3px solid #3d2e24',
          boxShadow: '0 4px 20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,162,76,0.1)'
        }}
      >
        {/* Wood grain texture on header */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
        
        <div className="flex items-center gap-4 relative z-10">
          <h1 
            className="font-['Cinzel'] text-2xl tracking-[0.2em] text-[#d4a24c] font-black uppercase"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(212,162,76,0.3)' }}
          >
            ROYALE ROGUE
          </h1>
          {/* Artifacts Display */}
          <div className="flex gap-1">
            {gameState.artifacts.map(art => (
              <div 
                key={art.id} 
                title={art.description}
                className="w-6 h-6 rounded-md bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-[10px] text-yellow-500 cursor-help"
              >
                {art.type === ArtifactType.GoldenTouch ? '💰' : '🍀'}
              </div>
            ))}
          </div>
          {/* Statistics */}
          {totalHandsPlayed > 0 && (
            <div className="hidden md:flex gap-3 text-xs text-gray-400">
              <span>Hands: {totalHandsPlayed}</span>
              <span>Wins: {totalWins}</span>
              <span>Win Rate: {((totalWins / totalHandsPlayed) * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-8 font-['Special_Elite'] text-[#e2d1b0]">
          <div className="flex flex-col items-end opacity-80">
            <span className="text-[#8b0000]/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">Gold Ledger</span>
            <div className="flex items-center gap-2">
                <NumberCounter value={gameState.bankroll} className="text-xl font-black" />
                {gameState.bankroll < 5 && (
                    <motion.span 
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-[#8b0000] text-[10px] font-bold"
                    >
                      (EMPTY)
                    </motion.span>
                )}
            </div>
          </div>
          
          <div className="flex flex-col items-end opacity-80 border-l border-[#1a1a1a] pl-6">
            <span className="text-[#8b0000]/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">Sins Total</span>
            <NumberCounter value={Math.floor(gameState.lifetimeEarnings)} className="text-xl font-black" />
          </div>

          <div className="flex flex-col items-end opacity-80 border-l border-[#1a1a1a] ml-6 pl-4">
            <span className="text-[#8b0000]/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">Ascension</span>
            <span className="text-xl font-black">Lvl {gameState.currentStage}</span>
          </div>
        </div>  
        
        {/* Header Controls */}
        <div className="flex items-center gap-4">
            {/* Deck Oracle Button (Blue) */}
            <button 
                onClick={() => setIsDeckViewerOpen(true)}
                className="w-10 h-10 rounded-full bg-blue-500/10 border-2 border-blue-500/40 hover:border-blue-400 hover:bg-blue-500/20 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] group"
                title="Deck Oracle"
            >
                <svg className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
            </button>
            
            {/* Black Market Button (Yellow) */}
            <button 
                onClick={handleOpenShop}
                className="w-10 h-10 rounded-full bg-yellow-500/10 border-2 border-yellow-500/40 hover:border-yellow-400 hover:bg-yellow-500/20 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)] group"
                title="Black Market"
            >
                <svg className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
            </button>
            
            {/* Stats Button (Gray) */}
            <button 
                onClick={() => setIsStatsOpen(true)}
                className="w-10 h-10 rounded-full bg-zinc-800/50 border-2 border-zinc-700/50 hover:border-zinc-500 hover:bg-zinc-800 transition-all flex items-center justify-center shadow-lg group"
                title="Lifetime Ledger"
            >
                <svg className="w-5 h-5 text-zinc-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </button>

            {/* Settings Button (Gray) */}
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-10 h-10 rounded-full bg-zinc-800/50 border-2 border-zinc-700/50 hover:border-zinc-500 hover:bg-zinc-800 transition-all flex items-center justify-center shadow-lg group"
                title="Rites & Ceremonies"
            >
                <svg className="w-5 h-5 text-zinc-400 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
          </div>
      </div>

      {/* Main Table Area */}
      <LayoutGroup>
      <div className="flex-grow relative flex flex-col items-center justify-center p-2 gap-4 overflow-visible">
        
        {/* Dealer Area */}
        <div className="flex flex-col items-center space-y-1 z-10">
            <div className="relative">
                <div className="flex gap-[-4rem] items-center justify-center h-32">
                    <AnimatePresence>
                    {gameState.dealerHand.cards.map((card, idx) => (
                        <div key={card.id} className={`${idx > 0 ? '-ml-12' : ''} z-${idx} relative hover:z-50 transition-all duration-200`}>
                            <CardComponent 
                                card={card} 
                                index={idx}
                                isHidden={gameState.phase === GamePhase.PlayerTurn && idx === 0}
                                onCardClick={handleCardClick}
                            />
                        </div>
                    ))}
                    </AnimatePresence>
                     {gameState.dealerHand.cards.length === 0 && (
                        <div className="w-24 h-36 border-4 border-[#1a1a1a] opacity-20"
                             style={{ clipPath: 'polygon(2% 4%, 98% 1%, 100% 10%, 97% 95%, 95% 100%, 5% 97%, 1% 90%, 3% 5%)' }}></div>
                    )}
                </div>
            </div>
            
            <div className="bg-black/50 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest text-gray-300 uppercase">
                Dealer {gameState.phase !== GamePhase.Betting && gameState.phase !== GamePhase.PlayerTurn && 
                    <span className="text-white ml-1">({gameState.dealerHand.score})</span>
                }
            </div>
            
            <div className="max-w-md text-center mt-1 h-8">
                <p className="text-[#8b0000]/80 font-['Special_Elite'] text-base leading-snug drop-shadow-sm line-clamp-1 italic">
                    "{gameState.dealerMessage}"
                </p>
            </div>
        </div>

        {/* Center / Betting Stack Area */}
        <div className="relative h-12 w-full flex items-center justify-center z-20">
            {/* Visual Bet Stack (Only during betting phase usually) */}
            {gameState.phase === GamePhase.Betting && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <AnimatePresence>
                        {gameState.currentBetChips.map((chip, index) => (
                             <motion.div
                                key={chip.id}
                                initial={{ opacity: 0, y: 100, scale: 0.5 }}
                                animate={{ opacity: 1, y: -index * 5, scale: 1 }}
                                exit={{ 
                                    opacity: 0, 
                                    y: -600, 
                                    x: 400, 
                                    scale: 0.5,
                                    transition: { duration: 0.6, ease: "easeIn" } 
                                }}
                                whileHover={{ scale: 1.1, cursor: 'pointer', zIndex: 100 }}
                                style={{ 
                                    zIndex: index, 
                                    position: 'absolute',
                                    pointerEvents: 'auto'
                                }}
                            >
                                <Chip color={chip.color} value={chip.value} onClick={() => returnChip(chip)} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Inventory / Power-ups Bar */}
            {gameState.phase !== GamePhase.Betting && gameState.inventory.length > 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-3 z-30">
                    <AnimatePresence>
                        {gameState.inventory.map((item) => (
                            <motion.button
                                key={item.id}
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                onClick={() => usePowerUp(item)}
                                className="bg-zinc-800 border border-white/10 p-2 rounded-xl shadow-2xl flex flex-col items-center gap-1 min-w-[60px] group"
                            >
                                <span className="text-xl">
                                    {item.type === PowerUpType.Peek && '👁️'}
                                    {item.type === PowerUpType.Transmute && '🎲'}
                                    {item.type === PowerUpType.Shield && '🛡️'}
                                </span>
                                <span className="text-[8px] font-bold text-gray-500 uppercase group-hover:text-yellow-500">{item.name}</span>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {gameState.insuranceAvailable && gameState.phase === GamePhase.PlayerTurn && (
                <div className="animate-bounce bg-yellow-600/90 p-4 rounded-lg shadow-lg flex flex-col items-center gap-2 backdrop-blur-sm z-30">
                    <span className="font-bold text-sm">INSURANCE PAYS 2:1</span>
                    <div className="flex gap-2">
                        <button onClick={buyInsurance} className="bg-green-700 hover:bg-green-600 px-4 py-1 rounded text-xs font-bold transition-colors">YES (${gameState.currentBet/2})</button>
                        <button onClick={skipInsurance} className="bg-red-700 hover:bg-red-600 px-4 py-1 rounded text-xs font-bold transition-colors">NO</button>
                    </div>
                </div>
            )}
            
            {gameState.phase === GamePhase.GameOver && (
                <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] z-30"
                >
                     ROUND OVER
                </motion.div>
            )}
        </div>

        {/* Player Area */}
        <div className="flex justify-center gap-8 w-full max-w-4xl px-4 overflow-visible pb-2 pt-1 min-h-[120px]">
            <AnimatePresence>
            {gameState.playerHands.map((hand, handIndex) => (
                <motion.div 
                    layout
                    key={hand.id} // Use hand.id for key to track splits
                    /* 
                       Logic for Initial: 
                       If it's a split hand (created with 1 card), we want it to be visible immediately 
                       so the card 'flying' into it via layoutId works visible.
                       If it's a new deal (2 cards), standard fade in.
                     */
                    initial={hand.cards.length === 1 ? { opacity: 1, scale: 1 } : { opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                    className={`flex flex-col items-center transition-opacity duration-300 ${
                        gameState.activeHandIndex === handIndex ? 'opacity-100' : 'opacity-60'
                    }`}
                >
                     <div className="flex -space-x-12 mb-0 relative h-28 overflow-visible">
                         {hand.cards.map((card, idx) => (
                            <div key={card.id} className="relative hover:z-50 transition-all duration-200">
                                <CardComponent 
                                    card={card} 
                                    index={idx}
                                    onCardClick={handleCardClick}
                                />
                            </div>
                         ))}
                          {hand.cards.length === 0 && (
                             <div className="w-24 h-36 border-4 border-[#1a1a1a] opacity-20"
                                  style={{ clipPath: 'polygon(2% 4%, 98% 1%, 100% 10%, 97% 95%, 95% 100%, 5% 97%, 1% 90%, 3% 5%)' }}></div>
                          )}
                     </div>
                     
                     <div className={`px-4 py-0.5 rounded-full text-sm font-bold flex items-center gap-2 mt-1 shadow-lg backdrop-blur-sm ${
                         hand.isBusted ? 'bg-red-900/80 text-red-200' : 
                         hand.isBlackjack ? 'bg-yellow-600/80 text-white' : 
                         gameState.activeHandIndex === handIndex ? 'bg-blue-600/80 text-white ring-2 ring-blue-400' : 'bg-gray-800/80 text-gray-400'
                     }`}>
                         {hand.isBusted ? 'BUST' : hand.score}
                         {hand.bet > 0 && <span className="text-xs opacity-75 border-l border-white/20 pl-2 ml-1">${hand.bet}</span>}
                     </div>
                </motion.div>
            ))}
            </AnimatePresence>
        </div>

      </div>
      </LayoutGroup>

      {/* Controls Footer */}
      <div className="w-full bg-gradient-to-t from-black to-transparent p-2 pb-8 z-20">
          <div className="max-w-3xl mx-auto">
              
              {/* Betting Controls */}
              {gameState.phase === GamePhase.Betting && (
                  <div className="flex flex-col items-center gap-8 animate-fade-in-up mt-auto mb-12">
                      <div className="flex gap-4 flex-wrap justify-center scale-110 mb-4">
                          <Chip color="red" value={5} onClick={() => placeBet(5)} disabled={gameState.bankroll < 5} />
                          <Chip color="green" value={25} onClick={() => placeBet(25)} disabled={gameState.bankroll < 25} />
                          <Chip color="black" value={100} onClick={() => placeBet(100)} disabled={gameState.bankroll < 100} />
                          <Chip color="purple" value={500} onClick={() => placeBet(500)} disabled={gameState.bankroll < 500} />
                      </div>

                      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
                          <motion.button 
                            whileHover={gameState.currentBet > 0 ? { scale: 1.05, boxShadow: '0 0 30px rgba(139, 0, 0, 0.4)' } : {}}
                            whileTap={gameState.currentBet > 0 ? { scale: 0.95 } : {}}
                            onClick={dealGame}
                            disabled={gameState.currentBet === 0}
                            className={`w-full py-5 font-['Special_Elite'] font-bold text-3xl border-4 transition-all uppercase tracking-[0.4em] relative overflow-hidden
                              ${gameState.currentBet > 0 
                                ? 'bg-[#3a0a0a] border-[#8b0000] text-[#8b0000] shadow-[0_0_20px_rgba(139,0,0,0.2)]' 
                                : 'bg-black/20 border-white/5 text-white/10 opacity-50'}`}
                            style={{ clipPath: 'polygon(0% 2%, 100% 0%, 99.5% 98%, 0.5% 100%)' }}
                          >
                            <span className="relative z-10">OFFER</span>
                            {gameState.currentBet > 0 && (
                              <motion.div 
                                className="absolute inset-0 bg-[#8b0000]/10"
                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </motion.button>

                          <button 
                            onClick={clearBet}
                            disabled={gameState.currentBet === 0}
                            className="group flex items-center gap-2 px-8 py-3 font-['Special_Elite'] font-bold text-lg bg-[#d1c7a7] text-[#8b0000] border-2 border-[#1a1a1a] hover:bg-[#c4b998] disabled:opacity-0 disabled:pointer-events-none transition-all uppercase tracking-widest shadow-xl"
                            style={{ clipPath: 'polygon(2% 10%, 95% 2%, 98% 90%, 5% 95%)' }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            VOID BET
                          </button>
                      </div>
                  </div>
              )}

              {/* Action Controls - Carved Wood Buttons */}
              {gameState.phase === GamePhase.PlayerTurn && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mx-auto">
                      <button 
                        onClick={hit}
                        className="relative overflow-hidden font-['Cinzel'] font-bold py-4 uppercase text-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{ 
                          background: 'linear-gradient(145deg, #2a3d2a 0%, #1a2a1a 100%)',
                          border: '3px solid #3d5a3d',
                          color: '#8fbc8f',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(143,188,143,0.2)',
                          clipPath: 'polygon(2% 0%, 98% 2%, 100% 8%, 98% 98%, 95% 100%, 5% 97%, 0% 92%, 2% 5%)'
                        }}
                      >
                         BETRAY
                         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                      </button>
                      
                      <button 
                        onClick={stand}
                        className="relative overflow-hidden font-['Cinzel'] font-bold py-4 uppercase text-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{ 
                          background: 'linear-gradient(145deg, #3d2424 0%, #2a1a1a 100%)',
                          border: '3px solid #8b1a1a',
                          color: '#ff6b35',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,107,53,0.2)',
                          clipPath: 'polygon(2% 2%, 98% 0%, 100% 10%, 98% 95%, 95% 100%, 5% 98%, 0% 92%, 2% 8%)'
                        }}
                      >
                         ACCEPT
                         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                      </button>

                      <button 
                        onClick={doubleDown}
                        disabled={!canDouble}
                        className="relative overflow-hidden font-['Cinzel'] font-bold py-4 uppercase text-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
                        style={{ 
                          background: 'linear-gradient(145deg, #2a1f18 0%, #1a1410 100%)',
                          border: '3px solid #d4a24c',
                          color: '#d4a24c',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,162,76,0.2)',
                          clipPath: 'polygon(2% 3%, 98% 0%, 100% 8%, 98% 97%, 95% 100%, 5% 97%, 0% 90%, 2% 6%)'
                        }}
                      >
                         SACRIFICE
                         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                      </button>

                      <button 
                        onClick={split}
                        disabled={!canSplit}
                        className="relative overflow-hidden font-['Cinzel'] font-bold py-4 uppercase text-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
                        style={{ 
                          background: 'linear-gradient(145deg, #1a1410 0%, #0a0806 100%)',
                          border: '3px solid #a89878',
                          color: '#a89878',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(168,152,120,0.1)',
                          clipPath: 'polygon(3% 0%, 97% 2%, 100% 12%, 98% 98%, 95% 100%, 5% 97%, 0% 94%, 2% 5%)'
                        }}
                      >
                         SPLIT
                      </button>
                  </div>
              )}

              {/* Game Over Controls */}
              {gameState.phase === GamePhase.GameOver && (
                  <div className="flex flex-col items-center gap-4">
                      <button 
                        onClick={resetGame}
                        className="bg-transparent border-2 border-[#e2d1b0] text-[#e2d1b0] font-['Special_Elite'] font-black text-2xl px-16 py-5 shadow-2xl hover:bg-white/5 transition-all animate-pulse uppercase tracking-[0.3em]"
                        style={{ clipPath: 'polygon(0% 2%, 100% 0%, 99.5% 98%, 0.5% 100%)' }}
                      >
                         RESURRECT
                      </button>
                      <button 
                        onClick={goToMenu}
                        className="bg-transparent border border-[#e2d1b0]/50 text-[#e2d1b0]/70 font-['Special_Elite'] text-sm px-8 py-2 hover:bg-white/5 hover:text-[#e2d1b0] transition-all uppercase tracking-widest"
                      >
                         ← RETURN TO MENU
                      </button>
                  </div>
              )}
          </div>
      </div>

      {!hasApiKey && (
          <div className="absolute top-2 left-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded z-50">
              API KEY MISSING - AI COMMENTARY DISABLED
          </div>
      )}

      {/* Card Skill Info Popup */}
      <CardSkillPopup
        card={selectedCardForInfo?.card || null}
        isOpen={!!selectedCardForInfo}
        onClose={() => setSelectedCardForInfo(null)}
        position={selectedCardForInfo?.position}
      />
      </div>
    </GameContainer>
  );
};

export default App;