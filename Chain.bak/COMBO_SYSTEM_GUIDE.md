# ⚡ Combo Chain Display System - Integration Guide

Sistem combo chain display yang dinamis dan mirip Balatro untuk game Royale Rogue Anda!

## 📁 Files

```
output/
├── components/
│   ├── ComboChainDisplay.tsx      # Komponen utama combo display
│   ├── ComboSystemDemo.tsx        # Demo lengkap
│   └── GameJuiceDemo.tsx          # (sudah ada)
├── hooks/
│   ├── useComboSystem.ts          # Hook untuk mengelola combo state
│   └── useGameJuice.ts            # (sudah ada)
├── context/
│   ├── ComboContext.tsx           # Global combo provider
│   └── GameJuiceContext.tsx       # (sudah ada)
└── examples/
    ├── BlackjackTable_withCombos.tsx  # Contoh integrasi
    └── CardComponent_withJuice.tsx    # (sudah ada)
```

## 🚀 Quick Start

### 1. Copy files ke project

```bash
cp -r /mnt/okcomputer/output/components/ComboChainDisplay.tsx src/components/
cp -r /mnt/okcomputer/output/hooks/useComboSystem.ts src/hooks/
cp -r /mnt/okcomputer/output/context/ComboContext.tsx src/context/
```

### 2. Basic Usage dengan useComboSystem

```tsx
import { ComboChainDisplay } from './components/ComboChainDisplay';
import { useComboSystem } from './hooks/useComboSystem';

function YourGame() {
  const {
    combos,
    activeCombos,
    totalMultiplier,
    baseScore,
    finalScore,
    activateCombo,
    deactivateCombo
  } = useComboSystem();

  // Activate a combo
  const handleWin = () => {
    activateCombo('blackjack');
  };

  return (
    <>
      {/* Combo display di sisi kanan */}
      <ComboChainDisplay
        combos={combos}
        totalMultiplier={totalMultiplier}
        baseScore={100}
        finalScore={100 * totalMultiplier}
        position="right"
        showDetails={true}
      />
      
      {/* Your game UI */}
    </>
  );
}
```

### 3. Global State dengan ComboProvider

```tsx
// App.tsx
import { ComboProvider } from './context/ComboContext';

function App() {
  return (
    <ComboProvider>
      <YourGame />
    </ComboProvider>
  );
}

// Any component
import { useComboContext } from './context/ComboContext';

function AnyComponent() {
  const { activateCombo, totalMultiplier } = useComboContext();
  
  const handleSomething = () => {
    activateCombo('pair');
  };
  
  return <div>Multiplier: ×{totalMultiplier}</div>;
}
```

## 🎴 Combo Types

| Combo Type | Base Multiplier | Base Value | Description |
|------------|-----------------|------------|-------------|
| `pair` | ×1.5 | $10 | Two cards of same rank |
| `two_pair` | ×2 | $20 | Two different pairs |
| `three_kind` | ×3 | $30 | Three cards of same rank |
| `straight` | ×4 | $40 | Five consecutive ranks |
| `flush` | ×5 | $50 | Five cards of same suit |
| `full_house` | ×7 | $70 | Three of a kind + Pair |
| `four_kind` | ×10 | $100 | Four cards of same rank |
| `straight_flush` | ×15 | $150 | Straight + Flush |
| `royal_flush` | ×25 | $250 | 10-J-Q-K-A of same suit |
| `blackjack` | ×2.5 | $50 | Ace + 10-value card |
| `lucky_seven` | ×1.3 | $7 | Hand contains 7 |
| `ace_high` | ×1.2 | $5 | Ace as 11 |
| `suit_bonus` | ×1.5+ | $15 | Multiple cards same suit |
| `streak` | ×1.5+ | $25 | Consecutive wins |
| `joker_synergy` | ×2+ | $50 | Multiple jokers active |

## ⚡ useComboSystem API

```typescript
const {
  // State (read-only)
  combos,           // All combos (active + inactive)
  activeCombos,     // Only active combos
  totalMultiplier,  // Combined multiplier (product of all)
  baseScore,        // Sum of base values
  finalScore,       // baseScore × totalMultiplier
  comboCount,       // Number of active combos
  
  // Actions
  activateCombo,        // (type, customMultiplier?, customValue?) => id
  deactivateCombo,      // (id) => void
  deactivateAllCombos,  // () => void
  updateComboMultiplier,// (id, multiplier) => void
  
  // Calculations
  calculateFinalScore,  // (baseAmount) => number
  
  // Batch operations
  activateMultipleCombos, // (types[]) => ids[]
  
  // Game helpers
  checkJokerSynergy,    // (jokerCount) => void
  updateStreak,         // (streakCount) => void
} = useComboSystem(options);
```

