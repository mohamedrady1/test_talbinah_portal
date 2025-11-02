import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { GiftToYourLovedOnesComponent } from '../gift-to-your-loved-ones/gift-to-your-loved-ones.component';
import { ModalService } from '../../../../shared/services/model.service';
import { Logger } from '../../../../common';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-gift-card',
  standalone: true,
  imports: [],
  templateUrl: './gift-card.component.html',
  styleUrls: ['./gift-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCardComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  private readonly _modalService = inject(ModalService);
  protected openGiftToYourLovedOnesModal(): void {
    this._modalService.open(GiftToYourLovedOnesComponent, {
      inputs: {
        image: 'images/settings/modal-icons/gift-loved-ones.png',
        title: 'gift_someone_you_love',
        subtitle: 'quick_gift_intro',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Gift to Your Loved Ones Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%",
      minHeight: "60%"
    });
  }
}

