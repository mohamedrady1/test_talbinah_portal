import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { DoctorDetailsBoxConfig } from '../../configs';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-doctor-details-box',
  standalone: true,
  imports: [
    TranslateModule,

  ],
  templateUrl: './doctor-details-box.component.html',
  styleUrls: ['./doctor-details-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorDetailsBoxComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }

  @Input({ required: true }) config!: DoctorDetailsBoxConfig;
}

