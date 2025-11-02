import { SESSION_WITH_DOCTOR_SEO_CONFIG } from "../configs";
import { LocalizationService } from "../../../shared";
import { MainPageRoutesEnum } from "../../main-page";
import { inject, Injectable } from "@angular/core";
import { MetadataService } from "../../../common";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class SessionWithDoctorFacade {
  private readonly _seo = inject(MetadataService);
  private readonly _localization = inject(LocalizationService);
  private readonly _router = inject(Router);

  setSeoMeta() {
    const meta = SESSION_WITH_DOCTOR_SEO_CONFIG;
    const lang = this._localization.getCurrentLanguage() as keyof typeof meta.title;
    this._seo.setMetaTags({
      title: meta.title[lang],
      description: meta.description[lang],
      ...meta.defaults
    });
  }

  goToHome() {
    this._router.navigate([MainPageRoutesEnum.MAINPAGE]);
  }
}
