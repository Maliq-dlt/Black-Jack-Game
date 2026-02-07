# 🎮 Gameplay & Animation Upgrade Guide

Upgrade lengkap untuk game Royale Rogue Anda!

## 📁 New Files

```
output/
├── components/
│   ├── NumberCounter.tsx          # Animated number counter
│   ├── Tooltip.tsx                # Rich tooltip system
│   ├── ParticleSystem.tsx         # Advanced particle effects
│   ├── EnhancedShop.tsx           # Shop dengan reroll & interest
│   ├── BossBattlePhases.tsx       # Multi-phase boss battle
│   └── AchievementNotification.tsx # Achievement system
```

---

## 🔢 Number Counter

### Basic Usage

```tsx
import { NumberCounter, RollingNumber, ScorePopup } from './components/NumberCounter';

// Basic counter
<NumberCounter
  value={bankroll}
  format="currency"
  size="xl"
  colorChange={true}
/>

// Rolling number (slot machine effect)
<RollingNumber value={score} digits={5} />

// Score popup
<ScorePopup amount={500} x={100} y={200} />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | - | Number to display |
| `format` | 'currency' \| 'percentage' \| 'compact' \| 'decimal' | 'currency' | Format type |
| `prefix` | string | '$' | Prefix (e.g., '$', '+') |
| `size` | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Text size |
| `colorChange` | boolean | true | Change color on value change |
| `duration` | number | 1 | Animation duration in seconds |

---

## 💬 Tooltip System

### Basic Usage

```tsx
import { Tooltip, CardTooltip, JokerTooltip } from './components/Tooltip';

// Basic tooltip
<Tooltip content="This is a tooltip">
  <button>Hover me</button>
</Tooltip>

// Rich content
<Tooltip
  content={
    <div>
      <h3>Title</h3>
      <p>Description here</p>
    </div>
  }
  position="auto"
  size="lg"
>
  <Card />
</Tooltip>

// Card tooltip (for jokers/items)
<CardTooltip
  card={{
    name: 'Golden Joker',
    description: 'Doubles all gold gains',
    rarity: 'rare',
    icon: '🤡'
  }}
>
  <JokerCard />
</CardTooltip>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | ReactNode | - | Tooltip content |
| `position` | 'top' \| 'bottom' \| 'left' \| 'right' \| 'auto' | 'top' | Position |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Tooltip size |
| `delay` | number | 300 | Show delay in ms |
| `maxWidth` | number | 250 | Max width in px |

---

## ✨ Particle System

### Basic Usage

```tsx
import { ParticleSystem, ParticleBurst, ContinuousParticles } from './components/ParticleSystem';

// One-shot effect
<ParticleSystem
  type="gold_shower"
  trigger={showEffect}
  origin={{ x: 0.5, y: 0.5 }}
  intensity="high"
  duration={3000}
/>

// Click burst
<ParticleBurst
  x={clickX}
  y={clickY}
  type="sparkle"
/>

// Continuous (rain/snow)
<ContinuousParticles type="rain" density="medium" />
```

### Particle Types

| Type | Description |
|------|-------------|
| `confetti` | Colorful confetti burst |
| `coins` | Gold coins falling |
| `sparkle` | Sparkling stars |
| `card_burst` | Cards exploding |
| `gold_shower` | Heavy gold particles |
| `level_up` | Level up celebration |
| `joker_trigger` | Purple joker effect |
| `combo_chain` | Green combo effect |
| `shockwave` | Expanding ring |
| `fireworks` | Fireworks explosion |
| `rain` | Continuous rain |
| `snow` | Continuous snow |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | ParticleType | - | Particle type |
| `trigger` | boolean | - | Trigger animation |
| `origin` | {x, y} | {0.5, 0.5} | Origin position (0-1) |
| `intensity` | 'low' \| 'medium' \| 'high' \| 'extreme' | 'medium' | Particle count |
| `duration` | number | 3000 | Duration in ms |

---

## 🏪 Enhanced Shop

### Basic Usage

```tsx
import { EnhancedShop } from './components/EnhancedShop';

const shopState = {
  items: [
    {
      id: 'joker1',
      name: 'Golden Joker',
      description: 'Doubles gold gains',
      cost: 500,
      type: 'joker',
      rarity: 'rare',
      icon: '🤡'
    }
  ],
  rerollCost: 50,
  rerollCount: 0,
  interestRate: 0.1,
  maxInterest: 50
};

<EnhancedShop
  isOpen={showShop}
  onClose={() => setShowShop(false)}
  bankroll={bankroll}
  shopState={shopState}
  onBuyItem={(item) => buyItem(item)}
  onReroll={() => rerollShop()}
  onUpdateShopState={(state) => updateShop(state)}
/>
```

### Features

