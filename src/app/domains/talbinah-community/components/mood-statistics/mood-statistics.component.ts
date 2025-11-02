import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MoodStatisticsConfig } from '../../models';
import { GetMoodSvgComponent } from "../../../../shared/components/get-mood-svg/get-mood-svg.component";
import { moods } from '../../../../common';

@Component({
  selector: 'app-mood-statistics',
  standalone: true,
  imports: [TranslateModule, GetMoodSvgComponent],
  templateUrl: './mood-statistics.component.html',
  styleUrls: ['./mood-statistics.component.scss']
})
export class MoodStatisticsComponent {
  @Input() config !: MoodStatisticsConfig;
  mood = moods;
}
