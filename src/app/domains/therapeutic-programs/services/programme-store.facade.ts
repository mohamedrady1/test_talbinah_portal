import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { ApiError, handleApiErrors, Logger } from '../../../common'; // Adjust common utilities path
import { LocalizationService, ModalService, ToastService } from '../../../shared'; // Adjust shared services path
import { IStoreProgrammeRequestDto, IStoreProgrammeResponseDto } from '../dtos';
import { IProgrammeStoreState, initialProgrammeStoreState } from '../models';
import { ITherapeuticProgramsApiClient, TherapeuticProgramsApiClientProvider } from '../clients';
import { WalletFacade } from '../../settings';


// Define a unique state key for Angular's TransferState for SSR hydration
const PROGRAMME_STORE_STATE_KEY = makeStateKey<IProgrammeStoreState>('programmeStoreState');

@Injectable({
  providedIn: 'root', // This makes the facade a singleton service
})
export class ProgrammeStoreFacade {
  // --- Dependencies Injected ---
  private readonly _apiClient: ITherapeuticProgramsApiClient = inject(TherapeuticProgramsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);
  private walletService = inject(WalletFacade);
  private modalService = inject(ModalService);
  // --- Internal Feature State (Managed by a Signal) ---
  private readonly _storeProgrammeState = signal<IProgrammeStoreState>(initialProgrammeStoreState);

  // --- Exposed Selectors (Computed Signals for Public Consumption) ---
  readonly isStoringProgramme = computed(() => this._storeProgrammeState().isStoring);
  readonly storeSuccess = computed(() => this._storeProgrammeState().storeSuccess);
  readonly storeError = computed(() => this._storeProgrammeState().storeError);
  readonly storedProgramme = computed(() => this._storeProgrammeState().storedProgrammeResponse);

  constructor() {
    // Attempt to hydrate the state from TransferState when running in the browser
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(PROGRAMME_STORE_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating programme store state from TransferState:', cachedState);
      //   this.updateState(cachedState);
      //   this._transferState.remove(PROGRAMME_STORE_STATE_KEY);
      // }
    }
  }

  // --- Public Action Methods ---
  storeProgramme(payload: IStoreProgrammeRequestDto): void {
    Logger.debug('Attempting to store programme with payload:', payload);

    // Optimistically update state to indicate loading and clear previous outcomes
    this.updateState({
      isStoring: true,
      storeSuccess: false,
      storeError: null,
      storedProgrammeResponse: null,
    });

    this._apiClient.storeProgramme(payload)
      .pipe(
        tap((response: IStoreProgrammeResponseDto) => {
          if (response.status) {
            if (payload.payment_id === 1) {
              this.modalService.closeAll();
            }
            // Update state with successful response data
            this.updateState({
              storeSuccess: true,
              storedProgrammeResponse: response.data, // Store the 'data' part
              storeError: null,
            });
            // Store the current state in TransferState during SSR (on the server)
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(PROGRAMME_STORE_STATE_KEY, this._storeProgrammeState());
              Logger.debug('Stored programme state in TransferState for SSR.');
            }
            // Uncomment to display a success toast notification
            // this._toastService.success(this._localizationService.translateTextFromJson('programmes.storeSuccess'));
            Logger.debug('Programme stored successfully:', response.data);
            this.walletService.fetchWallet();
          } else {
            // Handle API-level business logic errors
            const errorMessage = response.message || this._localizationService.translateTextFromJson('programmes.storeFailedGeneric');
            this.handleError({ message: errorMessage } as ApiError, errorMessage);
          }
        }),
        catchError((error: ApiError) => {
          // Catch and handle HTTP or network errors
          this.handleError(error, 'general.errorStoringProgramme');
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
    this._storeProgrammeState.set(initialProgrammeStoreState);
    Logger.debug('Programme store state reset.');
  }

  // --- Private Utility Methods for Internal State Management ---
  private updateState(updates: Partial<IProgrammeStoreState>): void {
    this._storeProgrammeState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`Error storing programme:`, error);
    handleApiErrors(error); // Call your common error handler
    // Uncomment to display an error toast notification
    // this._toastService.error(this._localizationService.translateTextFromJson(translationKey));
    this.updateState({
      storeError: error?.message ?? this._localizationService.translateTextFromJson(translationKey),
      storeSuccess: false,
      storedProgrammeResponse: null,
    });
  }

  /**
   * Finalizes the store operation by setting the loading state to false.
   */
  private finalizeStoreOperation(): void {
    this.updateState({
      isStoring: false,
    });
    Logger.debug('Programme store operation finalized.');
  }

  /**
   * Specifically clears success, error, and response data for a fresh start
   * without resetting the entire facade state.
   */
  resetStoreOperationState(): void {
    this._storeProgrammeState.set({
      isStoring: false,
      storeSuccess: false,
      storeError: null,
      storedProgrammeResponse: null,
    });
    Logger.debug('Programme store operation state manually reset.');
  }
}
