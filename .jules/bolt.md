## 2024-05-24 - [DeckViewer Statistics Refactor]
**Learning:** In DeckViewer.tsx, there were redundant `deck.filter().length` calls inside the render method to calculate High Cards, Aces, and Low Cards. These O(N) evaluations caused unnecessary recalculations.
**Action:** Optimized by leveraging the already precomputed `cardCounts` object to retrieve these statistics in O(1) time. This replaces repeated array iterations with simple lookups or short array reductions.
