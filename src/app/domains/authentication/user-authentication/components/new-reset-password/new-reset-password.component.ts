import {
    Component,
    Input,
    signal,
    effect,
    inject,
    ChangeDetectorRef,
    OnInit,
    PLATFORM_ID,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    Validators,
    ReactiveFormsModule,
    FormsModule,
    FormGroup, // Import FormGroup
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
    ALL_INPUT_TYPES,
    IFormInputConfig,
    InputIconPosition,
    InputIconType,
    LocalizationService,
    ModalService,
    PasswordMatchValidator,
    StorageKeys,
    SvgIconComponent,
    ToastService,
} from '../../../../../shared';
import { ApiError, handleApiErrorsMessage, Logger, MetadataService, NavigationIntent, StorageService, useNavigation } from '../../../../../common';
import { AuthenticationRoutesEnum, UserAuthRouteData } from '../../constants';
import { OtpMethodSelectionComponent } from '../otp-method-selection';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { UserAuthenticationApiClientProvider } from '../../clients';
import { IResetPasswordRequestDto, IResetPasswordResponseDto } from '../../dtos';
import { MainPageRoutesEnum } from '../../../../main-page';
import { RoleGuardService, UserContextService } from '../../services';

@Component({
    selector: 'app-new-reset-password',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, SvgIconComponent],
    templateUrl: './new-reset-password.component.html',
    styleUrls: ['./new-reset-password.component.scss']
})
export class NewResetPasswordComponent implements OnInit { // Implement OnInit
    private readonly userAuthApi = inject(UserAuthenticationApiClientProvider).getClient();
    @Output() closed = new EventEmitter<void>();
    private _StorageService = inject(StorageService);
    private readonly nav = useNavigation();
    private readonly _ActivatedRoute = inject(ActivatedRoute);
    private readonly _Router = inject(Router);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly _ToastService = inject(ToastService)
    protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    private readonly _router = inject(Router);


    private readonly modalService = inject(ModalService);

    private readonly fb = inject(FormBuilder);
    protected readonly cdr = inject(ChangeDetectorRef);
    private readonly _UserContextService = inject(UserContextService);
    private readonly roleGuard = inject(RoleGuardService);

    // 💡 Services
    private readonly seo = inject(MetadataService);
    private readonly localization = inject(LocalizationService);

    // 💡 Actions
    readonly isLoading = signal<boolean>(false);
    readonly NewResetPasswordRequest = signal<IResetPasswordRequestDto | null>(null);
    readonly NewResetPasswordResponse = signal<IResetPasswordResponseDto | null>(null);
    readonly NewResetPasswordError = signal<ApiError | null>(null);

    // Data properties
    protected neededDataToVerify = signal<any | null>(null);

    protected readonly formConfig: IFormInputConfig[] = [
        {
            type: ALL_INPUT_TYPES.PASSWORD,
            name: 'password',
            label: 'form.password.label',
            isRequired: true,
            placeholder: 'form.password.placeholder',
            defaultValue: '',
            isDisabled: false,
            widthClass: 'w-full',
            inputWithIcon: true,
            inputIconType: InputIconType.IMAGE,
            inputIcon: 'images/icons/key.svg',
            inputIconPosition: InputIconPosition.START,
            globalClass: 'custom-input-wrapper',
            inputClass: 'form-control',
            showConfirm: true,
            validation: [
                {
                    errorName: 'required', // Use errorName for specific validation type
                    errorMessage: 'form.password.errors.required',
                    function: Validators.required
                },
                // Add minLength validation if needed
                {
                    errorName: 'minlength',
                    errorMessage: 'form.password.errors.minLength', // Example message
                    function: Validators.minLength(8)
                }
            ],
            enableLabelClick: true,
            stopPaste: true,
            showPassword: true,
        },
        {
            id: 'registerConfirmPassword',
            type: ALL_INPUT_TYPES.PASSWORD,
            name: 'confirmPassword',
            label: 'form.confirmPassword.label',
            isRequired: true,
            placeholder: 'form.confirmPassword.placeholder',
            defaultValue: null,
            isDisabled: false,
            widthClass: 'w-full',
            inputWithIcon: true,
            inputIconType: InputIconType.IMAGE,
            inputIcon: 'images/icons/key.svg',
            inputIconPosition: InputIconPosition.START,
            globalClass: 'custom-input-wrapper',
            inputClass: 'form-control',
            validation:
                [{
                    errorName: 'required',
                    errorMessage: 'form.confirmPassword.errors.required',
                    function: Validators.required
                },
                {
                    errorName: 'passwordMismatch',
                    errorMessage: 'form.confirmPassword.errors.mismatch',
                    function: PasswordMatchValidator('password', 'confirmPassword')
                }
                ],
            enableLabelClick: true,
            stopPaste: true,
        }
    ];

