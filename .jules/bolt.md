
## 2026-05-05 - [Burst Animation GC Pressure]
**Learning:** Chained array methods (`.map().filter()`) inside `requestAnimationFrame` loops within React state setters cause severe garbage collection pressure and frame drops during intense burst animations because they allocate intermediate array objects on every frame.
**Action:** Use a single-pass `for` loop to evaluate state and prune dead entities, pushing only surviving objects into a single `nextState` array to eliminate intermediate garbage.
