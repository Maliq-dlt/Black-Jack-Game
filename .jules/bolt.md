## 2025-03-05 - [O(1) Map Lookups for Combos]
**Learning:** Array.find() on static config arrays inside frequently evaluated functions (like scoring loops in `comboDetector.ts`) creates unnecessary O(N) overhead during gameplay and limits scaling.
**Action:** Precomputing Maps for O(1) lookups is a codebase-specific pattern that should be applied to all configuration arrays that require repeated access, especially those in `calculateComboBonus` or other hot path logic.
