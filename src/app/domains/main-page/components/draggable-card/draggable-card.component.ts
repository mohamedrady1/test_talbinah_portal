import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { IQuickAccessCardConfig } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Logger } from '../../../../common';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-draggable-card',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    LazyLoadImageDirective
  ],
  templateUrl: './draggable-card.component.html',
  styleUrls: ['./draggable-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableCardComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input({ required: true }) public config!: IQuickAccessCardConfig;

  @Input() public enableAllowUnPinning = signal<boolean>(true);
  @Input() public allowPinning = signal<boolean>(true);


  @Output() public pinCard = new EventEmitter<IQuickAccessCardConfig>();
  @Output() public unpinCard = new EventEmitter<IQuickAccessCardConfig>();

  public generateElementId(suffix: string): string {
    return `card-${this.config?.id || 'unknown'}-${suffix}`;
  }

  public onUnpinClick(): void {
    this.unpinCard.emit(this.config);
  }

  public onPinClick(): void {
    if (this.allowPinning()) {
      this.pinCard.emit(this.config);
    } else {
      Logger.debug(`Pinning for card ${this.config.title} is currently disabled.`);
    }
  }
}
