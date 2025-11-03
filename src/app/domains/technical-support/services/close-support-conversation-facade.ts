import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { TechnicalSupportApiClientProvider, ITechnicalSupportApiClient } from '../clients';
import { ApiError, handleApiErrors, Logger } from '../../../common';
import { LocalizationService, ToastService } from '../../../shared';
import { ICloseSupportConversationResponseDto } from '../dtos';
import { TechnicalSupportChatsFacade } from './technical-support-chats-list.facade';

// --- State Interface ---
export interface ICloseSupportConversationState {
  isClosing: boolean;
  closeSuccess: boolean;
  closeError: string | null;
  response: ICloseSupportConversationResponseDto | null;
}

// --- Initial State ---
export const initialCloseSupportConversationState: ICloseSupportConversationState = {
  isClosing: false,
  closeSuccess: false,
  closeError: null,
  response: null,
};

// --- Unique key for SSR hydration ---
const CLOSE_SUPPORT_CONVERSATION_STATE_KEY =
  makeStateKey<ICloseSupportConversationState>('closeSupportConversationState');

@Injectable({
  providedIn: 'root',
})
export class CloseSupportConversationFacade {
  // --- Dependencies ---
  private readonly _apiClient: ITechnicalSupportApiClient = inject(TechnicalSupportApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  // --- Internal Signal State ---
  private readonly _state = signal<ICloseSupportConversationState>(initialCloseSupportConversationState);
  protected readonly _ChatsFacade = inject(TechnicalSupportChatsFacade);

  // --- Public Selectors ---
  readonly isClosing = computed(() => this._state().isClosing);
  readonly closeSuccess = computed(() => this._state().closeSuccess);
  readonly closeError = computed(() => this._state().closeError);
  readonly response = computed(() => this._state().response);

  constructor() {
    // Hydrate from TransferState in browser
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(CLOSE_SUPPORT_CONVERSATION_STATE_KEY, null);
      // if (cachedState) {
      //   this.updateState(cachedState);
      //   this._transferState.remove(CLOSE_SUPPORT_CONVERSATION_STATE_KEY);
      // }
    }
  }

  closeConversation(conversationId: number, isSupport?: boolean): void {
    Logger.debug(`Attempting to close support conversation ID: ${conversationId}`);

    this.updateState({
      isClosing: true,
      closeSuccess: false,
      closeError: null,
      response: null,
    });

    this._apiClient
      .closeSupportConversation(conversationId)
      .pipe(
        tap((response: ICloseSupportConversationResponseDto) => {
          if (response.status) {
            this.updateState({
              closeSuccess: true,
              response,
              closeError: null,
            });

            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(CLOSE_SUPPORT_CONVERSATION_STATE_KEY, this._state());
              Logger.debug('Stored close conversation state in TransferState for SSR.');
            }

            this._toastService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message || this._localizationService.translateTextFromJson('CloseSupportConversation.success'),
              life: 5000,
            });
            this._ChatsFacade.fetchChats(isSupport ?? false);

            Logger.debug(`Conversation ${conversationId} closed successfully`);
          } else {
            const errorMessage = response.message || this._localizationService.translateTextFromJson('CloseSupportConversation.failed');
            this.updateState({
              closeSuccess: false,
              response,
              closeError: errorMessage,
            });
            this.handleError({ message: errorMessage } as ApiError, 'CloseSupportConversation.failed');
          }
        }),
        catchError((error: ApiError) => {
          this.handleError(error, 'CloseSupportConversation.failed');
          return EMPTY;
        }),
        finalize(() => {
          this.updateState({ isClosing: false });
          Logger.debug('Close conversation operation finalized.');
        })
      )
      .subscribe();
  }

  /**
   * Reset the entire state
   */
  resetState(): void {
    this._state.set(initialCloseSupportConversationState);
    Logger.debug('Close conversation state reset.');
  }

  // --- Internal helpers ---
  private updateState(updates: Partial<ICloseSupportConversationState>): void {
    this._state.update((s) => ({ ...s, ...updates }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`Error closing conversation:`, error);
    handleApiErrors(error);

    const message = error?.message ?? this._localizationService.translateTextFromJson(translationKey);

    this._toastService.add({
      severity: 'error',
      summary: 'an_error_has_occurred',
      detail: message,
      life: 5000,
    });

    this.updateState({
      closeError: message,
      closeSuccess: false,
      response: null,
    });
  }
}
