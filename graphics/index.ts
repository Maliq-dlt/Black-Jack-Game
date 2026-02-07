// ============================================
// PHASE 1: High Impact, Low Effort
// ============================================

export { 
  RARITY_COLORS, 
  THEME_COLORS, 
  SUIT_COLORS, 
  SUIT_COLORS_TRADITIONAL,
  GlobalStyles 
} from './EnhancedColorPalette';

export { 
  EnhancedCard3D, 
  HolographicCard, 
  AnimatedBorderCard 
} from './EnhancedCard3D';

export { 
  AmbientParticles, 
  VignetteOverlay, 
  NoiseTexture, 
  Scanlines,
  ParallaxBackground,
  GameBackground 
} from './AmbientBackground';

// ============================================
// PHASE 2: Medium Effort
// ============================================

export { 
  GlitchEffect, 
  ChromaticAberration,
  AnimatedBorder,
  PulseGlow 
} from './HolographicEffects';

export { 
  AnimatedBossSprite, 
  PhaseTransition, 
  WarningIndicator,
  HealthBarSegments,
  DamageNumber 
} from './AnimatedBossBattle';

export { 
  EnhancedShopUI
} from './EnhancedShopUI';

// ============================================
// PHASE 3: High Effort (Optional - Three.js)
// ============================================
// 
// Phase 3 requires Three.js dependencies (not installed by default):
// npm install @react-three/fiber @react-three/drei three
// 
// After installing, import directly from the files:
// import CardScene from './graphics/Card3DSystem';
// import { DynamicLighting } from './graphics/DynamicLighting';

// DynamicLighting (no Three.js required)
export { 
  DynamicLighting,
  FlickeringLight,
  Spotlight,
  GlowEffect,
  BloomOverlay,
  RimLight,
  CandleLight,
  LightningFlash
} from './DynamicLighting';

// Card3DSystem exports commented out (requires Three.js):
// export { default as CardScene } from './Card3DSystem';
