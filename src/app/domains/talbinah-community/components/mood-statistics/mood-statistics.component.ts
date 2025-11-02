import { Component, inject, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MoodStatisticsConfig } from '../../models';
import { GetMoodSvgComponent } from "../../../../shared/components/get-mood-svg/get-mood-svg.component";
import { moods } from '../../../../common';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-mood-statistics',
  standalone: true,
  imports: [TranslateModule, GetMoodSvgComponent,],
  templateUrl: './mood-statistics.component.html',
  styleUrls: ['./mood-statistics.component.scss']
})
export class MoodStatisticsComponent {
  @Input() config !: MoodStatisticsConfig;
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }

  mood = moods;
}
