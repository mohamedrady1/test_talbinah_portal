import { Component, Input } from '@angular/core';
import { IWelcomeCardConfig } from '../../models';
import { Logger } from '../../../../common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-welcome-to-talbinah-community-card',
  standalone: true,
  imports: [TranslateModule, TranslateApiPipe],
  templateUrl: './welcome-to-talbinah-community-card.component.html',
  styleUrls: ['./welcome-to-talbinah-community-card.component.scss']
})
export class WelcomeToTalbinahCommunityCardComponent {
  @Input() config!: IWelcomeCardConfig; // Use '!' for definite assignment, or provide a default

  ngOnInit(): void {
    // Optional: Add a check to ensure config is provided
    if (!this.config) {
      Logger.error('WelcomeToTalbinahCommunityCardComponent: "config" Input is required.');
      // You might want to provide a default config or handle this gracefully
    }
  }
}
