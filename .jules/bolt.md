## 2026-04-02 - O(N) Config Array Lookups
**Learning:** `Array.find()` was being used inside loop-heavy combo calculation logic (`calculateComboBonus`) against a static config array (`COMBO_BONUSES`). This creates hidden nested loops (O(N) operations inside O(M) loops).
**Action:** Always precompute a `Map` (or Record) for static configuration arrays if they are queried frequently by key/type, converting O(N) array scans to O(1) constant-time map lookups.
