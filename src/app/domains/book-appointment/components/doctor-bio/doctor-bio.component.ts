import { Component, inject, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DoctorBioConfig } from '../../configs';
import { IGlobalDoctorContactInfoModel } from '../../../../common';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-doctor-bio',
  standalone: true,
  imports: [TranslateModule,],
  templateUrl: './doctor-bio.component.html',
  styleUrls: ['./doctor-bio.component.scss']
})
export class DoctorBioComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }

  @Input() item!: IGlobalDoctorContactInfoModel | null;
}

