# Bolt's Journal

## 2024-05-23 - Heavy Component Re-renders
**Learning:** The `App.tsx` component is the central state hub and re-renders frequently (e.g., on every particle frame or small state change). Heavy child components like `CardComponent` (which uses 3D transforms and complex framer-motion animations) were being re-rendered unnecessarily because of inline callback props, defeating their `React.memo` optimization.
**Action:** Always wrap callbacks passed to heavy, memoized components in `useCallback` within the main `App` component to ensure prop stability.
