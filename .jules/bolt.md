# Bolt's Journal

## 2024-05-23 - React.memo and Stable Callbacks
**Learning:** `React.memo` is only effective if the props passed to the component are stable. Inline arrow functions (e.g., `onClick={() => ...}`) create new references on every render, breaking memoization.
**Action:** Always use `useCallback` for event handlers passed to memoized child components, especially in high-frequency render loops like game loops or list rendering.