- ✅ **Reroll System** - Pay to refresh shop items
- ✅ **Interest System** - Save money for bonus
- ✅ **Flash Sales** - Random discounts
- ✅ **Stock Management** - Limited stock items
- ✅ **Category Tabs** - Filter by item type
- ✅ **Rarity Colors** - Visual rarity indication

---

## 👹 Boss Battle Phases

### Basic Usage

```tsx
import { BossBattlePhases } from './components/BossBattlePhases';

const boss = {
  id: 'dealer_king',
  name: 'The Dealer King',
  title: 'Master of the House',
  icon: '👑',
  maxHealth: 1000,
  currentHealth: 750,
  phase: 'phase1',
  abilities: [
    {
      id: 'shuffle',
      name: 'Shuffle',
      description: 'Shuffles your hand',
      icon: '🔄',
      cooldown: 10000,
      lastUsed: 0,
      effect: () => shuffleHand()
    }
  ],
  traits: ['Dealer Wins Push', 'Hidden Card Buff'],
  dialogue: {
    phase1: ['You dare challenge me?', 'Foolish mortal...'],
    phase2: ['Getting serious now!', 'Feel my wrath!'],
    enraged: ['I WILL DESTROY YOU!', 'RAAAAAHHH!']
  },
  color: '#dc2626'
};

<BossBattlePhases
  boss={boss}
  onHealthChange={(health) => setBossHealth(health)}
  onPhaseChange={(phase) => handlePhaseChange(phase)}
  onAbilityTrigger={(ability) => useAbility(ability)}
  onBossDefeated={() => handleVictory()}
/>
```

### Features

- ✅ **Multi-Phase System** - Boss changes at health thresholds
- ✅ **Phase Transitions** - Dramatic transition effects
- ✅ **Ability Cooldowns** - Track and display cooldowns
- ✅ **Dynamic Dialogue** - Phase-specific dialogue
- ✅ **Health Segments** - Visual health bar segments
- ✅ **Enraged Mode** - Special phase at low health

---

## 🏆 Achievement System

### Basic Usage

```tsx
import { AchievementNotification, AchievementQueue } from './components/AchievementNotification';

const achievement = {
  id: 'first_win',
  name: 'First Victory',
  description: 'Win your first hand',
  icon: '🏆',
  rarity: 'common',
  reward: {
    type: 'gold',
    amount: 100
  }
};

// Single achievement
<AchievementNotification
  achievement={achievement}
  onComplete={() => setAchievement(null)}
/>

// Multiple achievements (queued)
<AchievementQueue
  achievements={[achievement1, achievement2, achievement3]}
  onAllComplete={() => console.log('All shown!')}
/>
```

### Features

- ✅ **Rarity-Based Effects** - Different particles per rarity
- ✅ **Reward Display** - Show achievement rewards
- ✅ **Progress Ring** - Animated completion ring
- ✅ **Auto-Dismiss** - Progress bar for duration
- ✅ **Queue System** - Show multiple achievements

---

## 🎯 Integration Example

```tsx
import { useState } from 'react';
import { 
  NumberCounter, 
  Tooltip, 
  ParticleSystem,
  EnhancedShop,
  BossBattlePhases,
  AchievementNotification
} from './components';
import { useGameJuice } from './hooks/useGameJuice';

function Game() {
  const juice = useGameJuice();
  const [bankroll, setBankroll] = useState(1000);
  const [showWinEffect, setShowWinEffect] = useState(false);

  const handleWin = (amount: number) => {
    // Update bankroll
    setBankroll(prev => prev + amount);
    
    // Trigger juice
    juice.winCelebration(amount > 500);
    
    // Show particles
    setShowWinEffect(true);
    setTimeout(() => setShowWinEffect(false), 3000);
  };

  return (
    <div className="game-container">
      {/* Particles */}
      <ParticleSystem
        type="gold_shower"
        trigger={showWinEffect}
        intensity="high"
      />

      {/* Bankroll with animated counter */}
      <div className="bankroll">
        <NumberCounter
          value={bankroll}
          format="currency"
          size="xl"
          colorChange={true}
        />
      </div>

      {/* Shop button with tooltip */}
      <Tooltip content="Buy jokers and items">
        <button onClick={() => setShowShop(true)}>
          🏪 Shop
        </button>
      </Tooltip>

      {/* Shop modal */}
      <EnhancedShop
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        bankroll={bankroll}
        // ... other props
      />

      {/* Boss battle */}
      <BossBattlePhases
        boss={currentBoss}
        // ... other props
      />
    </div>
  );
}
```

---

## 🚀 Quick Start

1. **Copy files**
```bash
cp -r /mnt/okcomputer/output/* src/
```

2. **Install dependencies** (if not already)
```bash
npm install framer-motion
```

3. **Import and use**
```tsx
import { NumberCounter, Tooltip, ParticleSystem } from './components';
```

---

Selamat mencoba! 🎮✨
