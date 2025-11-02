import {
  inject,
  Injectable,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  TechnicalSupportApiClientProvider,
  ITechnicalSupportApiClient,
} from '../clients';
import { ICreateNewConversationToDepartmentResponseDto, ITechnicalSupportChatDto } from '../dtos';
import { Logger, ApiError, handleApiErrors } from '../../../common';
import { DestroyRef } from '@angular/core';

// State Key for SSR hydration
const TECHNICAL_SUPPORT_CONVERSATION_STATE_KEY =
  makeStateKey<TechnicalSupportConversationFeatureState>(
    'technicalSupportConversation'
  );

// State Shape
export interface TechnicalSupportConversationState {
  isLoading: boolean;
  errorMessage: string | null;
  conversation: ITechnicalSupportChatDto | null;
}

export interface TechnicalSupportConversationFeatureState {
  technicalSupportConversation: TechnicalSupportConversationState;
}

// Initial State
export const initialTechnicalSupportConversationFeatureState: TechnicalSupportConversationFeatureState =
{
  technicalSupportConversation: {
    isLoading: false,
    errorMessage: null,
    conversation: null,
  },
};

@Injectable({ providedIn: 'root' })
export class CreateTechnicalSupportConversationFacade {
  private readonly _apiClient: ITechnicalSupportApiClient =
    inject(TechnicalSupportApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _featureState = signal<TechnicalSupportConversationFeatureState>(
    initialTechnicalSupportConversationFeatureState
  );

  // Selectors
  readonly isLoading = computed(
    () => this._featureState().technicalSupportConversation.isLoading
  );
  readonly errorMessage = computed(
    () => this._featureState().technicalSupportConversation.errorMessage
  );
  readonly conversation = computed(
    () => this._featureState().technicalSupportConversation.conversation
  );

  constructor() {
    this.hydrateFromTransferState();
  }

  createNewConversationToDepartmentId(departmentId: number): void {
    Logger.debug('Creating new conversation to department', { departmentId });

    this._updateConversationState({ isLoading: true, errorMessage: null });

    this._apiClient
      .createNewConversationToDepartmentId(departmentId)
      .pipe(
        tap((response: ICreateNewConversationToDepartmentResponseDto) => {
          this.handleConversationResponse(response);
        }),
        catchError((error: ApiError) => {
          this.handleConversationError(error);
          return EMPTY;
        }),
        finalize(() => {
          this._updateConversationState({ isLoading: false });
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
  }

  resetState(): void {
    this._featureState.set(initialTechnicalSupportConversationFeatureState);
  }

  private hydrateFromTransferState(): void {
    // if (isPlatformBrowser(this._platformId)) {
    //   const cachedState = this._transferState.get<TechnicalSupportConversationFeatureState>(
    //     TECHNICAL_SUPPORT_CONVERSATION_STATE_KEY,
    //     initialTechnicalSupportConversationFeatureState
    //   );

    //   if (cachedState) {
    //     Logger.debug('Hydrating conversation from TransferState', cachedState);
    //     this._updateConversationState(cachedState.technicalSupportConversation);
    //     this._transferState.remove(TECHNICAL_SUPPORT_CONVERSATION_STATE_KEY);
    //   }
    // }
  }

  private handleConversationResponse(response: ICreateNewConversationToDepartmentResponseDto): void {
    if (!isPlatformBrowser(this._platformId)) {
      this._transferState.set(
        TECHNICAL_SUPPORT_CONVERSATION_STATE_KEY,
        this._featureState()
      );
    }

    if (response.status) {
      this._updateConversationState({
        conversation: response.data,
        errorMessage: null,
      });
    } else {
      this._updateConversationState({
        conversation: null,
        errorMessage: response.message || 'Failed to create conversation',
      });
    }
  }

  private handleConversationError(error: ApiError): void {
    this._updateConversationState({
      errorMessage: 'Error creating conversation. Please try again later.',
      conversation: null,
    });
    handleApiErrors(error);
  }

  private _updateConversationState(
    updates: Partial<TechnicalSupportConversationState>
  ): void {
    this._featureState.update((state) => ({
      ...state,
      technicalSupportConversation: {
        ...state.technicalSupportConversation,
        ...updates,
      },
    }));
  }
}
