import {
  inject,
  Injectable,
  signal,
  computed
} from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import {
  ITechnicalSupportApiClient,
  TechnicalSupportApiClientProvider
} from '../clients';
import {
  ITechnicalSupportChatDto,
  ITechnicalSupportConversationDetailsResponseDto,
} from '../dtos';
import { Logger, ApiError, handleApiErrors } from '../../../common';

// --- State Shape ---
export interface TechnicalSupportConversationDetailsState {
  details: ITechnicalSupportChatDto | null;
  isLoading: boolean;
  errorMessage: string | null;
}

// --- Initial State ---
const initialTechnicalSupportConversationDetailsState: TechnicalSupportConversationDetailsState = {
  details: null,
  isLoading: false,
  errorMessage: null
};

@Injectable({ providedIn: 'root' })
export class TechnicalSupportConversationDetailsFacade {
  private readonly _apiClient: ITechnicalSupportApiClient =
    inject(TechnicalSupportApiClientProvider).getClient();

  private readonly _state = signal<TechnicalSupportConversationDetailsState>(
    initialTechnicalSupportConversationDetailsState
  );

  // --- Selectors ---
  readonly details = computed(() => this._state().details);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly errorMessage = computed(() => this._state().errorMessage);

  fetchConversationDetails(conversation_id: number): void {
    Logger.debug('Fetching technical support conversation details', { conversation_id });

    this._state.update(state => ({
      ...state,
      isLoading: true,
      errorMessage: null
    }));

    this._apiClient
      .technicalSupportConversationDetails(conversation_id)
      .pipe(
        tap((response: ITechnicalSupportConversationDetailsResponseDto) => {
          this._state.update(state => ({
            ...state,
            details: response.data,
            errorMessage: null
          }));

          Logger.debug('Technical support conversation details response: ', {
            errorMessage: this.errorMessage(),
            details: this.details()
          });
        }),
        catchError((error: ApiError) => {
          this._state.update(state => ({
            ...state,
            errorMessage: 'Error loading conversation details. Please try again later.',
            details: null
          }));
          handleApiErrors(error);
          return EMPTY;
        }),
        finalize(() => {
          this._state.update(state => ({
            ...state,
            isLoading: false
          }));
        })
      )
      .subscribe();
  }

  resetState(): void {
    this._state.set(initialTechnicalSupportConversationDetailsState);
  }
}
