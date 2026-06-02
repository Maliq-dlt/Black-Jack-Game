## 2026-06-02 - Precomputed Maps for O(1) Static Lookups
**Learning:** Frequent use of `Array.find()` on static configuration arrays (like `BOSS_DATA`, `JOKERS`, and `COMBO_BONUSES`) inside React renders and high-frequency scoring loops causes unnecessary O(N) scans.
**Action:** Always precompute Maps (e.g., `BOSS_MAP = new Map(BOSS_DATA.map(b => [b.id, b]))`) for static, bounded datasets to enable O(1) lookups, ensuring consistent frame rates during heavy computations.
