## 2024-05-24 - O(N) Array Lookups in Render and Fast-loops
**Learning:** Found O(N) `Array.find()` logic running repeatedly inside `App.tsx` (on every render via BossBattlePhases props) and inside combo evaluation loops.
**Action:** Always map static array configs (like `BOSS_DATA` or `COMBO_BONUSES`) into `Map` instances (`BOSS_MAP`) on load to allow for O(1) `.get()` lookups in hot paths.
