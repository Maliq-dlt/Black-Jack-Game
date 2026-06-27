## 2024-05-24 - Array find optimization
**Learning:** In highly frequent evaluations, avoid chaining multiple array iteration methods or using `.find()` on static configuration arrays.
**Action:** Precomputed Maps (e.g., `BOSS_DATA_MAP`, `COMBO_BONUSES_MAP`) should be exported from their respective data files for O(1) retrieval.
