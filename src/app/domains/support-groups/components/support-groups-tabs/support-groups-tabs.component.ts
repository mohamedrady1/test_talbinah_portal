import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-support-groups-tabs',
  standalone: true,
  imports: [TranslateModule,],
  templateUrl: './support-groups-tabs.component.html',
  styleUrls: ['./support-groups-tabs.component.scss']
})
export class SupportGroupsTabsComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }


}

