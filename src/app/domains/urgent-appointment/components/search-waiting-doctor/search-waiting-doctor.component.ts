import { Component, EventEmitter, Output, Input, OnInit, OnDestroy, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CancelEmergencyAppointmentFacade, checkReservationRequestFacade } from '../../services';
import { Logger, useNavigation } from '../../../../common';
import { RecallNewAppointementComponent } from '../recall-new-appointement';
import { DetailsHeaderConfig } from '../../../therapeutic-programs';
import { ICancelEmergencyAppointmentRequestDto } from '../../dtos';
import { AppointmentsRoutesEnum } from '../../../appointments';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../../../shared';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-search-waiting-doctor',
  standalone: true,
  imports: [TranslateModule, CommonModule, TranslateApiPipe],
  templateUrl: './search-waiting-doctor.component.html',
  styleUrls: ['./search-waiting-doctor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchWaitingDoctorComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Output() cancelRequested = new EventEmitter<void>();
  @Output() closed = new EventEmitter<any>();

  private readonly nav = useNavigation();
  private readonly _checkReservationRequestFacade = inject(checkReservationRequestFacade);
  private readonly _cancelEmergencyAppointmentFacade = inject(CancelEmergencyAppointmentFacade);
  private readonly _ModalService = inject(ModalService);
  private readonly _router = inject(Router);

  public isCancelling = signal(false);
  private recallOpened = signal(false);

  private countdownSeconds = signal(0);
  private countdownInterval: any;
  private requestInterval: any;
  // Indicates that the first check request hasn't completed yet
  public isInitialLoading = signal(true);

  private lastHandledReservationId: number | null = null;
  // Track how the modal was closed (true = cancelled, false = closed by X)
  private wasCancelled = false;

  constructor() {
    effect(() => {
      const response = this._checkReservationRequestFacade.checkedEmergencyAppointment();
      const success = this._checkReservationRequestFacade.checkSuccess();
      const error = this._checkReservationRequestFacade.checkError();
      const isLoading = this._checkReservationRequestFacade.isCheckEmergencyAppointment();

      if (!isLoading && (success || error)) {
        // Mark first load as completed once we have a result
        if (this.isInitialLoading()) this.isInitialLoading.set(false);
        if (error) return;

        if (success && response) {
          Logger.debug('[SearchWaitingDoctorComponent] | Response received: ', response);

          if (response.reservation?.id) {
            this._router.navigate([
              AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
              AppointmentsRoutesEnum.APPOINTMENTS_SESSION,
              response.reservation.id
            ]);
            this._ModalService.closeAll();
            this._checkReservationRequestFacade.resetState();
            this._cancelEmergencyAppointmentFacade.resetState();
            this.closed.emit();
            return;
          }

          const remainingTime = response.remaining_time ?? 0;
          this.startCountdown(remainingTime);

          if (remainingTime <= 0) {
            setTimeout(() => this.openRecallAndClose(), 0);
          }
        }
      }
    });

    // Effect for handling cancel
    effect(() => {
      if (this._cancelEmergencyAppointmentFacade.cancelSuccess()) {
        this.isCancelling.set(false);
        this.cancelRequested.emit();
        setTimeout(() => {
          this._ModalService.closeAll();
          this.openRecallAndClose('urgent_search_cancelled');
        }, 0);
      } else if (this._cancelEmergencyAppointmentFacade.cancelError()) {
        this.isCancelling.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.sendCheckRequest();
    this.startCountdown(0);

    // Prevent floating window from opening while this modal is open
    this._checkReservationRequestFacade.setSearchWaitingDoctorOpen(true);
    this._checkReservationRequestFacade._openUrgentAppointmentWindow$.next({
      isOpen: false
    });
  }

  ngOnDestroy(): void {
    Logger.debug('[SearchWaitingDoctorComponent] ngOnDestroy called');

    // Allow floating window to open again
    this._checkReservationRequestFacade.setSearchWaitingDoctorOpen(false);

    // Save remaining_time before resetting state
    const currentResponse = this._checkReservationRequestFacade.checkedEmergencyAppointment();
    const savedRemainingTime = currentResponse?.remaining_time ?? this.data?.item?.remaining_time ?? 0;

    this._checkReservationRequestFacade.resetState();
    this._cancelEmergencyAppointmentFacade.resetState();
    this.lastHandledReservationId = null;
    this.isCancelling.set(false);
    clearInterval(this.countdownInterval);
    clearInterval(this.requestInterval);

    // Only reopen floating window if modal was closed by X (not by cancel) and there's remaining time
    if (!this.wasCancelled && savedRemainingTime > 0) {
      this._checkReservationRequestFacade._openUrgentAppointmentWindow$.next({
        isOpen: true,
        remaining_time: savedRemainingTime
      });
    }

    // Emit closed event when component is destroyed (modal closed manually)
    this.closed.emit();
  }

  private startCountdown(seconds: number) {
    this.countdownSeconds.set(seconds);
    clearInterval(this.countdownInterval);

    this.countdownInterval = setInterval(() => {
      const current = this.countdownSeconds();
      if (current > 0) {
        this.countdownSeconds.set(current - 1);
      }
    }, 1000);
  }

  // private startRequestInterval() {
  //   this.requestInterval = setInterval(() => {
  //     this.sendCheckRequest();
  //   }, 5000); // every 5 seconds
  // }

  private sendCheckRequest() {
    this._checkReservationRequestFacade.checkEmergencyAppointmentReservation({
      before_request: this.data?.before_request ?? false
    });
  }

  public cancelRequest(): void {
    this.wasCancelled = true; // Mark that the modal was closed via cancel
    this.isCancelling.set(true);
    const payload: ICancelEmergencyAppointmentRequestDto = { status: '0' };
    const id = this._checkReservationRequestFacade.checkedEmergencyAppointment()?.id || 0;

    if (!id) {
      this.isCancelling.set(false);
      return;
    }
    this._cancelEmergencyAppointmentFacade.cancelEmergencyAppointment(payload, id);
  }

  private openRecallAndClose(title?: string): void {
    if (this.recallOpened()) return;

    this.recallOpened.set(true);

    this._ModalService.open(RecallNewAppointementComponent, {
      inputs: {
        config: DetailsHeaderConfig,
        title: title,
        data: this.data?.item
      },
      outputs: {
        closed: (response?: any) => {
          this._checkReservationRequestFacade.resetState();
          this._cancelEmergencyAppointmentFacade.resetState();
          this.closed.emit(response);
          this.recallOpened.set(false);
        },
        recallAction: (response: any) => {
          this.closed.emit(response);
        }
      },
      width: '25%',
    });
  }

  public remainingTimeMinutes = computed(() =>
    Math.floor(this.countdownSeconds() / 60)
  );

  public remainingTimeSeconds = computed(() =>
    this.countdownSeconds() % 60
  );

  protected padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
