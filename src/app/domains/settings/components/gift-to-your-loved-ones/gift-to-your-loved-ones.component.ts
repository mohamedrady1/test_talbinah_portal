import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReceivedGiftsListComponent } from '../received-gifts-list';
import { SentGiftsListComponent } from '../sent-gifts-list';
import { SendGiftFormComponent } from '../send-gift-form';
import { AutoExactHeightDirective } from '../../../../common';

@Component({
  selector: 'app-gift-to-your-loved-ones',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SendGiftFormComponent,
    SentGiftsListComponent,
    ReceivedGiftsListComponent,
    AutoExactHeightDirective
  ],
  templateUrl: './gift-to-your-loved-ones.component.html',
  styleUrls: ['./gift-to-your-loved-ones.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftToYourLovedOnesComponent {
  protected readonly tabs = [
    { key: 'send', label: 'gift.tabs.send' },
    { key: 'sent', label: 'gift.tabs.sent' },
    { key: 'received', label: 'gift.tabs.received' }
  ];
  protected activeTab = 'send';

  protected setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
