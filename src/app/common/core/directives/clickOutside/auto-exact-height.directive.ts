import {
  Directive,
  ElementRef,
  AfterViewInit,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[appAutoExactHeight]'
})
export class AutoExactHeightDirective implements AfterViewInit, OnChanges {

  @Input('appAutoExactHeight') subtractValue: number | string | null | undefined = null;
  @Input() additionalHeight: number = 86;
  @Input() enabled: boolean = true;
  @Input() heightMode: 'height' | 'max-height' = 'height';

  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  ngAfterViewInit(): void {
    if (this.isBrowser && this.enabled) {
      setTimeout(() => this.updateHeight(), 100);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['enabled'] || changes['subtractValue']) && this.isBrowser) {
      this.enabled ? this.updateHeight() : this.resetHeight();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isBrowser && this.enabled) {
      this.updateHeight();
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isBrowser && this.enabled) {
      this.updateHeight();
    }
  }

  private updateHeight(): void {
    if (!this.isBrowser || !this.enabled) return;

    const el = this.el.nativeElement as HTMLElement;

    const screenWidth = window.innerWidth;
    this.additionalHeight = screenWidth < 768 ? 0 : 40;

    const rect = el.getBoundingClientRect();
    const topOffset = rect.top;
    const viewportHeight = window.innerHeight;

    let subtract = Number(this.subtractValue);
    if (isNaN(subtract)) subtract = 0;

    const desiredHeight = viewportHeight - topOffset - subtract - this.additionalHeight;

    this.applyHeight(el, desiredHeight <= 0 ? '0' : `${desiredHeight}px`);
    el.style.overflowY = 'auto';

    if (document?.body) {
      document.body.style.overflowY = document.body.scrollHeight > window.innerHeight ? 'hidden' : '';
    }
  }

  private applyHeight(el: HTMLElement, value: string): void {
    if (this.heightMode === 'max-height') {
      el.style.maxHeight = value;
      el.style.height = '';
    } else {
      el.style.height = value;
      el.style.maxHeight = '';
    }
  }

  private resetHeight(): void {
    const el = this.el.nativeElement as HTMLElement;
    el.style.height = '';
    el.style.maxHeight = '';
    el.style.overflowY = '';

    if (this.isBrowser && document?.body) {
      document.body.style.overflowY = '';
    }
  }
}
