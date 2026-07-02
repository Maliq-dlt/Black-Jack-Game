## 2024-07-02 - Chained Array Methods in requestAnimationFrame
**Learning:** Chained array methods (`.map().filter()`) inside `requestAnimationFrame` loops cause unnecessary O(N) array allocations and garbage collection overhead, leading to frame drops during intense burst animations.
**Action:** Always use a single-pass implementation (e.g. `for` loop or `.reduce()`) to calculate new states and prune dead items without allocating intermediate garbage.
