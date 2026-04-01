## 2024-05-15 - Array.find() Performance
**Learning:** Found usage of Array.find() on static arrays (like COMBO_BONUSES in comboDetector.ts). This is an O(N) hidden loop.
**Action:** Replace Array.find() with Map lookups to achieve O(1) time complexity, improving high frequency evaluation logic.
