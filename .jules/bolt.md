## 2024-06-23 - Performance optimization of array operations for small datasets

**Learning:** Micro-optimizations for native methods like `Array.prototype.sort()` can be rejected as unmaintainable because JavaScript engines heavily optimize these methods. Writing a custom manual insertion sort in an attempt to be faster than the built-in native engine `.sort()` introduces unnecessary complexity and fails code readability standards, even if it is technically faster in isolated node benchmarks for micro-arrays.

**Action:** Maintain native methods when standard optimization practices like `Array.prototype.sort()` are both readable and performant. Only replace higher-order functional array operations (`.map()`, `.some()`, etc.) that allocate closures or intermediate objects, keeping the code clean and avoiding over-engineering.
