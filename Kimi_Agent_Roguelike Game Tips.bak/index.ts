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
