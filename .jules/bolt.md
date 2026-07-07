
## 2025-02-12 - [Refactoring Combo Detection for Small Arrays]
**Learning:** For small arrays (N < 20, e.g., blackjack hands), manual nested loops (O(N^2)) outperform `Set` (O(N)) and higher-order array methods (`map`, `some`, `indexOf`) because the overhead of object instantiation and closure creation dominates execution time. Avoiding object allocations inside these loops drastically reduces garbage collection pauses. Pre-allocating an array for values (e.g., `new Array(len)`) and using a simple `for` loop avoids intermediate array allocations created by `.map()`.
**Action:** Replace `map`, `some`, `forEach`, and `every` with nested loops and pre-allocated arrays where high-frequency operations run on small arrays, minimizing closure overhead and memory allocation.
