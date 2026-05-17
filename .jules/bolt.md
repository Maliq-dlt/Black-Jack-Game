
## 2026-05-17 - O(1) Map lookups for static configuration arrays
**Learning:** Avoid using `Array.find()` on static configuration arrays (like `COMBO_BONUSES`) inside frequently evaluated loops (like `calculateComboBonus`). This causes an O(N) lookup for each item in the loop, resulting in unnecessary performance overhead, especially in games where combo evaluations happen continuously.
**Action:** Always precompute a `Map` (e.g., `COMBO_BONUSES_MAP`) from static configuration arrays and replace `Array.find()` with `Map.get()` to achieve O(1) lookups. Additionally, replace `.forEach` inside such calculations with a manual `for` loop to reduce closure overhead.
