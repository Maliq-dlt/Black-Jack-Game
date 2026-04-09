## 2024-05-20 - [Particle Animation Loop Optimization]
**Learning:** Chained array methods (`.map().filter()`) inside `requestAnimationFrame` loops cause unnecessary O(N) array allocations and garbage collection overhead, leading to frame drops during intense burst animations.
**Action:** Always use a single-pass implementation (e.g. `for` loop or `.reduce()`) inside `requestAnimationFrame` to calculate new states and prune dead items without allocating intermediate garbage.
