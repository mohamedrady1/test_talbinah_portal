import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ChangeDetectorRef, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { _, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

import { ALL_INPUT_TYPES, FeedbackData, IFormInputConfig, PublicService, RATING_VALUES } from '../../../../shared';
import { IGlobalDoctorContactInfoModel, Logger } from '../../../../common';
import { AppointmentCardComponent } from '../appointment-card';
import { IGlobalReservationModel } from '../../models';
import { RateDoctorFormConfig } from '../../configs';
import { LeaveRatingFacade } from '../../services';
import { ILeaveRatingRequestDto } from '../../dtos';
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
  selector: 'app-leave-rating-modal',
  standalone: true,
  imports: [
    AppointmentCardComponent,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    TranslateApiPipe
  ],
  templateUrl: './leave-rating-modal.component.html',
  styleUrls: ['./leave-rating-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveRatingModalComponent implements OnInit, OnDestroy {
  // --- Inputs/Outputs ---
  @Input({ required: false }) public type!: string;
  @Input() public session: IGlobalReservationModel | null = null;
  @Input() public doctor: IGlobalDoctorContactInfoModel | null = null;

  @Output() public closed = new EventEmitter<{ status?: boolean } | null>();
  @Output() public feedbackSubmitted = new EventEmitter<FeedbackData>();

  // --- Injected Services ---
  private readonly fb = inject(FormBuilder);
  public readonly publicService = inject(PublicService);
  private readonly destroy$ = new Subject<void>();
  private readonly cdr = inject(ChangeDetectorRef);

  // Config and constants
  protected readonly formConfig: IFormInputConfig[] = RateDoctorFormConfig;
  protected readonly allInputTypes: typeof ALL_INPUT_TYPES = ALL_INPUT_TYPES;

  // Form state
  public readonly form: FormGroup = this.fb.group({
    rate: [null, Validators.required],
    rate_text: [null, Validators.required]
  });
  public readonly RATING_VALUES = RATING_VALUES;

  // Leave Rating Facade
  protected readonly _LeaveRatingFacade = inject(LeaveRatingFacade);

  // --- Lifecycle ---

  constructor() {
    // Initialize form with default values
    effect(() => {
      if (this._LeaveRatingFacade.ratingResponse() && !this._LeaveRatingFacade.isSubmitting()) {
        this.resetFormAndClose();
        this._LeaveRatingFacade.resetState();
      }
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    // Any other initialization logic can go here, but the form is already initialized.
    Logger.debug('LeaveRatingModalComponent = > Inputs: ', {
      type: this.type,
      session: this.session,
      doctor: this.doctor
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- Public Methods ---
  protected onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      Logger.debug('LeaveRatingAppointmentComponent => Final formData:', formData);
      let payload: ILeaveRatingRequestDto = {
        reservation_id: this.session?.id || 0,
        doctor_id: this.doctor?.id || 0,
        rating: formData?.rate || 0,
        description: formData?.rate_text
      }
      Logger.debug('LeaveRatingAppointmentComponent => Final payload:', payload);
      if (this.session?.id) {
        this._LeaveRatingFacade.submitRating(this.session?.id, payload);
      }
    } else {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
    }
  }


  public resetFormAndClose(): void {
    this.form.reset();
    this.closed.emit();
  }

  // Helper to get FormControl for template
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
  public getError(name: string): Record<string, any> | null {
    const control: FormControl | null = this.getFormControl(name);
    return control?.invalid && (control?.touched || control?.dirty) ? control.errors : null;
  }

  protected onCancel(): void {
    this.closed.emit(null);
  }
}
