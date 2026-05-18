## 2025-03-01 - [O(1) Map Lookup for Static Configuration Arrays]
**Learning:** Using `Array.find()` on static configuration arrays (like `COMBO_BONUSES`) within loops (like `combos.forEach`) creates an O(N*M) bottleneck during frequent evaluations.
**Action:** Always precompute Maps (e.g., `COMBO_BONUSES_MAP`) for static arrays that are queried frequently to ensure O(1) lookups and eliminate unnecessary array iteration overhead.
