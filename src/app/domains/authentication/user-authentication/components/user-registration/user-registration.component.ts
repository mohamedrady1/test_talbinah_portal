import { LocalizationService, IFormInputConfig, InputIconType, ToastService, ModalService, StorageKeys, ALL_INPUT_TYPES, SvgIconComponent } from '../../../../../shared';
import { Component, inject, effect, PLATFORM_ID, makeStateKey, StateKey, TransferState, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { MetadataService, NavigationIntent, NavigationStateService, useNavigation, StorageService, Logger } from '../../../../../common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationRoutesEnum, UserAuthRouteData } from '../../constants';
import { CountriesLookupFacade, ICountryDto } from '../../../../lookups';
import { IRegisterRequestDto, IRegisterResponseDto } from '../../dtos';
import { OtpMethodSelectionComponent } from '../otp-method-selection';
import { UserContextService, RegisterFacade } from '../../services';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { registerFormConfig } from '../../configs';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    SvgIconComponent
  ], templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserRegistrationComponent {
  private readonly nav = useNavigation();

  private readonly modalService = inject(ModalService);
  private readonly userContext = inject(UserContextService);
  private readonly navState = inject(NavigationStateService);
  private readonly seo = inject(MetadataService);
  private readonly localization = inject(LocalizationService);
  private readonly router = inject(Router);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fb = inject(FormBuilder);
  protected readonly _RegisterFacade = inject(RegisterFacade);

  formConfigs: IFormInputConfig[] = [];
  InputIconType = InputIconType;
  protected readonly allInputTypes = ALL_INPUT_TYPES;

  protected registerForm!: ReturnType<FormBuilder['group']>;

  private readonly countriesService = inject(CountriesLookupFacade);
  private readonly allowedPhoneCodesInOrder = ['+966', '+965', '+973', '+974', '+971', '+968', '+20'];
  protected readonly countriesList = computed<any>(() => this.countriesService.Countries());
  protected readonly isLoadingCountries = computed<any>(() => this.countriesService.isLoading());
  protected readonly allowedCountries = computed(() => {
    const countries = (this.countriesList() as any)?.data ?? [];
    return this.allowedPhoneCodesInOrder
      .map(code => countries.find((c: any) => c.phone_code === code))
      .filter((c: any) => !!c);
  });
  protected selectedCountryModel = signal<ICountryDto | null>(null);

  readonly REGISTER_STATE_KEY: StateKey<IRegisterResponseDto> = makeStateKey<IRegisterResponseDto>('register-response');

  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ToastService = inject(ToastService);
  private readonly _StorageService = inject(StorageService);
  private readonly _Router = inject(Router);
  protected neededDataToVerify = signal<any | null>(null);
  private hasOpenedOtpDialog = false;

  private fcmToken: string | null = null;
  private registrationPassword: string | null = null;
  maxDate: string | null = null;
  private activeDateFields = new Set<string>();
  constructor() {
    this.initializeForm();
    this.setupFacadeEffect();
    this.countriesService.fetchCountries();
    effect(() => {
      if (!this.countriesService.isLoading() && this.countriesService.status()) {
        const allowed = this.allowedCountries() as any[] | null | undefined;
        const match = allowed?.find((c: any) => c.phone_code === '+966');
        if (match) this.selectedCountryModel.set(match as any);
      }
    });
  }

  ngOnInit(): void {
    this.setSeoMeta();
    const queryParams = this._ActivatedRoute.snapshot.queryParams;
    Logger.debug('Query Params:', queryParams);
    if (isPlatformBrowser(this.platformId)) {
      this.fcmToken = localStorage.getItem(StorageKeys.FCM_TOKEN);
      Logger.debug('UserRegistrationComponent | fcmToken:', this.fcmToken);
    }
    this.setMaxDate(18);
    this.patchInitialPhoneFromAuthData();
  }

  private setSeoMeta(): void {
    const { title, meta } = UserAuthRouteData.register;
    const lang = this.localization.getCurrentLanguage() as keyof typeof title;
    this.seo.setMetaTags({
      title: title[lang],
      description: meta.description[lang],
      keywords: 'resgister, authentication, talbinah',
      image: 'https://api.talbinah.net/dashboard_assets/Talbinah.png',
      url: 'https://talbinah.com/resgister',
      robots: 'index, follow',
      locale: 'en_US',
      canonical: 'https://talbinah.com/resgister'
    });
  }

  private setMaxDate(maxValue: number) {
    const today = new Date();
    today.setFullYear(today.getFullYear() - maxValue); // subtract 18 years
    this.maxDate = today.toISOString().split('T')[0]; // format YYYY-MM-DD
  }

  private initializeForm(): void {
    this.formConfigs = registerFormConfig;
    this.registerForm = this.fb.group({
      fullName: this.fb.control<string | null>(null, [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/)]),
      gender: this.fb.control<string | null>(null, [Validators.required]),
      birth_date: this.fb.control<string | null>(null, [Validators.required]),
      phoneNumber: this.fb.control<string | null>(null, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(3), Validators.maxLength(12)]),
      email: this.fb.control<string | null>(null, [Validators.email]),
      password: this.fb.control<string | null>(null, [Validators.required])
    });
  }

  private patchInitialPhoneFromAuthData(): void {
    const authData = JSON.parse(localStorage.getItem(StorageKeys.AUTH_DATA_PAYLOAD) || '{}');
    Logger.debug('UserRegistrationComponent | authData:', authData);
    if (authData?.phone_no) {
      const ctrl = this.registerForm.get('phoneNumber');
      ctrl?.setValue(authData.phone_no);
    }
  }

  protected onCountryChange(country: ICountryDto): void {
    this.selectedCountryModel.set(country);
    const phoneControl = this.registerForm.get('phoneNumber');
    phoneControl?.reset();
  }

  protected onSubmit(): void {
    if (this.registerForm.valid) {
      const values = this.registerForm.getRawValue();
      const selectedCountry = this.selectedCountryModel();
      if (!selectedCountry || selectedCountry.code === undefined || selectedCountry.code === null) {
        Logger.error('Country is required for register');
        return;
      }
      this.registrationPassword = values.password || null;
      const queryParams: IRegisterRequestDto = {
        name: values.fullName || '',
        email: values.email?.length ? values.email : null,
        gender: values.gender || null,
        password: values.password || '',
        phone_no: values.phoneNumber || '',
        birth_date: values.birth_date ? values.birth_date : null,
        country_id: selectedCountry.id,
        role: 'user',
        device_type: 'web',
        fcm_token: this.fcmToken
      } as IRegisterRequestDto;
      Logger.debug('Register Query Params:', queryParams);
      this._RegisterFacade.register(queryParams);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  protected getFormControl(controlName: string): FormControl | null {
    return this.registerForm.get(controlName) as FormControl;
  }

  protected getError(controlName: string): Record<string, any> | null {
    const control = this.getFormControl(controlName);
    return control?.invalid && control?.touched ? control.errors : null;
  }

  protected getValidationErrorMessage(controlName: string, validations: any[]): string {
    const control: any = this.registerForm.get(controlName);
    if (!control?.errors?.['required'] && !validations?.length) return '';
    const errorKeys = Object.keys(control?.errors || {});
    for (const v of validations) {
      if ((v.errorName && errorKeys.includes(v.errorName)) || (!v.errorName && control?.errors['required'])) {
        return v.errorMessage;
      }
    }
    return 'form.email.errors.email';
  }

  private setupFacadeEffect(): void {
    effect(() => {
      if (!this._RegisterFacade.loading() && this._RegisterFacade.success() && !this.hasOpenedOtpDialog) {
        this.hasOpenedOtpDialog = true;
        this.openOtpMethodSelectionDialog();
      }
      if (this._RegisterFacade.error()) {
        // trigger change detection if needed; OnPush not used here
      }
    });
  }

  protected onRoleSelect(role: 'login'): void {
    Logger.debug('Selected role:', role);

    if (isPlatformBrowser(this.platformId)) {
      if (role === 'login') {
        this.router.navigate([AuthenticationRoutesEnum.LOGIN]);
      }
    } else {
      Logger.debug('Navigation skipped: running on server');
    }
  }

  private openOtpMethodSelectionDialog(): void {
    Logger.info('Open OTP method selection dialog');
    this.modalService.open(OtpMethodSelectionComponent, {
      inputs: {
        image: 'images/auth/icons/talbinah.png',
        title: 'OtpMethodSelection.Title',
        data: {
          payploadCheckNumber: this.checkNumberRequest(),
          fromURL: AuthenticationRoutesEnum.REGISTER,
          password: this.registrationPassword
        }
      },
      outputs: {
        closed: (data: any): void => {
          Logger.debug('Modal closed with data:', data);
          if (data?.status) {
            Logger.debug('OTP Method Selection Successful:', data);
            this._StorageService.setItem(StorageKeys.AUTH_DATA_PAYLOAD, { ...data, password: this.registrationPassword }, true);
            this._StorageService.setItem(StorageKeys.FROM_URL_PAYLOAD, AuthenticationRoutesEnum.REGISTER, true);
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

  private checkNumberRequest(): any {
    return {
      phone_no: this.registerForm.get('phoneNumber')?.value,
      country_id: this.selectedCountryModel()?.id,
      role: 'user',
      device_type: 'web'
    }
  }

  // Date input helpers to allow custom placeholder and native picker
  protected onDateFocus(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    const name = (input.getAttribute('id') || '') as string;
    if (name) this.activeDateFields.add(name);
    if (input && input.type === 'text') {
      input.type = 'date';
      // re-open picker after type switch (Chrome keeps focus)
      setTimeout(() => input.showPicker?.(), 0);
    }
  }

  protected onDateBlur(event: FocusEvent, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const ctrl = this.registerForm.get(controlName);
    const hasValue = !!ctrl?.value;
    if (input && !hasValue) {
      input.type = 'text';
      this.activeDateFields.delete(controlName);
    } else {
      // keep active if user selected a value
      this.activeDateFields.delete(controlName);
    }
  }

  protected isDateActive(name: string): boolean {
    return this.activeDateFields.has(name);
  }
}
