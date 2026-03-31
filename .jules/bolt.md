
## 2025-02-28 - O(1) Map Lookups for Static Configuration Arrays
**Learning:** In frequently evaluated loops (like end-of-hand combo calculations), using `Array.find()` to look up configurations from static arrays like `COMBO_BONUSES` creates an O(N) hidden cost inside the loop. When evaluating many combos, this compounds to O(C * B).
**Action:** Always precompute a `Map` (e.g., `COMBO_BONUS_MAP = new Map(COMBO_BONUSES.map(b => [b.type, b]))`) for static definition arrays if they will be queried inside loops or high-frequency game logic, changing the lookup from O(N) to O(1).
