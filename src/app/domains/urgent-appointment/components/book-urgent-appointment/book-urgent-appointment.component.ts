import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  Output,
  EventEmitter,
  HostListener,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
  computed
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  CommunicationsLookupFacade,
  DurationsLookupFacade,
  ISpecialityItemDto,
  SpecialitiesLookupFacade
} from '../../../lookups';
import { EmergencySpecialtiesLookupFacade } from '../../services';
import {
  EmptyStateComponent,
  EmptyStateConfig,
  ErrorStateComponent,
  ErrorStateConfig,
  ModalService,
  StorageKeys
} from '../../../../shared';
import {
  checkReservationRequestFacade,
  EmergencyDurationsPriceLookupFacade
} from '../../services';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { SearchWaitingDoctorComponent } from '../search-waiting-doctor';
import { PatientDetailsFormComponent } from '../patient-details-form';
import { IEmergencyDurationsPriceRequestParamsDto } from '../../dtos';
import { AppointmentsRoutesEnum } from '../../../appointments';
import { Logger, StorageService, useNavigation } from '../../../../common';
import { emergencySpecialties } from '../../constants';
import { Router } from '@angular/router';
import { RoleGuardService, UserContextService } from '../../../authentication';
import { TranslationsFacade } from '../../../../common/core/translations/services';

export const ChooseSpecialityEmptyState: EmptyStateConfig = {
  imageUrl: 'images/not-found/UrgentAppointment/specialities.svg',
  title: 'no_specialties_available',
  gap: '.5rem'
};
export const SessionDurationEmptyState: EmptyStateConfig = {
  imageUrl: 'images/not-found/UrgentAppointment/duration.svg',
  title: 'no_durations_available',
  gap: '.5rem'
};
export const problemTypeEmptyState: EmptyStateConfig = {
  imageUrl: 'images/not-found/UrgentAppointment/problems.svg',
  title: 'no_issue_types_available',
  gap: '.5rem'
};
export const SessionTypeEmptyState: EmptyStateConfig = {
  imageUrl: 'images/not-found/UrgentAppointment/communication.svg',
  title: 'no_session_types_available',
  gap: '.5rem'
};

export function getSpecialityError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/UrgentAppointment/specialities-error.svg',
    title: 'error_loading_specialties_try_again',
    gap: '.5rem',
    onRetry
  };
}
export function getSessionDurationError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/UrgentAppointment/duration-error.svg',
    title: 'error_loading_session_durations_try_again',
    gap: '.5rem',
    onRetry
  };
}
export function getProblemTypeEmptyError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/UrgentAppointment/problems-error.svg',
    title: 'error_loading_issue_types_try_again',
    gap: '.5rem',
    onRetry
  };
}
export function getSessionTypeError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/UrgentAppointment/communication-error.svg',
    title: 'error_loading_session_types_try_again',
    gap: '.5rem',
    onRetry
  };
}

