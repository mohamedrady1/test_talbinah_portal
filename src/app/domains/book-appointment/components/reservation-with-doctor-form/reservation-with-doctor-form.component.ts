import {
  CheckPackagesReservationFacade,
  DoctorDaysFacade,
  DoctorSlotsFacade,
  ICheckPackagesReservationData,
  ICheckPackagesReservationParamsDto,
  INormalPackagesReservationRequestDto,
  IReservationPackageModel,
  NormalPackagesReservationFacade,
} from '../../../appointments';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
  effect,
  signal,
  computed,
  PLATFORM_ID
} from '@angular/core';
import {
  LocalizationService,
  ALL_INPUT_TYPES,
  EmptyStateConfig,
  ModalService,
  StorageKeys
} from '../../../../shared';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  startWith,
  tap
} from 'rxjs';
import { AvailablePackagesSelectionComponent } from '../available-packages-selection';
import { CommunicationsLookupFacade, DurationsLookupFacade } from '../../../lookups';
import { AvailablePackagesStoringComponent } from '../available-packages-storing';
import { IGlobalDoctorContactInfoModel, Logger, StorageService } from '../../../../common';
import { PatientDetailsFormComponent } from '../../../urgent-appointment';
import { DatePickerModule } from 'primeng/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { RoleGuardService } from '../../../authentication';
import { TranslateApiPipe } from '../../../../common/core/translations';

export const DoctorReservationSlotsEmptyState: EmptyStateConfig = {
  imageUrl: null,
  title: 'no_available_time',
  gap: '.5rem'
};
export const DoctorReservationSlotsErrorState: EmptyStateConfig = {
  imageUrl: null,
  title: 'AvailableTimes.AvailableTimesErrorState',
  gap: '.5rem'
};
export const ChooseDateReservationEmptyState: EmptyStateConfig = {
  imageUrl: null,
  title: 'choose_date_first',
  gap: '.5rem'
};

