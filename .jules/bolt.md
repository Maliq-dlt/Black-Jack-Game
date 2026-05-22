
## 2024-05-22 - O(1) Map Lookups for Combos and Bosses
**Learning:** Found an O(N) array lookup bottleneck in `calculateComboBonus` which iterates `COMBO_BONUSES.find()` inside a loop for combos, and similarly for `BOSS_DATA.find()` in tight loop renders (`App.tsx`). This O(N * M) pattern can add noticeable overhead during rapid frame updates.
**Action:** Always prefer precomputing static maps (e.g., `COMBO_BONUSES_MAP` and `BOSS_MAP_BY_ID`) to turn O(N) `.find()` calls into O(1) `.get()` calls, especially in loops and frequently rendered React components. Replace `.forEach()` with `for` loops inside critical functions like `calculateComboBonus` to minimize intermediate allocation and closure overhead.
