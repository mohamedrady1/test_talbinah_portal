import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appLazyLoadImage]',
  standalone: true
})
export class LazyLoadImageDirective implements OnInit, OnDestroy {
  @Input() appLazyLoadImage!: string;
  @Input() placeholder: string = 'assets/placeholder-image.jpg';
  @Input() threshold: number = 0.1;
  @Input() rootMargin: string = '50px';
  @Input() ssrFallback: boolean = true;
  @Input() fallbackImages: string[] = []; // Array of fallback images to try

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private isImageLoaded = false;
  private currentFallbackIndex = 0;

  ngOnInit() {
    if (!this.appLazyLoadImage) {
      console.warn('appLazyLoadImage: Image URL is required');
      return;
    }

    // Check if we're on the server side
    if (!isPlatformBrowser(this.platformId)) {
      // Server-side rendering - load image directly for SEO and initial render
      this.loadImageDirectly();
      return;
    }

    // Client-side rendering
    this.setupLazyLoading();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupLazyLoading() {
    // Set placeholder initially
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.placeholder);

    // Add loading state
    this.renderer.addClass(this.el.nativeElement, 'lazy-loading');

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for older browsers - load immediately
      this.loadImage();
    }
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isImageLoaded) {
            this.loadImage();
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: this.threshold,
        rootMargin: this.rootMargin
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  private loadImage() {
    if (this.isImageLoaded) return; // Prevent multiple loads

    const img = this.el.nativeElement;

    // Create a new image to preload
    const tempImg = new Image();

    tempImg.onload = () => {
      this.isImageLoaded = true;
      this.renderer.setAttribute(img, 'src', this.appLazyLoadImage);
      this.renderer.removeClass(img, 'lazy-loading');
      this.renderer.addClass(img, 'lazy-loaded');
    };

    tempImg.onerror = () => {
      console.error(`Failed to load image: ${this.appLazyLoadImage}`);
      this.renderer.removeClass(img, 'lazy-loading');
      this.renderer.addClass(img, 'lazy-error');

      // Try fallback images if available
      if (this.fallbackImages.length > 0 && this.currentFallbackIndex < this.fallbackImages.length) {
        this.tryFallbackImage();
      } else {
        // Final fallback to placeholder
        this.setFinalFallback(img);
      }
    };

    tempImg.src = this.appLazyLoadImage;
  }

  private tryFallbackImage() {
    const fallbackUrl = this.fallbackImages[this.currentFallbackIndex];
    const img = this.el.nativeElement;

    const tempImg = new Image();

    tempImg.onload = () => {
      this.isImageLoaded = true;
      this.renderer.setAttribute(img, 'src', fallbackUrl);
      this.renderer.removeClass(img, 'lazy-loading');
      this.renderer.addClass(img, 'lazy-loaded');
    };

    tempImg.onerror = () => {
      console.error(`Failed to load fallback image: ${fallbackUrl}`);
      this.currentFallbackIndex++;

      if (this.currentFallbackIndex < this.fallbackImages.length) {
        this.tryFallbackImage();
      } else {
        this.setFinalFallback(img);
      }
    };

    tempImg.src = fallbackUrl;
  }

  private setFinalFallback(img: HTMLElement) {
    // Final fallback to placeholder
    if (this.placeholder && this.placeholder !== this.appLazyLoadImage) {
      this.renderer.setAttribute(img, 'src', this.placeholder);
    }
  }

  private loadImageDirectly() {
    // For SSR, load the image directly without lazy loading
    // This ensures the image is available for SEO and initial render
    const img = this.el.nativeElement;

    if (this.ssrFallback) {
      // Set the actual image source directly for SSR
      this.renderer.setAttribute(img, 'src', this.appLazyLoadImage);
      this.renderer.addClass(img, 'lazy-loaded');
    } else {
      // Use placeholder for SSR if fallback is disabled
      this.renderer.setAttribute(img, 'src', this.placeholder);
      this.renderer.addClass(img, 'lazy-loading');
    }

    // Add error handling for SSR
    img.onerror = () => {
      console.error(`Failed to load image during SSR: ${this.appLazyLoadImage}`);
      this.renderer.addClass(img, 'lazy-error');

      if (this.placeholder && this.placeholder !== this.appLazyLoadImage) {
        this.renderer.setAttribute(img, 'src', this.placeholder);
      }
    };
  }

  // Public method to manually trigger image load
  public loadImageNow() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadImage();
    }
  }

  // Public method to check if image is loaded
  public isLoaded(): boolean {
    return this.isImageLoaded;
  }
}
