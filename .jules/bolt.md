## 2026-04-10 - [Lazy State Initialization]
**Learning:** Synchronous `localStorage.getItem` calls directly in the body of a functional component (e.g., inside `useState(loadMeta())`) cause synchronous blocking operations on every render, severely impacting performance for components that re-render frequently (like `App.tsx`).
**Action:** Always wrap state initialization that involves I/O operations or expensive computations in a lazy initializer function `useState(() => loadMeta())` to ensure they only run on the first render.
