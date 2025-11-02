import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IHeaderConfig } from './interfaces';
import { LazyLoadImageDirective } from '../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { NgOptimizedImage } from '@angular/common';
import { TranslationsFacade } from '../../../common/core/translations/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule, NgOptimizedImage, LazyLoadImageDirective,
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
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
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
