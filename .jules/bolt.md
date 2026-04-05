## 2026-04-05 - Precompute Lookups for Combos
**Learning:** Avoid using `Array.find()` on static configuration arrays within frequently evaluated loops.
**Action:** Used `Map` to enable O(1) constant-time lookups to improve performance.
