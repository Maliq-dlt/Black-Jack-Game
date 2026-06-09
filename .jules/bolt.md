
## 2024-05-30 - O(1) Map Lookups for Static Configurations
**Learning:** For static configuration arrays like `COMBO_BONUSES` (or similar lists of settings/types), iterating over them using `Array.find()` inside loops or frequent evaluations causes O(N) overhead. Combining `.forEach` with `.find` results in O(N*M) complexity.
**Action:** Always create a precomputed `Map` (e.g., `COMBO_BONUSES_MAP`) exported alongside the base array. Use `Map.get()` combined with a simple `for` loop to ensure O(1) retrieval and avoid closure/iteration overhead during game logic evaluations.
