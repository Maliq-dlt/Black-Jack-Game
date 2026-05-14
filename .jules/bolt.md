
## 2024-05-14 - Optimize array lookups for static data
**Learning:** In highly frequent evaluations or React render bodies, using `Array.find()` on static configuration arrays (like `BOSS_DATA`, `COMBO_BONUSES`, `RUN_MODES`, `ASCENSION_LEVELS`, `SKILL_NODES`, and `JOKERS`) introduces O(N) operations that can cause unnecessary bottlenecks.
**Action:** When a static array acts like a database lookup table, always pre-compute a `Map` from it to guarantee O(1) retrieval times. This speeds up helper functions, game loops, and UI rendering logic.
