
## 2026-03-14 - [NumberCounter Animation Optimization]
**Learning:** Using React's `useState` inside a `requestAnimationFrame` loop (e.g., `setDisplayValue(currentValue)`) is a major anti-pattern for text animations, as it forces the entire component to re-render ~60 times per second for a simple text change.
**Action:** Use a `useRef` pointing to the HTML element (e.g., `<span ref={displayRef}>`) and perform direct DOM manipulation (`displayRef.current.textContent = ...`) inside the animation loop to skip the React render cycle entirely.
