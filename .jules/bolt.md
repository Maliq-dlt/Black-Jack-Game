## 2025-02-18 - App.tsx Re-renders
**Learning:** App.tsx acts as a central state hub, causing frequent re-renders. Child components like CardComponent are wrapped in React.memo but receive unstable callback props (inline functions), negating the memoization benefit.
**Action:** Always wrap callbacks passed to memoized components in App.tsx with useCallback.
