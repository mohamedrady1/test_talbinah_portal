import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DoctorDetailsBoxConfig } from '../../configs';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-doctor-details-box',
  standalone: true,
  imports: [
    TranslateModule,
    TranslateApiPipe
  ],
  templateUrl: './doctor-details-box.component.html',
  styleUrls: ['./doctor-details-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorDetailsBoxComponent {
  @Input({ required: true }) config!: DoctorDetailsBoxConfig;
}
