import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { IAppointmentCategory, IGlobalReservationModel } from '../../models';
import { APPOINTMENT_CATEGORIES } from '../../constants';
import { LocalizationService } from '../../../../shared';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LanguageService } from '../../../../common';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-appointment-details-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './appointment-details-card.component.html',
  styleUrls: ['./appointment-details-card.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentDetailsCardComponent {
  /** Injected LocalizationService for text translation. */
  private readonly _localizationService = inject(LocalizationService);
  protected readonly languageService = inject(LanguageService);
  protected currentLang: string = 'ar';

  private readonly _datePipe = inject(DatePipe); // Inject DatePipe
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  @Input({ required: true }) details!: IGlobalReservationModel;

  readonly _details = signal(this.details);

  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }

  public ngOnInit(): void {
    this.currentLang = this._localizationService.getCurrentLanguage();
  }

  protected getBadgeClass(status: number, isStart: number, isEnd: number | null): string {
    const category = APPOINTMENT_CATEGORIES.find((cat: IAppointmentCategory) => {
      // Special handling for cancelled status
      if (cat.status === 0 && status === 0) {
        return true;
      }
      // General match for other statuses
      return cat.status === status && cat.is_start === isStart && cat.is_end === isEnd;
    });
    return category?.badge_class ?? 'badge-secondary';
  }
  protected getStatusName(status: number, isStart: number, isEnd: number | null): string {
    const category = APPOINTMENT_CATEGORIES.find((cat: IAppointmentCategory) => {
      if (cat.status === 0 && status === 0) {
        return true;
      }
      return cat.status === status && cat.is_start === isStart && cat.is_end === isEnd;
    });

    let statusName: string = category ? this._localizationService.translateTextFromJson(category.name) : this._localizationService.translateTextFromJson('general.pending');

    if (statusName.startsWith('ال')) {
      statusName = statusName.substring(2);
    }
    return statusName;
  }

  protected getFormattedDate(dateString: string, timeString: string | null = null, format: string): string | null {
    if (!dateString) {
      return null;
    }
    const dateTime = timeString ? `${dateString}T${timeString}` : dateString;
    return this._datePipe.transform(dateTime, format, undefined, this.currentLang);
  }
}
