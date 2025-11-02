import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from '../../../../shared';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes/translate-api.pipe';

@Component({
  selector: 'app-points',
  standalone: true,
  imports: [
    TranslateModule,

    SvgIconComponent,
    TranslateApiPipe
  ],
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointsComponent {
  @Input() points!: number;
}
