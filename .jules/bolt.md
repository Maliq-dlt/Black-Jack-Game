## 2026-05-21 - [Optimize requestAnimationFrame Loops]
**Learning:** Chaining array methods like `.map().filter()` inside a `requestAnimationFrame` loop creates multiple intermediate arrays, leading to significant garbage collection overhead and frame drops during intense animations (like particle bursts).
**Action:** Always use a single-pass implementation (e.g. `for` loop or `.reduce()`) to calculate new states and prune dead items without allocating intermediate garbage in high-frequency animation loops.
