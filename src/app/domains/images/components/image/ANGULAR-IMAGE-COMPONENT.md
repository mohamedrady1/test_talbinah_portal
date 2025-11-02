
# Angular Image Component with Lazy Loading

This Angular component provides a versatile solution for handling both single and multiple images. It supports lazy loading, error handling, and responsive design using the <picture> element. This component also generates alt text for images and supports fallback images in case of errors.

## Features

- Supports both single and multiple images.
- Responsive image handling with the <picture> element.
- Lazy loading for efficient image loading.
- Error handling with a fallback image.
- Automatic generation of alt text from the image source or a custom alt text.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Inputs](#inputs)
4. [Outputs](#outputs)
5. [Dependencies](#dependencies)
6. [Service Explanation](#service-explanation)

## Installation

1. Ensure that you have Angular installed in your project.

2. Install the necessary dependencies:

   ```bash
   npm install --save @angular/common
   ```

3. Import the component and directive into your Angular module:

   ```typescript
   import { ImageComponent } from './path/to/image.component';
   import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
   ```

## Usage

### Example of Using a Single Image

```html
<app-image 
  [src]="'path/to/image.jpg'"
  [class]="'custom-class'"
  [width]="300"
  [height]="200"
  [onError]="'fallback-image.jpg'">
</app-image>
```

### Example of Using an Array of Images

```html
<app-image 
  [src]="srcArray"
  [class]="'custom-class'"
  [onError]="'fallback-image.jpg'">
</app-image>
```

### Image Source Array

The `srcArray` input can be an array of `ImageSource` objects, as shown below:

```typescript
srcArray: ImageSource[] = [
  {
    src: 'path/to/image1.jpg',
    width: 300,
    height: 200,
    mediaQuery: '(max-width: 600px)',
    type: 'image/webp'
  },
  {
    src: 'path/to/image2.jpg',
    width: 600,
    height: 400,
    mediaQuery: '(min-width: 601px)',
  }
];
```

## Inputs

- **`src`** (`string | ImageSource[]`):  
  The source of the image or an array of `ImageSource` objects. This can be a single string URL for one image, or an array for multiple images.

- **`class`** (`string`):  
  Custom CSS classes to style the image.

- **`width`** (`number | null`):  
  The width of the image for single image cases.

- **`height`** (`number | null`):  
  The height of the image for single image cases.

- **`onError`** (`string`):  
  The fallback image to be displayed if an image fails to load.

## Outputs

The component doesn't emit events, but it handles image loading errors by using the `onError` input.

## Dependencies

- `CommonModule`: For basic Angular functionalities.
- `LazyLoadImageDirective`: Custom directive to handle lazy loading of images.

## Service Explanation

The `ImageService` provides a method to generate alt text for images. It attempts to extract the file name from the image URL and formats it into readable alt text. If a custom alt text is provided, it will be used instead.

### `ImageService`

```typescript
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  getAltText(src: string, alt?: string): string {
    if (alt) return alt;
    const fileName = src?.split('/').pop();
    return fileName ? fileName?.split('.')[0].replace(/[-_]/g, ' ') : 'image';
  }
}
```

## Conclusion

This `ImageComponent` is a flexible and efficient solution for managing images in your Angular application. It supports responsive images, lazy loading, error handling, and alt text generation.

## Additional Examples

```typescript
srcArray: ImageSource[] = [
  {
    src: 'path/to/small-image.jpg',
    width: 300,
    height: 200,
    mediaQuery: '(max-width: 600px)',
    type: 'image/webp'
  },
  {
    src: 'path/to/large-image.jpg',
    width: 800,
    height: 600,
    mediaQuery: '(min-width: 601px)',
  }
];
```
``` html
<app-image 
  [src]="srcArray"
  [class]="'responsive-images'"
  [onError]="'fallback-image.jpg'">
</app-image>
```
