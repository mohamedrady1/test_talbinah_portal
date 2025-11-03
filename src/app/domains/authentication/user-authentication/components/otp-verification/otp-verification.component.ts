import { ApiError, handleApiErrorsMessage, MetadataService, NavigationIntent, NavigationStateService, useNavigation, StorageService } from '../../../../../common';
import { AuthenticationRoutesEnum, UserAuthRouteData } from '../../constants';
import { Logger } from '../../../../../common/core/utilities/logging/logger';
import { TimerService } from '../../../../../shared/services/timer.service';
import { CodeInputComponent } from '../../../../../shared/components';
import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { LocalizationService, RecaptchaService, ToastService, StorageKeys, MoodModalIntegrationService } from '../../../../../shared';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationsFacade } from '../../../../../common/core/translations/services';
import { CountdownComponent } from './countdown';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserAuthenticationApiClientProvider } from '../../clients';
import { IMethodSelectionParams, IMethodSelectionResponseDto, IOtpVerificationRequestDto, IOtpVerificationResponseDto, ILoginRequestDto, ILoginResponseDto } from '../../dtos';
import { finalize, take } from 'rxjs';
import { MainPageRoutesEnum } from '../../../../main-page';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CodeInputComponent,
    CountdownComponent,
  ],
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent {
  private readonly userAuthApi = inject(UserAuthenticationApiClientProvider).getClient();

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
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly seo = inject(MetadataService);
  private readonly localization = inject(LocalizationService);
  private timerService = inject(TimerService);
  private readonly translationsFacade = inject(TranslationsFacade);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }

  protected codeNotValid = signal(false);
  protected neededDataToVerify = signal<any | null>(null);
  private codeLength = signal<number | string | null>(null);
  private clearInputs = signal(false);
  private isWaiting = signal(false);
  private expireAt = signal<number>(this.generateInitialTimestamp());

  private backURL = signal<number | string | null>(null);

  protected inputsNumber: number = 4;

  readonly isSubmitDisabled = computed(() => {
    const code = this.codeLength();
    return !code || code.toString().length < this.inputsNumber;
  });

  constructor() {
    this.setupVerifyCodeEffect();
    this.setupOtpMethodSelectionEffect();
    this.setupLoginEffect();
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
    }

    const authDataPayload = this._StorageService.getItem(StorageKeys.AUTH_DATA_PAYLOAD);
    if (!authDataPayload) {
      Logger.warn('Missing auth data payload in localStorage. Redirecting to login...');
      this._ToastService.add({
        severity: 'error',
        summary: 'an_error_has_occurred',
        detail: 'general.missingData',
        life: 5000,
      });
      if (isPlatformBrowser(this.platformId)) {
        this._Router.navigate([AuthenticationRoutesEnum.LOGIN]);
      }

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
        detail: 'general.missingData',
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
      code: code,
      phone_no: this.neededDataToVerify()?.payploadCheckNumber?.phone_no,
      country_id: this.neededDataToVerify()?.payploadCheckNumber?.country_id,
    };
    Logger.debug('OtpVerificationComponent | Verify Code Query Params:', queryParams);
    this.verifyCodeRequest.set(queryParams);
  }
  private setupVerifyCodeEffect(): void {
    effect(() => {
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
        this.nav.navigate(NavigationIntent.INTERNAL, AuthenticationRoutesEnum.RESER_PASSWORD);
      } else if (typeof backUrlValue === 'string' &&
        backUrlValue.includes(AuthenticationRoutesEnum.LOGIN)) {
        this._StorageService.setItem(StorageKeys.CHECK_NUMBER_PAYLOAD, this.verifyCodeRequest(), true);
        this.nav.navigate(NavigationIntent.INTERNAL, AuthenticationRoutesEnum.PASSWORD);
      } else if (typeof backUrlValue === 'string' &&
        backUrlValue.includes(AuthenticationRoutesEnum.REGISTER)) {
        Logger.debug('OtpVerificationComponent | OtpVerificationComponent => From Register Success: ', res);
        const neededData = this.neededDataToVerify();
        const registrationPassword = neededData?.password;

        if (registrationPassword) {
          const loginPayload: ILoginRequestDto = {
            phone_no: neededData?.payploadCheckNumber?.phone_no,
            country_id: neededData?.payploadCheckNumber?.country_id,
            password: registrationPassword,
            device_type: 'web',
            fcm_token: localStorage.getItem(StorageKeys.FCM_TOKEN)
          };
          this.loginRequest.set(loginPayload);
        } else {
          Logger.error('Password not found for login after registration.');
        }
      }
    } else {
      Logger.warn('Verify Code Cancelled or Failed');
    }
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
  }
  private setupOtpMethodSelectionEffect(): void {
    effect(() => {
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

  private setupLoginEffect(): void {
    effect(() => {
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

    // Show mood modal after successful login
    setTimeout(() => {
      // this.moodModalIntegrationService.checkMoodModal();
    }, 1000);

    // ===== SSR-safe redirect after login =====
    let redirectUrl: string | undefined | null = null;
    if (isPlatformBrowser(platformId)) {
      redirectUrl = storage.getItem(StorageKeys.REDIRECT_AFTER_LOGIN);
      storage.removeItem(StorageKeys.REDIRECT_AFTER_LOGIN); // clear after use
      Logger.debug('OtpVerificationComponent | Redirect after login:', redirectUrl);
    }

    // Navigate to stored redirect URL or fallback to main page
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
    this.recaptcha.removeScript();
  }
}
