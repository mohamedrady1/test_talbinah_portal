import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPreventPaste]',
  standalone: true
})
export class PreventPasteDirective {
  @Input('appPreventPaste') preventPaste: boolean = false;

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    if (this.preventPaste) {
      event.preventDefault();
    }
  }
}
