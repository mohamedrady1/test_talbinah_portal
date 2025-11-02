
# 🔘 Button Component - HTML Examples & BEM Usage

This documentation provides a comprehensive set of usage examples for the custom `btn` component styled with BEM principles. These examples are SSR-friendly, accessible, and ready to integrate into any Angular 19 project using SCSS mixins.

---

## 🧱 Class Structure (BEM)

- `btn` – base class for the button component
- `btn__label` – encapsulates button text
- `btn__icon` – handles icons (left/right/loading)
- Modifiers:
  - `btn--solid`, `btn--outline`, `btn--ghost`, `btn--link`
  - `btn--size-small`, `btn--size-medium`, `btn--size-large`, `btn--size-full`
  - `btn--icon-left`, `btn--icon-right`
  - `btn--color-main`, `btn--color-success`, `btn--color-danger`
  - `btn--disabled`

---

## ✨ Button Examples

### ✅ Default Solid Button

```html
<button type="button" class="btn btn--solid">
  <span class="btn__label">Submit</span>
</button>
```

---

### ✅ Outline Button

```html
<button type="button" class="btn btn--outline">
  <span class="btn__label">Cancel</span>
</button>
```

---

### ✅ Ghost Button

```html
<button type="button" class="btn btn--ghost">
  <span class="btn__label">Help</span>
</button>
```

---

### ✅ Link Button

```html
<button type="button" class="btn btn--link">
  <span class="btn__label">Forgot password?</span>
</button>
```

---

### ✅ Button with Left Icon

```html
<button type="button" class="btn btn--solid btn--icon-left">
  <span class="btn__icon pi pi-user"></span>
  <span class="btn__label">Login</span>
</button>
```

---

### ✅ Button with Right Icon

```html
<button type="button" class="btn btn--outline btn--icon-right">
  <span class="btn__label">Continue</span>
  <span class="btn__icon pi pi-arrow-right"></span>
</button>
```

---

### ✅ Button Sizes

```html
<!-- Small -->
<button class="btn btn--solid btn--size-small">
  <span class="btn__label">Small</span>
</button>

<!-- Medium -->
<button class="btn btn--solid btn--size-medium">
  <span class="btn__label">Medium</span>
</button>

<!-- Large -->
<button class="btn btn--solid btn--size-large">
  <span class="btn__label">Large</span>
</button>

<!-- Full Width -->
<button class="btn btn--solid btn--size-full">
  <span class="btn__label">Full Width</span>
</button>
```

---

### ✅ Loading Spinner Icon

```html
<button type="button" class="btn btn--solid" disabled>
  <span class="btn__icon btn__icon--loading pi pi-spinner pi-spin"></span>
  <span class="btn__label">Loading...</span>
</button>
```

---

### ✅ Disabled Button

```html
<button type="button" class="btn btn--solid btn--disabled" disabled>
  <span class="btn__label">Disabled</span>
</button>
```

---

### ✅ Color Variants

```html
<!-- Main -->
<button class="btn btn--solid btn--color-main">
  <span class="btn__label">Primary</span>
</button>

<!-- Success -->
<button class="btn btn--solid btn--color-success">
  <span class="btn__label">Success</span>
</button>

<!-- Danger -->
<button class="btn btn--solid btn--color-danger">
  <span class="btn__label">Delete</span>
</button>
```

---

## ✅ Accessibility & Best Practices

- Use `type="button"` unless submitting a form.
- Ensure icons use `aria-hidden="true"` if they are decorative.
- Prefer `btn__label` for screen-reader clarity.
- Apply `disabled` attribute for accessibility, along with `.btn--disabled` for styles.

---

## 📁 Integration

- Add styles to your global or shared styles: `@use 'path-to/button.component.scss'`.
- Import `<button>` markup into your standalone or shared UI components.
- Combine with Angular signals for reactive UI state (loading, disabled, etc.).

---

> Created with 💙 for scalable, semantic, SSR-optimized Angular applications.
