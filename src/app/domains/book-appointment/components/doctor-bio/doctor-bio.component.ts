import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DoctorBioConfig } from '../../configs';
import { IGlobalDoctorContactInfoModel } from '../../../../common';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-doctor-bio',
  standalone: true,
  imports: [TranslateModule, TranslateApiPipe],
  templateUrl: './doctor-bio.component.html',
  styleUrls: ['./doctor-bio.component.scss']
})
export class DoctorBioComponent {
  @Input() item!: IGlobalDoctorContactInfoModel | null;
}
