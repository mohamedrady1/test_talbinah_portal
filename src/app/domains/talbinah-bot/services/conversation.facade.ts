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
import { Observable, catchError, EMPTY, finalize, tap, BehaviorSubject } from 'rxjs';
import { Logger, ApiError, handleApiErrors, IApiResponse } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';
import { ITalbinahBotApiClient, TalbinahBotApiClientProvider } from '../clients';
import { IChatConversationDataDto, IStartNewChatRequestDto, ISendMessageRequestDto, IChatMessageDataDto } from '../dtos';
import { ConversationDetailState, MessageSendingState, initialConversationDetailState, initialMessageSendingState, initialNewChatState, startNewChatState } from '../models';


const CURRENT_CONVERSATION_STATE_KEY = makeStateKey<ConversationDetailState>('currentConversation');
const MESSAGE_SENDING_STATE_KEY = makeStateKey<MessageSendingState>('messageSending');

@Injectable({
  providedIn: 'root'
})
export class ConversationFacade {
  private readonly _apiClient: ITalbinahBotApiClient = inject(TalbinahBotApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _conversationState = signal<ConversationDetailState>(initialConversationDetailState);
  private readonly _newChatState = signal<startNewChatState>(initialNewChatState);
  private readonly _messageState = signal<MessageSendingState>(initialMessageSendingState);

  readonly currentConversation = computed(() => this._conversationState().response);
  readonly isConversationLoading = computed(() => this._conversationState().isLoading);
  readonly conversationStatus = computed(() => this._conversationState().status);
  readonly conversationErrorMessage = computed(() => this._conversationState().errorMessage);

  readonly isMessageSending = computed(() => this._messageState().isSending);
  readonly lastBotResponse = computed(() => this._messageState().lastBotResponse);
  readonly lastBotStatus = computed(() => this._messageState().status);
  readonly messageErrorMessage = computed(() => this._messageState().errorMessage);

  private readonly _localMessageSubject = new BehaviorSubject<IChatMessageDataDto | null>(null);
  public readonly localMessageAdded$ = this._localMessageSubject.asObservable();

  constructor() {
    this._initFromTransferState();

    this.localMessageAdded$.subscribe(message => {
      if (message) {
        this._addMessageToCurrentConversation(message);
      }
    });
  }

  private _initFromTransferState(): void {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedConversation = this._transferState.get<ConversationDetailState>(CURRENT_CONVERSATION_STATE_KEY, initialConversationDetailState);
      // if (cachedConversation && cachedConversation.response) {
      //   Logger.debug('Hydrating current conversation from TransferState', cachedConversation);
      //   this._updateConversationState(cachedConversation);
      //   this._transferState.remove(CURRENT_CONVERSATION_STATE_KEY);
      // }

      // const cachedMessageState = this._transferState.get<MessageSendingState>(MESSAGE_SENDING_STATE_KEY, initialMessageSendingState);
      // if (cachedMessageState && cachedMessageState.lastBotResponse) {
      //   Logger.debug('Hydrating message sending state from TransferState', cachedMessageState);
      //   this._updateMessageState(cachedMessageState);
      //   this._transferState.remove(MESSAGE_SENDING_STATE_KEY);
      // }
    }
  }

  addLocalMessageToConversation(message: IChatMessageDataDto): void {
    this._localMessageSubject.next(message);
  }

