## 2026-04-14 - [App Component Lazy State Initialization]
**Learning:** Moving persistence functions (`loadMeta`, `loadSettings`, `loadStats`) outside of the main `App` component and using lazy initialization (`useState(() => ...)`) prevents synchronous `localStorage.getItem` reads inside React render bodies, eliminating a major bottleneck during frequent `App` re-renders.
**Action:** Always extract configuration and persistence initializers outside of React components when they rely on synchronous blocking APIs like `localStorage`, and use the callback form of `useState`.
