## 2024-05-12 - [O(1) Map Lookups for Static Config]
**Learning:** In highly frequent evaluations or React renders, using `Array.find()` on static configuration arrays (like `BOSS_DATA`, `COMBO_BONUSES`, or `JOKERS`) creates an O(N) bottleneck.
**Action:** Always precompute Maps (e.g., `BOSS_MAP`, `COMBO_BONUSES_MAP`) to ensure O(1) retrieval for static arrays, replacing `Array.find()` with `Map.get()`.