  fetchConversation(id: number): void {
    Logger.debug(`Fetching conversation with ID: ${id}`);
    this._updateConversationState({ isLoading: true, errorMessage: null });

    this._apiClient.getConversation(id).pipe(
      tap((response: IApiResponse<IChatConversationDataDto[]>) => {
        if (response.status && response.data) {
          this._updateConversationState({
            response: response.data,
            status: true
          });

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(CURRENT_CONVERSATION_STATE_KEY, this._conversationState());
          }
        } else {
          this._updateConversationState({
            status: response.status,
            errorMessage: response.message || this._localizationService.translateTextFromJson('conversation.errorLoading')
          });
        }
      }),
      catchError((error: ApiError) => {
        this._updateConversationState({
          status: false,
          errorMessage: this._localizationService.translateTextFromJson('conversation.errorLoading')
        });
        handleApiErrors(error);
        return EMPTY;
      }),
      finalize(() => this._updateConversationState({ isLoading: false }))
    ).subscribe();
  }

  startNewChat(payload: IStartNewChatRequestDto): Observable<IApiResponse<IChatConversationDataDto>> {
    Logger.debug(`Starting new chat with initial message: ${payload}`);
    this._updateConversationState({ isLoading: true, errorMessage: null });

    const request: IStartNewChatRequestDto = payload;

    return this._apiClient.startNewChat(request).pipe(
      tap(response => {
        if (response.status && response.data) {
          this._updateNewChatState({ response: response.data, status: response.status });
        } else {
          this._updateConversationState({
            status: false,
            errorMessage: response.message || this._localizationService.translateTextFromJson('conversation.errorStartingNewChat')
          });
        }
      }),
      catchError((error: ApiError) => {
        this._updateConversationState({ status: false, errorMessage: this._localizationService.translateTextFromJson('conversation.errorStartingNewChat') });
        handleApiErrors(error);
        return EMPTY;
      }),
      finalize(() => this._updateConversationState({ isLoading: false }))
    );
  }

  sendMessage(message: string, card_slug?: string): void {
    const conversationId = 1;
    if (!conversationId) {
      Logger.warn('Cannot send message: No active conversation ID found. Starting a new chat instead.');
      const payload: { start: number; card_slug?: string } = { start: 1 };
      if (card_slug) {
        payload.card_slug = card_slug;
      }
      this.startNewChat(payload).subscribe();
      return;
    }

    Logger.debug(`Sending message to conversation ${conversationId}: "${message}"`);
    this._updateMessageState({ isSending: true, errorMessage: null });

    const request: ISendMessageRequestDto = { message };

    this._apiClient.sendMessage(request).pipe(
      tap(response => {
        this._removeFakeMessage(request.message);

        if (response.status && response.data) {
          this._updateMessageState({ lastBotResponse: response.data });
          Logger.debug(`Sending message to conversation Response: `, response);
          if (response.data) {
            this._addMessageToCurrentConversation(response.data);
            // Remove duplicate message emission - messages are already added to conversation state
            // this._localMessageSubject.next(response.data);
          }
        } else {
          this._updateMessageState({
            errorMessage: response.message || this._localizationService.translateTextFromJson('conversation.errorMessageSend')
          });
        }
      }),
      catchError((error: ApiError) => {
        this._removeFakeMessage(request.message);
        this._updateMessageState({ errorMessage: this._localizationService.translateTextFromJson('conversation.errorMessageSend') });
        handleApiErrors(error);
        return EMPTY;
      }),
      finalize(() => this._updateMessageState({ isSending: false }))
    ).subscribe();
  }

  resetStates(): void {
    this._conversationState.set(initialConversationDetailState);
    this._messageState.set(initialMessageSendingState);
    Logger.debug('Conversation and message states have been reset');
  }

  private _updateConversationState(updates: Partial<ConversationDetailState>): void {
    this._conversationState.update(state => ({
      ...state,
      ...updates
    }));
  }

  private _updateNewChatState(updates: Partial<startNewChatState>): void {
    this._newChatState.update(state => ({
      ...state,
      ...updates
    }));
  }

  private _updateMessageState(updates: Partial<MessageSendingState>): void {
    this._messageState.update(state => ({
      ...state,
      ...updates
    }));
  }

  private _addMessageToCurrentConversation(newMessage: IChatMessageDataDto): void {
    this._conversationState.update(state => {
      const currentMessages = state.response || [];
      const updatedMessages = [...currentMessages, newMessage];

      return {
        ...state,
        response: updatedMessages,
        status: true
      };
    });
  }

  // --- NEW: Method to remove the fake message ---
  private _removeFakeMessage(originalMessageContent: string): void {
    this._conversationState.update(state => {
      const currentMessages = state.response || [];
      const updatedMessages = currentMessages.filter(
        msg => !(msg.isDraft && msg.message === originalMessageContent)
      );

      if (updatedMessages.length < currentMessages.length) {
        Logger.debug('Removed fake message:', originalMessageContent);
      } else {
        Logger.debug('No fake message found to remove for:', originalMessageContent);
      }

      return {
        ...state,
        response: updatedMessages
      };
    });
  }
}
