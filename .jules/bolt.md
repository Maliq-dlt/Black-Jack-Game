## 2025-05-18 - Avoid chained array methods in rAF loops
**Learning:** Using chained array methods (like `.map().filter()`) inside `requestAnimationFrame` loops creates unnecessary intermediate arrays, adding O(N) memory allocations per frame. In scenarios with burst animations like particles, this garbage collection pressure can cause significant frame drops.
**Action:** Always refactor chained `.map().filter()` into a single-pass `for` loop or `.reduce()` inside hot code paths (e.g., game loop / `requestAnimationFrame`) to avoid allocating intermediate arrays.
