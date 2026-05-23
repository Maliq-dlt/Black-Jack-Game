## 2024-05-19 - [O(1) Map Lookups for Combos]
**Learning:** Replaced O(N) array `.find()` calls with O(1) Map lookups for static configuration arrays like `COMBO_BONUSES`. This provides significant performance benefits for frequently evaluated loops or React renders, avoiding unnecessary iteration over static data.
**Action:** When finding a `.find()` on a static array inside a hot loop, create an exported precomputed Map and use it for fast O(1) retrieval.
