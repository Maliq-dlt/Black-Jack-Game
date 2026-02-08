## 2025-02-18 - [App State Initialization Bottleneck]
**Learning:** `App.tsx` was initializing a massive `gameState` object on every render, including synchronous `localStorage.getItem` and `JSON.parse` calls for meta-progression and settings. This caused significant main-thread blocking during high-frequency re-renders (like particle animations).
**Action:** Always check `useState` initialization for expensive computations or object allocations. Use lazy initialization `useState(() => { ... })` for any state that involves IO or heavy calculation, or large object literals.
