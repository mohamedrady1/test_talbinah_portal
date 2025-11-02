import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, OnInit, effect } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';

// Assuming these are defined in your shared module
import { CancelReservationFacade, ReservationReasonsCancelationFacade } from '../../services';
import { ICalcReservationCancelPriceData, ICancelReservationRequestDto } from '../../dtos';
import { ALL_INPUT_TYPES, IFormInputConfig } from '../../../../shared';
import { CancelAppoitmentFormConfig } from '../../configs';
import { IGlobalReservationModel } from '../../models';
import { Logger } from '../../../../common';
import { TranslateApiPipe } from '../../../../common/core/translations';

// --- Interfaces for better type safety ---

export interface ICancelAppointmentForm {
  reason: string | null;
  reasonDetails: string | null;
}
export interface ICancelAppointmentSubmissionData {
  status: boolean;
  formItems: ICancelAppointmentForm
}

export const CANCEL_APPOINTMENT_FORM_CONFIG: IFormInputConfig[] = CancelAppoitmentFormConfig;

@Component({
  selector: 'app-cancel-appointment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    SelectModule,
    FormsModule,
    TranslateApiPipe
  ],
  templateUrl: './cancel-appointment.component.html',
  styleUrls: ['./cancel-appointment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CancelAppointmentComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  protected readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  @Input() public data?: { item: IGlobalReservationModel, responseCancel: { status?: boolean, response: ICalcReservationCancelPriceData | null } } | null;

  @Output() public closed: EventEmitter<{ status?: boolean } | null> = new EventEmitter<{ status?: boolean } | null>();

  public readonly cancelFacade = inject(CancelReservationFacade);

  protected readonly reasonsFacade = inject(ReservationReasonsCancelationFacade);

  // Config and constants
  protected readonly formConfig: IFormInputConfig[] = CANCEL_APPOINTMENT_FORM_CONFIG;
  protected readonly allInputTypes: typeof ALL_INPUT_TYPES = ALL_INPUT_TYPES;

  // Form state
  public readonly form: FormGroup = this.fb.group({
    reason: [null, Validators.required],
    reasonDetails: [null]
  });

  constructor() {
    effect(() => {
      if (this.cancelFacade.cancelSuccess() && !this.cancelFacade.isCancelling()) {
        Logger.debug('CancelAppointmentComponent => Cancellation Price successful, emitting closed event with form data.');
        this.closed.emit({ status: this.cancelFacade.cancelSuccess() });
      }
      else if (this.cancelFacade.cancelError() && !this.cancelFacade.isCancelling()) {
        Logger.error('CancelAppointmentComponent => Cancellation Price failed, closing modal.');
      }
    });

    effect(() => {
      const reasons = this.reasonsFacade.reasons();

      // Dynamically update the SELECT input options
      if (reasons.length > 0) {
        const selectField = this.formConfig.find(f => f.name === 'reason');
        if (selectField) {
          selectField.listValues = reasons.map(reason => ({
            value: String(reason.id),
            label: reason.reason
          }));
        }

        this.cdr.detectChanges();
      }
    });
  }


  public ngOnInit(): void {
    Logger.debug('CancelAppointmentComponent initialized with data final screen:', {
      data: this.data
    });
    this.reasonsFacade.loadReasons();
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

  /**
   * @method onSubmit
   * @description Handles the form submission logic.
   */
  protected onSubmit(): void {
    if (this.form.valid) {
      const formData: ICancelAppointmentForm = this.form.getRawValue();

      // Log the payload and data for debugging
      Logger.debug('Cancel Appointment Form Submitted:', {
        status: true,
        payload: formData,
        data: this.data
      });

      if (!this.data?.item?.id) {
        Logger.error('Reservation ID is missing. Cannot proceed with cancellation.');
        return;
      }

      // Safely extract payload data using optional chaining and nullish coalescing
      const payload: ICancelReservationRequestDto = {
        reason_id: Number(formData?.reason ?? 0),
        reason: formData?.reasonDetails ?? ''
      };

      // Call the facade action
      this.cancelFacade.cancelReservation(this.data?.item.id, payload);
    } else {
      Logger.debug('Cancel Appointment Form is invalid');
      this.form.markAllAsTouched();
      // Ensure the change detection runs to display errors immediately
      this.cdr.detectChanges();
    }
  }

  protected onCancel(): void {
    this.closed.emit(null);
  }

  public getError(name: string): Record<string, any> | null {
    const control: FormControl | null = this.getFormControl(name);
    return control?.invalid && (control?.touched || control?.dirty) ? control.errors : null;
  }
}
