import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { IHeaderConfig } from '../../models';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';

@Component({
  selector: 'app-mental-scale-health-test-header',
  standalone: true,
  imports: [TranslateModule, NgOptimizedImage, LazyLoadImageDirective],
  templateUrl: './mental-scale-health-test-header.component.html',
  styleUrls: ['./mental-scale-health-test-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentalScaleHealthTestHeaderComponent {
  @Input() config!: IHeaderConfig;
  @Output() fullscreenRequested = new EventEmitter<void>();
  @Output() closeRequested = new EventEmitter<void>();

  protected onFullscreenClick() {
    this.fullscreenRequested.emit();
  }

  protected onCloseClick() {
    this.closeRequested.emit();
  }

}
