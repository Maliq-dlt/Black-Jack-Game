## 2024-05-14 - Prevent synchronous localStorage access during React renders
**Learning:** Initializing state with function calls containing synchronous operations like `localStorage.getItem` causes significant performance bottlenecks during frequent re-renders in centralized state components like App.tsx.
**Action:** Always use lazy state initialization `useState(() => loadData())` or extract such operations outside the component definition to ensure they only run during the initial setup.
