## 2024-05-24 - [Avoid chained array allocations in 60fps loops]
**Learning:** In tight loops like `requestAnimationFrame`, combining `Array.map().filter()` causes unnecessary O(N) array allocations and immediate garbage collection. This causes GC pauses and frame drops, particularly when rendering burst effects like particles.
**Action:** Always replace chained array methods with a single-pass implementation (like a `for` loop pushing to a pre-allocated or single new array) when performing operations inside `requestAnimationFrame` state updates.
