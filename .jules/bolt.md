## 2024-05-22 - React Memoization in Complex Apps
**Learning:** In a large React app where the root component (`App.tsx`) holds all state, every small state update triggers a full tree re-render. Memoizing leaf components (`CardComponent`, `Chip`) is effective, BUT only if their props are stable. Inline functions (like `onClick={() => {}}`) break memoization, requiring extraction to constants or `useCallback`.
**Action:** Always check for inline function props when applying `React.memo`. Use `NO_OP` constants for empty handlers.
