
## 2024-05-18 - Replacing Object Maps with Fixed Arrays for Combo Sorting
**Learning:** In poker hand evaluation functions like `isSequential`, attempting to map an object properties (like a dynamic `Array.prototype.map()`) introduces significant GC pauses and object creation overhead per hand. Using a pre-allocated fixed length generic `Array` (`new Array(len)`) and manually filling it inside a loop eliminates mapping closures completely and significantly outperforms the `map` implementation by over 40% locally.
**Action:** Always pre-allocate fixed-length primitive arrays or typed arrays for bounded data sizes (<10 items) rather than using `.map()` inside frequently called calculation methods.
