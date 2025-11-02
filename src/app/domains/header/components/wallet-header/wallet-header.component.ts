import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { WalletData } from '../../../../domains/settings';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-wallet-header',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './wallet-header.component.html',
  styleUrls: ['./wallet-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletHeaderComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input() walletBalance: WalletData | null = null;
}
