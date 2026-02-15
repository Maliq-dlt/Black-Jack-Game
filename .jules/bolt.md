## 2026-02-15 - DOM vs Canvas for Particles
**Learning:** The `ParticleSystem` component was rendering hundreds of individual `motion.div` elements for particle effects (confetti, coins). This caused significant DOM overhead and main-thread work, likely impacting frame rates during "juice" moments.
**Action:** Replaced `ParticleSystem` implementation with a single HTML5 `<canvas>` element. Used `useRef` for state management to avoid React render cycles during the animation loop. This reduced hundreds of DOM nodes to one, and decoupled animation from React reconciliation.
