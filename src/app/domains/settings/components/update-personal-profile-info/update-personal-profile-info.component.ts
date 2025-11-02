import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Component,
  computed,
  inject,
  Output,
  signal,
  effect,
  Input
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
  StorageKeys
} from '../../../../shared';
import { IUser } from '../../../authentication';
import { updateProfileConfig } from '../../configs/update-profile-form-inputs.config';
import { CountriesLookupFacade, ICountryDto } from '../../../lookups';
import { SelectButtonModule } from 'primeng/selectbutton';
import { UpdateUserProfileFacade } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import { StorageService, TranslateApiPipe } from '../../../../common';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-update-personal-profile-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectButtonModule,
    CommonModule,
    SelectModule,
    FormsModule,
    TranslateApiPipe
  ],
  templateUrl: './update-personal-profile-info.component.html',
  styleUrls: ['./update-personal-profile-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdatePersonalProfileInfoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly storageService = inject(StorageService);
  private readonly countriesService = inject(CountriesLookupFacade);
  protected readonly _UpdateUserProfileFacade = inject(UpdateUserProfileFacade);

  protected readonly isEditable = signal(false);
  private readonly allowedPhoneCodesInOrder = ['+966', '+965', '+973', '+974', '+971', '+968', '+20'];

  protected readonly countriesList = computed(() => this.countriesService.Countries());
  protected readonly isLoadingCountries = computed(() => this.countriesService.isLoading());
  protected readonly allowedCountries = computed(() => {
    const countries = this.countriesList()?.data ?? [];
    return this.allowedPhoneCodesInOrder
      .map(code => countries.find(c => c.phone_code === code))
      .filter((c): c is NonNullable<typeof c> => !!c);
  });

  selectedCountryModel = signal<ICountryDto | null>(null);

  @Input() data?: any;
  @Input() type!: string;
  @Output() closed = new EventEmitter<any>();

  readonly formConfig: IFormInputConfig[] = updateProfileConfig;
  readonly allInputTypes = ALL_INPUT_TYPES;
  protected currentUser!: IUser;

  protected profileForm!: ReturnType<FormBuilder['group']>;

  constructor() {
    effect(() => {
      if (!this.countriesService.isLoading() && this.countriesService.status() && this.currentUser?.country) {
        const match = this.allowedCountries()?.find(c => c.phone_code === this.currentUser.country?.phone_code);
        if (match) this.selectedCountryModel.set(match);
      }
    });

    effect(() => {
      if (!this._UpdateUserProfileFacade.loading() && this._UpdateUserProfileFacade.success()) {
        this.closed.emit();
      }
    });

    effect(() => {
      if (this.profileForm) {
        if (this.isEditable()) {
          this.profileForm.enable({ emitEvent: false });
        } else {
          this.profileForm.disable({ emitEvent: false });
        }
      }
    });
  }

  ngOnInit(): void {
    this.countriesService.fetchCountries();
    const userFromStorage = this.storageService.getItem(StorageKeys.CURRENT_USER_INFO) as { user?: IUser } | null;
    if (userFromStorage?.user) {
      this.currentUser = userFromStorage.user;
      this.initializeForm();
      this.patchUserToForm();
    }
  }

  private initializeForm(): void {
    const disabled = !this.isEditable();
    this.profileForm = this.fb.group({
      name: this.fb.control({ value: null, disabled }, Validators.required),
      gender: this.fb.control({ value: null, disabled }, Validators.required),
      age: this.fb.control({ value: null, disabled }, Validators.required),
      email: this.fb.control({ value: null, disabled }, Validators.required),
      identifyNumber: this.fb.control({ value: null, disabled }),
      phoneNumber: this.fb.control({ value: null, disabled }, Validators.required)
    });
  }

  protected onCountryChange(country: ICountryDto): void {
    this.selectedCountryModel.set(country);
  }

  private patchUserToForm(): void {
    const user = this.currentUser;
    const genderValue = user.gender === 1 ? 'female' : user.gender === 0 ? 'male' : null;
    let ageValue: number | null = null;

    if (user.birth_date) {
      const birthDate = new Date(user.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      ageValue = age;
    }

    this.profileForm.patchValue({
      name: user.full_name ?? null,
      gender: genderValue,
      age: ageValue,
      email: user.email ?? null,
      identifyNumber: user.national_id != null ? String(user.national_id) : null,
      phoneNumber: user.phone_no ?? null
    });
  }

  protected onSubmit(): void {
    if (this.profileForm.valid) {
      const formValues = this.profileForm.getRawValue();
      const selectedCountry = this.selectedCountryModel();

      const formData = new FormData();
      formData.append('full_name', formValues.name ?? '');
      formData.append('gender', formValues.gender === 'female' ? '1' : formValues.gender === 'male' ? '0' : '');
      formData.append('birth_date', this.calculateBirthDateFromAge(formValues.age));
      formData.append('email', formValues.email ?? '');
      if (formValues.identifyNumber) formData.append('national_id', formValues.identifyNumber);
      formData.append('phone_no', formValues.phoneNumber ?? '');
      formData.append('phone_code', selectedCountry?.phone_code ?? '');
      formData.append('country_id', selectedCountry?.id?.toString() ?? '');

      this._UpdateUserProfileFacade.updateProfile(formData);
    } else {
      this.profileForm.markAllAsTouched();
      this.cdr.detectChanges();
    }
  }

  protected getFormControl(controlName: string): FormControl | null {
    return this.profileForm.get(controlName) as FormControl;
  }
  protected getError(controlName: string): Record<string, any> | null {
    const control = this.getFormControl(controlName);
    return control?.invalid && control?.touched ? control.errors : null;
  }
  protected getValidationErrorMessage(controlName: string, validations: any[]): string {
    const control: any = this.profileForm.get(controlName);
    if (!control?.errors?.['required'] && !validations?.length) return '';
    const errorKeys = Object.keys(control?.errors || {});
    for (const v of validations) {
      if ((v.errorName && errorKeys.includes(v.errorName)) || (!v.errorName && control?.errors['required'])) {
        return v.errorMessage;
      }
    }
    return 'form.genericError';
  }

  private calculateBirthDateFromAge(age: number | null): string {
    if (!age || isNaN(age)) return '';
    const today = new Date();
    const birthYear = today.getFullYear() - age;
    return new Date(birthYear, today.getMonth(), today.getDate()).toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    this._UpdateUserProfileFacade.reset();
  }
}
