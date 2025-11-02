import {
  Directive,
  ElementRef,
  Input,
  inject,
  effect,
  Signal,
  signal,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appTruncateText]',
  standalone: true,
})
export class TruncateTextDirective {
  private el = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);

  private _htmlContent = signal<string>('');
  @Input('appTruncateText')
  set htmlContent(value: string) {
    this._htmlContent.set(value);
  }

  private _lines = signal<number>(2);
  @Input()
  set truncateLines(value: number | undefined) {
    this._lines.set(value ?? 2);
  }

  private plainText: Signal<string> = computed(() => {
    const html = this._htmlContent();
    if (!html) return '';
    if (isPlatformBrowser(this.platformId)) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return doc.body.textContent?.trim() ?? '';
    } else {
      // SSR fallback: strip tags with regex (simple but effective)
      return html.replace(/<\/?[^>]+(>|$)/g, '').trim();
    }
  });

  constructor() {
    effect(() => {
      const lines = this._lines();
      const el = this.el.nativeElement;

      // Apply your exact styles here:
      el.style.overflow = 'hidden';
      el.style.color = 'var(--text-300, #47586E)';
      // el.style.textAlign = 'right';
      el.style.textOverflow = 'ellipsis';

      el.style.fontSize = '0.75rem'; // text-xs / Regular
      el.style.fontStyle = 'normal';
      el.style.fontWeight = '400';
      el.style.lineHeight = '1.5';

      el.style.display = '-webkit-box';
      el.style.webkitBoxOrient = 'vertical';
      el.style.webkitLineClamp = String(lines);

      el.style.alignSelf = 'stretch';

      el.textContent = this.plainText();
    });
  }
}
