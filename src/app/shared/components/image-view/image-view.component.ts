import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Logger } from '../../../common';

interface Iimage {
  title: string;
  image: string;
}

@Component({
  selector: 'app-image-view',
  standalone: true,
  imports: [],
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewComponent {
  private sanitizer = inject(DomSanitizer)
  @Input() config!: Iimage; // Input for image configuration

  // Signal to store the sanitized image URL
  sanitizedImageUrl = signal<SafeUrl | null>(null);

  ngOnInit(): void {
    // Sanitize the image URL to prevent potential XSS vulnerabilities
    if (this.config && this.config.image) {
      this.sanitizedImageUrl.set(this.sanitizer.bypassSecurityTrustUrl(this.config.image));
      Logger.debug('ImageViewComponent initialized with sanitized image URL.');
    } else {
      Logger.warn('ImageViewComponent received no image URL in config.');
    }
  }
}
