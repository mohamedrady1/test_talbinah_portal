import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-talbinah-card',
  standalone: true,
  imports: [TranslateModule, SvgIconComponent,],
  templateUrl: './talbinah-card.component.html',
  styleUrls: ['./talbinah-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TalbinahCardComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }


}

