import {
  Component,
  signal,
  effect,
  inject,
  ChangeDetectorRef,
  OnInit,
  PLATFORM_ID,
  ChangeDetectionStrategy,
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
import {
  ALL_INPUT_TYPES,
  IFormInputConfig,
  LocalizationService,
  ModalService,
  StorageKeys,
  SvgIconComponent,
  MoodModalIntegrationService,
} from '../../../../../shared';
import {
  Logger,
  MetadataService,
  NavigationIntent,
  StorageService,
  useNavigation
} from '../../../../../common';
import { AuthenticationRoutesEnum, UserAuthRouteData } from '../../constants';
import { OtpMethodSelectionComponent } from '../otp-method-selection';
import { loginPasswordFormConfig } from '../../configs';
import { MainPageRoutesEnum } from '../../../../main-page';
import { LoginPasswordFacade } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, SvgIconComponent],
  templateUrl: './login-password.component.html',
  styleUrls: ['./login-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPasswordComponent implements OnInit {
  private readonly _StorageService = inject(StorageService);
  private readonly nav = useNavigation();
  private readonly _Router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly modalService = inject(ModalService);
  private readonly fb = inject(FormBuilder);
  protected readonly cdr = inject(ChangeDetectorRef);
  private readonly seo = inject(MetadataService);
  private readonly localization = inject(LocalizationService);
  protected readonly _LoginPasswordFacade = inject(LoginPasswordFacade);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);
  protected readonly allInputTypes = ALL_INPUT_TYPES;

  protected neededDataToVerify = signal<any | null>(null);
  protected readonly formConfig: IFormInputConfig[] = loginPasswordFormConfig;

  protected readonly form = this.fb.group({
    password: ['', [Validators.required]],
  });

  private visible = signal(false);
  readonly passwordVisible = this.visible.asReadonly();
  readonly inputType = signal<'password' | 'text'>('password');

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  private fcmToken: string | null = null;

  constructor() {
    this.setupFacadeEffect();
  }

  ngOnInit(): void {
    this.setSeoMeta();

    const checkNumberPayload = this._StorageService.getItem(StorageKeys.CHECK_NUMBER_PAYLOAD);

    if (!checkNumberPayload) {
      Logger.warn('Missing check number payload in localStorage. Redirecting to login...');
      if (isPlatformBrowser(this.platformId)) {
        this._Router.navigate([AuthenticationRoutesEnum.LOGIN]);
        this._LoginPasswordFacade.setError(this.localization.translateTextFromJson('general.missingData'));
      }
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      this.fcmToken = localStorage.getItem(StorageKeys.FCM_TOKEN);
      Logger.debug('LoginPasswordComponent | fcmToken:', this.fcmToken);
    }

    try {
      this.neededDataToVerify.set(checkNumberPayload);
      Logger.debug('Login Password Component Needed Data To Verify:', this.neededDataToVerify());
      this._StorageService.removeItem(StorageKeys.CHECK_NUMBER_PAYLOAD);
    } catch (error) {
      Logger.error('Invalid check number payload in localStorage. Redirecting to login...');
      if (isPlatformBrowser(this.platformId)) {
        this._Router.navigate([AuthenticationRoutesEnum.LOGIN]);
        this._LoginPasswordFacade.setError(this.localization.translateTextFromJson('general.missingData'));
      }
    }
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
    if (!control || !control.errors) return '';
    const errorKeys = Object.keys(control.errors);
    for (const v of validations) {
      if (v.errorName && errorKeys.includes(v.errorName)) return v.errorMessage;
      if (!v.errorName && control.errors['required']) return v.errorMessage;
    }
    return 'form.genericError';
  }

  protected onSubmit(): void {
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
    } else {
      Logger.debug('Login Password Form is invalid');
      this.form.markAllAsTouched();
    }
  }

  private setupFacadeEffect(): void {
    effect(() => {
      if (!this._LoginPasswordFacade.loading() && this._LoginPasswordFacade.success()) {
        const response = this._LoginPasswordFacade.response();
        if (response?.status) {
          const platformId = this.platformId;
          const storage = this._StorageService;
          const nav = this.nav;

          // Store user token and info
          storage.setItem(StorageKeys.TOKEN, response.data.token, true);
          storage.setItem(StorageKeys.CURRENT_USER_INFO, response.data, true);

          // Show mood modal after successful login
          setTimeout(() => {
            // this.moodModalIntegrationService.checkMoodModal();
          }, 1000);

          // ===== SSR-safe redirect after login =====
          let redirectUrl: string | undefined | null = null;
          if (isPlatformBrowser(platformId)) {
            redirectUrl = storage.getItem(StorageKeys.REDIRECT_AFTER_LOGIN);
            // Clear it after reading
            storage.removeItem(StorageKeys.REDIRECT_AFTER_LOGIN);
          }

          // Navigate to stored redirect URL or fallback to main page
          if (redirectUrl) {
            nav.navigate(NavigationIntent.INTERNAL, redirectUrl);
          } else {
            nav.navigate(NavigationIntent.INTERNAL, MainPageRoutesEnum.MAINPAGE);
          }
        }
      }

      if (this._LoginPasswordFacade.error()) {
        this.cdr.markForCheck();
      }
    });
  }

  private openOtpMethodSelectionDialog(): void {
    Logger.info('Open OTP Login Password dialog');
    this.modalService.open(OtpMethodSelectionComponent, {
      inputs: {
        image: 'images/auth/icons/talbinah.png',
        title: 'OtpMethodSelection.Title',
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
            this.nav.navigate(NavigationIntent.INTERNAL, AuthenticationRoutesEnum.VERIFY_CODE);
          } else {
            Logger.warn('OTP Login Password Cancelled or Failed');
          }
        }
      },
      width: '30%',
      closeOnBackdropClick: false,
    });
  }

  protected onForgotPassword(): void {
    this.openOtpMethodSelectionDialog();
  }
}
