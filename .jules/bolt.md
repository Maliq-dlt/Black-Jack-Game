## 2024-05-24 - [Combo Evaluation Arrays]
**Learning:** Frequent array instantiation via `Object.values()` combined with multiple iterations (`includes`, `filter`) for combo detection causes unnecessary overhead per hand.
**Action:** Avoid chaining array methods for frequency counting; use a single `for...in` loop over a dictionary instead.
