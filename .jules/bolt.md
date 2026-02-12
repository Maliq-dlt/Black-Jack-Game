## 2024-05-23 - [Memoizing Handlers]
**Learning:** Passing inline functions as props to memoized components (like `CardComponent`) breaks `React.memo` optimization, causing unnecessary re-renders. Also, inline handlers for effects like `ParticleSystem` can cause animation resets if the parent re-renders.
**Action:** Always wrap event handlers passed to memoized children or effects in `useCallback`.
