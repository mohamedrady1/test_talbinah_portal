import { Injectable, PLATFORM_ID, StateKey, TransferState, computed, inject, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ICountriesResponseDto, ICountryDto, LocationsApiClientProvider } from '../../domains';
import { Logger } from '../../common/core/utilities/logging/logger';
import { IApiError } from '../../common/core/results';

@Injectable({
  providedIn: 'root'
})
export class CountriesLookupService {
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiClient = inject(LocationsApiClientProvider).getClient();
  private readonly STATE_KEY: StateKey<ICountriesResponseDto> = makeStateKey<ICountriesResponseDto>('countries-response');

  readonly isLoading = signal(false);
  readonly countries = signal<ICountryDto[]>([]);
  readonly isLoaded = signal(false);

  // 🔁 Selected country signal lives here now
  private readonly _selectedCountry = signal<ICountryDto | null>(null);
  readonly selectedCountry = this._selectedCountry.asReadonly();

  private readonly allowedPhoneCodesInOrder = ['+966', '+965', '+973', '+974', '+971', '+968', '+20'];

  loadCountriesIfNeeded(): void {
    this.clearSelectedCountry();
    if (!isPlatformBrowser(this.platformId) || this.isLoaded()) return;

    // const cached = this.transferState.get(this.STATE_KEY, null);
    // if (cached) {
    //   this.countries.set(cached.data);
    //   this.transferState.remove(this.STATE_KEY);
    //   this.isLoaded.set(true);
    //   Logger.debug('[CountriesLookupService] Loaded from TransferState');
    //   return;
    // }

    this.isLoading.set(true);
    this.apiClient.getCountries()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res: ICountriesResponseDto) => {
          const filtered = res.data
            .filter(country => this.allowedPhoneCodesInOrder.includes(country.phone_code))
            .sort((a, b) =>
              this.allowedPhoneCodesInOrder.indexOf(a.phone_code) - this.allowedPhoneCodesInOrder.indexOf(b.phone_code)
            );

          this.countries.set(filtered);
          this.transferState.set(this.STATE_KEY, { ...res, data: filtered });
          this.isLoaded.set(true);
          Logger.debug('[CountriesLookupService] Fetched and filtered countries from API', this.countries());
        },
        error: (err: IApiError) => {
          Logger.error('[CountriesLookupService] Failed to fetch countries', err.message);
        }
      });
  }

  setSelectedCountry(country: ICountryDto | null): void {
    this._selectedCountry.set(country);
  }

  clearSelectedCountry(): void {
    this._selectedCountry.set(null);
  }

  // 👇 Derived signal example
  readonly selectedCountryPhoneCode = computed(() => this._selectedCountry()?.phone_code ?? '');

  // 👇 Utility to format phone number
  formatPhoneNumberWithSelectedCountryCode(phoneNumber: string | number): string {
    const code = this.selectedCountryPhoneCode();
    const cleanNumber = String(phoneNumber).replace(/[^0-9]/g, '');
    return code ? `${code}${cleanNumber}` : cleanNumber;
  }
}
