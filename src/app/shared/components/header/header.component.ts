import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IHeaderConfig } from './interfaces';
import { LazyLoadImageDirective } from '../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { TranslateApiPipe } from '../../../common/core/translations/pipes/translate-api.pipe';
import { NgOptimizedImage } from '@angular/common';

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
  @Input() config!: IHeaderConfig;
  @Output() fullscreenRequested = new EventEmitter<void>();
  @Output() closeRequested = new EventEmitter<void>();
  readonly showCloseButton = computed(() => this.config?.showCloseButton ?? true);
  protected onFullscreenClick() {
    this.fullscreenRequested.emit();
  }

  protected onCloseClick() {
    // If onCloseClick function is provided in config, call it first
    if (this.config?.onCloseClick && typeof this.config.onCloseClick === 'function') {
      this.config.onCloseClick();
    }
    // Then emit closeRequested event
    this.closeRequested.emit();
  }
}