@Component({
  selector: 'app-book-urgent-appointment',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    CommonModule,
    AutoExactHeightDirective,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './book-urgent-appointment.component.html',
  styleUrls: ['./book-urgent-appointment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookUrgentAppointmentComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  private readonly nav = useNavigation();
  private readonly _router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(ModalService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly isSubmit = signal(false);
  private readonly initiatedDataFetch = signal(false);
  @Output() closed = new EventEmitter<any>();

  protected readonly _SpecialitiesLookupFacade = inject(SpecialitiesLookupFacade);
  protected readonly _EmergencySpecialtiesLookupFacade = inject(EmergencySpecialtiesLookupFacade);
  protected get emergencySpecialtiesList() {
    return this._EmergencySpecialtiesLookupFacade.response()?.data ?? [];
  }
  readonly specialitiesList = this._SpecialitiesLookupFacade.specialities;
  readonly isLoadingEmergencySpecialties = this._EmergencySpecialtiesLookupFacade.isLoading;
  readonly EmergencySpecialtiesListErrorMessage = this._EmergencySpecialtiesLookupFacade.errorMessage;
  readonly statusSpecialities = this._SpecialitiesLookupFacade.status;
  readonly specialitiesListErrorMessage = this._SpecialitiesLookupFacade.errorMessage;

  protected readonly _EmergencyDurationsPriceLookupFacade = inject(EmergencyDurationsPriceLookupFacade);
  readonly EmergencyDurationsPriceResponse = this._EmergencyDurationsPriceLookupFacade.EmergencyDurationsPrice;
  readonly isLoadingEmergencyDurationsPrice = this._EmergencyDurationsPriceLookupFacade.isLoading;
  readonly statusEmergencyDurationsPrice = this._EmergencyDurationsPriceLookupFacade.status;
  readonly EmergencyDurationsPriceListErrorMessage = this._EmergencyDurationsPriceLookupFacade.errorMessage;

  protected readonly _DurationsLookupFacade = inject(DurationsLookupFacade);
  readonly DurationsList = this._DurationsLookupFacade.Durations;
  readonly isLoadingDurations = this._DurationsLookupFacade.isLoading;
  readonly statusDurations = this._DurationsLookupFacade.status;
  readonly DurationsListErrorMessage = this._DurationsLookupFacade.errorMessage;

  protected readonly _ProblemTypesLookupFacade = inject(DurationsLookupFacade);
  readonly ProblemTypesList = this._ProblemTypesLookupFacade.Durations;
  readonly isLoadingProblemTypes = this._ProblemTypesLookupFacade.isLoading;
  readonly statusProblemTypes = this._ProblemTypesLookupFacade.status;
  readonly ProblemTypesListErrorMessage = this._ProblemTypesLookupFacade.errorMessage;

  protected readonly _CommunicationTypesLookupFacade = inject(CommunicationsLookupFacade);
  readonly CommunicationTypesList = this._CommunicationTypesLookupFacade.Communications;
  readonly isLoadingCommunicationTypes = this._CommunicationTypesLookupFacade.isLoading;
  readonly statusCommunicationTypes = this._CommunicationTypesLookupFacade.status;
  readonly CommunicationTypesListErrorMessage = this._CommunicationTypesLookupFacade.errorMessage;

  chooseSpecialityEmptyState = ChooseSpecialityEmptyState;
  sessionDurationEmptyState = SessionDurationEmptyState;
  problemTypeEmptyState = problemTypeEmptyState;
  sessionTypeEmptyState = SessionTypeEmptyState;

  protected readonly specialityErrorState = getSpecialityError(() => this.onSpecialityChange());
  protected readonly sessionDurationErrorState = getSessionDurationError(() => this.onSpecialityChange());
  protected readonly problemTypeErrorState = getProblemTypeEmptyError(() => this.onSpecialityChange());
  protected readonly sessionTypeErrorState = getSessionTypeError(() => this._CommunicationTypesLookupFacade.fetchCommunications());

  readonly appointmentForm: FormGroup = this.fb.group({
    Speciality: [null, Validators.required],
    Duration: [null, Validators.required],
    ProblemType: [null, Validators.required],
    CommunicationType: [null, Validators.required]
  });

  readonly isLoading = signal(false);
  showFormOnMobile: boolean = true;

  protected readonly _checkReservationRequestFacade = inject(checkReservationRequestFacade);
  readonly isCheckingReservation = this._checkReservationRequestFacade.isCheckEmergencyAppointment;
  readonly checkSuccess = this._checkReservationRequestFacade.checkSuccess;
  readonly checkError = this._checkReservationRequestFacade.checkError;
  readonly checkedEmergencyAppointment = this._checkReservationRequestFacade.checkedEmergencyAppointment;
  readonly before_request = this._checkReservationRequestFacade.before_request;

  // SSR-safe browser check
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _Router = inject(Router);

  // ----- Auth / Guest Computed -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  protected readonly isLoggedIn = computed(() => !!this.token());

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  constructor() {
    if (this.isBrowser) {
      this.checkScreenWidth();
    }

    effect(() => {
      const response = this.checkedEmergencyAppointment();
      const checkSuccess = this.checkSuccess();
      const checkError = this.checkError();

      if (checkSuccess && response) {
        if (response.reservation?.id && this.before_request()) {
          this._router.navigate([
            AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
            AppointmentsRoutesEnum.APPOINTMENTS_SESSION,
            response.reservation.id
          ]);
          this._checkReservationRequestFacade.resetStoreOperationState();
          this._checkReservationRequestFacade.resetState();
          this.closed.emit();
        } else if (!response.reservation && response.remaining_time > 0 && !this.isSubmit()) {
          this.openSearchWaitingDoctor(response);
          this._checkReservationRequestFacade.resetStoreOperationState();
          this._checkReservationRequestFacade.resetState();
          this.closed.emit();
        }
      } else if (checkError) {
        Logger.error('Emergency Appointment error:', checkError);
      }
    });

    // Auto-select first specialty when data arrives (must run in injection context)
    effect(() => {
      const data = this._EmergencySpecialtiesLookupFacade.response()?.data ?? [];
      if (!this.appointmentForm.get('Speciality')?.value && data.length) {
        this.appointmentForm.get('Speciality')?.patchValue(data[0].id);
      }
    });

    // Defer fetching other data until after reservation check completes (regardless of result)
    effect(() => {
      const isChecking = this.isCheckingReservation();
      if (!isChecking && !this.initiatedDataFetch()) {
        this.initiatedDataFetch.set(true);
        this._CommunicationTypesLookupFacade.fetchCommunications();
        this._EmergencySpecialtiesLookupFacade.fetchSpecialties();
      }
    });
  }

  ngOnInit(): void {
    this.refreshLoginStatus();
    if (this.isLoggedIn()) {
      this._checkReservationRequestFacade.checkEmergencyAppointmentReservation({ before_request: true });
    }
    this.appointmentForm.get('Speciality')?.valueChanges.subscribe(() => {
      this.onSpecialityChange();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.isBrowser) {
      this.checkScreenWidth();
    }
  }

  private checkScreenWidth(): void {
    this.showFormOnMobile = this.isBrowser && window.innerWidth >= 1200;
  }

  protected toggleFormVisibility(): void {
    this.showFormOnMobile = !this.showFormOnMobile;
  }

  protected onSpecialityChange(): void {
    if (!this.initiatedDataFetch()) return;

    const selectedSpecialityId = this.appointmentForm.get('Speciality')?.value;
    const selectedSpeciality = this.emergencySpecialtiesList?.find(s => s.id === selectedSpecialityId);

    if (selectedSpeciality?.id) {
      const params: IEmergencyDurationsPriceRequestParamsDto = {
        specialist_id: selectedSpeciality.id
      };
      this._EmergencyDurationsPriceLookupFacade.fetchEmergencyDurationsPrice(params);
    }
  }

  protected onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.refreshLoginStatus();
      if (!this.isLoggedIn()) {
        this._RoleGuardService.openLoginModal();
        return;
      }
      this.openPatientDetails();
      this.isSubmit.set(true);
    } else {
      this.appointmentForm.markAllAsTouched();
    }
  }

  private openPatientDetails(): void {
    this.modalService.open(PatientDetailsFormComponent, {
      inputs: {
        image: 'images/urgent-appointment/calender-2.png',
        title: 'patient_details_modal_title',
        subtitle: 'patient_details_modal_subtitle',
        data: {
          appointmentForm: this.appointmentForm.value
        }
      },
      outputs: {
        closed: () => { }
      },
      width: '50%'
    });
  }

  private openSearchWaitingDoctor(item: any | null): void {
    const dataInput: any = {
      item,
      before_request: true,
      statusLabels: {
        buttonText: 'supportGroups.goToProgramDetails',
        successTitle: 'supportGroups.therapySubscriptionSuccess',
        successSubTitle: 'supportGroups.therapySubscriptionSuccessText',
        errorTitle: 'supportGroups.therapySubscriptionError',
        errorSubTitle: 'supportGroups.therapySubscriptionErrorText'
      }
    };
    this.modalService.open(SearchWaitingDoctorComponent, {
      inputs: {
        image: 'images/urgent-appointment/calender.png',
        title: 'waiting_doctor_modal_title',
        subtitle: 'waiting_doctor_modal_subtitle',
        data: dataInput
      },
      outputs: {
        closed: () => {
          Logger.debug('Search Waiting Doctor modal closed from book-urgent-appointment');
          // Floating window reopening is now handled in SearchWaitingDoctorComponent
        }
      },
      width: '40%'
    });
  }
  ngOnDestroy(): void {
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }
}