@Component({
  selector: 'app-reservation-with-doctor-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectModule,
    DatePickerModule,
    TranslateApiPipe
  ],
  styleUrls: ['./reservation-with-doctor-form.component.scss'],
  templateUrl: './reservation-with-doctor-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationWithDoctorFormComponent {
  @Input({ required: true }) doctor!: IGlobalDoctorContactInfoModel;

  private readonly _ModalService = inject(ModalService);

  protected readonly fb = inject(FormBuilder);
  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly localizationService = inject(LocalizationService);
  private readonly roleGuardService = inject(RoleGuardService);
  protected readonly durationsLookupFacade = inject(DurationsLookupFacade);
  protected readonly doctorDaysFacade = inject(DoctorDaysFacade);
  protected readonly doctorSlotsFacade = inject(DoctorSlotsFacade);

  protected readonly _CommunicationTypesLookupFacade = inject(CommunicationsLookupFacade);
  readonly CommunicationTypesList = this._CommunicationTypesLookupFacade.Communications;
  readonly isLoadingCommunicationTypes = this._CommunicationTypesLookupFacade.isLoading;
  readonly statusCommunicationTypes = this._CommunicationTypesLookupFacade.status;
  readonly CommunicationTypesListErrorMessage = this._CommunicationTypesLookupFacade.errorMessage;

  protected readonly _NormalPackagesReservationFacade = inject(NormalPackagesReservationFacade);
  protected readonly _CheckPackagesReservationFacade = inject(CheckPackagesReservationFacade);

  protected readonly today: Date = (() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  })();
  protected readonly allInputTypes = ALL_INPUT_TYPES;

  protected readonly ChooseDateEmptyState = ChooseDateReservationEmptyState;
  protected readonly DoctorSlotsEmptyState = DoctorReservationSlotsEmptyState;
  protected readonly DoctorSlotsErrorState = DoctorReservationSlotsErrorState;

  protected currentLang = 'ar';
  protected disabledWeekDays: number[] = [];
  protected selectedFormattedDate: string | null = null;
  protected selectedDayId: number | null = null;

  protected latestReservationPayload: INormalPackagesReservationRequestDto | null = null;

  /** Signal to track if session is free */
  protected readonly isSessionFree = signal<boolean>(false);

  readonly form: FormGroup = this.fb.group({
    duration_id: [null, Validators.required],
    date: [null, Validators.required],
    CommunicationType: [null, Validators.required],
    time_id: [null, Validators.required]
  });

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly platformId = inject(PLATFORM_ID);

  // ----- Login State -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  protected readonly isLoggedIn = computed(() => !!this.token());

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  // Save form data to sessionStorage
  private saveFormDataToSession(): void {
    if (!this.isBrowser) return;

    const formData = {
      duration_id: this.form.get('duration_id')?.value,
      date: this.form.get('date')?.value,
      CommunicationType: this.form.get('CommunicationType')?.value,
      time_id: this.form.get('time_id')?.value,
      selectedFormattedDate: this.selectedFormattedDate,
      selectedDayId: this.selectedDayId,
      doctorId: this.doctor?.id
    };

    try {
      sessionStorage.setItem('reservation_form_data', JSON.stringify(formData));
      Logger.debug('Form data saved to sessionStorage:', formData);
    } catch (error) {
      Logger.error('Error saving form data to sessionStorage:', error);
    }
  }

  // Load form data from sessionStorage
  private loadFormDataFromSession(forceRestore: boolean = false): void {
    if (!this.isBrowser) return;

    try {
      const savedData = sessionStorage.getItem('reservation_form_data');
      if (savedData) {
        const formData = JSON.parse(savedData);

        // Only restore if it's for the same doctor
        if (formData.doctorId === this.doctor?.id) {
          // Check if form already has data to avoid overwriting
          const currentDurationId = this.form.get('duration_id')?.value;
          if (forceRestore || !currentDurationId) {
            this.restoreFormDataAndLoadSlots(formData);
          }
        } else {
          // Clear session data if doctor changed
          sessionStorage.removeItem('reservation_form_data');
        }
      }
    } catch (error) {
      Logger.error('Error loading form data from sessionStorage:', error);
      sessionStorage.removeItem('reservation_form_data');
    }
  }

  // Clear form data from sessionStorage
  private clearFormDataFromSession(): void {
    if (!this.isBrowser) return;
    sessionStorage.removeItem('reservation_form_data');
    Logger.debug('Form data cleared from sessionStorage');
  }

  // Helper method to restore form data and trigger necessary API calls
  private restoreFormDataAndLoadSlots(formData: any): void {
    // Restore date without time to avoid minDate comparison issues
    let restoredDate: Date | null = null;
    if (formData.date) {
      restoredDate = new Date(formData.date);
      restoredDate.setHours(0, 0, 0, 0);
    }

    // Set the basic form values first
    this.form.patchValue({
      duration_id: formData.duration_id,
      date: restoredDate,
      CommunicationType: formData.CommunicationType,
      time_id: formData.time_id
    });

    this.selectedFormattedDate = formData.selectedFormattedDate;
    this.selectedDayId = formData.selectedDayId;

    // If date is selected, trigger date selection logic
    if (formData.date) {
      this.onDateSelect(new Date(formData.date));
    }

    // Force change detection to ensure form values are updated
    this.cdr.detectChanges();

    // If duration and date are available, trigger slots loading
    if (formData.duration_id && formData.date && formData.selectedFormattedDate && formData.selectedDayId) {
      // Use setTimeout to ensure the form values are set before calling slots
      setTimeout(() => {
        this.checkAndCallSlots();
      }, 200);
    }

    Logger.debug('Form data restored and slots loading triggered:', formData);
  }


  constructor() {
    this.setupEffects();
  }

  ngOnInit(): void {
    this.currentLang = this.localizationService.getCurrentLanguage();
    this.doctorSlotsFacade.reset();
    this._CommunicationTypesLookupFacade.fetchCommunications();

    if (this.doctor?.id) {
      this.doctorDaysFacade.load(this.doctor.id);
      this.durationsLookupFacade.fetchDurations(this.doctor.id);
    }

    // Try to load saved form data after a short delay to ensure services are loaded
    setTimeout(() => {
      this.loadFormDataFromSession();

      // If no saved data, set default date (without time)
      if (!this.form.get('date')?.value) {
        const defaultDate = new Date();
        defaultDate.setHours(0, 0, 0, 0);
        this.form.get('date')?.patchValue(defaultDate);
        this.onDateSelect(defaultDate);
      }
    }, 300);
  }

  private setupEffects(): void {
    effect(() => {
      const durations = this.durationsLookupFacade.Durations();
      const status = this.durationsLookupFacade.status();
      const loading = this.durationsLookupFacade.isLoading();

      if (status === true && !loading && durations) {
        // Only reset duration_id if there's no saved data
        const savedData = this.isBrowser ? sessionStorage.getItem('reservation_form_data') : null;
        if (!savedData) {
          this.form.patchValue({ duration_id: null });
        } else {
          // If there's saved data, try to restore it after durations are loaded
          setTimeout(() => {
            this.loadFormDataFromSession(true);
          }, 100);
        }
      }
      this.cdr.detectChanges();
    });

    effect(() => {
      const days = this.doctorDaysFacade.days();
      const status = this.doctorDaysFacade.status();

      if (status === true && days?.length) {
        const active = days.map(day => (day.day_id === 7 ? 0 : day.day_id));
        this.disabledWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(d => !active.includes(d));
      } else if (status === false) {
        this.disabledWeekDays = [0, 1, 2, 3, 4, 5, 6];
        this.doctorDaysFacade.reset();
      }

      this.cdr.detectChanges();
    });

    effect(() => {
      const status = this.doctorSlotsFacade.status();
      const slots = this.doctorSlotsFacade.dataSlots();
      if (status && slots?.length) {
        Logger.debug('Slots loaded:', slots);
        this.cdr.detectChanges();
      }
    });

    effect(() => {
      const status = this._CheckPackagesReservationFacade.status();
      const response: ICheckPackagesReservationData | null = this._CheckPackagesReservationFacade.response();

      if (status) {
        Logger.debug('Response packages is loaded:', response);

        if ((response?.packages?.length ?? 0) > 0 && response?.has_package == 0) {
          this.isSessionFree.set(false);
          this.openAvailablePackagesSelection(response, this.latestReservationPayload);
        } else {
          if (this.latestReservationPayload) {
            if (response?.has_package == 1) {
              Logger.debug('ReservationWithDoctorFormComponent | Session Free Modal');
              this.isSessionFree.set(true);
            } else {
              this.isSessionFree.set(false);
            }
            this.openPatientDetails(this.latestReservationPayload);
          } else {
            Logger.warn('Reservation payload was null when trying to open Patient Details.');
          }
        }
        this._CheckPackagesReservationFacade.reset();
        this.cdr.detectChanges();
      }
    });

    combineLatest([
      this.form.get('duration_id')!.valueChanges.pipe(startWith(this.form.get('duration_id')!.value)),
      this.form.get('date')!.valueChanges.pipe(startWith(this.form.get('date')!.value))
    ]).pipe(
      debounceTime(200),
      distinctUntilChanged(([prevDuration, prevDate], [currDuration, currDate]) => {
        const datesAreEqual = (prevDate instanceof Date && currDate instanceof Date)
          ? prevDate.getTime() === currDate.getTime()
          : prevDate === currDate;
        return prevDuration === currDuration && datesAreEqual;
      }),
      filter(([durationId, date]) => {
        Logger.debug('combineLatest - unfiltered values:', { durationId, date });
        return !!durationId && !!date && !!this.selectedFormattedDate && this.selectedDayId !== null;
      }),
      tap(() => this.checkAndCallSlots())
    ).subscribe();

    // Effect to monitor login status changes and restore form data
    effect(() => {
      const isLoggedIn = this.isLoggedIn();
      Logger.debug('Login status changed:', isLoggedIn);

      if (isLoggedIn) {
        // User just logged in, try to restore form data
        // Use setTimeout to ensure the component is fully initialized
        setTimeout(() => {
          this.loadFormDataFromSession(true);
          this.cdr.detectChanges();
        }, 200);
      }
    });

    // Monitor form changes and save data to session
    this.form.valueChanges.pipe(
      debounceTime(300), // Reduced debounce time for better responsiveness
      distinctUntilChanged()
    ).subscribe(() => {
      // Only save if user is not logged in (to avoid overwriting during restoration)
      if (!this.isLoggedIn()) {
        this.saveFormDataToSession();
      }
    });
  }

  protected checkAndCallSlots(): void {
    const durationId = this.form.get('duration_id')?.value;
    const selectedDate = this.form.get('date')?.value;

    if (durationId && selectedDate && this.selectedFormattedDate && this.selectedDayId && this.doctor?.id) {
      Logger.debug('[ReservationWithDoctorForm] Fetching doctor slots:', {
        doctorId: this.doctor.id,
        date: this.selectedFormattedDate,
        dayId: this.selectedDayId,
        durationId: durationId
      });
      this.doctorSlotsFacade.load(this.doctor.id, this.selectedDayId, durationId, this.selectedFormattedDate);
    }
  }

  protected onDateSelect(date: Date): void {
    if (!date) return;
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    this.selectedFormattedDate = `${year}-${month}-${day}`;
    Logger.debug('ReservationWithDoctorFormComponent => onDateSelect => selectedFormattedDate: ', this.selectedFormattedDate);
    this.selectedDayId = date.getDay() === 0 ? 7 : date.getDay();
  }
  protected convertTimeStringToDate(time: string): Date | null {
    if (!time) return null;
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
  }

  protected onSubmit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      // Save form data before opening login modal
      this.saveFormDataToSession();
      this.roleGuardService.openLoginModal();
      return;
    }

    if (!this.doctor?.id || !this.selectedFormattedDate || !this.selectedDayId) {
      Logger.warn('Missing doctor ID, date, or day ID');
      return;
    }

    const data = this.form.getRawValue();
    Logger.debug('onSubmit => Data Form: ', {
      data: data,
      doctorItem: this.doctor
    });

    this.latestReservationPayload = {
      doctor_id: this.doctor.id,
      day_id: this.selectedDayId,
      date: this.selectedFormattedDate,
      start_time: data.time_id?.start_time ?? '',
      end_time: data.time_id?.end_time ?? '',
      communication_id: data.CommunicationType ?? 0,
      duration_id: data.duration_id ?? 0
    };

    Logger.debug('Submitting reservation (payload stored):', this.latestReservationPayload);

    if (this.latestReservationPayload.doctor_id && this.latestReservationPayload.duration_id) {
      const params: ICheckPackagesReservationParamsDto = {
        doctor_id: this.latestReservationPayload.doctor_id,
        duration_id: this.latestReservationPayload.duration_id
      };
      this._CheckPackagesReservationFacade.check(params);
    }
  }

  private openPatientDetails(payload: INormalPackagesReservationRequestDto | null): void {
    Logger.debug('Open patient details with payload:', payload);
    this._ModalService.open(PatientDetailsFormComponent, {
      inputs: {
        image: 'images/urgent-appointment/calender-2.png',
        title: 'patient_details_modal_title',
        subtitle: 'patient_details_modal_subtitle',
        type: 'normal',
        data: {
          appointmentForm: payload,
          type: 'book-appointment'
        },
        isSessionFree: this.isSessionFree()
      },
      outputs: {
        closed: (data: any): void => {
          Logger.debug('The modal is closed');
        }
      },
      width: '50%',
    });
  }

  private openAvailablePackagesSelection(packagesData: ICheckPackagesReservationData | null, latestReservationPayload?: INormalPackagesReservationRequestDto | null): void {
    Logger.debug('Open openAvailablePackagesSelection');
    this._ModalService.open(AvailablePackagesSelectionComponent, {
      inputs: {
        image: 'images/urgent-appointment/calender-2.png',
        title: 'available_offers',
        subtitle: 'choose_package',
        data: packagesData
      },
      outputs: {
        closed: (data: IReservationPackageModel | null): void => {
          Logger.debug('AvailablePackagesSelection => The modal is closed', data);
          if (data) {
            this.openAvailablePackagesStoring(data);
          } else {
            latestReservationPayload ? this.openPatientDetails(latestReservationPayload) : '';
          }
        }
      },
      width: '40%',
    });
  }
  private openAvailablePackagesStoring(packageData: IReservationPackageModel | null): void {
    Logger.debug('Open openAvailablePackagesStoring');
    this._ModalService.open(AvailablePackagesStoringComponent, {
      inputs: {
        image: 'images/urgent-appointment/calender-2.png',
        title: 'available_packages_storing_title',
        subtitle: 'available_packages_storing_subtitle',
        data: packageData,
        doctor: this.doctor,
        reservationFormData: this.latestReservationPayload,
      },
      outputs: {
        closed: (data: IReservationPackageModel | null): void => {
          Logger.debug('AvailablePackagesStoring => The modal is closed', data);
        }
      },
      width: '40%',
      overflow: true
    });
  }

  protected onReset(): void {
    this.form.reset({
      duration_id: null,
      date: null,
      CommunicationType: null,
      time_id: null
    });

    this.selectedFormattedDate = null;
    this.selectedDayId = null;
    this.latestReservationPayload = null;

    // Clear session data when form is reset
    this.clearFormDataFromSession();

    this.cdr.markForCheck();
  }

  protected getFormControl(name: string): FormControl | null {
    return this.form.get(name) as FormControl;
  }

  protected getError(name: string): Record<string, any> | null {
    const control = this.getFormControl(name);
    return control?.invalid && (control.touched || control.dirty) ? control.errors : null;
  }

  protected getValidationErrorMessage(name: string, validations: any[]): string {
    const control = this.getFormControl(name);
    if (!control?.errors || !validations?.length) return '';

    for (const validation of validations) {
      if (validation.errorName && control.errors[validation.errorName]) {
        return validation.errorMessage;
      }
      if (!validation.errorName && control.errors['required']) {
        return validation.errorMessage;
      }
    }

    return 'form.genericError';
  }
}
