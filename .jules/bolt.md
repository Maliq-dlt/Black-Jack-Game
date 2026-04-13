## 2024-05-18 - [Optimizing Massive Component Mount]
**Learning:** React component initializers containing expensive, synchronous I/O operations (like `localStorage.getItem` or `JSON.parse`) execute repeatedly on every render if not correctly isolated.
**Action:** Move large pure config parsers outside the component scope and always use lazy initialization (`useState(() => loadFromStorage())`) for state originating from slow synchronous sources.
