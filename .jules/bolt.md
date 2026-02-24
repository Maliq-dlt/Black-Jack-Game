## 2024-06-25 - React.memo() Performance Trap
**Learning:** In React, `React.memo()` is only effective if all props passed to the component are referentially stable. I found `CardComponent` wrapped in `memo` but receiving a new inline function (`onCardClick`) on every parent render, completely negating the memoization.
**Action:** Always verify prop stability when optimizing with `React.memo()`. Use `useCallback` for event handlers passed to memoized children.
