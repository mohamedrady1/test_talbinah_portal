import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { IMentalHealthScaleListItemDto } from '../../../../domains';
import { LanguageService, Logger } from '../../../../common';
import { CommonModule } from '@angular/common';
import { MentalHealthScaleTestComponent } from '../mental-health-scale-test';
import { ModalService } from '../../../../shared';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';

@Component({
  selector: 'app-depressive-disorder-scale-card',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    NgOptimizedImage,
    LazyLoadImageDirective
  ],
  templateUrl: './depressive-disorder-scale-card.component.html',
  styleUrls: ['./depressive-disorder-scale-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepressiveDisorderScaleCardComponent {
  @Input() item!: IMentalHealthScaleListItemDto;
  @Output() watchDetails = new EventEmitter<IMentalHealthScaleListItemDto>();

  // 💡 Services
  private readonly modalService = inject(ModalService);

  protected readonly _LanguageService = inject(LanguageService);
  protected readonly currentLang = this._LanguageService.getCurrentLanguage();

  watchDetailsAction() {
    this.openTestDetailsModal();
    // this.watchDetails.emit(this.item);
  }

  private openTestDetailsModal(): void {
    Logger.debug('DepressiveDisorderScaleCardComponent => openTestDetailsModal => Item: ', this.item);
    this.modalService.open(MentalHealthScaleTestComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/scale.png',
        title: this.item?.mental_category_name,
        subtitle: this.item.title,
        data: {
          item: this.item,
          isView: true
        }
      },
      outputs: {
        closed: (data: any): void => {
          Logger.debug('MentalHealthScaleComponent => openTestDetailsModal => Modal closed with data:', data);
        }
      },
      width: '60%',
      closeOnBackdropClick: false

      // height: '60%'
    });
  }
}
