import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WalletData } from '../../../../domains/settings';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes/translate-api.pipe';

@Component({
  selector: 'app-wallet-header',
  standalone: true,
  imports: [
    TranslateModule,
    TranslateApiPipe
  ],
  templateUrl: './wallet-header.component.html',
  styleUrls: ['./wallet-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletHeaderComponent {
  @Input() walletBalance: WalletData | null = null;
}
