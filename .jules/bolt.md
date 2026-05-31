## 2024-05-18 - [NumberCounter Component Optimization]
**Learning:** Using `useState` inside a `requestAnimationFrame` loop creates a significant performance bottleneck by forcing full React re-renders up to 60 times a second for simple animation tasks.
**Action:** Always replace `setState` with `useRef` for tracking the current value, and update the DOM directly (e.g., `spanRef.current.textContent`) when dealing with high-frequency updates that don't need React's virtual DOM diffing logic.
