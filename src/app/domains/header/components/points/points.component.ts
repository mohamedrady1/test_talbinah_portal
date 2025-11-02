import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from '../../../../shared';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-points',
  standalone: true,
  imports: [
    TranslateModule,

    SvgIconComponent
  ],
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointsComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input() points!: number;
}
