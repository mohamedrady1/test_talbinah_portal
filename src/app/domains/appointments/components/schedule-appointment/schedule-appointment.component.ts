import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, effect, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SelectModule } from 'primeng/select';

// Assuming these are defined in your shared module
import { ALL_INPUT_TYPES, EmptyStateCardComponent, EmptyStateConfig, ErrorStateCardComponent, IFormInputConfig, LocalizationService } from '../../../../shared';
import { CancelReservationFacade, DoctorDaysFacade, DoctorSlotsFacade, ReservationReasonsSchedulingFacade, ScheduleReservationFacade } from '../../services';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { LanguageService, Logger } from '../../../../common';
import { ScheduleAppoitmentFormConfig } from '../../configs';
import { IScheduleReservationRequestDto } from '../../dtos';
import { DurationsLookupFacade } from '../../../lookups';
import { IGlobalReservationModel } from '../../models';
import { DatePickerModule } from 'primeng/datepicker';
import { extractDayIdFromDateString } from '../../../payments';
import { PrimeSelectFilterFocusDirective } from '../../../../common/core/directives/prime-select-filter-focus.directive';
import { TranslateApiPipe } from '../../../../common/core/translations';

// Import the new utility function

export const DoctorSlotsEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/appointments.svg',
  title: 'AvailableTimes.NoAvailableTimes',
  gap: '.5rem'
};
export const DoctorSlotsErrorState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/appointments.svg',
  title: 'AvailableTimes.AvailableTimesErrorState',
  gap: '.5rem'
};
export const ChooseDateEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/appointments.svg',
  title: 'AvailableTimes.ChooseDateFirst',
};

