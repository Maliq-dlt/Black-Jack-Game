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
