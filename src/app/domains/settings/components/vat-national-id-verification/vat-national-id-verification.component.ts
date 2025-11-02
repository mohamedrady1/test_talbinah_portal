import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { IGlobalUserContactInfoModel, Logger, StorageService } from '../../../../common';
import { StorageKeys } from '../../../../shared';
import { NationalIdVerificationFacade } from '../../services';
import { IVerifyNationalIdFormData } from '../../models';
import { DatePickerModule } from 'primeng/datepicker';
import { IVerifyNationalIdRequest } from '../../dtos';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
    selector: 'app-vat-national-id-verification',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DatePickerModule,
        
    ],
    templateUrl: './vat-national-id-verification.component.html',
    styleUrls: ['./vat-national-id-verification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VatNationalIdVerificationComponent implements OnInit, OnDestroy {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
    private readonly _fb = inject(FormBuilder);
    private readonly _nationalIdVerificationFacade = inject(NationalIdVerificationFacade);
    private readonly _StorageService = inject(StorageService);
    private readonly _destroy$ = new Subject<void>();

    @Input() public data?: any;
    @Output() public closed = new EventEmitter<{ status: boolean, data: any } | void>();

    public readonly form = this._fb.group({
        national_id: this._fb.control<string | null>(null, [
            Validators.required,
            Validators.pattern(/^\d{10,15}$/)
        ]),
        birth_date: this._fb.control<Date | null>(null, [
            Validators.required
        ]),
    });

    public readonly isLoading = this._nationalIdVerificationFacade.isLoading;
    public readonly apiErrorMessage = this._nationalIdVerificationFacade.errorMessage;
    public readonly verificationResponse = this._nationalIdVerificationFacade.verificationResponse;
    public readonly isVerified = this._nationalIdVerificationFacade.isVerified;
    public readonly isUnverified = this._nationalIdVerificationFacade.isUnverified;

    public readonly maxBirthDate: Date = this.calculateMaxBirthDate(18);

    constructor() {
        Logger.debug('VatNationalIdVerificationComponent: Initializing with data:', { data: this.data });
    }

    public ngOnInit(): void {
        // Get user data from storage
        const storedUserInfo = this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO) as { user?: IGlobalUserContactInfoModel } | null;

        if (storedUserInfo && storedUserInfo.user) {
            const user = storedUserInfo.user;
            Logger.debug('VatNationalIdVerificationComponent: Found user data:', user);

            // Patch national_id if available
            if (user.national_id) {
                this.form.patchValue({
                    national_id: user.national_id
                });
                Logger.debug('VatNationalIdVerificationComponent: Patched national_id:', user.national_id);
            }

            // Patch birth_date if available
            if (user.birth_date) {
                const birthDate = new Date(user.birth_date);
                if (!isNaN(birthDate.getTime())) {
                    this.form.patchValue({
                        birth_date: birthDate
                    });
                    Logger.debug('VatNationalIdVerificationComponent: Patched birth_date:', birthDate);
                }
            }
        } else {
            Logger.debug('VatNationalIdVerificationComponent: No user data found in storage, using default birth date');
            // Use default birth date if no user data
            const defaultBirthDate = this.calculateDefaultBirthDate(18);
            this.form.patchValue({
                birth_date: defaultBirthDate
            });
        }

        this.form.controls.birth_date.updateValueAndValidity();
        Logger.debug('VatNationalIdVerificationComponent: After patchValue - birth_date value:', this.form.controls.birth_date.value);
        Logger.debug('VatNationalIdVerificationComponent: After patchValue - birth_date errors:', this.form.controls.birth_date.errors);
        Logger.debug('VatNationalIdVerificationComponent: After patchValue - form validity:', this.form.valid);
        this._nationalIdVerificationFacade.resetState();
    }

    private calculateDefaultBirthDate(yearsToSubtract: number): Date {
        const today = new Date();
        return new Date(today.getFullYear() - yearsToSubtract, today.getMonth(), today.getDate());
    }

    public ngOnDestroy(): void {
        this._nationalIdVerificationFacade.resetState();
        Logger.debug('VatNationalIdVerificationComponent: Destroyed. Facade state reset.');
    }

    private calculateMaxBirthDate(maxAge: number): Date {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
        maxDate.setDate(maxDate.getDate() - 1);
        return maxDate;
    }

    public onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        Logger.debug('VatNationalIdVerificationComponent: Form values is:', this.form.value);
        if (this.form.valid) {
            const nationalId = this.form.controls.national_id.value;
            const birthDate = this.form.controls.birth_date.value;
            let formattedBirthDate: string | null = null;
            if (birthDate instanceof Date && !isNaN(birthDate.getTime())) {
                formattedBirthDate = birthDate.toISOString().split('T')[0];
            }
            const payload: IVerifyNationalIdRequest = {
                national_id: nationalId ?? '',
                birth_date: formattedBirthDate ?? ''
            };
            Logger.debug('VatNationalIdVerificationComponent: payload is:', payload);
            this._nationalIdVerificationFacade.verifyNationalIdAction(payload)
                .pipe(takeUntil(this._destroy$))
                .subscribe({
                    next: (response) => {
                        Logger.debug('VatNationalIdVerificationComponent: API call success:', response);
                        this.closed.emit({ status: true, data: response });
                    },
                    error: (error) => {
                        Logger.error('VatNationalIdVerificationComponent: API call error:', error);
                    },
                    complete: () => {
                        Logger.debug('VatNationalIdVerificationComponent: API call completed.');
                    }
                });
        } else {
            Logger.debug('VatNationalIdVerificationComponent: Form is invalid. Errors:', this.form.errors);
            this._nationalIdVerificationFacade.resetState();
        }
    }

    public getFormControl(name: keyof IVerifyNationalIdFormData): FormControl {
        return this.form.get(name) as FormControl;
    }

    public getValidationErrorMessage(controlName: keyof IVerifyNationalIdFormData, validations: { errorName?: string; errorMessage: string }[]): string {
        const control = this.getFormControl(controlName);
        if (!control || !control.errors || !control.touched) return '';
        const errorKeys = Object.keys(control.errors);
        for (const validation of validations) {
            if (validation.errorName && errorKeys.includes(validation.errorName)) {
                return validation.errorMessage;
            }
            if (!validation.errorName && control.errors['required']) {
                return validation.errorMessage;
            }
        }
        return 'form.genericError';
    }
} 

