## 2024-05-24 - High-performance ID generation
**Learning:** Frequent calls to `Math.random().toString(36)` and `Date.now().toString()` inside render loops or frequent operations (like shuffling decks or emitting particles) create noticeable GC pressure and block the main thread.
**Action:** Centralize ID generation using a session-prefix and incrementing counter pattern (`prefix + counter++`). This is roughly 4-5x faster than random string generation and significantly reduces GC overhead.