### Options

```typescript
interface UseComboSystemOptions {
  maxCombos?: number;        // Max combos to track (default: 10)
  comboDecayTime?: number;   // Auto-expire time in ms (default: 0 = never)
  onComboActivate?: (combo) => void;  // Callback when combo activated
  onComboExpire?: (combo) => void;    // Callback when combo expires
}
```

## 🎨 ComboChainDisplay Props

```typescript
interface ComboChainDisplayProps {
  combos: Combo[];              // Combo array from useComboSystem
  totalMultiplier: number;      // From useComboSystem
  baseScore: number;            // Base score amount
  finalScore: number;           // Final calculated score
  position?: 'left' | 'right';  // Position on screen (default: 'right')
  showDetails?: boolean;        // Show total multiplier box (default: true)
  isCalculating?: boolean;      // Show "Calculating..." state
}
```

## 🎯 Integration Examples

### Blackjack Hand Detection

```tsx
const checkHandCombos = (hand: Card[]) => {
  // Clear old hand combos
  deactivateAllCombos();
  
  // Check for blackjack
  if (isBlackjack(hand)) {
    activateCombo('blackjack');
    juice.blackjackCelebration();
  }
  
  // Check for pair
  else if (hasPair(hand)) {
    activateCombo('pair');
  }
  
  // Check for lucky seven
  if (hand.some(c => c.rank === '7')) {
    activateCombo('lucky_seven');
  }
  
  // Check suit bonus
  const suitCounts = getSuitCounts(hand);
  const maxSuit = Math.max(...Object.values(suitCounts));
  if (maxSuit >= 3) {
    activateCombo('suit_bonus', 1 + (maxSuit - 3) * 0.3);
  }
};
```

### Win Streak Integration

```tsx
const [winStreak, setWinStreak] = useState(0);
const { updateStreak } = useComboSystem();

const handleWin = () => {
  const newStreak = winStreak + 1;
  setWinStreak(newStreak);
  updateStreak(newStreak);  // Auto-manages streak combo
};

const handleLoss = () => {
  setWinStreak(0);
  updateStreak(0);  // Removes streak combo
};
```

### Joker Synergy Integration

```tsx
const [activeJokers, setActiveJokers] = useState(0);
const { checkJokerSynergy } = useComboSystem();

const addJoker = () => {
  const newCount = activeJokers + 1;
  setActiveJokers(newCount);
  checkJokerSynergy(newCount);  // Auto-manages joker synergy
};
```

### Payout Calculation

```tsx
const baseBet = 100;
const finalPayout = calculateFinalScore(baseBet);
// atau
const finalPayout = baseBet * totalMultiplier;
```

## 🎮 Combo Popup

Show popup saat combo activated:

```tsx
import { ComboPopup } from './components/ComboChainDisplay';

const [recentCombo, setRecentCombo] = useState(null);

const { activateCombo } = useComboSystem({
  onComboActivate: (combo) => {
    setRecentCombo(combo);
    setTimeout(() => setRecentCombo(null), 2000);
  }
});

// In render
<AnimatePresence>
  {recentCombo && (
    <ComboPopup combo={recentCombo} />
  )}
</AnimatePresence>
```

## 📱 Mini Combo Indicator

Untuk tampilan compact:

```tsx
import { MiniComboIndicator } from './components/ComboChainDisplay';

<MiniComboIndicator
  comboCount={activeCombos.length}
  totalMultiplier={totalMultiplier}
  onClick={() => setShowDisplay(!showDisplay)}
/>
```

## 🎨 Styling

ComboChainDisplay menggunakan:
- Tailwind CSS untuk styling
- Framer Motion untuk animasi
- Warna dinamis berdasarkan combo type

Untuk customize warna, edit `COMBO_CONFIG` di `ComboChainDisplay.tsx`.

## 🔧 Troubleshooting

### Combo tidak muncul
- Pastikan `combos` array ter-update
- Check `isActive` property
- Pastikan ComboChainDisplay ter-render

### Multiplier tidak update
- Gunakan `totalMultiplier` dari hook (computed value)
- Jangan hitung manual

### Animasi tidak smooth
- Pastikan Framer Motion terinstall
- Check tidak ada CSS conflict

## 📊 Performance Tips

1. **Gunakan `useMemo`** untuk hand analysis
2. **Limit max combos** (default: 15)
3. **Deactivate unused combos**
4. **Gunakan `AnimatePresence`** untuk smooth exit

## 🎮 Demo

Jalankan demo untuk melihat semua fitur:

```tsx
import { ComboSystemDemo } from './components/ComboSystemDemo';

function App() {
  return <ComboSystemDemo />;
}
```

---

Selamat mencoba! 🎉
