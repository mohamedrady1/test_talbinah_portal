import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { IGlobalReservationModel } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

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
  @Input({ required: true }) details!: IGlobalReservationModel;

  readonly _details = signal(this.details);

  public ngOnInit(): void {

  }
}
