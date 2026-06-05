## 2026-06-05 - Avoid O(N) array iteration with Map Lookups
**Learning:** In highly frequent evaluations or React renders, chaining or iterating with higher-order array methods (like `.find()`) over static configuration arrays (e.g., `BOSS_DATA`, `ASCENSION_LEVELS`, `RUN_MODES`, `SKILL_NODES`, `COMBO_BONUSES`, `JOKERS`) creates an O(N) execution bottleneck per invocation.
**Action:** Always precompute Maps (e.g., `BOSS_DATA_MAP`) keyed by identifiers during module initialization to ensure O(1) retrieval time.
