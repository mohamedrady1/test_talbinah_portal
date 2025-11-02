import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardLayoutType, IQuickAccessCardConfig } from '../../models';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-quick-access-card',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    LazyLoadImageDirective
  ],
  templateUrl: './quick-access-card.component.html',
  styleUrls: ['./quick-access-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickAccessCardComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input({ required: true }) public config!: IQuickAccessCardConfig;

  public get cardClass(): string {
    return this.config.type === CardLayoutType.COLUMN ? 'card card--column' : 'card';
  }


  public get contentClass(): string {
    // Safely access config.gap using nullish coalescing
    return `card__content ${this.config.gap ?? ''}`.trim();
  }
}
