import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GiftToYourLovedOnesComponent } from '../gift-to-your-loved-ones/gift-to-your-loved-ones.component';
import { ModalService } from '../../../../shared/services/model.service';
import { Logger } from '../../../../common';

@Component({
  selector: 'app-gift-card',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './gift-card.component.html',
  styleUrls: ['./gift-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCardComponent {
  private readonly _modalService = inject(ModalService);
  protected openGiftToYourLovedOnesModal(): void {
    this._modalService.open(GiftToYourLovedOnesComponent, {
      inputs: {
        image: 'images/settings/modal-icons/gift-loved-ones.png',
        title: 'settings.giftLovedOnes.title',
        subtitle: 'settings.giftLovedOnes.subtitle',
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
