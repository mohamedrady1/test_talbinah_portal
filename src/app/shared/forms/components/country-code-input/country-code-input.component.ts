import { ChangeDetectorRef, Component, computed, effect, inject, Input, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { ALL_INPUT_TYPES, InputIconType } from '../../enums';
import { CountriesLookupService } from '../../../services';
import { TranslateModule } from '@ngx-translate/core';
import { ICountryDto } from '../../../../domains';
import { IFormInputConfig } from '../../models';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { Logger } from '../../../../common';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-country-code-input',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    SelectModule,
    FormsModule
  ],
  providers: [TranslationsFacade],
  templateUrl: './country-code-input.component.html',
  styleUrls: ['./country-code-input.component.scss']
})
export class CountryCodeInputComponent {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  protected readonly countriesService = inject(CountriesLookupService);

  readonly countriesLookupsList = this.countriesService.countries;

  // Priority codes (used when isAllowedOnlyNearbyCountries is false)
  private readonly priorityPhoneCodes = ['+966', '+20'];
  // Allowed codes (used when isAllowedOnlyNearbyCountries is true, and for general sorting if false)
  private readonly allowedPhoneCodesInOrder = ['+966', '+965', '+973', '+974', '+971', '+968', '+20'];

  // New signal to control the filtering logic
  protected isAllowedOnlyNearbyCountries = signal<boolean>(true); // Default to false as per your last request

  // ✅ MODIFIED: sortedCountriesList now conditionally returns countries
  readonly sortedCountriesList = computed(() => {
    const countries = this.countriesLookupsList() ?? [];

    if (this.isAllowedOnlyNearbyCountries()) {
      // If true, return only countries in allowedPhoneCodesInOrder, sorted by that order
      const allowedCodesSet = new Set(this.allowedPhoneCodesInOrder);
      const filteredCountries = countries.filter(c => allowedCodesSet.has(c.phone_code));

      return this.allowedPhoneCodesInOrder
        .map(code => filteredCountries.find(c => c.phone_code === code))
        .filter(Boolean) as ICountryDto[];
    } else {
      // Else (if isAllowedOnlyNearbyCountries is false),
      // prioritize countries based on allowedPhoneCodesInOrder, then include all others.
      // This effectively makes allowedPhoneCodesInOrder the new 'priority' list for this case.
      const prioritizedCountries = this.allowedPhoneCodesInOrder
        .map(code => countries.find(c => c.phone_code === code))
        .filter(Boolean) as ICountryDto[];

      const otherCountries = countries.filter(c => !this.allowedPhoneCodesInOrder.includes(c.phone_code));

      // Combine prioritized countries with the rest
      return [...prioritizedCountries, ...otherCountries];
    }
  });

  readonly isLoadingCountriesLookups = this.countriesService.isLoading;

  @Input() formItem: IFormInputConfig = {
    type: ALL_INPUT_TYPES.TEXT,
    name: '',
    defaultValue: '',
  };

  InputIconType = InputIconType;
  @Input() control: FormControl = new FormControl();
  @Input() name: string = '';
  @Input() inputClass?: string;

  constructor() {
    this.setupCountriesLookupEffect();
  }
  ngOnInit(): void {
    // Logger.debug('FormInputTextComponent initialized with formItem:', this.formItem);
  }


  // Add this method to handle country change
  protected onCountryChange(selected: ICountryDto): void {
    this.countriesService.setSelectedCountry(selected);
    this.formItem.countryCode = selected.phone_code;
    this.control.reset();

  }
  get selectedCountryModel(): ICountryDto | null {
    return this.countriesService.selectedCountry();
  }
  set selectedCountryModel(value: ICountryDto | null) {
    this.countriesService.setSelectedCountry(value);
  }

  private setupCountriesLookupEffect(): void {
    effect(() => {
      this.countriesService.loadCountriesIfNeeded();
      Logger.debug('CountryCodeInputComponent | setupCountriesLookupEffect | formItem: ', this.formItem);
      if (this.countriesLookupsList().length > 0 && !this.isLoadingCountriesLookups()) {
        const defaultCountryId = this.formItem?.countryCode ?? 187;

        const matchedCountry = this.countriesLookupsList().find((c: ICountryDto) => c.id === defaultCountryId);

        if (matchedCountry) {
          this.selectedCountryModel = matchedCountry;
        }

        this.cdr.markForCheck();
      }
    });
  }

  get isInvalid(): boolean {
    const control = this.control;
    return !!(
      control &&
      control.invalid &&
      (control.touched || control.dirty)
    );
  }
  // ✅ Dynamically set role attribute based on input type
  get roleAttr(): string {
    const type = this.formItem?.type?.toLowerCase();
    return type === ALL_INPUT_TYPES.TEXT ? 'textbox' :
      type === ALL_INPUT_TYPES.EMAIL ? 'email' :
        type === ALL_INPUT_TYPES.PASSWORD ? 'password' :
          type === 'number' ? 'spinbutton' :
            'textbox';
  }

  // ✅ Dynamically set autocomplete attribute based on input type
  get autocompleteAttr(): string {
    const type = this.formItem?.type?.toLowerCase();
    return type === ALL_INPUT_TYPES.TEXT ? 'name' :
      type === ALL_INPUT_TYPES.EMAIL ? 'email' :
        type === ALL_INPUT_TYPES.PASSWORD ? 'current-password' :
          'off';
  }

  // ✅ Aria-label for accessibility
  get ariaLabel(): string {
    return this.formItem?.label ?? `Input field for ${this.name.replace(/[-_]/g, ' ')}`;
  }

  // ✅ Placeholder handling with fallback
  get placeholderText(): string {
    return this.formItem?.placeholder ?? '';
  }

  // ✅ Disabled state handling
  get isDisabled(): boolean {
    return this.formItem?.isDisabled ?? false;
  }

  // ✅ Readonly state handling
  get isReadonly(): boolean {
    return this.formItem?.isDisabled ?? false;
  }

  // ✅ Prevent Paste state handling
  get isStopPaste(): boolean {
    return this.formItem?.stopPaste ?? false;
  }
}
