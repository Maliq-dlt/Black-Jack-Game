# 🎮 Game Juice System - Integration Guide

Sistem Screen Shake + Flash Effects yang siap pakai untuk game Royale Rogue Anda!

## 📁 Files

```
output/
├── hooks/
│   └── useGameJuice.ts          # Hook utama untuk efek
├── components/
│   ├── ShakeContainer.tsx       # Container dengan shake support
│   ├── FlashOverlay.tsx         # Komponen flash effect
│   └── GameJuiceDemo.tsx        # Demo & contoh penggunaan
└── context/
    └── GameJuiceContext.tsx     # Global state provider
```

## 🚀 Quick Start

### 1. Copy files ke project Anda

```bash
# Copy ke folder src/ project Anda
cp -r output/hooks src/
cp -r output/components src/
cp -r output/context src/
```

### 2. Wrap game dengan ShakeContainer

```tsx
// App.tsx atau Game.tsx
import { ShakeContainer, ShakeContainerRef } from './components/ShakeContainer';
import { useRef } from 'react';

function App() {
  const gameRef = useRef<ShakeContainerRef>(null);

  return (
    <ShakeContainer ref={gameRef} id="game-container" className="min-h-screen">
      {/* Semua konten game Anda di sini */}
      <YourGame />
    </ShakeContainer>
  );
}
```

### 3. Gunakan hook di komponen game

```tsx
// Di komponen game Anda (misal: BlackjackTable.tsx)
import { useGameJuice } from './hooks/useGameJuice';

function BlackjackTable() {
  const juice = useGameJuice();

  const handleWin = (amount: number) => {
    const isBigWin = amount > 500;
    juice.winCelebration(isBigWin);
  };

  const handleBust = () => {
    juice.bustEffect();
  };

  const handleJokerTrigger = (jokerName: string) => {
    juice.jokerTrigger();
    // Show joker popup...
  };

  return (
    // ... your game UI
  );
}
```

## 🎨 Efek yang Tersedia

### Screen Shake

```tsx
const { screenShake } = useGameJuice();

// Intensity levels: 'light' | 'medium' | 'heavy' | 'extreme'
screenShake('light');    // +4px shake, 200ms
screenShake('medium');   // +10px shake, 350ms
screenShake('heavy');    // +20px shake, 500ms
screenShake('extreme');  // +35px shake, 800ms

// Custom config
screenShake('medium', { x: 15, y: 15, duration: 400 });
```

### Flash Effects

```tsx
const { flash } = useGameJuice();

// Preset colors
flash('white');   // White flash, 50% opacity
flash('gold');    // Gold flash, 50% opacity
flash('red');     // Red flash, 50% opacity
flash('green');   // Green flash, 40% opacity
flash('purple');  // Purple flash, 50% opacity
flash('blue');    // Blue flash, 40% opacity

// Custom
flash('custom', { color: '#ff00ff', opacity: 0.7 });
```

### Preset Combo Effects

```tsx
const juice = useGameJuice();

// Win effects
juice.winCelebration(false);  // Normal win - medium shake + green flash
juice.winCelebration(true);   // Big win - triple shake + multi flash

// Loss effects
juice.lossImpact(false);      // Normal loss
juice.lossImpact(true);       // Critical loss - extreme shake

// Game events
juice.jokerTrigger();         // Light shake + purple flash
juice.bossAppear();           // Heavy shake + red flash
juice.levelUp();              // Medium shake + gold multi-flash
juice.blackjackCelebration(); // Heavy shake + triple gold flash
juice.bustEffect();           // Heavy shake + red flash
```

## 🎯 Integrasi dengan Komponen yang Sudah Ada

### BossBattleUI.tsx

```tsx
import { useGameJuice } from '../hooks/useGameJuice';

export const BossBattleUI: React.FC<BossBattleUIProps> = ({ boss, isActive }) => {
  const juice = useGameJuice();

  useEffect(() => {
    if (isActive && boss) {
      juice.bossAppear();
    }
  }, [isActive, boss]);

  // ... rest of component
};
```

### JokerSlots.tsx

```tsx
import { useGameJuice } from '../hooks/useGameJuice';

export const JokerCard: React.FC<JokerCardProps> = ({ joker, onClick }) => {
  const juice = useGameJuice();

  const handleClick = () => {
    juice.jokerTrigger();
    onClick?.();
  };

  return (
    <motion.button onClick={handleClick}>
      {/* ... */}
    </motion.button>
  );
};
```

### CardComponent.tsx

```tsx
import { useGameJuice } from '../hooks/useGameJuice';

const CardComponent: React.FC<CardComponentProps> = ({ card, isWinning, isLosing }) => {
  const juice = useGameJuice();
  const prevWinningRef = useRef(isWinning);

  useEffect(() => {
    if (isWinning && !prevWinningRef.current) {
      juice.winCelebration(false);
    }
    if (isLosing && !prevWinningRef.current) {
      juice.lossImpact(false);
    }
    prevWinningRef.current = isWinning;
  }, [isWinning, isLosing]);

  // ... rest of component
};
```

## 🔄 Menggunakan dengan Context (Global)

Jika Anda ingin trigger efek dari mana saja tanpa prop drilling:

```tsx
// App.tsx
import { GameJuiceProvider } from './context/GameJuiceContext';

function App() {
  return (
    <GameJuiceProvider>
      <ShakeContainer id="game-container">
        <YourGame />
      </ShakeContainer>
    </GameJuiceProvider>
  );
}

// Any component deep in tree
import { useGameJuiceContext } from './context/GameJuiceContext';

function DeepComponent() {
  const { win, flash, shake } = useGameJuiceContext();

  const handleSomething = () => {
    win(true);  // Trigger big win effect
  };

  return <button onClick={handleSomething}>Click</button>;
}
```

## 🎨 Flash Overlay Komponen

Untuk kontrol lebih granular, gunakan FlashOverlay langsung:

```tsx
import { FlashOverlay, MultiFlashOverlay } from './components/FlashOverlay';

function MyComponent() {
  const [flash, setFlash] = useState<{ type: string; active: boolean } | null>(null);

  const triggerFlash = () => {
    setFlash({ type: 'gold', active: true });
    setTimeout(() => setFlash(null), 500);
  };

  return (
    <>
      {flash && (
        <FlashOverlay
          isActive={flash.active}
          type={flash.type}
          opacity={0.6}
          duration={200}
        />
      )}
      {/* ... */}
    </>
  );
}
```

## 📊 Performance Tips

1. **Gunakan `will-change: transform`** - Sudah di-set di ShakeContainer
2. **Batasi simultaneous effects** - Max 2-3 efek bersamaan
3. **Gunakan `requestAnimationFrame`** - Sudah diimplementasikan
4. **Clean up on unmount** - Hook sudah handle ini otomatis

## 🐛 Troubleshooting

### Shake tidak bekerja
- Pastikan container memiliki `position: relative` atau `position: absolute`
- Pastikan tidak ada CSS `transform` yang conflict

### Flash tidak muncul
- Pastikan z-index cukup tinggi (sudah di-set ke 9999)
- Pastikan tidak ada element lain yang menutupi

### Performance lag
- Kurangi intensity atau duration
- Gunakan `light` intensity untuk efek yang sering

## 🎮 Demo

Jalankan demo untuk melihat semua efek:

```tsx
import { GameJuiceDemo } from './components/GameJuiceDemo';

function App() {
  return <GameJuiceDemo />;
}
```

---

Selamat mencoba! 🎉
