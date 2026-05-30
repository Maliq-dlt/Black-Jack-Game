## 2024-05-19 - O(1) Map lookups for Boss Data
**Learning:** Found multiple O(N) array lookups using `BOSS_DATA.find()` inside `App.tsx` renders and state updates, which are called very frequently.
**Action:** Replace `Array.find()` with `Map.get()` for static config arrays to turn O(N) lookups into O(1) in frequent execution paths like `App.tsx`.
