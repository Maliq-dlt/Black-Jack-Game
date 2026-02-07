// ============================================
// Game Juice System - Screen Shake & Flash
// ============================================

// Hooks
export { useGameJuice } from './hooks/useGameJuice';
export type { ShakeIntensity, FlashColor } from './hooks/useGameJuice';

// Components
export { 
  ShakeContainer, 
  ShakeOnEvent, 
  GameContainer,
  type ShakeContainerRef 
} from './components/ShakeContainer';

export { 
  FlashOverlay, 
  MultiFlashOverlay, 
  ShockwaveEffect,
  type FlashType 
} from './components/FlashOverlay';

export { GameJuiceDemo } from './components/GameJuiceDemo';

// Context
export { 
  GameJuiceProvider, 
  useGameJuiceContext 
} from './context/GameJuiceContext';

// ============================================
// Combo Chain Display System
// ============================================

// Hooks
export { useComboSystem } from './hooks/useComboSystem';

// Components
export { 
  ComboChainDisplay,
  ComboPopup,
  MiniComboIndicator,
  type Combo,
  type ComboType,
  type ComboChainDisplayProps
} from './components/ComboChainDisplay';

export { ComboSystemDemo } from './components/ComboSystemDemo';

// Context
export { 
  ComboProvider, 
  useComboContext,
  type HandAnalysis
} from './context/ComboContext';

// ============================================
// Number Counter & Animation
// ============================================

export { 
  NumberCounter,
  RollingNumber,
  ScorePopup,
  AnimatedBankroll,
  type NumberFormat
} from './components/NumberCounter';

// ============================================
// Tooltip System
// ============================================

export { 
  Tooltip,
  CardTooltip,
  JokerTooltip,
  StatTooltip,
  type TooltipPosition,
  type TooltipSize
} from './components/Tooltip';

// ============================================
// Particle System
// ============================================

export { 
  ParticleSystem,
  ParticleBurst,
  ContinuousParticles,
  type ParticleType
} from './components/ParticleSystem';

// ============================================
// Enhanced Shop
// ============================================

export { 
  EnhancedShop,
  ShopItemCard,
  type ShopItem,
  type ShopState
} from './components/EnhancedShop';

// ============================================
// Boss Battle Phases
// ============================================

export { 
  BossBattlePhases,
  type BossPhase,
  type BossAbility,
  type BossData
} from './components/BossBattlePhases';

// ============================================
// Achievement System
// ============================================

export { 
  AchievementNotification,
  AchievementQueue,
  AchievementToast,
  type Achievement
} from './components/AchievementNotification';
