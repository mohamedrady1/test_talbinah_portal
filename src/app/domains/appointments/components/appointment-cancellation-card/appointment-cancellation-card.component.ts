import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { IGlobalReservationModel } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-appointment-cancellation-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './appointment-cancellation-card.component.html',
  styleUrls: ['./appointment-cancellation-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentCancellationCardComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  @Input({ required: true }) details!: IGlobalReservationModel;

  readonly _details = signal(this.details);

  public ngOnInit(): void {

  }
}
