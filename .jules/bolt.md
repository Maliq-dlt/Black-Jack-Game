## 2024-05-14 - Initial Setup
**Learning:** Bolt initialized. Remember to follow strict format for PRs.
**Action:** Let's optimize something!
## 2024-05-14 - NumberCounter React Optimization
**Learning:** High-frequency animation loops (like number counters) relying on `requestAnimationFrame` cause excessive React re-renders when updating state (e.g., `useState`).
**Action:** Use a `useRef` pointing to the DOM node (e.g., `spanRef.current.textContent`) to update text elements directly inside the animation frame loop, bypassing React's render cycle completely. This is a critical performance pattern for text animations in this application.
