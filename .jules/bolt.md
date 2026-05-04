## 2024-05-04 - [Optimize DeckViewer Component]
**Learning:** Replaced multiple O(N) `array.filter().length` operations with O(1) lookups by using a precomputed dictionary.
**Action:** When calculating multiple aggregations over the same array within a component (e.g. counting different card categories), avoid redundant array traversals by performing a single O(N) pass to build a frequency map, then compute derived values using O(1) lookups.
