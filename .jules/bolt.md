## 2025-02-12 - Prevent high-frequency React re-renders in NumberCounter
**Learning:** High-frequency animation loops (e.g., animated number counters) must avoid using `useState` inside `requestAnimationFrame` to prevent expensive React re-renders, as this triggers the full React lifecycle and causes performance bottlenecks during burst animations.
**Action:** Replaced `useState` and `setDisplayValue` with `useRef` for tracking state and directly manipulating the DOM (via `spanRef.current.textContent`) to ensure smooth updates without causing unnecessary component re-renders.
