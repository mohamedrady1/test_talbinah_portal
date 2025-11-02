import { DatepickerComponent } from './../../../../common/shared/components/datepicker/datepicker.component';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  effect,
  inject,
  input,
  signal,
  computed
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DoctorDaysFacade, DoctorSlotsFacade, NormalPackagesReservationFacade } from '../../../appointments';
import { IGlobalDoctorContactInfoModel } from '../../../../common';
import { ALL_INPUT_TYPES, LocalizationService } from '../../../../shared';
import { extractDayIdFromDateString } from '../../../payments';
import { TranslationsFacade } from '../../../../common/core/translations/services';


export interface IReservationStepData {
  date: string | Date;
  time_id: {
    id?: number;
    start_time: string;
    end_time: string;
    [key: string]: any;
  };
}

@Component({
  selector: 'app-reservation-package-item-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    DatepickerComponent,
    
  ],
  templateUrl: './reservation-package-item-form.component.html',
  styleUrls: ['./reservation-package-item-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class ReservationPackageItemFormComponent implements OnInit {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  // Inputs
  public doctor = input.required<IGlobalDoctorContactInfoModel>();
  public durationId = input.required<number>();
  public reservationFormData = input.required<any>();
  public currentStepData = input<IReservationStepData | null | undefined>();
  public key = input<any>();

  /** if true (only step 1), user cannot change date or time */
  public readonlyInitial = input<boolean>(false);

  /** previously used times (from ALL earlier steps) => disable reuse */
  public previouslyUsedTimes = input<Array<{ date: string; start_time: string; end_time: string }>>([]);

  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly localizationService = inject(LocalizationService);
  private readonly datePipe = inject(DatePipe);

  protected readonly doctorDaysFacade = inject(DoctorDaysFacade);
  protected readonly doctorSlotsFacade = inject(DoctorSlotsFacade);
  protected readonly _NormalPackagesReservationFacade = inject(NormalPackagesReservationFacade);

  protected readonly today = new Date();
  protected readonly allInputTypes = ALL_INPUT_TYPES;

  protected currentLang = 'ar';
  protected disabledWeekDays = signal<number[]>([]);
  protected selectedFormattedDate = signal<string | null>(null);
  protected selectedDayId = signal<number | null>(null);

  /** Mirror for picker value (signals to keep UI in sync on patches) */
  protected pickerValue = signal<Date | null>(null);

  private lastProcessedKey: any = undefined;

  public readonly formPackage: FormGroup = this.fb.group({
    date: [null, Validators.required],
    time_id: [null, Validators.required],
  });

  /** quick lookup structure for disabling reused times on the **selected** date */
  protected disabledTimeKeysForSelectedDate = computed<Set<string>>(() => {
    const dateISO = this.selectedFormattedDate();
    if (!dateISO) return new Set();
    const list = this.previouslyUsedTimes() || [];
    const matches = list.filter(x => this.ensureISO(x.date) === dateISO);
    return new Set(matches.map(x => `${x.start_time}-${x.end_time}`));
  });

  constructor() {
    this.currentLang = this.localizationService.getCurrentLanguage();

    // Load doctor days
    effect(() => {
      const doctorId = this.doctor().id;
      if (doctorId) {
        this.doctorDaysFacade.load(doctorId);
      } else {
        this.doctorDaysFacade.reset();
        this.disabledWeekDays.set([0, 1, 2, 3, 4, 5, 6]);
      }
    });

    // Apply disabled week days
    effect(() => {
      const days = this.doctorDaysFacade.days();
      const status = this.doctorDaysFacade.status();
      if (status === true && days?.length) {
        const active = days.map(d => (d.day_id === 7 ? 0 : d.day_id));
        this.disabledWeekDays.set([0, 1, 2, 3, 4, 5, 6].filter(d => !active.includes(d)));
      } else if (status === false) {
        this.disabledWeekDays.set([0, 1, 2, 3, 4, 5, 6]);
        this.doctorDaysFacade.reset();
      }
    });

    // Reset on key (step change) and prefill state
    effect(() => {
      const currentKey = this.key();
      if (currentKey === this.lastProcessedKey) return;
      this.lastProcessedKey = currentKey;

      this.doctorSlotsFacade.reset();
      this.formPackage.reset();
      this.formPackage.enable({ emitEvent: false });

      // prefill logic: prefer step data; else reservationFormData; else today
      const stepData = this.currentStepData();
      const rfd = this.reservationFormData();

      const resolveDate = () => {
        if (stepData?.date) return stepData.date;
        if (rfd?.date) return rfd.date;
        return null; // Don't default to today, let user select
      };

      const resolvedDate = resolveDate();
      const dateToUse = resolvedDate ? this.coerceDate(resolvedDate) : null;
      this.patchDate(dateToUse); // syncs form + picker + selectedFormattedDate + slots

      // Prefill time if available from step or step1 seed
      const seedTime = stepData?.time_id || (this.readonlyInitial() ? {
        start_time: rfd?.start_time,
        end_time: rfd?.end_time
      } : null);

      if (seedTime?.start_time) {
        // Wait for slots effect below to set the radio if exists
      } else {
        this.formPackage.controls['time_id'].reset();
      }

      // Lock if readonlyInitial
      if (this.readonlyInitial()) {
        this.formPackage.controls['date'].disable({ emitEvent: false });
        this.formPackage.controls['time_id'].disable({ emitEvent: false });
      } else {
        this.formPackage.controls['date'].enable({ emitEvent: false });
        this.formPackage.controls['time_id'].enable({ emitEvent: false });
      }
    });

    // When slots load, if we have a preselected time, set it (and it will be disabled visually if reused)
    effect(() => {
      const status = this.doctorSlotsFacade.status();
      const slots = this.doctorSlotsFacade.dataSlots();
      const stepData = this.currentStepData();
      const rfd = this.reservationFormData();

      if (!status) return;
      if (!slots?.length) {
        this.formPackage.controls['time_id'].reset();
        return;
      }

      const preStart =
        stepData?.time_id?.start_time ??
        (this.readonlyInitial() ? rfd?.start_time : null);

      if (preStart) {
        const found = slots.find(s => s.start_time === preStart);
        if (found) {
          this.formPackage.controls['time_id'].patchValue(found, { emitEvent: false });
        }
      }
    });
  }

  ngOnInit(): void {
    // Don't default to today, let the effect handle initialization
    // The effect will properly handle date resolution based on input data
  }

  /** called by the custom datepicker component */
  protected onPickerChange(date: Date | null): void {
    this.patchDate(date);
  }

  /** centralize patching so both UI (picker) and form control stay in sync and slots are fetched */
  private patchDate(date: Date | null): void {
    if (!date) {
      this.pickerValue.set(null);
      this.selectedFormattedDate.set(null);
      this.selectedDayId.set(null);
      this.formPackage.controls['date'].patchValue(null, { emitEvent: false });
      this.formPackage.controls['time_id'].reset();
      this.doctorSlotsFacade.reset();
      this.cdr.markForCheck();
      return;
    }

    const iso = this.ensureISO(date);
    const dayId = extractDayIdFromDateString(iso);

    this.pickerValue.set(this.coerceDate(date));
    this.selectedFormattedDate.set(iso);
    this.selectedDayId.set(dayId);

    this.formPackage.controls['date'].patchValue(this.coerceDate(date), { emitEvent: false });
    this.formPackage.controls['time_id'].reset();

    this.checkAndCallSlots();
    this.cdr.markForCheck();
  }

  protected onTimeSelected(slot: any): void {
    this.formPackage.controls['time_id'].patchValue(slot);
  }

  protected isTimeDisabledForReuse(slot: { start_time: string; end_time: string }): boolean {
    const key = `${slot.start_time}-${slot.end_time}`;
    return this.disabledTimeKeysForSelectedDate().has(key);
  }

  protected checkAndCallSlots(): void {
    const doctorId = this.doctor().id;
    const duration = this.durationId();
    const formattedDate = this.selectedFormattedDate();
    const dayId = this.selectedDayId();

    if (doctorId && duration && formattedDate && dayId !== null) {
      this.doctorSlotsFacade.load(doctorId, dayId, duration, formattedDate);
    } else {
      this.doctorSlotsFacade.reset();
    }
  }

  public async validateAndGetFormData(): Promise<{ isValid: boolean; data: IReservationStepData | null }> {
    this.formPackage.markAllAsTouched();
    this.cdr.detectChanges();

    if (this.formPackage.invalid) {
      return { isValid: false, data: null };
    }

    if (!this.doctor().id || !this.selectedFormattedDate() || this.selectedDayId() === null || this.durationId() === null) {
      return { isValid: false, data: null };
    }

    // if time disabled by reuse guard, block submit
    const time = this.formPackage.controls['time_id'].value;
    if (time && this.isTimeDisabledForReuse(time)) {
      return { isValid: false, data: null };
    }

    // Normalize to ISO date string for parent
    const raw = this.formPackage.getRawValue();
    const normalized: IReservationStepData = {
      date: this.ensureISO(raw.date),
      time_id: raw.time_id
    };

    return { isValid: true, data: normalized };
  }

  public getFormControl(name: string): FormControl<any> | null {
    return this.formPackage.get(name) as FormControl<any> | null;
  }

  public getError(name: string): Record<string, any> | null {
    const control = this.getFormControl(name);
    return control?.invalid && (control.touched || control.dirty) ? control.errors : null;
  }

  public getValidationErrorMessage(
    name: string,
    validations: Array<{ errorName?: string; errorMessage: string }>
  ): string {
    const control = this.getFormControl(name);
    if (!control?.errors || !validations?.length) return '';
    for (const v of validations) {
      if (v.errorName && control.errors[v.errorName]) return v.errorMessage;
      if (!v.errorName && control.errors['required']) return v.errorMessage;
    }
    return 'form.genericError';
  }

  protected convertTimeStringToDate(time: string | null): Date | null {
    if (!time) return null;
    try {
      const [h, m] = time.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    } catch { return null; }
  }

  private ensureISO(d: string | Date): string {
    if (typeof d === 'string') return d;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private coerceDate(d: string | Date): Date {
    if (d instanceof Date) return d;
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, (m - 1), day);
  }
}

