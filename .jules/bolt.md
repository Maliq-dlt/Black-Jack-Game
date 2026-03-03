## 2026-03-03 - [React Strict Mode purity]
**Learning:** Side effects like `soundEngine.playChipClick()` and non-pure operations like `Math.random()` MUST be placed outside of `setGameState` functional updaters. React Strict Mode invokes these updaters twice to detect impurity, which causes audio to play twice and generates throwaway IDs if placed inside.
**Action:** Always extract side-effects and generation of unique IDs outside of React state updaters.
