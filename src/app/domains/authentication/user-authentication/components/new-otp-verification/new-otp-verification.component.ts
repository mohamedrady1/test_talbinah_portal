import { ILoginRequestDto, ILoginResponseDto, IMethodSelectionParams, IMethodSelectionResponseDto, IOtpVerificationRequestDto, IOtpVerificationResponseDto } from "../../dtos";
import { CodeInputComponent, LocalizationService, ModalService, MoodModalIntegrationService, RecaptchaService, StorageKeys, ToastService } from "../../../../../shared";
import { ApiError, handleApiErrorsMessage, Logger, MetadataService, NavigationIntent, StorageService, useNavigation } from "../../../../../common";
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Output, PLATFORM_ID, signal } from "@angular/core";
import { TimerService } from "../../../../../shared/services/timer.service";
import { AuthenticationRoutesEnum, UserAuthRouteData } from "../../constants";
import { UserAuthenticationApiClientProvider } from "../../clients";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { CountdownComponent } from "../otp-verification";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NewLoginComponent } from "../new-login";
import { finalize, take } from "rxjs";
import { NewRegisterComponent } from "../new-register";
import { NewResetPasswordComponent } from "../new-reset-password";
import { MainPageRoutesEnum } from "../../../../main-page/constants/main-page-routes.enum";
import { RoleGuardService, UserContextService } from "../../services";
import { TranslationsFacade } from "../../../../../common/core/translations/services";
export interface NewOtpVerificationModalData {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-new-otp-verification',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CodeInputComponent,
    CountdownComponent
  ],
  templateUrl: './new-otp-verification.component.html',
  styleUrls: ['./new-otp-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewOtpVerificationComponent {
  private readonly translationsFacade = inject(TranslationsFacade);

  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);

  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }

  private readonly userAuthApi = inject(UserAuthenticationApiClientProvider).getClient();
  private readonly modalService = inject(ModalService);
  private recaptcha = inject(RecaptchaService);
  recaptchaToken = signal<string | null>(null);

  readonly isLoading = signal<boolean>(false);
  readonly verifyCodeRequest = signal<IOtpVerificationRequestDto | null>(null);
  readonly verifyCodeResponse = signal<IOtpVerificationResponseDto | null>(null);
  readonly verifyCodeError = signal<ApiError | null>(null);

  readonly isLoadingResend = signal<boolean>(false);
  readonly methodSelectionRequest = signal<IMethodSelectionParams | null>(null);
  readonly MethodSelectionResponse = signal<IMethodSelectionResponseDto | null>(null);
  readonly methodSelectionError = signal<ApiError | null>(null);

  readonly isLoadingLogin = signal<boolean>(false);
  readonly loginRequest = signal<ILoginRequestDto | null>(null);

  private readonly nav = useNavigation();
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _Router = inject(Router);
  private readonly _ToastService = inject(ToastService);
  private readonly _StorageService = inject(StorageService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly roleGuard = inject(RoleGuardService);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _router = inject(Router);
  private readonly seo = inject(MetadataService);
  private readonly localization = inject(LocalizationService);
  private timerService = inject(TimerService);

  protected codeNotValid = signal(false);
  protected neededDataToVerify = signal<any | null>(null);
  private codeLength = signal<number | string | null>(null);
  private clearInputs = signal(false);
  private isWaiting = signal(false);
  private expireAt = signal<number>(this.generateInitialTimestamp());

  private backURL = signal<number | string | null>(null);

  // Dynamic title key based on source (password reset vs general)
  protected titleKey = signal<string>('verify_the_code');

  // Output for modal closing
  @Output() closed = new EventEmitter<void>();

  protected inputsNumber: number = 4;

  readonly isSubmitDisabled = computed(() => {
    const code = this.codeLength();
    return !code || code.toString().length < this.inputsNumber;
  });

  constructor() {
    // Effects will be set up using setTimeout-based polling instead of effect()
  }

  ngOnInit(): void {
    this.setSeoMeta();

    const queryParams = this._ActivatedRoute.snapshot.queryParams;
    Logger.debug('OtpVerificationComponent | Query Params:', queryParams);

    const fromUrlPayload = this._StorageService.getItem(StorageKeys.FROM_URL_PAYLOAD);
    if (fromUrlPayload) {
      this.backURL.set(fromUrlPayload.toString());
      Logger.debug('OtpVerificationComponent | backURL from localStorage:', this.backURL());
      this._StorageService.removeItem(StorageKeys.FROM_URL_PAYLOAD);
      // Adjust title for password reset flow
      if (typeof fromUrlPayload === 'string' && fromUrlPayload.includes(AuthenticationRoutesEnum.PASSWORD)) {
        // Use a more specific title if available, else fallback to generic
        this.titleKey.set('reset_password');
      }
    }

    const authDataPayload = this._StorageService.getItem(StorageKeys.AUTH_DATA_PAYLOAD);
    if (!authDataPayload) {
      Logger.warn('Missing auth data payload in localStorage. Redirecting to login...');
      this._ToastService.add({
        severity: 'error',
        summary: 'an_error_has_occurred',
        detail: 'missing_data',
        life: 5000,
      });
      return;
    }

    try {
      this.neededDataToVerify.set(authDataPayload);
      Logger.debug('OtpVerificationComponent | Needed Data To Verify:', this.neededDataToVerify());

      this._StorageService.removeItem(StorageKeys.AUTH_DATA_PAYLOAD);
    } catch (error) {
      Logger.error('Invalid auth data payload in localStorage. Redirecting to login...');
      this._ToastService.add({
        severity: 'error',
        summary: 'an_error_has_occurred',
        detail: 'missing_data',
        life: 5000,
      });
      if (isPlatformBrowser(this.platformId)) {
        this._Router.navigate([AuthenticationRoutesEnum.LOGIN]);
      }
    }
  }
  private setSeoMeta(): void {
    const { title, meta } = UserAuthRouteData.otpVerification;
    const lang = this.localization.getCurrentLanguage() as keyof typeof title;
    this.seo.setMetaTags({
      title: title[lang],
      description: meta.description[lang],
      keywords: 'verify-code, authentication, talbinah',
      image: 'https://api.talbinah.net/dashboard_assets/Talbinah.png',
      url: 'https://talbinah.com/verify-code',
      robots: 'index, follow',
      locale: 'en_US',
      canonical: 'https://talbinah.com/verify-code'
    });
  }

  private generateInitialTimestamp(): number {
    return this.timerService.getFutureTimestamp(30_000);
  }
  protected handleCodeChange(code: number | string | null): void {
    this.codeLength.set(code);
  }
  protected handleCodeCompletion(code: number | string | null): void {
    this.codeLength.set(code);
  }
  protected printTimeEnd(event: { end: boolean }): void {
    if (event?.end) {
      this.isWaiting.set(true);
      Logger.debug('OtpVerificationComponent | Countdown ended, resend button is now active');
    }
  }

  protected checkCode(): void {
    const code = this.codeLength();
    if (!code || code.toString().length < this.inputsNumber) {
      return;
    }
    Logger.debug('OtpVerificationComponent | Code submitted:', code);
    const queryParams: IOtpVerificationRequestDto = {
      code: code.toString(),
      phone_no: this.neededDataToVerify()?.payploadCheckNumber?.phone_no || '',
      country_id: this.neededDataToVerify()?.payploadCheckNumber?.country_id || 0,
    };
    Logger.debug('OtpVerificationComponent | Verify Code Query Params:', queryParams);
    this.verifyCodeRequest.set(queryParams);
    this.monitorVerifyCodeResponse();
  }
  private monitorVerifyCodeResponse(): void {
    const request = this.verifyCodeRequest();
    if (!request) return;

    this.isLoading.set(true);
    this.userAuthApi.verifyCode(request)
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (res: IOtpVerificationResponseDto) => {
          this.verifyCodeResponse.set(res);
          this.handleVerifyCodeResponse(res);
        },
        error: (error: ApiError) => {
          this.verifyCodeError.set(error);
          this._ToastService.add({
            severity: 'error',
            summary: 'an_error_has_occurred',
            detail: String(error?.message ?? 'Unknown error'),
            life: 5000,
          });

          handleApiErrorsMessage(error);
        }
      });
  }
  protected handleVerifyCodeResponse(res: IOtpVerificationResponseDto): void {
    Logger.debug('OtpVerificationComponent | Handle Verify Code called', res);
    if (res.status) {
      const backUrlValue = this.backURL();
      if (
        typeof backUrlValue === 'string' &&
        backUrlValue.includes(AuthenticationRoutesEnum.PASSWORD)
      ) {
        this._StorageService.setItem(StorageKeys.AUTH_DATA_PAYLOAD, this.verifyCodeRequest(), true);
        this.openResetPasswordModal();
      } else if (typeof backUrlValue === 'string' &&
        backUrlValue.includes(AuthenticationRoutesEnum.LOGIN)) {
        this._StorageService.setItem(StorageKeys.CHECK_NUMBER_PAYLOAD, this.verifyCodeRequest(), true);
        this.nav.navigate(NavigationIntent.INTERNAL, AuthenticationRoutesEnum.PASSWORD);
      } else if (typeof backUrlValue === 'string' &&
        backUrlValue.includes(AuthenticationRoutesEnum.REGISTER)) {
        Logger.debug('OtpVerificationComponent | Registration Success: ', res);

        // If API returned auth directly, persist and finish
        const token = (res as any)?.data?.token;
        const user = (res as any)?.data?.user;
        if (token && user) {
          this._StorageService.setItem(StorageKeys.TOKEN, token, true);
          this._StorageService.setItem(StorageKeys.CURRENT_USER_INFO, { token, user }, true);
          this._UserContextService.recallUserDataViewed.next(true);
          this.roleGuard.setRole('user');
          // Close current modal, then navigate
          this.closed.emit();
          this.modalService.closeAll();
          this.nav.navigate(NavigationIntent.INTERNAL, '/');
          return;
        }

        // Otherwise, auto-login using registration password if available
        const needed = this.neededDataToVerify();
        const registrationPassword = needed?.password;
        if (registrationPassword) {
          const loginPayload: ILoginRequestDto = {
            phone_no: needed?.payploadCheckNumber?.phone_no,
            country_id: needed?.payploadCheckNumber?.country_id,
            password: registrationPassword,
            device_type: 'web',
            fcm_token: isPlatformBrowser(this.platformId) ? localStorage.getItem(StorageKeys.FCM_TOKEN) : null as any
          };
          this.closed.emit();
          this.loginRequest.set(loginPayload);
          this.monitorLoginResponse();

        } else {
          // Fallback: prompt login
          this.openLoginModal();
        }
      }

    } else {
      Logger.warn('Verify Code Cancelled or Failed');
    }
  }
  private openLoginModal(): void {
    this.closed.emit();
    const modalData = {
      image: 'images/icons/logo-2.png',
      title: 'login',
      description: 'welcome_safe_space',
    };

    this.modalService.open(NewLoginComponent, {
      inputs: modalData,
      minWidth: '70vh',
      maxWidth: '70vh',
      minHeight: '50vh',
      closeOnBackdropClick: false,
      outputs: {
        closed: (data: any): void => {
          Logger.debug('Login Modal closed with data:', data);
        }
      },
    });
  }
  private openResetPasswordModal(): void {
    this.closed.emit();
    const modalData = {
      image: 'images/icons/logo-2.png',
      title: 'reset_password',
      description: 'welcome_safe_space',
    };

    this.modalService.open(NewResetPasswordComponent, {
      inputs: modalData,
      minWidth: '70vh',
      maxWidth: '70vh',
      minHeight: '50vh',
      outputs: {
        closed: (data: any): void => {
          Logger.debug('Login Modal closed with data:', data);
        }
      },
    });
  }
  protected resendCode(reset: boolean): void {
    if (!reset) return;
    Logger.debug('OtpVerificationComponent | Resend code requested');
    this.isWaiting.set(false);
    this.isLoadingResend.set(true);
    this.onOtpMethodSelectionSubmit();
  }

  protected async onOtpMethodSelectionSubmit(): Promise<void> {
    Logger.debug('OtpVerificationComponent | Needed Data To Verify : ', this.neededDataToVerify());
    this.clearInputs.set(true);

    try {
      this.isLoadingResend.set(true);
      const token = await this.recaptcha.execute('LOGIN');
      this.recaptchaToken.set(token);
      Logger.debug('OtpVerificationComponent | reCAPTCHA token received:', token);
    } catch (err) {
      Logger.warn('Failed to fetch reCAPTCHA token', err);
      this.isLoadingResend.set(false);
      this.isWaiting.set(true);
      this._ToastService.add({
        severity: 'error',
        summary: 'an_error_has_occurred',
        detail: 'failed_to_resend_verification_code',
        life: 5000,
      });
      return;
    }
    const queryParams: IMethodSelectionParams = {
      channel: this.neededDataToVerify().data.channel ?? '',
      phone_no: this.neededDataToVerify()?.payploadCheckNumber?.phone_no,
      country_id: this.neededDataToVerify()?.payploadCheckNumber?.country_id,
      role: 'user',
      device_type: 'web',
      'g-recaptcha-response': this.recaptchaToken() ?? '',
      platform: 'portal',
      app_type: 'web'
    };
    Logger.debug('OtpVerificationComponent | Method Selection Query Params:', queryParams);
    this.methodSelectionRequest.set(queryParams);
    this.monitorMethodSelectionResponse();
  }
  private monitorMethodSelectionResponse(): void {
    const request = this.methodSelectionRequest();
    if (!request) return;

    this.userAuthApi.methodSelection(request)
      .pipe(
        take(1),
        finalize(() => this.isLoadingResend.set(false))
      )
      .subscribe({
        next: (res: IMethodSelectionResponseDto) => {
          this.MethodSelectionResponse.set(res);
          this.handleMethodSelection(res);
        },
        error: (error: ApiError) => {
          this.methodSelectionError.set(error);
          this._ToastService.add({
            severity: 'error',
            summary: 'an_error_has_occurred',
            detail: String(error?.message ?? 'Unknown error'),
            life: 5000,
          });
          handleApiErrorsMessage(error);
          this.isWaiting.set(true);
          this._ToastService.add({
            severity: 'error',
            summary: 'an_error_has_occurred',
            detail: 'failed_to_resend_verification_code',
            life: 5000,
          });
        }
      });
  }
  protected handleMethodSelection(res: IMethodSelectionResponseDto): void {
    Logger.debug('OtpVerificationComponent | Handle Method Selection called', res);
    if (res.status) {
      Logger.debug('OtpVerificationComponent | Method Selection successful, starting new countdown');
      this.preformResendCode();
    } else {
      Logger.warn('Method Selection failed');
      this.isWaiting.set(true);
      this._ToastService.add({
        severity: 'error',
        summary: 'an_error_has_occurred',
        detail: 'failed_to_resend_verification_code',
        life: 5000,
      });
    }
  }

  private preformResendCode(): void {
    Logger.debug('OtpVerificationComponent | Starting new countdown for 30 seconds');
    this.isWaiting.set(false);
    this.expireAt.set(this.timerService.getFutureTimestamp(30_000));
    this.clearInputs.set(true);
    this.codeLength.set(null);
    this.codeNotValid.set(false);

    setTimeout(() => {
      this.clearInputs.set(false);
      Logger.debug('OtpVerificationComponent | Code inputs cleared and ready for new input');
    }, 100);
  }
  protected backToRegister(): void {
    const modalData = {
      image: 'images/icons/logo-2.png',
      title: 'create_new_account',
      description: 'join_talbinah_start_journey_towards_mental_health',
      number: this.neededDataToVerify()?.payploadCheckNumber?.phone_no,
      country_id: this.neededDataToVerify()?.payploadCheckNumber?.country_id,
    };

    this.modalService.open(NewRegisterComponent, {
      inputs: modalData,
      minWidth: '70vh',
      maxWidth: '70vh',
      maxHeight: '70vh',
      closeOnBackdropClick: false,
      outputs: {
        closed: (data: any): void => {
          Logger.debug('Login Modal closed with data:', data);
        }
      },
    });
  }
  protected backTo(): void {
    const backUrlValue = this.backURL();
    const targetUrl =
      (typeof backUrlValue === 'number' ? backUrlValue.toString() : backUrlValue) ||
      AuthenticationRoutesEnum.LOGIN;
    this.nav.navigate(
      NavigationIntent.INTERNAL,
      targetUrl
    );
  }

  private monitorLoginResponse(): void {
    const request = this.loginRequest();
    if (!request) return;

    this.isLoadingLogin.set(true);
    this.userAuthApi.login(request)
      .pipe(
        take(1),
        finalize(() => this.isLoadingLogin.set(false))
      )
      .subscribe({
        next: (res: ILoginResponseDto) => {
          this.handleSuccessfulLogin(res);
        },
        error: (error: ApiError) => {
          this._ToastService.add({
            severity: 'error',
            summary: 'an_error_has_occurred',
            detail: String(error?.message ?? 'Unknown error'),
            life: 5000,
          });
          handleApiErrorsMessage(error);
        }
      });
  }

  private handleSuccessfulLogin(res: ILoginResponseDto): void {
    Logger.debug('OtpVerificationComponent | Successful login after OTP verification', res);
    if (!res.status) {
      Logger.warn('Login response status is not successful');
      return;
    }

    const platformId = this.platformId;
    const storage = this._StorageService;
    const nav = this.nav;

    // ===== Store token and current user info =====
    storage.setItem(StorageKeys.TOKEN, res.data.token, true);
    storage.setItem(StorageKeys.CURRENT_USER_INFO, res.data, true);
    // Refresh header immediately
    try {
      const userContext = (this as any)._UserContextService as any;
      const roleGuard = (this as any).roleGuard as any;
      userContext?.recallUserDataViewed?.next(true);
      roleGuard?.setRole?.('user');
    } catch { }

    // ===== SSR-safe redirect after login =====
    let redirectUrl: string | undefined | null = null;
    if (isPlatformBrowser(platformId)) {
      redirectUrl = storage.getItem(StorageKeys.REDIRECT_AFTER_LOGIN);
      storage.removeItem(StorageKeys.REDIRECT_AFTER_LOGIN); // clear after use
      Logger.debug('OtpVerificationComponent | Redirect after login:', redirectUrl);
    }

    // Navigate to main page (or redirect if available)
    if (redirectUrl) {
      nav.navigate(NavigationIntent.INTERNAL, redirectUrl);
    } else {
      nav.navigate(NavigationIntent.INTERNAL, MainPageRoutesEnum.MAINPAGE);
    }
  }


  get codeLengthValue(): number | string | null {
    return this.codeLength();
  }
  get isWaitingValue(): boolean {
    return this.isWaiting();
  }
  get clearInputsValue(): boolean {
    return this.clearInputs();
  }
  get customTime(): number {
    return this.expireAt();
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      const currentUrl = this._router.url;
      if (currentUrl === '/' || currentUrl === '/home') {
        document.body.style.overflow = '';
      }
    }
    this.recaptcha.removeScript();
  }
}
