export interface ImageSource {
  src: string;         // The path to the image
  width: number;       // The width of the image
  mediaQuery: string;  // The media query (e.g., (max-width: 600px))
  height: number;      // The height of the image
  alt?: string;        // The alternative text for the image
  type?: string;       // The type of the image (e.g., 'image/webp')
}
