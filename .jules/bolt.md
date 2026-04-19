## 2026-04-19 - [Performance: requestAnimationFrame Loops]
**Learning:** Chaining array methods (`.map().filter()`) inside `requestAnimationFrame` loops creates O(N) array allocations and excessive garbage collection overhead per frame, which can lead to micro-stutters during burst animations (e.g., `ParticleSystem.tsx`).
**Action:** Always refactor chained array iterations inside `requestAnimationFrame` to use a single-pass `reduce()` or manual `for` loop to build the next state directly, eliminating intermediate garbage allocation.
