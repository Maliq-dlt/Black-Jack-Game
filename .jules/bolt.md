# Bolt's Journal ⚡

## 2024-05-22 - DOM to Canvas for Particle Systems
**Learning:** Rendering hundreds of individual DOM nodes for particle effects (e.g., using `framer-motion` for each snowflake or coin) causes massive style recalculation and layout thrashing. The browser struggles to composite so many moving layers.
**Action:** For high-quantity, non-interactive visual effects, always prefer a single HTML5 `<canvas>` element. It reduces the DOM footprint to 1 element while handling thousands of particles at 60fps.
