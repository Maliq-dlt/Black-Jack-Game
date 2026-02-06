import { BossData, BossDialogue, BossPersonality, BossTrait } from './types';

/**
 * 10 Unique Boss Configurations for Royale Rogue
 * Each boss has distinct personality, traits, and dialogue
 */

export const BOSS_DATA: BossData[] = [
  // ====================
  // STAGE 5 - THE PERFECTIONIST
  // ====================
  {
    id: 'boss_perfectionist',
    name: 'Viktor',
    title: 'The Perfectionist',
    traits: [BossTrait.Perfectionist, BossTrait.GreedyDealer],
    personality: BossPersonality.Calculating,
    stageAppears: 5,
    rewardMultiplier: 1.5,
    specialAbility: {
      name: 'Calculated Risk',
      description: 'Always hits until reaching 19 or higher',
      triggerCondition: 'Every dealer turn',
    },
    visualTheme: {
      primaryColor: '#1a1a2e',
      secondaryColor: '#e94560',
      icon: '🎯',
    },
    dialogue: {
      intro: [
        "Perfection is not optional. It is the only acceptable outcome.",
        "I've calculated every possibility. You have none.",
        "Let us see if you can match my precision.",
      ],
      playerWin: [
        "A statistical anomaly. Nothing more.",
        "Luck is a temporary companion. Skill is eternal.",
        "I... miscalculated. It won't happen again.",
      ],
      playerLose: [
        "Predictable. Like clockwork.",
        "Mathematics never lies.",
        "Another soul falls to precision.",
      ],
      playerBust: [
        "Greed is the enemy of perfection.",
        "You reached too far. I simply calculated.",
        "The numbers were never in your favor.",
      ],
      dealerBust: [
        "Impossible... my calculations...",
        "There must be an error in the deck.",
        "This... this was not in my equations.",
      ],
      taunt: [
        "Your hesitation reveals your weakness.",
        "I already know what you'll choose.",
        "Every card is simply a number to me.",
      ],
      special: ["Calculating optimal play...", "Precision mode engaged."],
    },
  },

  // ====================
  // STAGE 10 - THE GAMBLER
  // ====================
  {
    id: 'boss_gambler',
    name: 'Maverick',
    title: 'The Gambler',
    traits: [BossTrait.WildSwings],
    personality: BossPersonality.Unpredictable,
    stageAppears: 10,
    rewardMultiplier: 2.0,
    specialAbility: {
      name: 'Wild Multiplier',
      description: 'Random payout multiplier between 0.5x and 3x',
      triggerCondition: 'On every round result',
    },
    visualTheme: {
      primaryColor: '#ff6b6b',
      secondaryColor: '#feca57',
      icon: '🎲',
    },
    dialogue: {
      intro: [
        "Life's a gamble, kid. Let's roll the dice!",
        "Fortune favors the bold! Are you bold enough?",
        "Rules? Where we're going, we don't need rules!",
      ],
      playerWin: [
        "HAHA! That's the spirit! Take it all!",
        "A winner! I love winners!",
        "You've got the fire in your eyes!",
      ],
      playerLose: [
        "Sometimes you eat the bear, sometimes the bear eats you!",
        "That's the game, baby! Double or nothing next time?",
        "The wheel turns for everyone!",
      ],
      playerBust: [
        "Ooooh! So close! Or was it? Who knows!",
        "Busted! But what a ride, right?",
        "The house always... well, sometimes wins!",
      ],
      dealerBust: [
        "I busted! But who cares? I'M HAVING FUN!",
        "WOOOOO! Even I don't see that coming!",
        "What a twist! This is why I love this game!",
      ],
      taunt: [
        "Come on, live a little!",
        "What's the worst that could happen?",
        "Feeling lucky? I sure am!",
      ],
      special: ["Let's see what fate has in store!", "SPIN THE WHEEL OF FORTUNE!"],
    },
  },

  // ====================
  // STAGE 15 - THE COUNTER
  // ====================
  {
    id: 'boss_counter',
    name: 'Shade',
    title: 'The Counter',
    traits: [BossTrait.CardCounter],
    personality: BossPersonality.Calculating,
    stageAppears: 15,
    rewardMultiplier: 2.0,
    specialAbility: {
      name: 'Peek',
      description: 'Can see one of your face-down cards',
      triggerCondition: 'Start of each hand',
    },
    visualTheme: {
      primaryColor: '#2c3e50',
      secondaryColor: '#9b59b6',
      icon: '👁️',
    },
    dialogue: {
      intro: [
        "I see everything. Even what you try to hide.",
        "Your cards whisper secrets to me.",
        "Shall we play? I already know the outcome.",
      ],
      playerWin: [
        "Impressive. You found my blind spot.",
        "Perhaps I underestimated your... creativity.",
        "Knowledge isn't everything, it seems.",
      ],
      playerLose: [
        "I knew this would happen before you sat down.",
        "Your defeat was written in the cards.",
        "As I predicted. Always as I predicted.",
      ],
      playerBust: [
        "I watched you fall before you even stood.",
        "Your desperation was... transparent.",
        "Each card you drew, I counted.",
      ],
      dealerBust: [
        "The cards betrayed me...",
        "Even I cannot see everything.",
        "An oversight I won't repeat.",
      ],
      taunt: [
        "I know what you're holding.",
        "Your face tells me everything.",
        "The deck remembers every card.",
      ],
      special: ["Observing your hand...", "Your secrets are mine."],
    },
  },

  // ====================
  // STAGE 20 - THE CURSED ONE
  // ====================
  {
    id: 'boss_cursed',
    name: 'Mortis',
    title: 'The Cursed One',
    traits: [BossTrait.CursedTouch, BossTrait.DealerWinsPush],
    personality: BossPersonality.Intimidating,
    stageAppears: 20,
    rewardMultiplier: 2.5,
    specialAbility: {
      name: 'Soul Drain',
      description: 'Push = You lose a card from your deck permanently',
      triggerCondition: 'On push result',
    },
    visualTheme: {
      primaryColor: '#1a0a2e',
      secondaryColor: '#8b0000',
      icon: '💀',
    },
    dialogue: {
      intro: [
        "Welcome to the table of the damned.",
        "Your soul will join my collection.",
        "Even a draw means you lose something precious.",
      ],
      playerWin: [
        "You delay the inevitable.",
        "A temporary reprieve from eternal torment.",
        "The curse finds everyone eventually.",
      ],
      playerLose: [
        "Your essence is mine.",
        "Another soul for the void.",
        "The curse grows stronger.",
      ],
      playerBust: [
        "Greed is a beautiful sin.",
        "Your ambition sealed your fate.",
        "The curse feeds on your despair.",
      ],
      dealerBust: [
        "Even death can be cheated...",
        "But not for long.",
        "The curse... spares you this time.",
      ],
      taunt: [
        "Do you feel the cold?",
        "Your deck grows thinner.",
        "Soon there will be nothing left.",
      ],
      special: ["The curse activates...", "I claim what is owed."],
    },
  },

  // ====================
  // STAGE 25 - THE BANKER
  // ====================
  {
    id: 'boss_banker',
    name: 'Rothschild',
    title: 'The Banker',
    traits: [BossTrait.DoubleStakes, BossTrait.TaxCollector],
    personality: BossPersonality.Calculating,
    stageAppears: 25,
    rewardMultiplier: 3.0,
    specialAbility: {
      name: 'Compound Interest',
      description: 'Stakes double every round. Hits cost $10 extra.',
      triggerCondition: 'Every round',
    },
    visualTheme: {
      primaryColor: '#1a1a1a',
      secondaryColor: '#d4af37',
      icon: '💰',
    },
    dialogue: {
      intro: [
        "Money talks. And right now, it's laughing at you.",
        "Every gamble has interest. Mine is quite... aggressive.",
        "Let's see how deep your pockets go.",
      ],
      playerWin: [
        "A small withdrawal. The bank remains solvent.",
        "Enjoy your winnings. The interest accrues.",
        "Hmph. Consider it a loan.",
      ],
      playerLose: [
        "Another deposit for the vault.",
        "Your assets have been liquidated.",
        "The bank always collects.",
      ],
      playerBust: [
        "Bankruptcy is such an ugly word.",
        "Your credit rating just tanked.",
        "Consider this a hostile takeover.",
      ],
      dealerBust: [
        "A minor loss. The reserves are deep.",
        "Even banks have bad days.",
        "I'll recover this with interest.",
      ],
      taunt: [
        "Can you afford another round?",
        "The debt grows with every breath.",
        "Time is money. And you're running out of both.",
      ],
      special: ["Adjusting the interest rate...", "Your debt has been doubled."],
    },
  },

  // ====================
  // STAGE 30 - THE HUSTLER
  // ====================
  {
    id: 'boss_hustler',
    name: 'Slick',
    title: 'The Hustler',
    traits: [BossTrait.ChipThief],
    personality: BossPersonality.Aggressive,
    stageAppears: 30,
    rewardMultiplier: 2.5,
    specialAbility: {
      name: 'Sticky Fingers',
      description: 'Steals 10% of your chips when you bust',
      triggerCondition: 'Player bust',
    },
    visualTheme: {
      primaryColor: '#2d3436',
      secondaryColor: '#00b894',
      icon: '🃏',
    },
    dialogue: {
      intro: [
        "Nice chips you got there. Be a shame if they... disappeared.",
        "I don't just beat you. I take what's yours.",
        "Ready to play? More importantly, ready to pay?",
      ],
      playerWin: [
        "Alright, alright, you got me this time.",
        "Fair enough. But I'll be back for those.",
        "Today's your lucky day. Tomorrow? Not so much.",
      ],
      playerLose: [
        "Thanks for the donation!",
        "Easy money. Just like always.",
        "Don't worry, I'll put your chips to good use.",
      ],
      playerBust: [
        "Bust means I help myself to a little... extra.",
        "Oops! There go some of your chips!",
        "The bust tax. Gotta love it.",
      ],
      dealerBust: [
        "Okay, you got lucky. But check your pockets.",
        "A loss? Or is it?",
        "Fine, you win. This time.",
      ],
      taunt: [
        "Getting low on chips there, friend?",
        "Every bust feeds my wallet.",
        "Want to bust? Please, bust!",
      ],
      special: ["Helping myself to a 'service fee'...", "*pockets clinking*"],
    },
  },

  // ====================
  // STAGE 35 - THE PHANTOM
  // ====================
  {
    id: 'boss_phantom',
    name: 'Wraith',
    title: 'The Phantom',
    traits: [BossTrait.PhantomCards],
    personality: BossPersonality.Intimidating,
    stageAppears: 35,
    rewardMultiplier: 2.5,
    specialAbility: {
      name: 'Fade to Black',
      description: 'One of your cards becomes invisible until reveal',
      triggerCondition: 'After deal',
    },
    visualTheme: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#6c5ce7',
      icon: '👻',
    },
    dialogue: {
      intro: [
        "What you see... is not always what is.",
        "Reality is but a veil. I walk between its folds.",
        "Some cards are better left unseen.",
      ],
      playerWin: [
        "You pierce the veil. Impressive.",
        "Perhaps you see more than I thought.",
        "The shadows release you... for now.",
      ],
      playerLose: [
        "Lost in the darkness once more.",
        "You never saw it coming. Literally.",
        "The void claims another.",
      ],
      playerBust: [
        "Hard to count what you cannot see.",
        "The invisible hand guided you to ruin.",
        "Blinded by ambition.",
      ],
      dealerBust: [
        "Even shadows can miscalculate...",
        "The light finds me...",
        "A rare misstep in the darkness.",
      ],
      taunt: [
        "What are you really holding?",
        "Can you trust your own eyes?",
        "The shadows lie. Or do they?",
      ],
      special: ["A card fades from sight...", "Now you see it... now you don't."],
    },
  },

  // ====================
  // STAGE 40 - THE MIRROR
  // ====================
  {
    id: 'boss_mirror',
    name: 'Echo',
    title: 'The Mirror',
    traits: [BossTrait.MirrorPlay],
    personality: BossPersonality.Defensive,
    stageAppears: 40,
    rewardMultiplier: 3.0,
    specialAbility: {
      name: 'Reflection',
      description: 'Copies your last action',
      triggerCondition: 'After player action',
    },
    visualTheme: {
      primaryColor: '#b8b8b8',
      secondaryColor: '#e0e0e0',
      icon: '🪞',
    },
    dialogue: {
      intro: [
        "I am you. You are me. We are one.",
        "Every move you make, I make better.",
        "Face yourself. Face your defeat.",
      ],
      playerWin: [
        "You... you defeated yourself?",
        "The reflection cracks...",
        "How can you beat your own image?",
      ],
      playerLose: [
        "You were always your own worst enemy.",
        "The mirror shows the truth.",
        "Self-destruction is inevitable.",
      ],
      playerBust: [
        "You did this to yourself.",
        "I merely reflected your greed.",
        "The mirror judges harshly.",
      ],
      dealerBust: [
        "Your chaos... infected me...",
        "The reflection shatters!",
        "We fall together...",
      ],
      taunt: [
        "I know what you'll do before you do.",
        "Hit? I'll hit too.",
        "Stand? So will I.",
      ],
      special: ["Reflecting your action...", "Mirror, mirror..."],
    },
  },

  // ====================
  // STAGE 45 - THE TRICKSTER
  // ====================
  {
    id: 'boss_trickster',
    name: 'Loki',
    title: 'The Trickster',
    traits: [BossTrait.CardSwapper],
    personality: BossPersonality.Unpredictable,
    stageAppears: 45,
    rewardMultiplier: 3.0,
    specialAbility: {
      name: 'Sleight of Hand',
      description: 'Randomly swaps cards between hands',
      triggerCondition: 'Random - 30% chance per round',
    },
    visualTheme: {
      primaryColor: '#6c3483',
      secondaryColor: '#f39c12',
      icon: '🎭',
    },
    dialogue: {
      intro: [
        "Nothing is as it seems in my domain!",
        "Let's shuffle things up, shall we?",
        "Chaos is the only true order!",
      ],
      playerWin: [
        "Ha! You've out-tricked the Trickster!",
        "Well played! I'll remember that move!",
        "Chaos favors you today!",
      ],
      playerLose: [
        "Surprise! Your cards weren't your cards!",
        "The old switcheroo!",
        "Didn't see that coming, did you?",
      ],
      playerBust: [
        "Oops! Wrong card! My bad!",
        "Was that yours? I forget!",
        "Tricks within tricks!",
      ],
      dealerBust: [
        "Wait, those were MY cards?!",
        "I've confused even myself!",
        "The chaos is... chaotic!",
      ],
      taunt: [
        "Whatcha got there? Let me see!",
        "Mind if I... rearrange things?",
        "Is this your card? No? How about now?",
      ],
      special: ["Abracadabra!", "Watch closely... *swap!*"],
    },
  },

  // ====================
  // STAGE 50 - THE HOUSE (FINAL BOSS)
  // ====================
  {
    id: 'boss_house',
    name: 'The House',
    title: 'Always Wins',
    traits: [
      BossTrait.TheHouse,
      BossTrait.DealerWinsPush,
      BossTrait.GreedyDealer,
      BossTrait.TaxCollector,
    ],
    personality: BossPersonality.Intimidating,
    stageAppears: 50,
    rewardMultiplier: 5.0,
    specialAbility: {
      name: 'House Rules',
      description: 'All boss traits are active. Push = Loss. No mercy.',
      triggerCondition: 'Always active',
    },
    visualTheme: {
      primaryColor: '#000000',
      secondaryColor: '#8b0000',
      icon: '🏛️',
    },
    dialogue: {
      intro: [
        "I AM THE HOUSE. AND THE HOUSE ALWAYS WINS.",
        "You've come far. But this is where legends die.",
        "Every rule. Every advantage. All mine.",
      ],
      playerWin: [
        "IMPOSSIBLE... I AM THE HOUSE!",
        "You... you broke the rules?!",
        "This cannot be... THE HOUSE NEVER LOSES!",
      ],
      playerLose: [
        "AS IT WAS WRITTEN. AS IT SHALL ALWAYS BE.",
        "The House collects what is owed.",
        "Your journey ends here. Forever.",
      ],
      playerBust: [
        "GREED IS THE FOUNDATION OF MY POWER.",
        "You built this house. Now it buries you.",
        "Another soul for the foundation.",
      ],
      dealerBust: [
        "THE HOUSE... CRUMBLES?!",
        "No... this is not possible!",
        "The foundations... shake...",
      ],
      taunt: [
        "THE ODDS WERE NEVER IN YOUR FAVOR.",
        "Every card. Every chip. MINE.",
        "There is no escaping the House.",
      ],
      special: ["ALL RULES ARE HOUSE RULES.", "THE HOUSE TAKES EVERYTHING."],
    },
  },
];

/**
 * Get boss for a specific stage
 */
export function getBossForStage(stage: number): BossData | null {
  return BOSS_DATA.find(boss => boss.stageAppears === stage) || null;
}

/**
 * Check if current stage is a boss stage
 */
export function isBossStage(stage: number): boolean {
  return stage % 5 === 0 && stage > 0;
}

/**
 * Get random dialogue from boss
 */
export function getBossDialogue(boss: BossData, type: keyof BossDialogue): string {
  const dialogues = boss.dialogue[type];
  return dialogues[Math.floor(Math.random() * dialogues.length)];
}
