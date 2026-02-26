## 2024-05-22 - App.tsx Re-renders
**Learning:** `App.tsx` serves as the central state hub, causing frequent re-renders. Passing inline functions to memoized child components like `CardComponent` defeats memoization and causes unnecessary re-renders of the entire card grid.
**Action:** Always wrap event handlers passed to heavy/memoized components in `useCallback` within `App.tsx`.
