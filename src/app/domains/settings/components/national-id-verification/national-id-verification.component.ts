import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  OnInit,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';

import { Logger } from '../../../../common';
import { IGlobalUserContactInfoModel } from '../../../../common';
import { NationalIdVerificationFacade } from '../../services';
import { IVerifyNationalIdRequest } from '../../dtos';
import { IVerifyNationalIdFormData } from '../../models';
import { UserContextService } from '../../../authentication';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-national-id-verification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    DatePickerModule,
    TranslateApiPipe
  ],
  templateUrl: './national-id-verification.component.html',
  styleUrls: ['./national-id-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NationalIdVerificationComponent implements OnInit, OnDestroy {
  private readonly _fb = inject(FormBuilder);
  private readonly _facade = inject(NationalIdVerificationFacade);
  private readonly _destroy$ = new Subject<void>();
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly userContext = inject(UserContextService);

  @Input() public data?: any;
  @Output() public closed = new EventEmitter<{ status: boolean, data: any } | void>();

  public readonly form = this._fb.group({
    national_id: this._fb.control<string | null>(null, [
      Validators.required,
      this.validateNationalId()
    ]),
    birth_date: this._fb.control<Date | null>(null, [
      Validators.required,
      this.validateBirthDate()
    ]),
  });

  public readonly isLoading = this._facade.isLoading;
  public readonly apiErrorMessage = this._facade.errorMessage;
  public readonly verificationResponse = this._facade.verificationResponse;
  public readonly isVerified = this._facade.isVerified;
  public readonly isUnverified = this._facade.isUnverified;
  public readonly maxBirthDate: Date = this.calculateMaxBirthDate(18);

  ngOnInit(): void {
    const userData = this.userContext.user();
    Logger.debug('[NationalIdVerificationComponent] | UserContextService current user data:', userData);

    // Patch birth date from user context if available
    if (userData?.user?.birth_date) {
      const [year, month, day] = userData.user.birth_date.split('-').map(Number);
      this.form.patchValue({
        birth_date: new Date(year, month - 1, day)
      });
    } else {
      // Fallback to default if no birth date in user context
      this.form.patchValue({
        birth_date: this.calculateDefaultBirthDate(18)
      });
    }

    this._facade.resetState();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._facade.resetState();
  }

  private validateNationalId(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) return null;

      if (value.length !== 10) return { invalidLength: true };
      if (!['1', '2'].includes(value.charAt(0))) return { invalidPrefix: true };
      if (!/^\d+$/.test(value)) return { invalidCharacters: true };

      return null;
    };
  }

  private validateBirthDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!(value instanceof Date)) return null;

      const today = new Date();
      const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());

      if (value < minDate) return { tooOld: true };
      if (value > this.maxBirthDate) return { tooYoung: true };

      return null;
    };
  }

  private calculateDefaultBirthDate(yearsToSubtract: number): Date {
    const today = new Date();
    return new Date(today.getFullYear() - yearsToSubtract, today.getMonth(), today.getDate());
  }

  private calculateMaxBirthDate(maxAge: number): Date {
    const today = new Date();
    return new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
  }

  public onNationalIdInput(event: Event): void {
    if (!isPlatformBrowser(this._platformId)) return;

    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) value = value.substring(0, 10);
    input.value = value;
    this.form.controls.national_id.setValue(value);
  }

  public onSubmit(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    const nationalId = this.form.controls.national_id.value;
    const birthDate = this.form.controls.birth_date.value;

    let formattedBirthDate = '';
    if (birthDate instanceof Date) {
      formattedBirthDate = `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`;
    }

    const payload: IVerifyNationalIdRequest = {
      national_id: nationalId ?? '',
      birth_date: formattedBirthDate
    };

    this._facade.verifyNationalIdAction(payload)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response) => {
          if (response?.status && response?.data) {
            Logger.debug('NationalIdVerificationComponent: Updating user data with verification response:', response.data);

            const userData: IGlobalUserContactInfoModel = {
              ...response.data,
              national_id: response.data.national_id ? String(response.data.national_id) : null
            };

            this.userContext.updateUserInfo(userData);
          }
          this.closed.emit({ status: true, data: response });
        },
        error: (error) => Logger.error('NationalIdVerificationComponent: API call error:', error)
      });
  }

  public onSkip(): void {
    this.closed.emit({ status: false, data: this.data });
  }

  public getFormControl(name: keyof IVerifyNationalIdFormData): FormControl {
    return this.form.get(name) as FormControl;
  }

  public getValidationErrorMessage(controlName: keyof IVerifyNationalIdFormData): string {
    const control = this.getFormControl(controlName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'form.nationalId.errors.required';
    if (controlName === 'national_id') {
      if (control.errors['invalidLength']) return 'form.nationalId.errors.length';
      if (control.errors['invalidPrefix']) return 'form.nationalId.errors.startDigit';
      if (control.errors['invalidCharacters']) return 'form.nationalId.errors.characters';
    }
    if (controlName === 'birth_date') {
      if (control.errors['tooYoung']) return 'form.birthDate.errors.tooYoung';
      if (control.errors['tooOld']) return 'form.birthDate.errors.tooOld';
    }

    return 'form.errors.generic';
  }
}
