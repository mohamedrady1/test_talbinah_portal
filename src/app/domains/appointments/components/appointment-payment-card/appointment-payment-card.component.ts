import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { IGlobalReservationModel } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-appointment-payment-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './appointment-payment-card.component.html',
  styleUrls: ['./appointment-payment-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentPaymentCardComponent {
  @Input({ required: true }) details!: IGlobalReservationModel;
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  readonly _details = signal(this.details);

  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }

  public ngOnInit(): void {

  }
}
