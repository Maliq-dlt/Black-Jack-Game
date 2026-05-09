## 2026-05-09 - DeckViewer Array Operations
**Learning:** Redundant `filter().length` operations on component render create unnecessary O(N) bottlenecks.
**Action:** When calculating statistics or subgroups of an array where a frequency map already exists, sum the values from the precomputed map using O(1) property lookups instead of executing additional array passes.
