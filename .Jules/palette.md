## 2025-05-22 - Icon-only Buttons Accessibility
**Learning:** Found multiple instances of icon-only buttons (Close, Toggle) implemented with raw SVGs inside buttons without accessible names. This completely blocks screen reader users from understanding the control's purpose.
**Action:** Standardize on adding `aria-label` to all icon-only buttons during component review.
