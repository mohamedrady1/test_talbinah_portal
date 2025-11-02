import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, input, Output, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { headerConfig } from '../../models';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { Router } from '@angular/router';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes/translate-api.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule, NgOptimizedImage, LazyLoadImageDirective,
    TranslateApiPipe
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() config!: headerConfig;
  @Output() fullscreenRequested = new EventEmitter<void>();
  @Output() closeRequested = new EventEmitter<void>();
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  isFullscreen = signal(false);

  protected onFullscreenClick() {
    this.fullscreenRequested.emit();
    this.isFullscreen.update(v => !v);

  }

  protected onCloseClick() {
    this.closeRequested.emit();
    if (this.isBrowser && !this.router.url.includes('')) {
      document.body.style.overflow = 'hidden';
    }
  }
}
