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
  selector: '[appAutoExactHeightParent]'
})
export class AutoExactHeightParentDirective implements AfterViewInit, OnChanges {
  @Input('appAutoExactHeightParent') subtractValue: number | string | null | undefined = null;
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
    const parent = el.parentElement;
    if (!parent) {
      this.resetHeight();
      return;
    }

    const screenWidth = this.isBrowser ? window.innerWidth : 1024;
    this.additionalHeight = screenWidth < 768 ? 0 : 40;

    const parentHeight = parent.clientHeight;
    const elOffsetTop = el.offsetTop;

    let subtract = Number(this.subtractValue);
    if (isNaN(subtract)) subtract = 0;

    const desiredHeight = parentHeight - elOffsetTop - subtract - this.additionalHeight;

    this.applyHeight(el, desiredHeight <= 0 ? '0' : `${desiredHeight}px`);
    el.style.overflowY = 'auto';
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
  }
}
