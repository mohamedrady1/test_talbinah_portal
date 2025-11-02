import { WelcomeToTalbinahCommunityCardComponent } from '../welcome-to-talbinah-community-card';
import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IWelcomeCardConfig } from '../../models';
import { welcomeCardConfig } from '../../configs';

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
}
