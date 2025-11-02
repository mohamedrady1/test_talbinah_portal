import { WelcomeToTalbinahCommunityCardComponent } from '../welcome-to-talbinah-community-card';
import { Component, Output, EventEmitter, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IWelcomeCardConfig } from '../../models';
import { welcomeCardConfig } from '../../configs';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-welcome-to-talbinah',
  standalone: true,
  imports: [TranslateModule, WelcomeToTalbinahCommunityCardComponent],
  templateUrl: './welcome-to-talbinah.component.html',
  styleUrls: ['./welcome-to-talbinah.component.scss']
})
export class WelcomeToTalbinahComponent {
  @Output() skip = new EventEmitter<void>();
  protected welcomeCardConfigData: IWelcomeCardConfig[] = welcomeCardConfig;
  protected skipStep(): void {
    this.skip.emit();
  }
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
}
