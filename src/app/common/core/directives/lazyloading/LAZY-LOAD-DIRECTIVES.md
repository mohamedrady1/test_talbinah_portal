
# Lazy Loading Directives

This document covers two Angular directives for lazy loading:
1. `Lazy Load Image Directive`: Lazy loads images as they enter the viewport.
2. `Lazy Load Section Directive`: Triggers an event when a section enters the viewport.

## Table of Contents
- [Lazy Load Image Directive](#lazyloadimagedirective)
- [Lazy Load Section Directive](#lazyloadsectiondirective)

---

## LazyLoadImageDirective

The `LazyLoadImageDirective` is used to lazy load images. It initially shows a placeholder image and replaces it with the actual image once it enters the viewport.

### Installation

1. Add the `LazyLoadImageDirective` to your Angular module:

```typescript
import { LazyLoadImageDirective } from './lazy-load-image.directive';

@NgModule({
  declarations: [LazyLoadImageDirective],
  exports: [LazyLoadImageDirective],
})
export class SharedModule {}
```

2. Use the directive in your component’s template by adding it as an attribute to an `<img>` element.

### Usage Example

In your component template:

```html
<img 
  [appLazyLoadImage]="imageUrl" 
  [placeholder]="'assets/placeholder-image.jpg'" 
  alt="Lazy loaded image">
```

Where:
- `appLazyLoadImage`: The URL of the image to be lazy-loaded when it enters the viewport.
- `placeholder`: The URL of the placeholder image to display initially.

### HTML Example:

```html
<img 
  [appLazyLoadImage]="'https://example.com/large-image.jpg'" 
  [placeholder]="'assets/placeholder.jpg'" 
  alt="Lazy loaded image">
```

This example will initially show the placeholder image, and once the image enters the viewport, it will load the actual image from `https://example.com/large-image.jpg`.

---

## LazyLoadSectionDirective

The `LazyLoadSectionDirective` is used to trigger an event when a section or element enters the viewport. It helps in handling visibility-based logic, such as triggering animations or loading content when the user scrolls.

### Installation

1. Add the `LazyLoadSectionDirective` to your Angular module:

```typescript
import { LazyLoadSectionDirective } from './lazy-load-section.directive';

@NgModule({
  declarations: [LazyLoadSectionDirective],
  exports: [LazyLoadSectionDirective],
})
export class SharedModule {}
```

2. Use the directive in your component’s template by adding it as an attribute to any HTML element.

### Usage Example

In your component template:

```html
<div 
  appLazyLoadSection 
  [threshold]="0.1" 
  (sectionInView)="onSectionInView($event)">
  <h2>Section Title</h2>
  <p>This content will be triggered once it enters the viewport.</p>
</div>
```

Where:
- `threshold`: The percentage of the element's visibility required to trigger the event (default is `0.1` or 10%).
- `sectionInView`: An output event that emits `true` when the element is in the viewport.

### Handling the Event:

In your component:

```typescript
onSectionInView(isInView: boolean): void {
  if (isInView) {
    console.log('Section is in view!');
    // Add any additional logic for when the section is in view
  }
}
```

---

## How It Works

### LazyLoadImageDirective:

1. The directive listens for the image element to enter the viewport using the `IntersectionObserver`.
2. Initially, it sets the `src` attribute to a placeholder image.
3. Once the image is about to enter the viewport, the directive updates the `src` to the actual image URL.

If `IntersectionObserver` is not supported, it directly loads the image.

### LazyLoadSectionDirective:

1. The directive monitors when the section enters the viewport.
2. It triggers the `sectionInView` event once the section is visible, based on the provided threshold.
3. You can use this event to load content, trigger animations, or perform any other visibility-based actions.

If the section is already in view on page load, it emits the event with a slight delay.

---

## Notes

- Both directives work only in the browser (`isPlatformBrowser` check ensures they don’t execute during server-side rendering).
- The `LazyLoadSectionDirective` will trigger the event only once for the same section unless the page is resized or scrolled.

---
