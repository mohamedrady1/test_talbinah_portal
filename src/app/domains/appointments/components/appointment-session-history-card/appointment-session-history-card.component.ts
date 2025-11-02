import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { IGlobalReservationModel } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Logger } from '../../../../common';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-appointment-session-history-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,

  ],
  templateUrl: './appointment-session-history-card.component.html',
  styleUrls: ['./appointment-session-history-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentSessionHistoryCardComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }

  @Input({ required: true }) details!: IGlobalReservationModel;

  readonly _details = signal(this.details);

  public ngOnInit(): void {
    Logger.debug('AppointmentSessionHistoryCardComponent => Item Details: ', this.details);
    Logger.debug('AppointmentSessionHistoryCardComponent => Item Details History: ', this.details?.time_line);
  }
}

