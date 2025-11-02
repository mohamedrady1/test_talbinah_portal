// only-numbers.directive.ts
import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]',
  standalone: true,
})
export class OnlyNumbersDirective {
  @Input('appOnlyNumbers') enabled = true;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) return;

    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if (!this.enabled) return;

    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D+/g, '');
    if (digitsOnly !== input.value) {
      input.value = digitsOnly;
      const newEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(newEvent);
    }
  }
}
