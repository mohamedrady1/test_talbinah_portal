import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { ApiError, handleApiErrors, Logger } from '../../../common';
import { LocalizationService, ModalService, ToastService } from '../../../shared';
import { initialSeminarStoreState, ISeminarStoreState } from '../models';
import { IStoreSeminarRequestDto, IStoreSeminarResponseDto } from '../dtos';
import { ISupportGroupsApiClient, SupportGroupsApiClientProvider, SupportGroupsInMemoryApiClient } from '../clients';


// Define a unique state key for Angular's TransferState for SSR hydration
const SEMINAR_STORE_STATE_KEY = makeStateKey<ISeminarStoreState>('seminarStoreState');

@Injectable({
  providedIn: 'root', // This makes the facade a singleton service
})
export class SeminarStoreFacade {
  // --- Dependencies Injected ---
  private readonly _apiClient: ISupportGroupsApiClient = inject(SupportGroupsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);
  private modalService = inject(ModalService);
  // --- Internal Feature State (Managed by a Signal) ---
  private readonly _storeSeminarState = signal<ISeminarStoreState>(initialSeminarStoreState);

  // --- Exposed Selectors (Computed Signals for Public Consumption) ---
  readonly isStoringSeminar = computed(() => this._storeSeminarState().isStoring);
  readonly storeSuccess = computed(() => this._storeSeminarState().storeSuccess);
  readonly storeError = computed(() => this._storeSeminarState().storeError);
  readonly storedSeminar = computed(() => this._storeSeminarState().storedSeminarResponse);

  constructor() {
    // Attempt to hydrate the state from TransferState when running in the browser
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(SEMINAR_STORE_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating seminar store state from TransferState:', cachedState);
      //   this.updateState(cachedState);
      //   this._transferState.remove(SEMINAR_STORE_STATE_KEY);
      // }
    }
  }

  // --- Public Action Methods ---
  storeSeminar(payload: IStoreSeminarRequestDto): void {
    Logger.debug('Attempting to store seminar with payload:', payload);

    // Optimistically update state to indicate loading and clear previous outcomes
    this.updateState({
      isStoring: true,
      storeSuccess: false,
      storeError: null,
      storedSeminarResponse: null,
    });

    this._apiClient.storeSeminar(payload)
      .pipe(
        tap((response: IStoreSeminarResponseDto) => {
          if (response.status) {
            if (payload.payment_id === 1) {
              this.modalService.closeAll();
            }
            // Update state with successful response data
            this.updateState({
              storeSuccess: true,
              storedSeminarResponse: response.data, // Store the 'data' part
              storeError: null,
            });
            // Store the current state in TransferState during SSR (on the server)
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(SEMINAR_STORE_STATE_KEY, this._storeSeminarState());
              Logger.debug('Stored Seminar state in TransferState for SSR.');
            }
            // Uncomment to display a success toast notification
            // this._toastService.success(this._localizationService.translateTextFromJson('seminars.storeSuccess'));
            Logger.debug('seminar stored successfully:', response.data);
          } else {
            // Handle API-level business logic errors
            const errorMessage = response.message || this._localizationService.translateTextFromJson('seminars.storeFailedGeneric');
            this.updateState({
              storeSuccess: false,
              storedSeminarResponse: response.data, // Store the 'data' part
              storeError: errorMessage,
            });
            this.handleError({ message: errorMessage } as ApiError, errorMessage);
          }
        }),
        catchError((error: ApiError) => {
          // Catch and handle HTTP or network errors
          this.handleError(error, 'general.errorStoringseminar');
          return EMPTY; // Prevent the observable stream from completing with an error
        }),
        finalize(() => {
          // Always finalize by resetting the loading state
          this.finalizeStoreOperation();
        })
      )
      .subscribe(); // Subscribe to execute the observable
  }

  resetState(): void {
    this._storeSeminarState.set(initialSeminarStoreState);
    Logger.debug('seminar store state reset.');
  }

  // --- Private Utility Methods for Internal State Management ---
  private updateState(updates: Partial<ISeminarStoreState>): void {
    this._storeSeminarState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`Error storing seminar:`, error);
    handleApiErrors(error); // Call your common error handler
    // Uncomment to display an error toast notification
    // this._toastService.error(this._localizationService.translateTextFromJson(translationKey));
    this.updateState({
      storeError: error?.message ?? this._localizationService.translateTextFromJson(translationKey),
      storeSuccess: false,
      storedSeminarResponse: null,
    });
  }

  /**
   * Finalizes the store operation by setting the loading state to false.
   */
  private finalizeStoreOperation(): void {
    this.updateState({
      isStoring: false,
    });
    Logger.debug('seminar store operation finalized.');
  }

  /**
   * Specifically clears success, error, and response data for a fresh start
   * without resetting the entire facade state.
   */
  resetStoreOperationState(): void {
    this._storeSeminarState.set({
      isStoring: false,
      storeSuccess: false,
      storeError: null,
      storedSeminarResponse: null,
    });
    Logger.debug('seminar store operation state manually reset.');
  }
}
