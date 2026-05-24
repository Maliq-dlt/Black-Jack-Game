// Quick mock without importing
enum ComboType {
  Blackjack = 'blackjack',
  Perfect21 = 'perfect_21',
  Pair = 'pair',
  ThreeOfAKind = 'three_of_a_kind',
  Suited = 'suited',
  Sequential = 'sequential',
  FiveCards = 'five_cards',
  LowBall = 'low_ball',
  HighRoller = 'high_roller',
  DoubleDown = 'double_down'
}

const COMBO_BONUSES = [
  {
    type: ComboType.Blackjack,
    name: 'Blackjack!',
    description: 'Natural 21 with 2 cards',
    multBonus: 100,
    goldBonus: 50,
    icon: '🃏'
  },
  {
    type: ComboType.Perfect21,
    name: 'Perfect 21',
    description: 'Exactly 21 points',
    multBonus: 50,
    goldBonus: 25,
    icon: '🎯'
  },
  {
    type: ComboType.Pair,
    name: 'Pair',
    description: 'Two cards of same rank',
    multBonus: 20,
    goldBonus: 10,
    icon: '👯'
  },
  {
    type: ComboType.ThreeOfAKind,
    name: 'Triple',
    description: 'Three cards of same rank',
    multBonus: 75,
    goldBonus: 40,
    icon: '🔱'
  },
  {
    type: ComboType.Suited,
    name: 'Suited Hand',
    description: 'All cards same suit',
    multBonus: 30,
    goldBonus: 15,
    icon: '♠️'
  },
  {
    type: ComboType.Sequential,
    name: 'Run',
    description: 'Cards in sequence',
    multBonus: 40,
    goldBonus: 20,
    icon: '📈'
  },
  {
    type: ComboType.FiveCards,
    name: 'Five Card Charlie',
    description: '5+ cards without busting',
    multBonus: 150,
    goldBonus: 100,
    icon: '🖐️'
  },
  {
    type: ComboType.LowBall,
    name: 'Low Ball',
    description: 'Win with 17 or less',
    multBonus: 25,
    goldBonus: 15,
    icon: '👇'
  },
  {
    type: ComboType.HighRoller,
    name: 'High Roller',
    description: 'Win with 20 or 21',
    multBonus: 15,
    goldBonus: 10,
    icon: '🎰'
  },
  {
    type: ComboType.DoubleDown,
    name: 'Double Down Win',
    description: 'Won after doubling',
    multBonus: 35,
    goldBonus: 20,
    icon: '⬇️'
  },
];

function calculateComboBonusOriginal(combos: ComboType[]): { mult: number; gold: number } {
  let mult = 0;
  let gold = 0;

  combos.forEach(combo => {
    const bonus = COMBO_BONUSES.find(b => b.type === combo);
    if (bonus) {
      mult += bonus.multBonus;
      gold += bonus.goldBonus;
    }
  });

  return { mult, gold };
}

const COMBO_BONUSES_MAP = new Map(COMBO_BONUSES.map(b => [b.type, b]));

function calculateComboBonusOptimized(combos: ComboType[]): { mult: number; gold: number } {
  let mult = 0;
  let gold = 0;

  for (let i = 0; i < combos.length; i++) {
    const bonus = COMBO_BONUSES_MAP.get(combos[i]);
    if (bonus) {
      mult += bonus.multBonus;
      gold += bonus.goldBonus;
    }
  }

  return { mult, gold };
}


const iterations = 10_000_000;
const combosToTest = [ComboType.Blackjack, ComboType.Pair, ComboType.Suited];

console.time('calculateComboBonusOriginal');
for (let i = 0; i < iterations; i++) {
  calculateComboBonusOriginal(combosToTest);
}
console.timeEnd('calculateComboBonusOriginal');


console.time('calculateComboBonusOptimized');
for (let i = 0; i < iterations; i++) {
  calculateComboBonusOptimized(combosToTest);
}
console.timeEnd('calculateComboBonusOptimized');
