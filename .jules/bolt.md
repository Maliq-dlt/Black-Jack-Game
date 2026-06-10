## 2026-06-10 - [⚡ Bolt: Optimize combo bonus calculations and evaluations]
**Learning:** The project uses an O(N) `Array.find()` inside the highly frequent `calculateComboBonus` function. Replaced with an O(1) Map lookup. Discovered unnecessary O(N) array allocation overhead in `isSequential` and `isSuited` calculations which happen on every hand.
**Action:** Always eliminate O(N) configurations array lookups using Maps, and replace slow array higher-order methods (`.every`, `.map`, `.sort`) with fast `for` loops and direct assignments to minimize memory allocation.
