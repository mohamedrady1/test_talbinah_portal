
import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    inject,
    signal,
    ChangeDetectorRef,
    PLATFORM_ID,
    ChangeDetectionStrategy,
    Output,
    EventEmitter
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    Validators,
    ReactiveFormsModule,
    FormsModule,
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { ALL_INPUT_TYPES, IFormInputConfig, LocalizationService, ModalService, StorageKeys, SvgIconComponent } from '../../../../../shared';
import { Logger, MetadataService, NavigationIntent, StorageService, useNavigation } from '../../../../../common';
import { UserIdentityStore } from '../../../../talbinah-community/routes/user-identity.service';
import { PostInterestsFacade } from '../../../../talbinah-community';
import { UserContextService, RoleGuardService } from '../../services';
import { PageSpecificDataRefreshService } from '../../../services';
import { MainPageRoutesEnum } from '../../../../main-page';
import { loginPasswordFormConfig } from '../../configs';
import { LoginPasswordFacade } from '../../services';
import { AuthenticationRoutesEnum, UserAuthRouteData } from '../../constants';
import { NewResetPasswordComponent } from '../new-reset-password';
import { OtpMethodSelectionComponent } from '../otp-method-selection';
import { NewOtpVerificationComponent } from '../new-otp-verification';
import { Router } from '@angular/router';
import { TranslationsFacade } from '../../../../../common/core/translations/services';

export interface NewLoginPasswordModalData {
    icon: string;
    title: string;
    description: string;
}

