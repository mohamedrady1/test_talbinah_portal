import {
  inject,
  Injectable,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
  signal,
  computed
} from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import {
  ITechnicalSupportApiClient,
  TechnicalSupportApiClientProvider
} from '../clients';
import { Logger, ApiError, handleApiErrors, IGlobalUserContactInfoModel } from '../../../common';

// --- API Response DTO ---
export interface ICustomersSupportResponseDto {
  status: boolean;
  message: string | null;
  data: IGlobalUserContactInfoModel[];
}


// --- State Key for SSR hydration ---
const CUSTOMERS_SUPPORT_STATE_KEY =
  makeStateKey<CustomersSupportFeatureState>('CustomersSupport');

// --- State Shape ---
export interface CustomersSupportListState {
  customersSupport: IGlobalUserContactInfoModel[];
  isLoading: boolean;
  errorMessage: string | null;
}

export interface CustomersSupportFeatureState {
  CustomersSupport: CustomersSupportListState;
}

// --- Initial State ---
export const initialCustomersSupportFeatureState: CustomersSupportFeatureState = {
  CustomersSupport: {
    customersSupport: [],
    isLoading: false,
    errorMessage: null
  }
};

@Injectable({ providedIn: 'root' })
export class CustomersSupportFacade {
  private readonly _apiClient: ITechnicalSupportApiClient =
    inject(TechnicalSupportApiClientProvider).getClient();

  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _featureState = signal<CustomersSupportFeatureState>(
    initialCustomersSupportFeatureState
  );

  // --- Selectors ---
  readonly customersSupport = computed(
    () => this._featureState().CustomersSupport.customersSupport
  );
  readonly isLoading = computed(
    () => this._featureState().CustomersSupport.isLoading
  );
  readonly errorMessage = computed(
    () => this._featureState().CustomersSupport.errorMessage
  );

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState =
      //   this._transferState.get<CustomersSupportFeatureState>(
      //     CUSTOMERS_SUPPORT_STATE_KEY,
      //     initialCustomersSupportFeatureState
      //   );

      // if (cachedState) {
      //   Logger.debug('Hydrating support customersSupport from TransferState', cachedState);
      //   this._updateCustomersSupportState(cachedState.CustomersSupport);
      //   this._transferState.remove(CUSTOMERS_SUPPORT_STATE_KEY);
      // }
    }
  }

  fetchCustomersSupport(): void {
    Logger.debug('Fetching customers support list');

    this._updateCustomersSupportState({ isLoading: true, errorMessage: null });

    this._apiClient
      .getCustomersSupport()
      .pipe(
        tap((response: ICustomersSupportResponseDto) => {
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(
              CUSTOMERS_SUPPORT_STATE_KEY,
              this._featureState()
            );
            Logger.debug('Stored customers support in TransferState for SSR');
          }

          this._updateCustomersSupportState({
            customersSupport: response.data,
            errorMessage: null
          });

          Logger.debug('customers support response: ', {
            errorMessage: this.errorMessage(),
            customersSupport: this.customersSupport()
          });
        }),
        catchError((error: ApiError) => {
          this._updateCustomersSupportState({
            errorMessage: '🚨 Error loading customersSupport. Please try again later.',
            customersSupport: []
          });
          handleApiErrors(error);
          return EMPTY;
        }),
        finalize(() => {
          this._updateCustomersSupportState({ isLoading: false });
        })
      )
      .subscribe();
  }

  private _updateCustomersSupportState(
    updates: Partial<CustomersSupportListState>
  ): void {
    this._featureState.update(state => ({
      ...state,
      CustomersSupport: {
        ...state.CustomersSupport,
        ...updates
      }
    }));
  }
}
