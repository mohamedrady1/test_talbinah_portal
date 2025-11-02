import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormBuilder,
  Validators,
  FormsModule
} from '@angular/forms';
import {
  IFormInputConfig,
  ALL_INPUT_TYPES,
  StorageKeys,
  ModalService,
  LocalizationService,
  SvgIconComponent,
  MoodModalIntegrationService
} from '../../../../../shared';
import { MetadataService, NavigationIntent, useNavigation, StorageService } from '../../../../../common';
import { TranslateApiPipe } from './../../../../../common/core/translations/pipes/translate-api.pipe';
import { AuthenticationRoutesEnum, UserAuthRouteData } from '../../constants';
import { AsGuestFacade, LoginFacade, RoleGuardService } from '../../services';
import { Logger } from '../../../../../common/core/utilities/logging/logger';
import { CountriesLookupFacade, ICountryDto } from '../../../../lookups';
import { OtpMethodSelectionComponent } from '../otp-method-selection';
import { checkNumberFormConfig } from '../../configs';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SelectModule,
    FormsModule,

    SvgIconComponent,

    TranslateApiPipe
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly nav = useNavigation();
  private readonly modalService = inject(ModalService);
  private readonly seo = inject(MetadataService);
  private readonly localization = inject(LocalizationService);
  private readonly storageService = inject(StorageService);
  private readonly countriesService = inject(CountriesLookupFacade);
  protected readonly _LoginFacade = inject(LoginFacade);
  protected readonly allInputTypes = ALL_INPUT_TYPES;
  private readonly roleGuard = inject(RoleGuardService);
  private readonly allowedPhoneCodesInOrder = ['+966', '+965', '+973', '+974', '+971', '+968', '+20'];
  protected readonly countriesList = computed(() => this.countriesService.Countries());
  protected readonly isLoadingCountries = computed(() => this.countriesService.isLoading());
  protected readonly allowedCountries = computed(() => {
    const countries = this.countriesList()?.data ?? [];
    return this.allowedPhoneCodesInOrder
      .map(code => countries.find(c => c.phone_code === code))
      .filter((c): c is NonNullable<typeof c> => !!c);
  });

  readonly formConfigs: IFormInputConfig[] = checkNumberFormConfig;
  protected readonly isEditable = signal(true);
  selectedCountryModel = signal<ICountryDto | null>(null);
  protected loginForm!: ReturnType<FormBuilder['group']>;

  protected readonly _AsGuestFacade = inject(AsGuestFacade);
  protected readonly cdr = inject(ChangeDetectorRef);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);

  constructor() {
    this.initializeForm();
    this.setSeoMeta();
    this.countriesService.fetchCountries();

    effect(() => {
      if (!this.countriesService.isLoading() && this.countriesService.status()) {
        const match = this.allowedCountries()?.find(c => c.phone_code === '+966');
        if (match) this.selectedCountryModel.set(match);
      }
    });

    effect(() => {
      if (!this._LoginFacade.loading() && this._LoginFacade.success()) {
        const response = this._LoginFacade.response();
        if (response?.status) {
          if (response.data.user) {
            this.storageService.setItem(StorageKeys.CHECK_NUMBER_PAYLOAD, this._LoginFacade.checkNumberRequest(), true);
            this.nav.navigate(NavigationIntent.INTERNAL, AuthenticationRoutesEnum.PASSWORD);
          } else {
            if (response.data.validated === true && response.data.otp_verified == false) {
              this.openOtpMethodSelectionDialog();
            } else {
              this.storageService.setItem(StorageKeys.AUTH_DATA_PAYLOAD, this._LoginFacade.checkNumberRequest(), true);
              this.storageService.setItem(StorageKeys.FROM_URL_PAYLOAD, AuthenticationRoutesEnum.LOGIN, true);
              this.nav.navigate(NavigationIntent.INTERNAL, AuthenticationRoutesEnum.REGISTER);
            }
          }
        }
      }
    });

    this.setupGuestFacadeEffect();
  }

  private setupGuestFacadeEffect(): void {
    effect(() => {
      if (!this._AsGuestFacade.loading() && this._AsGuestFacade.success()) {
        const response = this._AsGuestFacade.response();
        Logger.debug('LoginComponent | response: ', response);
        if (response?.status) {
          this.storageService.setItem(StorageKeys.TOKEN, response.data.token, true);
          this.storageService.setItem(StorageKeys.CURRENT_USER_INFO, response.data, true);

          // Show mood modal after successful guest login
          setTimeout(() => {
            // this.moodModalIntegrationService.checkMoodModal();
          }, 1000);

          this.nav.navigate(NavigationIntent.INTERNAL, '/');
        }
      }
      if (this._AsGuestFacade.error()) {
        this.cdr.markForCheck();
      }
    });
  }

  protected LoginAsGuest(): void {
    this._AsGuestFacade.asGuest();
  }

  private setSeoMeta(): void {
    const { title, meta } = UserAuthRouteData.login;
    const lang = this.localization.getCurrentLanguage() as keyof typeof title;
    this.seo.setMetaTags({
      title: title[lang],
      description: meta.description[lang],
      keywords: 'login, authentication, talbinah',
      image: 'https://api.talbinah.net/dashboard_assets/Talbinah.png',
      url: 'https://talbinah.com/login',
      robots: 'index, follow',
      locale: 'en_US',
      canonical: 'https://talbinah.com/login'
    });
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      phoneNumber: this.fb.control({ value: null, disabled: false }, [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.minLength(3),
        Validators.maxLength(12)
      ])
    });
  }

  protected onCountryChange(country: ICountryDto): void {
    this.selectedCountryModel.set(country);
    const phoneControl = this.loginForm.get('phoneNumber');
    if (phoneControl) {
      phoneControl.reset();
    }
  }

  protected onSubmit(): void {
    if (this.loginForm.valid) {
      this.roleGuard.setRole('user');

      const formValues = this.loginForm.getRawValue();
      const selectedCountry = this.selectedCountryModel();
      if (!selectedCountry || selectedCountry.code === undefined || selectedCountry.code === null) {
        Logger.error('Country is required for login');
        return;
      }
      const queryParams = {
        phone_no: formValues.phoneNumber,
        country_id: selectedCountry.id,
        role: 'user',
        device_type: 'web'
      };
      Logger.debug('Check Number Query Params:', queryParams);
      this._LoginFacade.checkNumber(queryParams);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  protected getFormControl(controlName: string): FormControl | null {
    return this.loginForm.get(controlName) as FormControl;
  }

  protected getError(controlName: string): Record<string, any> | null {
    const control = this.getFormControl(controlName);
    return control?.invalid && control?.touched ? control.errors : null;
  }

  protected getValidationErrorMessage(controlName: string, validations: any[]): string {
    const control: any = this.loginForm.get(controlName);
    if (!control?.errors?.['required'] && !validations?.length) return '';
    const errorKeys = Object.keys(control?.errors || {});
    for (const v of validations) {
      if ((v.errorName && errorKeys.includes(v.errorName)) || (!v.errorName && control?.errors['required'])) {
        return v.errorMessage;
      }
    }
    return 'form.genericError';
  }

  private openOtpMethodSelectionDialog(): void {
    Logger.info('Open OTP method selection dialog');
    this.modalService.open(OtpMethodSelectionComponent, {
      inputs: {
        image: 'images/auth/icons/talbinah.png',
        title: 'choose_verification_method',
        data: {
          payploadCheckNumber: this._LoginFacade.checkNumberRequest(),
          fromURL: AuthenticationRoutesEnum.LOGIN
        }
      },
      outputs: {
        closed: (data: any): void => {
          Logger.debug('Modal closed with data:', data);
          if (data?.status) {
            Logger.debug('OTP Method Selection Successful:', data);
            this.storageService.setItem(StorageKeys.AUTH_DATA_PAYLOAD, data, true);
            this.storageService.setItem(StorageKeys.FROM_URL_PAYLOAD, AuthenticationRoutesEnum.LOGIN, true);
            this.nav.navigate(NavigationIntent.INTERNAL, AuthenticationRoutesEnum.VERIFY_CODE);
          } else {
            Logger.warn('OTP Method Selection Cancelled or Failed');
          }
        }
      },
      width: '30%',
      closeOnBackdropClick: false,
    });
  }

  protected onRoleSelect(role: 'doctor' | 'patient'): void {
    Logger.debug('Selected role:', role);
    if (role === 'doctor') {
      this.nav.navigate(NavigationIntent.EXTERNAL_NEW_TAB, AuthenticationRoutesEnum.EXTERNAL_DOCTOR_REGISTER);
    } else {
      this.nav.navigate(NavigationIntent.INTERNAL, AuthenticationRoutesEnum.REGISTER);
    }
  }
}
