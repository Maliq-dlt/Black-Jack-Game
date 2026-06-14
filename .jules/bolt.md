## 2024-03-24 - [Replace .map().filter() chained iteration in animation loops]
**Learning:** `Array.prototype.map().filter()` inside a `requestAnimationFrame` loop creates a temporary array allocation per frame per particle effect. When multiple animations run, this increases GC pressure significantly and leads to jank.
**Action:** Always replace `.map().filter()` or array `.map()` in `requestAnimationFrame` hooks with manual `for` loop single-pass updates that directly push to a new array to prevent intermediate array creation and optimize allocations.
