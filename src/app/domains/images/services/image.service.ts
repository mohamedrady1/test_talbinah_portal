import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  // Generate default alt text from the file name
  getAltText(src: string, alt?: string): string {
    if (alt) return alt;
    const fileName = src?.split('/').pop();
    return fileName ? fileName?.split('.')[0].replace(/[-_]/g, ' ') : 'image';
  }
}
