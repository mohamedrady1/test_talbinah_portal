import { Component, Input, Output, EventEmitter, inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-details-for-mobile',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './details-for-mobile.component.html',
  styleUrls: ['./details-for-mobile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsForMobileComponent {
  @Input() background: string = '';
  @Input() showCloseButton: boolean = true;
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();

  private readonly platformId = inject(PLATFORM_ID);

  isBrowser = isPlatformBrowser(this.platformId);

  onClose(): void {
    this.close.emit();
  }
}
