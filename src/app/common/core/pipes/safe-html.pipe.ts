import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);

  transform(value: string): SafeHtml | string {
    if (isPlatformBrowser(this.platformId)) {
      // Only sanitize in the browser where bypassSecurityTrustHtml is safe
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }
    // On the server, return plain string to avoid serialization issues
    return value;
  }
}
