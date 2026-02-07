## 2024-05-22 - [React.memo Invalidation by Inline Functions]
**Learning:** Passing inline functions as props to `React.memo` components invalidates memoization on every render, causing unnecessary re-renders of the child component even if other props are unchanged. This is especially critical in lists or loops (like rendering cards in a hand).
**Action:** Always use `useCallback` to create stable function references for event handlers passed to memoized child components.
