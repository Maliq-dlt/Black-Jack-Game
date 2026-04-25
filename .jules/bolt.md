
## 2024-05-19 - [O(1) Precomputed Lookups in Renders]
**Learning:** Multiple array filters (e.g., `filter().length`) inside a React component's render function can cause redundant O(N) operations, which is a performance bottleneck for frequently updated views like card counting statistics.
**Action:** Always leverage existing precomputed data structures (like `cardCounts` maps) to replace O(N) filters with O(1) property access or simple `reduce` functions on small static arrays for improved render performance.