    protected readonly form = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]], // Added minLength for password
        confirmPassword: ['', [Validators.required]]
    }, { validators: PasswordMatchValidator('password', 'confirmPassword') }); // Apply password mismatch validator

    private visible = signal(false);
    readonly passwordVisible = this.visible.asReadonly();
    readonly inputType = signal<'password' | 'text'>('password');
    protected readonly allInputTypes = ALL_INPUT_TYPES;

    get passwordControl(): FormControl {
        return this.form.get('password') as FormControl;
    }

    // Get form group level errors (e.g., password mismatch)
    getFormGroupError(): Record<string, any> | null {
        return this.form.errors;
    }

    private fcmToken: string | null = null;

    constructor() {
        this.setupResetPasswordEffect();
    }

    ngOnInit(): void {
        this.setSeoMeta();

        const queryParams = this._ActivatedRoute.snapshot.queryParams;
        Logger.debug('Query Params:', queryParams);

        // Get fromURL from localStorage instead of URL parameters
        const fromUrlPayload = this._StorageService.getItem(StorageKeys.FROM_URL_PAYLOAD);
        if (fromUrlPayload) {
            Logger.debug('fromURL from localStorage:', fromUrlPayload);
            // Clear the fromURL payload from localStorage after successful retrieval
            this._StorageService.removeItem(StorageKeys.FROM_URL_PAYLOAD);
        }

        // Get auth data payload from localStorage instead of URL parameters
        const authDataPayload = this._StorageService.getItem(StorageKeys.AUTH_DATA_PAYLOAD);
        if (!authDataPayload) {
            Logger.warn('Missing auth data payload in localStorage. Redirecting to login...');
            this._ToastService.add({
                severity: 'error',
                summary: 'general.error',
                detail: 'general.missingData',
                life: 5000,
            });
            // ✅ Avoid navigation on the server to support SSR
            if (isPlatformBrowser(this.platformId)) {
                this._Router.navigate([AuthenticationRoutesEnum.LOGIN]);
            }

            return;
        }

        if (isPlatformBrowser(this.platformId)) {
            this.fcmToken = localStorage.getItem(StorageKeys.FCM_TOKEN);
            Logger.debug('LoginPasswordComponent | fcmToken:', this.fcmToken);
        }

        try {
            this.neededDataToVerify.set(authDataPayload);
            Logger.debug('Needed Data To Verify:', this.neededDataToVerify());

            // Clear the payload from localStorage after successful retrieval
            this._StorageService.removeItem(StorageKeys.AUTH_DATA_PAYLOAD);
        } catch (error) {
            Logger.error('Invalid auth data payload in localStorage. Redirecting to login...');
            this._ToastService.add({
                severity: 'error',
                summary: 'general.error',
                detail: 'general.missingData',
                life: 5000,
            });
            if (isPlatformBrowser(this.platformId)) {
                this._Router.navigate([AuthenticationRoutesEnum.LOGIN]);
            }
        }
    }
    private setSeoMeta(): void {
        const { title, meta } = UserAuthRouteData.login;
        const lang = this.localization.getCurrentLanguage() as keyof typeof title;
        this.seo.setMetaTags({
            title: title[lang],
            description: meta.description[lang],
            keywords: 'lofin-password, authentication, talbinah',
            image: 'https://api.talbinah.net/dashboard_assets/Talbinah.png',
            url: 'https://talbinah.com/lofin-password',
            robots: 'index, follow',
            locale: 'en_US',
            canonical: 'https://talbinah.com/lofin-password'
        });
    }

    protected toggleVisibility(): void {
        this.visible.update((v) => !v);
        this.inputType.set(this.visible() ? 'text' : 'password');
    }

    protected getFormControl(name: string): FormControl | null {
        return this.form.get(name) as FormControl;
    }

    protected getError(name: string): Record<string, any> | null {
        const control = this.getFormControl(name);
        return control?.invalid && control?.touched ? control.errors : null;
    }

    protected getValidationErrorMessage(controlName: string, validations: any[]): string {
        const control = this.getFormControl(controlName);
        if (!control || !control.errors || !validations?.length) return '';

        const errorKeys = Object.keys(control.errors);
        for (const validation of validations) {
            if (validation.errorName && errorKeys.includes(validation.errorName)) {
                return validation.errorMessage;
            }
            // This part might be redundant if 'required' is always explicitly handled in validations
            if (!validation.errorName && control.errors['required']) {
                return validation.errorMessage;
            }
        }

        // For form group errors that might not be tied to a specific control's validation config
        if (controlName === 'confirmPassword' && this.form.hasError('passwordMismatch')) {
            const mismatchValidation = validations.find(v => v.errorName === 'passwordMismatch');
            if (mismatchValidation) {
                return mismatchValidation.errorMessage;
            }
        }
        return 'form.genericError';
    }

    // New method to get form group validation message
    protected getFormGroupValidationErrorMessage(errorName: string, errorMessage: string): string {
        const errors = this.getFormGroupError();
        if (errors && errors[errorName]) {
            return errorMessage;
        }
        return '';
    }

    protected onSubmit(): void {
        if (this.form.valid) {
            const payload = this.form.getRawValue();
            const queryParams: IResetPasswordRequestDto = {
                // phone_no: 1018388774, // Consider getting this dynamically
                // country_id: 63,      // Consider getting this dynamically
                password: payload.password || '',
                password_confirmation: payload.confirmPassword || '',
                phone_no: this.neededDataToVerify()?.phone_no,
                country_id: this.neededDataToVerify()?.country_id,
                // country_id: removeSpecialCharacters(selectedCountry.phone_code),
                role: 'user',
                device_type: 'web',
                fcm_token: this.fcmToken
            };
            Logger.debug('Reset Password Query Params:', queryParams);
            // Set the request signal
            this.NewResetPasswordRequest.set(queryParams);
        } else {
            Logger.debug('Otp Reset Password Form is invalid');
            this.form.markAllAsTouched();
            this.cdr.markForCheck(); // Ensure UI updates on OnPush
        }
    }

    private setupResetPasswordEffect(): void {
        effect(() => {
            const request = this.NewResetPasswordRequest();
            if (!request) return;

            this.isLoading.set(true);
            this.userAuthApi.resetPassword(request)
                .pipe(
                    take(1),
                    finalize(() => this.isLoading.set(false))
                )
                .subscribe({
                    next: (res: IResetPasswordResponseDto) => {
                        this.NewResetPasswordResponse.set(res);
                        this.handleNewResetPasswordResponse(res);
                    },
                    error: (error: ApiError) => {
                        this.NewResetPasswordError.set(error);
                        Logger.warn('Reset Password failed', error);
                        handleApiErrorsMessage(error);
                        this._ToastService.add({
                            severity: 'error',
                            summary: 'general.error',
                            detail: error?.message,
                            life: 5000,
                        });
                    }
                });
        });
    }
    protected handleNewResetPasswordResponse(res: IResetPasswordResponseDto): void {
        Logger.debug('Handle Reset Password called', res);
        if (res.status) {
            this.closed.emit();
            this._StorageService.setItem(StorageKeys.TOKEN, res.data.token, true);
            this._StorageService.setItem(StorageKeys.CURRENT_USER_INFO, res.data, true);
            // Trigger header and user-info refresh immediately
            this._UserContextService.recallUserDataViewed.next(true);
            this.roleGuard.setRole('user');
            this.nav.navigate(NavigationIntent.INTERNAL, MainPageRoutesEnum.MAINPAGE);
        } else {
            Logger.warn('New Reset Password Cancelled or Failed');
        }
    }

    private openOtpMethodSelectionDialog(): void {
        Logger.info('Open OTP New Reset Password dialog');
        this.modalService.open(OtpMethodSelectionComponent, {
            inputs: {
                image: 'images/auth/icons/talbinah.png',
                title: 'OtpMethodSelection.Title',
                // subtitle: 'OtpMethodSelection.Subtitle',
                data: {
                    payploadCheckNumber: this.neededDataToVerify(),
                    fromURL: AuthenticationRoutesEnum.PASSWORD
                }
            },
            outputs: {
                closed: (data: any): void => {
                    Logger.debug('Modal closed with data:', data);
                    if (data?.status) {
                        Logger.debug('OTP Reset Password Successful:', data);
                        // Store auth data payload in localStorage instead of URL
                        this._StorageService.setItem(StorageKeys.AUTH_DATA_PAYLOAD, data, true);
                        this._StorageService.setItem(StorageKeys.FROM_URL_PAYLOAD, AuthenticationRoutesEnum.PASSWORD, true);
                        this.nav.navigate(NavigationIntent.INTERNAL, AuthenticationRoutesEnum.RESER_PASSWORD);
                    } else {
                        Logger.warn('OTP Reset Password Cancelled or Failed');
                    }
                }
            },
            width: '30%',
            closeOnBackdropClick: false,
            // height: '60%'
        });
    }

    protected onForgotPassword(): void {
        this.openOtpMethodSelectionDialog();
    }
    ngOnDestroy(): void {
        if (this.isBrowser) {
            const currentUrl = this._router.url;
            if (currentUrl === '/' || currentUrl === '/home') {
                document.body.style.overflow = '';
            }
        }
    }
}
