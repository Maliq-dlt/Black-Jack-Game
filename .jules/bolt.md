## 2024-05-23 - React Animation Loop Bottleneck
**Learning:** Using `useState` inside a `requestAnimationFrame` loop causes the entire component to re-render on every frame. When rendering hundreds of elements (like particles), this creates massive overhead (reconciliation, style calculation, layout) and kills performance.
**Action:** Move high-frequency animation state out of React state (use `useRef`) and render directly to a `<canvas>` element. This bypasses the React render cycle entirely for the animation loop.

## 2024-05-23 - Randomness in Render
**Learning:** Deriving random values (like `Math.random()`) directly inside the render function or a component body without memoization causes visual glitches (flickering) because every re-render generates new values.
**Action:** Calculate random properties once during initialization (e.g., inside `useEffect` or `useMemo`) and store them in state or ref.
