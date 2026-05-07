## 2024-05-18 - [App & Combo O(N) optimizations]
**Learning:** O(n^2) or finding in large array repetitively causes slowness especially in React rendering loops or intensive calculation paths. `Array.find` inside repeated iterations is slow.
**Action:** Use precomputed Maps for O(1) lookups on static arrays like `COMBO_BONUSES` and `BOSS_DATA`.
