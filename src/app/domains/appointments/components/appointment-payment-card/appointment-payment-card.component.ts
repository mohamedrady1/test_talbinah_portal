import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { IGlobalReservationModel } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-appointment-payment-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TranslateApiPipe
  ],
  templateUrl: './appointment-payment-card.component.html',
  styleUrls: ['./appointment-payment-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentPaymentCardComponent {
  @Input({ required: true }) details!: IGlobalReservationModel;

  readonly _details = signal(this.details);

  public ngOnInit(): void {

  }
}
