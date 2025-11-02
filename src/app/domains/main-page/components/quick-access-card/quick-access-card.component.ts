import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardLayoutType, IQuickAccessCardConfig } from '../../models';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes/translate-api.pipe';

@Component({
  selector: 'app-quick-access-card',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    LazyLoadImageDirective,
    TranslateApiPipe
  ],
  templateUrl: './quick-access-card.component.html',
  styleUrls: ['./quick-access-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickAccessCardComponent {
  @Input({ required: true }) public config!: IQuickAccessCardConfig;

  public get cardClass(): string {
    return this.config.type === CardLayoutType.COLUMN ? 'card card--column' : 'card';
  }


  public get contentClass(): string {
    // Safely access config.gap using nullish coalescing
    return `card__content ${this.config.gap ?? ''}`.trim();
  }
}
