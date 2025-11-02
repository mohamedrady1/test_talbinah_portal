import {
  inject,
  Injectable,
  signal,
  computed,
  PLATFORM_ID,
  makeStateKey,
  TransferState
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, EMPTY, finalize, tap } from 'rxjs';
import {
  IPaginationParameters,
  defaultPaginationParameters,
  Logger,
  ApiError,
  handleApiErrors,
  IApiResponse
} from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';
import { ITalbinahBotApiClient, TalbinahBotApiClientProvider } from '../clients';
import { ChatHistoryListState, initialChatHistoryListState, TalbinahBotFeatureState } from '../models';
import { IChatHistoryItemDataDto, IEditChatNameRequestDto } from '../dtos';

const CHAT_HISTORY_STATE_KEY = makeStateKey<TalbinahBotFeatureState['chatHistory']>('chatHistory');

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryFacade {
  private readonly _apiClient: ITalbinahBotApiClient = inject(TalbinahBotApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _state = signal<ChatHistoryListState>(initialChatHistoryListState);

  // New signal for specific name editing loading state
  private readonly _isEditingNameLoading = signal(false);

  private _paginationParams: IPaginationParameters = { ...defaultPaginationParameters, total: 10 };

  readonly chatHistory = computed(() => this._state().response);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly isFiltering = computed(() => this._state().isFiltering);
  readonly errorMessage = computed(() => this._state().errorMessage);
  readonly totalItems = computed(() => this._state().totalItems);
  readonly currentPage = computed(() => this._state().currentPage);
  readonly totalPages = computed(() => this._state().totalPages);
  readonly status = computed(() => this._state().status);
  // Expose the new loading signal
  readonly isEditingNameLoading = computed(() => this._isEditingNameLoading());

  constructor() {
    this._initFromTransferState();
  }

  private _initFromTransferState(): void {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get<ChatHistoryListState>(CHAT_HISTORY_STATE_KEY, initialChatHistoryListState);
      // if (cachedState && cachedState.response.length > 0) {
      //   Logger.debug('Hydrating chat history from TransferState', cachedState);
      //   this._updateState(cachedState);
      //   this._transferState.remove(CHAT_HISTORY_STATE_KEY);
      // }
    }
  }

  fetchChatHistory(page: number = this._paginationParams?.page ?? 1, filter: boolean = false): void {
    Logger.debug(`Fetching chat history - Page: ${page}, Filter: ${filter}`);

    this._paginationParams.page = page;

    if (!filter) {
      this._updateState({
        isLoading: true,
        errorMessage: null,
        status: true
      });
    }
    this._updateState({
      isFiltering: filter,
      currentPage: page,
      errorMessage: null,
      status: true
    });

    this._apiClient
      .getChatsHistoryListing(this._paginationParams)
      .pipe(
        tap((response: IApiResponse<IChatHistoryItemDataDto[]>) => {
          if (response.status && response.data) {
            this._updateState({
              response: response.data,
              currentPage: page,
              totalItems: response.data.length,
              totalPages: Math.ceil(response.data.length / this._paginationParams.total!),
              status: true
            });

            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(CHAT_HISTORY_STATE_KEY, this._state());
              Logger.debug('Stored chat history in TransferState for SSR');
            }
          } else {
            this._updateState({
              errorMessage: response.message || this._localizationService.translateTextFromJson('chat.errorLoadingHistory'),
              status: false
            });
          }
        }),
        catchError((error: ApiError) => {
          this._updateState({
            errorMessage: this._localizationService.translateTextFromJson('chat.errorLoadingHistory'),
            response: [],
            status: false
          });
          handleApiErrors(error);
          return EMPTY;
        }),
        finalize(() => {
          if (!filter) {
            this._updateState({
              isLoading: false,
              isFiltering: false
            });
          }
        })
      )
      .subscribe();
  }

  deleteChat(id: number): Observable<IApiResponse<void>> {
    Logger.debug(`Attempting to delete chat with ID: ${id}`);
    this._updateState({ isLoading: true, errorMessage: null, status: true });

    return this._apiClient.deleteChat(id).pipe(
      tap(response => {
        if (response.status) {
          this._updateState({
            response: this._state().response.filter(chat => chat.id !== id),
            status: true
          });
        } else {
          this._updateState({
            errorMessage: response.message || this._localizationService.translateTextFromJson('chat.errorDeletingChat'),
            status: false
          });
        }
      }),
      catchError((error: ApiError) => {
        handleApiErrors(error);
        this._updateState({
          errorMessage: this._localizationService.translateTextFromJson('general.errorOccurred'),
          status: false
        });
        return EMPTY;
      }),
      finalize(() => this._updateState({ isLoading: false }))
    );
  }

  editChatName(id: number, newName: string): Observable<IApiResponse<IChatHistoryItemDataDto>> {
    Logger.debug(`Attempting to edit chat ${id} name to: ${newName}`);
    // Set the specific loading state to true
    this._isEditingNameLoading.set(true);

    const request: IEditChatNameRequestDto = { name: newName };

    return this._apiClient.editChatName(id, request).pipe(
      tap(response => {
        if (response.status && response.data) {
          // Update the chat name in the history list
          this._state.update(current => ({
            ...current,
            response: current.response.map(chat =>
              chat.id === id ? { ...chat, name: response.data!.name } : chat
            ),
            status: true
          }));
          // Optionally re-fetch history or update specific chatSelectedItem's name
          // If chatSelectedItem is an input, you'd need to emit an event for parent to update.
          // For now, if the `chatSelectedItem().name` depends on this facade's data, it will auto-update.
          // this.fetchChatHistory(this._paginationParams.page, true);
        } else {
          this._updateState({
            errorMessage: response.message || this._localizationService.translateTextFromJson('chat.errorUpdatingChatName'),
            status: false
          });
        }
      }),
      catchError((error: ApiError) => {
        handleApiErrors(error);
        this._updateState({
          errorMessage: this._localizationService.translateTextFromJson('general.errorOccurred'),
          status: false
        });
        return EMPTY;
      }),
      finalize(() => {
        // Set the specific loading state back to false when the operation finishes
        this._isEditingNameLoading.set(false);
      })
    );
  }
  public updateChatNameInHistory(chatId: number, newName: string): void {
    this._state.update(state => ({
      ...state,
      response: state.response.map(chat =>
        chat.id === chatId ? { ...chat, name: newName } : chat
      )
    }));
    Logger.debug(`Chat ID ${chatId} name updated in history signal to "${newName}"`);
  }

  resetState(): void {
    this._state.set(initialChatHistoryListState);
    this._paginationParams = { ...defaultPaginationParameters, total: 10 };
    Logger.debug('Chat history state has been reset');
  }

  private _updateState(updates: Partial<ChatHistoryListState>): void {
    this._state.update(state => ({
      ...state,
      ...updates
    }));
  }
  public addNewChatToHistory(newChat: IChatHistoryItemDataDto): void {
    this._state.update(current => ({
      ...current,
      response: [newChat, ...current.response], // Add the new chat at the beginning
      totalItems: (current.totalItems ?? 0) + 1 // Increment total items count, defaulting to 0 if undefined
    }));
    Logger.debug(`New chat "${newChat.name}" added to the beginning of history.`);
  }

}