@Component({
    selector: 'app-new-login-password',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        SvgIconComponent
    ],
    templateUrl: './new-login-password.component.html',
    styleUrls: ['./new-login-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewLoginPasswordComponent implements OnInit, OnDestroy {
    private readonly translationsFacade = inject(TranslationsFacade);
    
    protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
    
    protected translate(key: string): string {
        return this.translationsFacade.translate(key);
    }
    
    private readonly _StorageService = inject(StorageService);
    private readonly nav = useNavigation();
    private readonly platformId = inject(PLATFORM_ID);
    private readonly modalService = inject(ModalService);
    private readonly fb = inject(FormBuilder);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly seo = inject(MetadataService);
    private readonly localization = inject(LocalizationService);
    protected readonly _LoginPasswordFacade = inject(LoginPasswordFacade);
    private readonly userContextService = inject(UserContextService);
    private readonly postInterestsFacade = inject(PostInterestsFacade);
    private readonly userIdentityStore = inject(UserIdentityStore);
    private readonly roleGuard = inject(RoleGuardService);
    // private readonly pageSpecificDataRefreshService = inject(PageSpecificDataRefreshService);
    private readonly destroy$ = new Subject<void>();
    protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    private readonly _router = inject(Router);
    protected readonly allInputTypes = ALL_INPUT_TYPES;

    // Modal data inputs
    @Input() icon: string = 'images/logos/icon.png';
    @Input() title: string = 'enter_password';
    @Input() description: string = 'welcome_safe_space';

    // Output for refresh signaling
    @Output() refreshEmitted = new EventEmitter<boolean>();

    // Output for modal closing
    @Output() closed = new EventEmitter<void>();

    public neededDataToVerify = signal<any | null>(null);
    protected readonly formConfig: IFormInputConfig[] = loginPasswordFormConfig;

    public readonly form = this.fb.group({
        password: ['', [Validators.required]],
    });

    private visible = signal(false);
    readonly passwordVisible = this.visible.asReadonly();
    readonly inputType = signal<'password' | 'text'>('password');

    private fcmToken: string | null = null;

    get passwordControl(): FormControl {
        return this.form.get('password') as FormControl;
    }

    constructor() {
        this.setupSubscriptions();
    }

    ngOnInit(): void {
        this.setSeoMeta();
        this.initializeAuthData();
    }

    ngOnDestroy(): void {
        if (this.isBrowser) {
            const currentUrl = this._router.url;
            if (currentUrl === '/' || currentUrl === '/home') {
                document.body.style.overflow = '';
            }
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setSeoMeta(): void {
        const { title, meta } = UserAuthRouteData.login;
        const lang = this.localization.getCurrentLanguage() as keyof typeof title;
        this.seo.setMetaTags({
            title: title[lang],
            description: meta.description[lang],
            keywords: 'login-password, authentication, talbinah',
            image: 'https://api.talbinah.net/dashboard_assets/Talbinah.png',
            url: 'https://talbinah.com/login-password',
            robots: 'index, follow',
            locale: 'en_US',
            canonical: 'https://talbinah.com/login-password'
        });
    }

    private initializeAuthData(): void {
        const checkNumberPayload = this._StorageService.getItem(StorageKeys.CHECK_NUMBER_PAYLOAD);

        if (!checkNumberPayload) {
            Logger.warn('Missing check number payload in localStorage. Cannot proceed with password verification.');
            if (isPlatformBrowser(this.platformId)) {
                this.modalService.closeAll();
                this._LoginPasswordFacade.setError(this.localization.translateTextFromJson('general.missingData'));
            }
            return;
        }

        if (isPlatformBrowser(this.platformId)) {
            this.fcmToken = localStorage.getItem(StorageKeys.FCM_TOKEN);
            Logger.debug('NewPasswordComponent | fcmToken:', this.fcmToken);
        }

        try {
            this.neededDataToVerify.set(checkNumberPayload);
            Logger.debug('New Password Component Needed Data To Verify:', this.neededDataToVerify());
            this._StorageService.removeItem(StorageKeys.CHECK_NUMBER_PAYLOAD);
        } catch (error) {
            Logger.error('Invalid check number payload in localStorage. Cannot proceed with password verification.');
            if (isPlatformBrowser(this.platformId)) {
                this.modalService.closeAll();
                this._LoginPasswordFacade.setError(this.localization.translateTextFromJson('general.missingData'));
            }
        }
    }

    public toggleVisibility(): void {
        this.visible.update((v) => !v);
        this.inputType.set(this.visible() ? 'text' : 'password');
    }

    public getFormControl(name: string): FormControl | null {
        return this.form.get(name) as FormControl;
    }

    public getError(name: string): Record<string, any> | null {
        const control = this.getFormControl(name);
        return control?.invalid && control?.touched ? control.errors : null;
    }

    public getValidationErrorMessage(controlName: string, validations: any[]): string {
        const control = this.getFormControl(controlName);
        if (!control || !control.errors) return '';
        const errorKeys = Object.keys(control.errors);
        for (const v of validations) {
            if (v.errorName && errorKeys.includes(v.errorName)) return v.errorMessage;
            if (!v.errorName && control.errors['required']) return v.errorMessage;
        }
        return 'form.genericError';
    }

    public onSubmit(): void {
        if (this.form.valid) {
            const payload = this.form.getRawValue();
            const verifyData = this.neededDataToVerify();
            if (!verifyData || !verifyData.phone_no || !verifyData.country_id) {
                Logger.error('Missing required data for login');
                this._LoginPasswordFacade.setError(this.localization.translateTextFromJson('general.missingData'));
                return;
            }
            const queryParams = {
                password: payload.password || '',
                phone_no: verifyData.phone_no,
                country_id: verifyData.country_id,
                fcm_token: this.fcmToken,
                device_type: 'web',
            };
            Logger.debug('Login Password Query Params:', queryParams);
            this._LoginPasswordFacade.login(queryParams);

            // Monitor the response after submission
            this.monitorLoginPasswordResponse();
        } else {
            Logger.debug('Login Password Form is invalid');
            this.form.markAllAsTouched();
        }
    }

    private monitorLoginPasswordResponse(): void {
        // Use a simple timeout to check the response after a short delay
        const checkResponse = () => {
            const loading = this._LoginPasswordFacade.loading();
            const success = this._LoginPasswordFacade.success();
            const error = this._LoginPasswordFacade.error();

            if (!loading && success) {
                const response = this._LoginPasswordFacade.response();
                if (response?.status) {
                    const platformId = this.platformId;
                    const storage = this._StorageService;

                    storage.setItem(StorageKeys.TOKEN, response.data.token, true);
                    storage.setItem(StorageKeys.CURRENT_USER_INFO, response.data, true);

                    this.updateUserDataAfterLogin();

                    this.emitRefreshSignal();

                    this.closed.emit();

                    this.handleSuccessfulLogin(storage, platformId);
                }
            } else if (!loading && error) {
                this.cdr.markForCheck();
            } else if (loading) {
                // Still loading, check again in 100ms
                setTimeout(checkResponse, 100);
            }
        };

        // Start checking after a short delay
        setTimeout(checkResponse, 100);
    }

    private setupSubscriptions(): void {
        // No continuous monitoring - we'll handle responses in onSubmit method
    }

    private emitRefreshSignal(): void {
        // Emit refresh signal for user info and wallet reload
        this.refreshEmitted.emit(true);

        // Emit via UserContextService for app-wide refresh
        // this.userContextService.emitRefresh();

        Logger.debug('NewPasswordComponent: Refresh signal emitted');
    }

    private updateUserDataAfterLogin(): void {
        Logger.debug('NewLoginPasswordComponent: Updating user data after successful login');

        // Update post interests data
        this.postInterestsFacade.fetchPostInterests();

        // Update user identity profile data
        this.userIdentityStore.fetch();

        // Trigger user profile data refresh
        this.userContextService.recallUserDataViewed.next(true);
        this.roleGuard.setRole('user');

        // Refresh page-specific data based on current route
        // this.pageSpecificDataRefreshService.refreshDataForCurrentPage();

        Logger.debug('NewLoginPasswordComponent: User data update initiated - wallet, interests, user-profile, page-specific data');
    }

    private handleSuccessfulLogin(storage: StorageService, platformId: any): void {
        // ===== SSR-safe redirect after login =====
        let redirectUrl: string | undefined | null = null;
        if (isPlatformBrowser(platformId)) {
            redirectUrl = storage.getItem(StorageKeys.REDIRECT_AFTER_LOGIN);
            // Clear it after reading
            storage.removeItem(StorageKeys.REDIRECT_AFTER_LOGIN);
        }

        // Modal will be closed by the closed.emit() call above
    }

    public onForgotPassword(): void {
        this.openOtpMethodSelectionDialog();
    }

    private openOtpMethodSelectionDialog(): void {
        Logger.info('Open OTP Login Password dialog');
        this.closed.emit();
        this.modalService.open(OtpMethodSelectionComponent, {
            inputs: {
                image: 'images/auth/icons/talbinah.png',
                title: 'choose_verification_method',
                data: {
                    payploadCheckNumber: this.neededDataToVerify(),
                    fromURL: AuthenticationRoutesEnum.PASSWORD
                }
            },
            outputs: {
                closed: (data: any): void => {
                    Logger.debug('Modal closed with data:', data);
                    if (data?.status) {
                        this._StorageService.setItem(StorageKeys.AUTH_DATA_PAYLOAD, data, true);
                        this._StorageService.setItem(StorageKeys.FROM_URL_PAYLOAD, AuthenticationRoutesEnum.PASSWORD, true);
                        this.openOtpModal();
                    } else {
                        Logger.warn('OTP Login Password Cancelled or Failed');
                    }
                }
            },
            width: '30%',
            closeOnBackdropClick: false,
        });
    }
    private openOtpModal(): void {
        Logger.info('Open OTP modal');
        this.modalService.open(NewOtpVerificationComponent, {
            inputs: {
                image: 'images/icons/logo-2.png',
                title: 'verify_the_code',
                description: 'enter_the_code_sent_to_your_phone',
                fromURL: AuthenticationRoutesEnum.PASSWORD
            },
            outputs: {
                closed: (data: any): void => {
                    Logger.debug('OTP Verification Modal closed:', data);
                }
            },
            minWidth: '60vh',
            maxWidth: '60vh',
            closeOnBackdropClick: false,
        });
    }
    public onClose(): void {
        this.closed.emit();
    }
}
