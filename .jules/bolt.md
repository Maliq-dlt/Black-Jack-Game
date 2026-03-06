
## 2024-05-19 - [Memoization Anti-pattern in Central State Hubs]
**Learning:** Passing inline arrow functions (e.g., `onClick={(c, e) => ...}`) to child components wrapped in `React.memo` entirely defeats the purpose of the memoization. The function is recreated on every render of the parent, causing the prop reference to change and forcing the child to re-render. This is especially detrimental in central state hubs like `App.tsx` that re-render frequently (e.g., due to timers, betting state changes, or frequent UI updates).
**Action:** Always wrap event handler props in `useCallback` when passing them down to `React.memo` components, particularly for components rendered in lists or frequent-render environments.
