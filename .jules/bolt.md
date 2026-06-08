## 2024-05-24 - Precomputed Map Optimization
**Learning:** For small, bounded configurations (like boss lists, joker definitions), repeatedly using `Array.find()` inside frequent game loop calculations (like damage calculations or rendering) generates unnecessary O(N) linear scans.
**Action:** Consistently replace `Array.find()` with precomputed Maps exported from static data files for O(1) lookups. This pattern is essential when items are queried by unique ID within render cycles or tight data evaluation loops.
