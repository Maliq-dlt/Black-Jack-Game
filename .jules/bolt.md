## 2024-05-18 - Avoid array methods for small array operations
**Learning:** For small arrays (N < 20, e.g., blackjack hands), manual nested loops outperform higher-order array methods (`map`, `some`, `indexOf`) because the overhead of object instantiation and closure creation dominates execution time.
**Action:** Replace `map`, `some`, `every`, and `forEach` with manual nested loops and pre-allocated arrays in heavily utilized calculation functions like `hasPair`, `hasThreeOfAKind`, `isSuited`, and `isSequential`.
