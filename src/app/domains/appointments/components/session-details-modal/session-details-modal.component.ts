import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { ChangeDetectionStrategy, Component, effect, inject, Input } from '@angular/core';
// import { DoctorCardForDetailsComponent } from '../../../book-appointment';
import { IGlobalReservationModel } from '../../models';
import { Logger } from '../../../../common';
import { AppointmentPaymentCardComponent } from '../appointment-payment-card';
import { AppointmentCancellationCardComponent } from '../appointment-cancellation-card';
import { AppointmentSessionHistoryCardComponent } from '../appointment-session-history-card';
import { ReservationDetailsFacade } from '../../services';
// import { TherapeuticProgramCardShimmerComponent } from '../../../therapeutic-programs';
import { AppointmentDetailsCardComponent } from '../appointment-details-card';
import { SessionDetailsSkeletonComponent } from '../session-details-skeleton';
import { DoctorCardForDetailsComponent } from '../../../../shared';
import { AppointmentCardSkeletonComponent } from '../appointment-card-skeleton';
import { ErrorStateCardComponent } from '../../../../shared/components/error-state-card';
import { GetReservationDetails } from '../../configs/error-state.config';


@Component({
  selector: 'app-session-details-modal',
  standalone: true,
  imports: [
    // DoctorCardForDetailsComponent,
    AutoExactHeightDirective,
    DoctorCardForDetailsComponent,
    AppointmentDetailsCardComponent,
    AppointmentPaymentCardComponent,
    AppointmentCancellationCardComponent,
    AppointmentSessionHistoryCardComponent,
    SessionDetailsSkeletonComponent,
    AppointmentCardSkeletonComponent,
    ErrorStateCardComponent
  ],
  templateUrl: './session-details-modal.component.html',
  styleUrls: ['./session-details-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionDetailsModalComponent {

  @Input({ required: true }) item!: IGlobalReservationModel;
  @Input({ required: true }) type!: string;
  // <--- UPDATED INJECTION AND SIGNAL NAMES
  private readonly _reservationDetailsFacade = inject(ReservationDetailsFacade);

  readonly currentReservation = this._reservationDetailsFacade.currentReservation;
  readonly isLoadingReservation = this._reservationDetailsFacade.isLoadingReservation;
  readonly reservationFetchStatus = this._reservationDetailsFacade.reservationFetchStatus;
  readonly reservationFetchErrorMessage = this._reservationDetailsFacade.reservationFetchErrorMessage;
  readonly reservationDetailsErrorState = GetReservationDetails(() => this._reservationDetailsFacade.fetchReservationDetails(this.item?.id));
  constructor() {

    // Effect to react when reservationId is available and trigger chat fetch
    effect(() => {
      const id = this.item?.id;
      if (id) {
        Logger.debug(`[Session Details Popup] Reservation ID: ${id}`);
      }
    });


    effect(() => {
      const reservation = this.currentReservation(); // Read the signal
      if (reservation) {
        Logger.debug('[Session Details Popup] Full reservation data loaded:', reservation);
      } else if (this.reservationFetchStatus() === false && this.reservationFetchErrorMessage()) {
        Logger.error('[Session Details Popup] Failed to load reservation:', this.reservationFetchErrorMessage());
        this.reservationDetailsErrorState.title = this.reservationFetchErrorMessage() || '';
      }
    });
  }

  ngOnInit(): void {
    Logger.debug('SessionDetailsModalComponent => Item: ', this.item);
    const id = this.item?.id || this.item?.itemId;
    if (id) {
      this._reservationDetailsFacade.fetchReservationDetails(id);
    }
  }
}
