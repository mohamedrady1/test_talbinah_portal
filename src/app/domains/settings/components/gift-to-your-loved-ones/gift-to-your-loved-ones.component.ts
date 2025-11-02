import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReceivedGiftsListComponent } from '../received-gifts-list';
import { SentGiftsListComponent } from '../sent-gifts-list';
import { SendGiftFormComponent } from '../send-gift-form';
import { AutoExactHeightDirective } from '../../../../common';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-gift-to-your-loved-ones',
  standalone: true,
  imports: [
    CommonModule,
    SendGiftFormComponent,
    SentGiftsListComponent,
    ReceivedGiftsListComponent,
    AutoExactHeightDirective,
    TranslateApiPipe
  ],
  templateUrl: './gift-to-your-loved-ones.component.html',
  styleUrls: ['./gift-to-your-loved-ones.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftToYourLovedOnesComponent {
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly tabs = [
    { key: 'send', label: 'send_gifts' },
    { key: 'sent', label: 'sent_gifts' },
    { key: 'received', label: 'gifts_received' }
  ];
  protected activeTab = 'send';

  protected setActiveTab(tab: string): void {
    if (!this.isBrowser) return;
    this.activeTab = tab;
  }
}
