
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormBuilder,
  Validators,
  FormsModule
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { Subject } from 'rxjs';
import { ALL_INPUT_TYPES, StorageKeys, IFormInputConfig, ModalService, SvgIconComponent } from '../../../../../shared';
import { Logger, StorageService, useNavigation, AutoExactHeightDirective } from '../../../../../common';
import { CountriesLookupFacade, ICountryDto } from '../../../../lookups';
import { OtpMethodSelectionComponent } from '../otp-method-selection';
import { NewOtpVerificationComponent } from '../new-otp-verification';
import { AuthenticationRoutesEnum } from '../../constants';
import { registerFormConfig } from '../../configs';
import { IRegisterRequestDto } from '../../dtos';
import { RegisterFacade } from '../../services';
import { NewLoginComponent } from '../new-login';
import { TranslationsFacade } from '../../../../../common/core/translations/services';
export interface NewRegisterModalData {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-new-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SelectModule,
    AutoExactHeightDirective,
    SvgIconComponent,
  ],
  templateUrl: './new-register.component.html',
  styleUrls: ['./new-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewRegisterComponent implements OnInit, OnDestroy {
  protected readonly _RegisterFacade = inject(RegisterFacade);
  private readonly countriesService = inject(CountriesLookupFacade);
  private readonly storageService = inject(StorageService);
  private readonly nav = useNavigation();
  private readonly modalService = inject(ModalService);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  readonly formConfigs: IFormInputConfig[] = registerFormConfig;
  protected readonly isEditable = signal(true);
  selectedCountryModel = signal<ICountryDto | null>(null);
  protected readonly allInputTypes = ALL_INPUT_TYPES;
  public registerForm = this.fb.group({
    fullName: this.fb.control<string | null>(null, [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/)]),
    gender: this.fb.control<string | null>(null, [Validators.required]),
    birth_date: this.fb.control<string | null>(null, [Validators.required]),
    phoneNumber: this.fb.control<string | null>(null, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(3), Validators.maxLength(12)]),
    email: this.fb.control<string | null>(null, [Validators.email]),
    password: this.fb.control<string | null>(null, [Validators.required])
  });

  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  private readonly destroy$ = new Subject<void>();

  // Additional properties from user-registration
  private fcmToken: string | null = null;
  private registrationPassword: string | null = null;
  maxDate: string | null = null;
  private activeDateFields = new Set<string>();
  private hasOpenedOtpDialog = false;

  // Password visibility signals
  private visible = signal(false);
  readonly passwordVisible = this.visible.asReadonly();
  readonly inputType = signal<'password' | 'text'>('password');

  // Modal data inputs
  @Input() icon: string = 'images/logos/icon.png';
  @Input() title: string = 'general.createAccount';
  @Input() description: string = 'welcome_safe_space';
  @Input() number: string | null = null;
  @Input() country_id: string | null = null;
  // Output for modal closing
  @Output() closed = new EventEmitter<void>();

  private readonly allowedPhoneCodesInOrder = ['+966', '+965', '+973', '+974', '+971', '+968', '+20'];
  protected readonly countriesList = computed(() => this.countriesService.Countries());
  protected readonly isLoadingCountries = computed(() => this.countriesService.isLoading());
  protected readonly allowedCountries = computed(() => {
    const countries = this.countriesList()?.data ?? [];
    return this.allowedPhoneCodesInOrder
      .map(code => countries.find(c => c.phone_code === code))
      .filter((c): c is NonNullable<typeof c> => !!c);
  });
  constructor() {
    this.countriesService.fetchCountries();
    this.setupSubscriptions();
    this.setMaxDate(18);

    // Prefer prefilled country when available, otherwise fall back to +966
    const countries = this.countriesList()?.data ?? [];
    const prefillMatch = this.country_id ? countries.find(c => String(c.id) === String(this.country_id)) : undefined;
    const match = prefillMatch || countries.find(c => c.phone_code === '+966');
    if (match) {
      this.selectedCountryModel.set(match);
    }
    // Ensure default is applied even if countries arrive a bit later
    this.ensureDefaultCountrySelected();
  }

  private setupSubscriptions(): void {
    // Set default country when countries are loaded (one-time setup)
    setTimeout(() => {
      if (!this.countriesService.isLoading() && this.countriesService.status()) {
        const desired = (this.country_id
          ? this.allowedCountries()?.find(c => String(c.id) === String(this.country_id))
          : this.allowedCountries()?.find(c => c.phone_code === '+966'));
        const current = this.selectedCountryModel();
        if (desired && (!current || String(current.id) !== String(desired.id))) {
          this.selectedCountryModel.set(desired);
        }
      }
    }, 100);

    // Monitor registration facade state - only when form is submitted
    // We'll handle this in the onSubmit method instead of continuous monitoring
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fcmToken = localStorage.getItem(StorageKeys.FCM_TOKEN);
      Logger.debug('NewRegisterComponent | fcmToken:', this.fcmToken);

    }

    // Prefill phone number if provided
    if (this.number) {
      const ctrl = this.registerForm.get('phoneNumber');
      ctrl?.setValue(this.number);
    }
  }

  private ensureDefaultCountrySelected(): void {
    const trySelect = (attempt: number = 0): void => {
      const countries = this.countriesList()?.data ?? [];
      const pool = countries.length ? countries : this.allowedCountries() ?? [];
      const prefill = this.country_id ? pool.find(c => String(c.id) === String(this.country_id)) : undefined;
      const fallback = pool.find(c => c.phone_code === '+966');
      const desired = prefill || fallback;
      const current = this.selectedCountryModel();
      if (desired && (!current || String(current.id) !== String(desired.id))) {
        this.selectedCountryModel.set(desired);
        return;
      }
      if (attempt < 20) {
        setTimeout(() => trySelect(attempt + 1), 100);
      }
    };
    // Start immediately and also in next tick
    trySelect(0);
    setTimeout(() => trySelect(1), 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setMaxDate(maxValue: number): void {
    const today = new Date();
    today.setFullYear(today.getFullYear() - maxValue); // subtract 18 years
    this.maxDate = today.toISOString().split('T')[0]; // format YYYY-MM-DD
  }


  public onCountryChange(country: ICountryDto): void {
    this.selectedCountryModel.set(country);
    const phoneControl = this.registerForm.get('phoneNumber');
    if (phoneControl) {
      phoneControl.reset();
    }
  }

  public onSubmit(): void {
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
        country_code: selectedCountry.phone_code,
        role: 'user',
        device_type: 'web',
        fcm_token: this.fcmToken
      } as IRegisterRequestDto;
      Logger.debug('Register Query Params:', queryParams);
      this._RegisterFacade.register(queryParams);

      // Monitor the response after submission
      this.monitorRegistrationResponse();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  private monitorRegistrationResponse(): void {
    // Use a simple timeout to check the response after a short delay
    const checkResponse = (): void => {
      const loading = this._RegisterFacade.loading();
      const success = this._RegisterFacade.success();
      const error = this._RegisterFacade.error();

      if (!loading && success) {
        const response = this._RegisterFacade.response();
        if (response?.status) {
          // Store registration data for OTP verification
          this.storageService.setItem(StorageKeys.CHECK_NUMBER_PAYLOAD, this._RegisterFacade.registerRequest(), true);

          // Close current modal and open OTP method selection
          this.closed.emit();
          this.openOtpMethodSelectionDialog();
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

  private openOtpModal(): void {
    Logger.info('Open OTP modal');
    this.modalService.open(NewOtpVerificationComponent, {
      inputs: {
        image: 'images/icons/logo-2.png',
        title: 'verify_the_code',
        description: 'enter_the_code_sent_to_your_phone'
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
  private openOtpMethodSelectionDialog(): void {
    Logger.info('Open OTP method selection dialog');
    this.modalService.open(OtpMethodSelectionComponent, {
      inputs: {
        icon: 'images/auth/icons/talbinah.png',
        title: 'choose_verification_method',
        data: {
          payploadCheckNumber: this._RegisterFacade.registerRequest()
        }
      },
      outputs: {
        closed: (data: any): void => {
          Logger.debug('Modal closed with data:', data);
          if (data?.status) {
            Logger.debug('OTP Method Selection Successful:', data);
            // Persist OTP payload along with the chosen registration password
            const enhancedPayload = {
              ...data,
              password: this.registrationPassword
            };
            this.storageService.setItem(StorageKeys.AUTH_DATA_PAYLOAD, enhancedPayload, true);
            this.storageService.setItem(StorageKeys.FROM_URL_PAYLOAD, AuthenticationRoutesEnum.REGISTER, true);
            this.openOtpModal();
          } else {
            Logger.warn('OTP Method Selection Cancelled or Failed');
          }
        }
      },
      width: '30%',
      closeOnBackdropClick: false,
    });
  }

  public getFormControl(controlName: string): FormControl | null {
    return this.registerForm.get(controlName) as FormControl;
  }

  public getError(controlName: string): Record<string, any> | null {
    const control = this.getFormControl(controlName);
    return control?.invalid && control?.touched ? control.errors : null;
  }

  public getValidationErrorMessage(controlName: string, validations: any[]): string {
    const control = this.getFormControl(controlName);
    if (!control || !control.errors) return '';
    const errorKeys = Object.keys(control.errors);
    for (const v of validations) {
      if (v.errorName && errorKeys.includes(v.errorName)) {
        return v.errorMessage;
      }
      if (!v.errorName && control.errors['required']) {
        return v.errorMessage;
      }
    }
    return 'form.genericError';
  }

  protected onClose(): void {
    this.closed.emit();
  }

  protected toggleVisibility(): void {
    this.visible.update((v) => !v);
    this.inputType.set(this.visible() ? 'text' : 'password');
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

  protected onDateClick(event: MouseEvent, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input && input.type === 'text') {
      input.type = 'date';
      this.activeDateFields.add(fieldName);
      // Force focus and open picker
      input.focus();
      setTimeout(() => {
        if (input.showPicker) {
          input.showPicker();
        }
      }, 0);
    }
  }

  protected openLoginModal(): void {
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
}
