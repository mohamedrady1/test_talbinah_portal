# 🎯 Flexbox Utility Mixins (Angular 19+ SCSS Best Practices)

This folder contains reusable SCSS mixins for applying modern flexbox layout patterns using semantic, composable utilities. These are intended for use in Angular 19+ projects with modular SCSS and BEM naming practices.

## 📁 File Structure


## 📦 Setup

Ensure `main.scss` (or your global SCSS entry file) imports all mixins via:

```scss
// styles/abstracts/_mixins.scss
@forward './mixins/flex';
Then in any component or layout SCSS file:


@use 'src/styles/abstracts/mixins' as mix;
🔧 Available Mixins
1. @include mix.flex-center-column;
Centers content vertically and horizontally using flexbox with column direction.


.my-section {
  @include mix.flex-center-column;
  height: 100vh;
}
2. @include mix.flex-center-row;
Centers content vertically and horizontally using flexbox with row direction.


.my-header {
  @include mix.flex-center-row;
}
3. @include mix.flex-layout($direction, $justify, $align);
Customizable shorthand for applying full flex layout.

Parameters:
$direction: row | column (default: row)

$justify: flex-start | center | space-between | ...

$align: stretch | center | baseline | ...


.card-container {
  @include mix.flex-layout(column, space-between, center);
}
✅ Best Practices
Use in conjunction with BEM naming conventions (e.g., .form__footer).

Avoid inline flex declarations—centralize layout behavior using mixins.

Combine with responsive mixins/media queries for mobile-first layout.
