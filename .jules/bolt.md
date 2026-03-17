## 2024-03-01 - [Frontend Optimization: List Rendering]
**Learning:** Frequent parent state updates (like bankroll/betting state in `App.tsx`) cause all child components inside lists (like the stack of `Chip` components) to re-render, even if their props are unchanged. This is especially taxing during animations.
**Action:** Always wrap visual sub-components that are rendered in arrays (like `Chip` or `CardComponent`) with `React.memo` and ensure the parent passes stable primitives or memoized callback props to minimize unnecessary render cycles.
