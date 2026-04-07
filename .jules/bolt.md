## 2025-05-18 - Lazy initialization of state in React to avoid performance bottlenecks
**Learning:** Synchronous operations like `localStorage.getItem` within a React functional component block the main thread and run on every render if not placed inside a lazy initializer (`useState(() => ...)`) or defined outside the component.
**Action:** Always ensure persistence loading functions are defined outside the component body and use lazy state initialization (`useState(() => ...)`).
