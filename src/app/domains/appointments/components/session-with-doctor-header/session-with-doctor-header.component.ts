import { Component, EventEmitter, Input, Output, inject, PLATFORM_ID } from '@angular/core';
import { ILayoutGridHeaderConfig } from '../../../../shared';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-session-with-doctor-header',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './session-with-doctor-header.component.html',
  styleUrls: ['./session-with-doctor-header.component.scss']
})
export class SessionWithDoctorHeaderComponent {
  @Input() config!: ILayoutGridHeaderConfig;
  @Output() fullscreenRequested = new EventEmitter<void>();
  @Output() closeRequested = new EventEmitter<void>();
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  protected onFullscreenClick() {
    this.fullscreenRequested.emit();
  }

  protected onCloseClick() {
    this.closeRequested.emit();
    if (this.isBrowser && !this.router.url.includes('')) {
      document.body.style.overflow = 'hidden';
    }

  }
}
