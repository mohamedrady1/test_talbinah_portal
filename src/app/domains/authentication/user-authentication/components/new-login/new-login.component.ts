import { TranslateApiPipe } from './../../../../../common/core/translations/pipes/translate-api.pipe';

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
  PLATFORM_ID,
  signal,
  effect
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormBuilder,
  Validators,
  FormsModule
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { Subject } from 'rxjs';


import { ALL_INPUT_TYPES, IFormInputConfig, ModalService, StorageKeys, SvgIconComponent } from '../../../../../shared';
import { StorageService, useNavigation, Logger, NavigationIntent } from '../../../../../common';
import { CountriesLookupFacade, ICountryDto } from '../../../../lookups';
import { NewLoginPasswordComponent } from '../new-login-password';
import { AuthenticationRoutesEnum } from '../../constants';
import { checkNumberFormConfig } from '../../configs';
import { NewRegisterComponent } from '../new-register';
import { LoginFacade } from '../../services';
import { Router } from '@angular/router';

export interface NewLoginModalData {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-new-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SelectModule,
    FormsModule,
    SvgIconComponent,

    TranslateApiPipe
  ],
  templateUrl: './new-login.component.html',
  styleUrls: ['./new-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewLoginComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(ModalService);
  private readonly nav = useNavigation();

  private readonly storageService = inject(StorageService);
  private readonly countriesService = inject(CountriesLookupFacade);
  protected readonly _LoginFacade = inject(LoginFacade);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly _router = inject(Router);
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly allInputTypes = ALL_INPUT_TYPES;
  private readonly destroy$ = new Subject<void>();

  // Modal data inputs
  @Input() icon: string = 'images/logos/icon.png';
  @Input() title: string = 'welcome_back';
  @Input() description: string = 'welcome_safe_space';

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

  readonly formConfigs: IFormInputConfig[] = checkNumberFormConfig;
  protected readonly isEditable = signal(true);
  selectedCountryModel = signal<ICountryDto | null>(null);
  public loginForm!: ReturnType<FormBuilder['group']>;

  constructor() {
    this.initializeForm();
    this.countriesService.fetchCountries();
    this.setupSubscriptions();

    // Ensure +966 is selected by default once countries load
    let defaultCountryApplied = false;

  }

  private setupSubscriptions(): void {
    // لما يتغير allowedCountries هنجرب نضبط الـ default مرة واحدة
    effect(() => {
      const countries = this.allowedCountries();
      if (countries?.length && !this.selectedCountryModel()) {
        const match = countries.find(c => c.phone_code === '+966');
        if (match) {
          this.selectedCountryModel.set(match);
        }
      }
    });
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

  public onCountryChange(country: ICountryDto): void {
    this.selectedCountryModel.set(country);
    const phoneControl = this.loginForm.get('phoneNumber');
    if (phoneControl) {
      phoneControl.reset();
    }
  }

  public onSubmit(): void {
    if (this.loginForm.valid) {
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

      // Monitor the response after submission
      this.monitorLoginResponse();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private monitorLoginResponse(): void {
    // Use a simple timeout to check the response after a short delay
    const checkResponse = () => {
      const loading = this._LoginFacade.loading();
      const success = this._LoginFacade.success();
      const error = this._LoginFacade.error();

      if (!loading && success) {
        const response = this._LoginFacade.response();
        if (response?.status) {
          if (response.data.user) {
            this.storageService.setItem(StorageKeys.CHECK_NUMBER_PAYLOAD, this._LoginFacade.checkNumberRequest(), true);
            this.openPasswordModal();
            this.closed.emit();
          } else {
            // Handle registration flow or OTP verification
            this.handleLoginResponse(response);
          }
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

  public getFormControl(controlName: string): FormControl | null {
    return this.loginForm.get(controlName) as FormControl;
  }

  public getError(controlName: string): Record<string, any> | null {
    const control = this.getFormControl(controlName);
    return control?.invalid && control?.touched ? control.errors : null;
  }

  public getValidationErrorMessage(controlName: string, validations: any[]): string {
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

  private openPasswordModal(): void {
    const modalData: NewLoginModalData = {
      image: this.icon,
      title: 'password',
      description: this.description
    };

    // Open the password modal first
    this.modalService.open(NewLoginPasswordComponent, {
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

    // Close current modal using the output
    this.closed.emit();
  }

  private handleLoginResponse(response: any): void {
    Logger.debug('Login response handling:', response);
    // If user not found -> open register with prefilled values
    const phoneControl = this.loginForm.get('phoneNumber');
    const phone_no = (phoneControl?.value as string) || '';
    const country = this.selectedCountryModel();
    if (phone_no && country?.id != null) {
      this.openRegisterModal({ phone_no, country_id: country.id });
      this.closed.emit();
    } else {
      this.openRegisterModal();
      this.closed.emit();
    }
  }

  protected onRoleSelect(role: 'doctor' | 'patient'): void {
    Logger.debug('Selected role:', role);
    if (role === 'doctor') {
      this.nav.navigate(NavigationIntent.EXTERNAL_NEW_TAB, AuthenticationRoutesEnum.EXTERNAL_DOCTOR_REGISTER);
    } else {
      this.openRegisterModal();
      this.closed.emit();
    }
  }
  private openRegisterModal(prefill?: { phone_no: string; country_id: number | string }): void {
    const modalData = {
      image: 'images/icons/logo-2.png',
      title: 'create_new_account',
      description: 'join_talbinah_start_journey_towards_mental_health'

    };

    this.modalService.open(NewRegisterComponent, {
      inputs: {
        ...modalData,
        number: prefill?.phone_no ?? null,
        country_id: prefill?.country_id?.toString?.() ?? null
      },
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
  protected onClose(): void {
    this.closed.emit();
  }
}
