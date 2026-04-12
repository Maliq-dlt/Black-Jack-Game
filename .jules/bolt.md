## 2024-04-12 - [Avoid Chained Array Methods in requestAnimationFrame]
**Learning:** Chained array methods (like `.map().filter()`) inside `requestAnimationFrame` loops cause unnecessary O(N) intermediate array allocations, increasing garbage collection overhead. This can lead to frame drops during intense burst animations.
**Action:** Always use a single-pass implementation (e.g., `for` loop or `.reduce()`) to calculate new states and prune dead items in high-frequency animation loops without allocating intermediate garbage arrays.
