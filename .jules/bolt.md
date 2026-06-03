## 2024-03-22 - O(N) Array.find() optimizations
**Learning:** For static configuration arrays that are queried frequently (e.g. `BOSS_DATA`, `ASCENSION_LEVELS`, `RUN_MODES`, `SKILL_NODES`, `COMBO_BONUSES`), using `Array.prototype.find()` creates O(N) overhead in loops and React renders.
**Action:** Always precompute Maps (e.g. `export const BOSS_DATA_MAP = new Map(...)`) during module initialization for these static arrays and use `Map.get()` to ensure O(1) lookups.
