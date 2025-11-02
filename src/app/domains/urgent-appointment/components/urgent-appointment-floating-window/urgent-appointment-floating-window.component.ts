import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  effect,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SvgIconComponent, ModalService } from '../../../../shared';
import {
  Logger,
} from '../../../../common';
import { TranslateModule } from '@ngx-translate/core';
import { checkReservationRequestFacade, CancelEmergencyAppointmentFacade } from '../../services';
import { SearchWaitingDoctorComponent } from '../search-waiting-doctor';
import { RecallNewAppointementComponent } from '../recall-new-appointement';
import { DetailsHeaderConfig } from '../../../therapeutic-programs';
import { ICancelEmergencyAppointmentRequestDto } from '../../dtos';
import { AppointmentsRoutesEnum } from '../../../appointments';

@Component({
  selector: 'app-urgent-appointment-floating-window',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, TranslateModule],
  templateUrl: './urgent-appointment-floating-window.component.html',
  styleUrls: ['./urgent-appointment-floating-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrgentAppointmentFloatingWindowComponent implements OnInit, OnDestroy {
  // ====== Injection ======
  private readonly _checkReservationRequestFacade = inject(checkReservationRequestFacade);
  private readonly _cancelEmergencyAppointmentFacade = inject(CancelEmergencyAppointmentFacade);
  private readonly _modalService = inject(ModalService);
  private readonly _router = inject(Router);

  // ====== Signals ======
  protected countdownSeconds = signal(0);
  private countdownInterval: any;
  private requestInterval: any;
  private isCancelling = signal(false);
  private searchWaitingDoctorOpened = signal(false);

  // ====== Computed Properties ======
  protected readonly remainingTimeMinutes = computed(() =>
    Math.floor(this.countdownSeconds() / 60)
  );

  protected readonly remainingTimeSeconds = computed(() =>
    this.countdownSeconds() % 60
  );

  constructor() {
    // Effect for handling check response
    effect(() => {
      const response = this._checkReservationRequestFacade.checkedEmergencyAppointment();
      const success = this._checkReservationRequestFacade.checkSuccess();
      const error = this._checkReservationRequestFacade.checkError();

      if (success && response) {
        Logger.debug('[UrgentAppointmentFloatingWindowComponent] | Response received: ', response);

        if (response.reservation?.id) {
          this._router.navigate([
            AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
            AppointmentsRoutesEnum.APPOINTMENTS_SESSION,
            response.reservation.id
          ]);
          this._modalService.closeAll();
          this._checkReservationRequestFacade.resetState();
          this._cancelEmergencyAppointmentFacade.resetState();
          this.closeWindow();
          return;
        }

        const remainingTime = response.remaining_time ?? 0;
        this.startCountdown(remainingTime);

        if (remainingTime <= 0) {
          // Time expired, cancel and open recall
          setTimeout(() => this.cancelAndOpenRecall(), 0);
        }
      }
    });

    // Effect for handling window state changes (when reopening from modal close)
    effect(() => {
      const windowState = this._checkReservationRequestFacade._openUrgentAppointmentWindow$.value;
      if (windowState?.isOpen && windowState?.remaining_time && windowState.remaining_time > 0) {
        Logger.debug('[UrgentAppointmentFloatingWindowComponent] | Reopening window with remaining time:', windowState.remaining_time);
        this.startCountdown(windowState.remaining_time);
      } else if (windowState?.isOpen === false) {
        Logger.debug('[UrgentAppointmentFloatingWindowComponent] | Window closed, stopping countdown');
        this.stopCountdown();
      }
    });

    // Effect for handling cancel
    effect(() => {
      if (this._cancelEmergencyAppointmentFacade.cancelSuccess()) {
        this.isCancelling.set(false);
        setTimeout(() => {
          this.closeWindow();
          this.openRecallAndClose('urgent_search_cancelled');
        }, 0);
      } else if (this._cancelEmergencyAppointmentFacade.cancelError()) {
        this.isCancelling.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.sendCheckRequest();
  }

  ngOnDestroy(): void {
    this._checkReservationRequestFacade.resetState();
    this._cancelEmergencyAppointmentFacade.resetState();
    this.isCancelling.set(false);
    this.searchWaitingDoctorOpened.set(false);
    clearInterval(this.countdownInterval);
    clearInterval(this.requestInterval);
  }

  private startCountdown(seconds: number): void {
    this.countdownSeconds.set(seconds);
    clearInterval(this.countdownInterval);

    this.countdownInterval = setInterval(() => {
      const current = this.countdownSeconds();
      if (current > 0) {
        this.countdownSeconds.set(current - 1);
      } else {
        // Time expired, cancel and open recall
        this.cancelAndOpenRecall();
      }
    }, 1000);
  }

  private stopCountdown(): void {
    clearInterval(this.countdownInterval);
    this.countdownInterval = undefined;
  }

  private sendCheckRequest(): void {
    this._checkReservationRequestFacade.checkEmergencyAppointmentReservation({
      before_request: false
    });
  }

  private cancelAndOpenRecall(): void {
    this.isCancelling.set(true);
    const payload: ICancelEmergencyAppointmentRequestDto = { status: '0' };
    const id = this._checkReservationRequestFacade.checkedEmergencyAppointment()?.id || 0;

    if (!id) {
      this.isCancelling.set(false);
      this.closeWindow();
      this.openRecallAndClose('urgent_search_time_ended');
      return;
    }
    this._cancelEmergencyAppointmentFacade.cancelEmergencyAppointment(payload, id);
  }

  private openSearchWaitingDoctor(): void {
    this.searchWaitingDoctorOpened.set(true);

    this._modalService.open(SearchWaitingDoctorComponent, {
      inputs: {
        image: 'images/urgent-appointment/calender.png',
        title: 'waiting_doctor_modal_title',
        subtitle: 'waiting_doctor_modal_subtitle',
        data: { before_request: false }
      },
      outputs: {
        closed: () => {
          Logger.debug('Search Waiting Doctor modal closed.');
        }
      },
      width: '40%'
    });
  }

  private openRecallAndClose(title?: string): void {
    this._modalService.open(RecallNewAppointementComponent, {
      inputs: {
        config: DetailsHeaderConfig,
        title: 'urgent_search_time_ended', // Default title for cancelled search
        data: null // No specific data needed for cancelled search
      },
      outputs: {
        closed: (response?: any) => {
          Logger.debug('Recall modal closed from floating window.');
        },
        recallAction: (response: any) => {
          Logger.debug('Recall action triggered from floating window.');
        }
      },
      width: '25%',
    });
  }

  protected closeWindow(): void {
    Logger.debug('Urgent Appointment Floating Window closed.');
    this._checkReservationRequestFacade._openUrgentAppointmentWindow$.next({ isOpen: false });
  }

  protected onButtonClick(): void {
    // Don't open if already opened
    if (this.searchWaitingDoctorOpened()) {
      return;
    }

    this.closeWindow();
    this.openSearchWaitingDoctor();
  }

  protected padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
