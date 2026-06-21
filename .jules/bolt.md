## 2026-06-21 - O(1) Map Lookups
**Learning:** React renders and frequent game updates shouldn't iterate static arrays repeatedly using Array.find() for id lookups. Maps are more performant.
**Action:** When working with static configuration arrays in heavily rendered components, precompute Map structures for O(1) key-based retrieval instead of keeping O(N) array scans.
