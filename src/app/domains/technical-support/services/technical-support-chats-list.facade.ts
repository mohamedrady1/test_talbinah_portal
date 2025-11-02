import {
  inject,
  Injectable,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
  signal,
  computed
} from '@angular/core';

import { ITechnicalSupportApiClient, TechnicalSupportApiClientProvider } from '../clients';
import { ITechnicalSupportChatDto, ITechnicalSupportChatResponseDto } from '../dtos';
import { Logger, ApiError, handleApiErrors } from '../../../common';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

const TECHNICAL_SUPPORT_CHATS_STATE_KEY =
  makeStateKey<TechnicalSupportChatsFeatureState>('technicalSupportChats');

export interface TechnicalSupportChatsListState {
  chats: ITechnicalSupportChatDto[];
  isLoading: boolean;
  errorMessage: string | null;
}

export interface TechnicalSupportChatsFeatureState {
  technicalSupportChats: TechnicalSupportChatsListState;
}

export const initialTechnicalSupportChatsFeatureState: TechnicalSupportChatsFeatureState = {
  technicalSupportChats: {
    chats: [],
    isLoading: false,
    errorMessage: null
  }
};

@Injectable({ providedIn: 'root' })
export class TechnicalSupportChatsFacade {
  private readonly _apiClient: ITechnicalSupportApiClient =
    inject(TechnicalSupportApiClientProvider).getClient();

  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _featureState = signal<TechnicalSupportChatsFeatureState>(
    initialTechnicalSupportChatsFeatureState
  );

  // selectors
  readonly chats = computed(() => this._featureState().technicalSupportChats.chats);
  readonly isLoading = computed(() => this._featureState().technicalSupportChats.isLoading);
  readonly errorMessage = computed(
    () => this._featureState().technicalSupportChats.errorMessage
  );

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // Optional hydration logic
      // const cachedState = this._transferState.get<TechnicalSupportChatsFeatureState>(
      //   TECHNICAL_SUPPORT_CHATS_STATE_KEY,
      //   initialTechnicalSupportChatsFeatureState
      // );
      // if (cachedState) {
      //   Logger.debug('Hydrating support chats from TransferState', cachedState);
      //   this._updateChatsState(cachedState.technicalSupportChats);
      //   this._transferState.remove(TECHNICAL_SUPPORT_CHATS_STATE_KEY);
      // }
    }
  }

  fetchChats(isSupport?: boolean): void {
    Logger.debug('Fetching technical support chats list');

    this._updateChatsState({ isLoading: true, errorMessage: null });

    this._apiClient
      .getTechnicalSupportChats(isSupport)
      .pipe(
        tap((response: ITechnicalSupportChatResponseDto) => {
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(TECHNICAL_SUPPORT_CHATS_STATE_KEY, this._featureState());
            Logger.debug('Stored technical support chats in TransferState for SSR');
          }

          this._updateChatsState({
            chats: response.data,
            errorMessage: null
          });

          Logger.debug('Technical support chats response: ', {
            errorMessage: this.errorMessage(),
            chats: this.chats()
          });
        }),
        catchError((error: ApiError) => {
          this._updateChatsState({
            errorMessage: '🚨 Error loading chats. Please try again later.',
            chats: []
          });
          handleApiErrors(error);
          return EMPTY;
        }),
        finalize(() => {
          this._updateChatsState({ isLoading: false });
        })
      )
      .subscribe();
  }

  private _updateChatsState(updates: Partial<TechnicalSupportChatsListState>): void {
    this._featureState.update(state => ({
      ...state,
      technicalSupportChats: {
        ...state.technicalSupportChats,
        ...updates
      }
    }));
  }
}