@Component({
  selector: 'app-schedule-appointment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePickerModule,
    TranslateModule,
    CommonModule,
    SelectModule,
    FormsModule,
    AutoExactHeightDirective,
    EmptyStateCardComponent,
    ErrorStateCardComponent,
    PrimeSelectFilterFocusDirective,
    TranslateApiPipe
  ],
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleAppointmentComponent {
  // Initialize with an empty array. It will be populated dynamically.
  protected disabledWeekDays: number[] = [];

  /** Injected LocalizationService for text translation. */
  private readonly _localizationService = inject(LocalizationService);
  protected readonly languageService = inject(LanguageService);
  private readonly _datePipe = inject(DatePipe); // Inject DatePipe
  /** Holds the current language string, initialized in ngOnInit. */
  protected currentLang: string = 'ar';

  private readonly fb: FormBuilder = inject(FormBuilder);
  protected readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  protected today: Date = new Date();

  @Input() public item?: IGlobalReservationModel; // This should contain doctor.id

  @Output() public closed: EventEmitter<{ status?: boolean } | null> = new EventEmitter<{ status?: boolean } | null>();

  public readonly cancelFacade = inject(CancelReservationFacade);

  protected readonly reasonsFacade = inject(ReservationReasonsSchedulingFacade);

  // Config and constants
  protected readonly formConfig: IFormInputConfig[] = ScheduleAppoitmentFormConfig;
  protected readonly allInputTypes: typeof ALL_INPUT_TYPES = ALL_INPUT_TYPES;

  // Durations Lookup Facade (for available times)
  protected readonly TimesLookupFacade = inject(DurationsLookupFacade);
  readonly TimesList = this.TimesLookupFacade.Durations; // This is actually 'Durations' in the Facade
  readonly isLoadingTimes = this.TimesLookupFacade.isLoading;
  readonly statusTimes = this.TimesLookupFacade.status;
  readonly TimesListErrorMessage = this.TimesLookupFacade.errorMessage;

  // Doctor Days Facade
  protected readonly doctorDaysFacade = inject(DoctorDaysFacade);
  readonly doctorDays = this.doctorDaysFacade.days;
  readonly isLoadingDoctorDays = this.doctorDaysFacade.isLoading;
  readonly DoctorDaysStatus = this.doctorDaysFacade.status;
  readonly doctorDaysError = this.doctorDaysFacade.error;

  ChooseDateEmptyState = ChooseDateEmptyState;
  DoctorSlotsEmptyState = DoctorSlotsEmptyState;
  DoctorSlotsErrorState = DoctorSlotsErrorState;

  // Doctor Days Facade
  protected readonly doctorSlotsFacade = inject(DoctorSlotsFacade);

  // Schedule Facade
  protected readonly _ScheduleReservationFacade = inject(ScheduleReservationFacade);

  // Form state
  public readonly form: FormGroup = this.fb.group({
    reason: [null, Validators.required],
    reasonDetails: [null, Validators.required],
    date: [null, Validators.required],
    time_id: [null, Validators.required]
  });

  protected selectedFormattedDate: string | null = null;
  protected selectedDayId: number | null = null; // Will store day_id: 1=Saturday, 2=Sunday, ..., 7=Friday

  protected showNextStep = signal(false);

  constructor() {
    // Effect for reasons
    effect(() => {
      const reasons = this.reasonsFacade.reasons();
      // Dynamically update the SELECT input options for 'reason'
      if (reasons.length > 0) {
        const selectField = this.formConfig.find(f => f.name === 'reason');
        if (selectField) {
          selectField.listValues = reasons.map(reason => ({
            value: String(reason.id),
            label: reason.reason
          }));
        }
        this.cdr.detectChanges(); // Trigger change detection if needed for dynamically updated form config
      }
    });

    // Effect to react to DoctorDaysFacade status and update disabledWeekDays
    // This logic correctly maps your backend's active days (e.g., Monday=1, Sunday=7)
    // to JavaScript's Date.getDay() (Sunday=0, Monday=1, etc.) for PrimeNG's calendar component.
    // This part should NOT change based on the new day_id mapping for the payload.
    effect(() => {
      const doctorDaysData = this.doctorDays(); // Get the current value of the signal
      const doctorDaysStatus = this.DoctorDaysStatus();

      if (doctorDaysStatus === true && doctorDaysData && doctorDaysData.length > 0) {
        Logger.debug('Doctor Days Facade successful, processing doctor days:', doctorDaysData);
        // Map backend day_id (e.g., 1=Monday, ..., 7=Sunday) to JavaScript's Date.getDay() (0=Sunday, 1=Monday, etc.)
        const activeDoctorWeekDays = doctorDaysData.map(day => {
          return day.day_id === 7 ? 0 : day.day_id;
        });

        const allDaysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // All days from Sunday to Saturday (JS getDay() format)

        this.disabledWeekDays = allDaysOfWeek.filter(day => !activeDoctorWeekDays.includes(day));

        this.cdr.detectChanges(); // Trigger change detection to update the datepicker
      } else if (doctorDaysStatus === false) {
        Logger.warn('Doctor Days Facade failed or returned empty, resetting doctor days and disabling all days.');
        this.doctorDaysFacade.reset();
        this.disabledWeekDays = [0, 1, 2, 3, 4, 5, 6]; // Disable all days
        this.cdr.detectChanges();
      }
    });

    // Effect to react to DoctorSlotsFacade status and update disabledWeekDays
    effect(() => {
      const doctorSlotsData = this.doctorSlotsFacade.dataSlots();
      const doctorSlotsStatus = this.doctorSlotsFacade.status();

      if (doctorSlotsStatus === true && doctorSlotsData) {
        Logger.debug('Doctor Slots Facade successful, processing doctor slots:', doctorSlotsData);

        this.cdr.detectChanges(); // Trigger change detection to update the datepicker
      } else if (doctorSlotsStatus === false) {
        Logger.warn('Doctor Slots Facade failed or returned empty, resetting doctor slots and disabling all slots.');
      }
    });

    // Effect for Schedule Reservation
    effect(() => {
      const status = this._ScheduleReservationFacade.scheduleSuccess();
      // Dynamically update the SELECT input options for 'reason'
      if (status) {
        this.onCancel();
        this.cdr.detectChanges(); // Trigger change detection if needed for dynamically updated form config
      }
    });

  }

  public ngOnInit(): void {
    this.currentLang = this._localizationService.getCurrentLanguage();

    this.doctorSlotsFacade.reset();
    this.TimesLookupFacade.fetchDurations();
    Logger.debug('ScheduleAppointmentComponent initialized with data final screen:', {
      item: this.item
    });
    this.reasonsFacade.loadReasons();

    if (this.item?.doctor?.id) {
      this.doctorDaysFacade.load(this.item.doctor.id);
    }
  }

  protected onDateSelect(event: any): void {
    const selectedDate: Date = event;

    if (!selectedDate) {
      this.selectedFormattedDate = null;
      this.selectedDayId = null;
      this.form.controls['time_id'].reset(); // Clear time selection
      this.doctorSlotsFacade.reset(); // Reset slots display
      return;
    }

    // Format the date to YYYY-MM-DD without timezone
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // *** USE THE EXTRACTED FUNCTION HERE ***
    this.selectedDayId = extractDayIdFromDateString(formattedDate);

    Logger.debug('Selected Date (YYYY-MM-DD):', formattedDate);
    // Log the converted dayId based on your new mapping (1=Saturday, 2=Sunday, ..., 7=Friday)
    Logger.debug('Selected Day ID (1=Saturday, 2=Sunday, ..., 7=Friday):', this.selectedDayId);

    // 🔐 Save for use in onSubmit
    this.selectedFormattedDate = formattedDate;

    if (this.item?.doctor?.id && this.item?.duration?.id && this.selectedDayId !== null && formattedDate) {
      Logger.debug('Calling doctorSlotsFacade.load with:', {
        doctorId: this.item.doctor.id,
        durationId: this.item.duration.id,
        dayId: this.selectedDayId,
        date: formattedDate
      });
      // Note: You must ensure your doctorSlotsFacade.load expects the new day_id format (1=Saturday, ..., 7=Friday)
      this.doctorSlotsFacade.load(this.item.doctor.id, this.selectedDayId, this.item.duration.id, formattedDate);
    } else {
      Logger.warn('Cannot load doctor slots: missing required parameters.', {
        doctorId: this.item?.doctor?.id,
        durationId: this.item?.duration?.id,
        dayId: this.selectedDayId, // Will be null if extraction failed
        date: formattedDate
      });
      this.doctorSlotsFacade.reset(); // Reset slots if parameters are invalid
    }
  }

  protected getFormattedDate(dateString: string | null | undefined, timeString: string | null = null, format: string): string | null {
    let finalDateTime: string | Date | null = null;

    if (dateString) {
      // If dateString is explicitly provided, use it
      finalDateTime = timeString ? `${dateString}T${timeString}` : dateString;
    } else if (timeString) {
      // If dateString is missing but timeString is provided, use today's date
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
      const day = today.getDate().toString().padStart(2, '0');
      finalDateTime = `${year}-${month}-${day}T${timeString}`;
      Logger.warn(`getFormattedDate: Date string missing. Using current date (${year}-${month}-${day}) with provided time: ${timeString}`);
    } else {
      // Neither dateString nor timeString provided
      Logger.warn('getFormattedDate: Neither dateString nor timeString provided. Returning null.');
      return null;
    }

    // Ensure finalDateTime is not null before attempting to transform
    if (finalDateTime) {
      try {
        // Use the DatePipe to transform the combined string or Date object
        return this._datePipe.transform(finalDateTime, format, undefined, this.currentLang);
      } catch (e) {
        Logger.error('getFormattedDate: Error transforming date with DatePipe', e, finalDateTime, format, this.currentLang);
        return null;
      }
    }
    return null;
  }

  public getFormControl(name: string): FormControl | null {
    return this.form.get(name) as FormControl | null; // Explicitly cast to FormControl | null
  }

  public getValidationErrorMessage(controlName: string, validations: any[]): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors || !validations?.length) return '';

    const errorKeys = Object.keys(control.errors);
    for (const validation of validations) {
      if (validation.errorName && errorKeys.includes(validation.errorName)) {
        return validation.errorMessage;
      }

      // Handle required validator (which often lacks `errorName`)
      if (!validation.errorName && control.errors['required']) {
        return validation.errorMessage;
      }
    }

    return 'form.genericError'; // fallback
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.getRawValue();

      if (!this.item?.doctor?.id || !this.item?.duration?.id) {
        Logger.error('Doctor or duration data is missing.');
        return;
      }

      if (this.selectedDayId === null || !this.selectedFormattedDate) { // Check for null explicitly
        Logger.warn('Selected date or day ID missing. Ensure a date was chosen.');
        return;
      }

      const payload: IScheduleReservationRequestDto = {
        doctor_id: this.item.doctor.id,
        day_id: this.selectedDayId, // This now uses your new 1=Saturday, 7=Friday mapping
        start_time: formData?.time_id?.start_time,
        end_time: formData?.time_id?.end_time,
        date: this.selectedFormattedDate,
        time_id: 0, // replace with real ID if needed
        duration_id: this.item.duration.id,
        reason: formData?.reasonDetails,
        reason_id: formData?.reason
      };

      Logger.debug('ScheduleAppointmentComponent => Final Payload:', payload);

      // TODO: Call actual API facade
      this._ScheduleReservationFacade.scheduleReservation(this.item.id, payload);
    } else {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
    }
  }

  protected onCancel(): void {
    this.closed.emit(null);
  }

  protected onPreviousStep(): void {
    this.showNextStep.set(false);
    this.cdr.markForCheck();
  }

  private validateStep1(): boolean {
    const requiredFields = ['reason', 'reasonDetails'];
    let allValid = true;

    requiredFields.forEach(field => {
      const control = this.form.get(field);
      if (control?.invalid) {
        control.markAsTouched();
        allValid = false;
      }
    });

    this.cdr.detectChanges();
    return allValid;
  }
  protected onNextStep(): void {
    if (this.validateStep1()) {
      this.showNextStep.set(true);
      this.cdr.markForCheck();
    }
  }

  public getError(name: string): Record<string, any> | null {
    const control: FormControl | null = this.getFormControl(name);
    return control?.invalid && (control?.touched || control?.dirty) ? control.errors : null;
  }
}
