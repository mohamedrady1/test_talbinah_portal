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

// Common/Shared modules and services
import { Logger, ApiError, handleApiErrors, IApiResponse } from '../../../common'; // Adjust path
import { ToastService, LocalizationService } from '../../../shared'; // Adjust path

// Domain-specific imports for DTOs and models
import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients'; // Adjust path to your API client
import { initialMeetingReservationChatDetailState, initialMeetingReservationChatMessageSendingState, MeetingReservationChatDetailState, MeetingReservationChatMessageSendingState } from '../models';
import { ISendMessageRequestDto } from '../../talbinah-bot';
import { IMeetingChatItem } from '../dtos';

// State models for this facade


// TransferState Keys for SSR hydration
const MEETING_RESERVATION_CHAT_DETAIL_STATE_KEY = makeStateKey<MeetingReservationChatDetailState>('meetingReservationChatDetail');
const MEETING_RESERVATION_CHAT_MESSAGE_SENDING_STATE_KEY = makeStateKey<MeetingReservationChatMessageSendingState>('meetingReservationChatMessageSending');

@Injectable({
  providedIn: 'root'
})
export class MeetingReservationChatFacade {
  // --- Dependencies ---
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  // --- Feature States (Signals) ---
  private readonly _chatDetailState = signal<MeetingReservationChatDetailState>(initialMeetingReservationChatDetailState);
  private readonly _messageSendingState = signal<MeetingReservationChatMessageSendingState>(initialMeetingReservationChatMessageSendingState);

  // --- Selectors (Computed) ---
  // `chatMessages` now clearly indicates it holds the messages for the meeting reservation chat
  readonly chatMessages = computed(() => this._chatDetailState().chatMessages);
  readonly isChatLoading = computed(() => this._chatDetailState().isLoading);
  readonly chatLoadStatus = computed(() => this._chatDetailState().status);
  readonly chatLoadErrorMessage = computed(() => this._chatDetailState().errorMessage);

  readonly isMessageSending = computed(() => this._messageSendingState().isSending);
  readonly lastBotResponse = computed(() => this._messageSendingState().lastBotResponse);
  readonly messageSendStatus = computed(() => this._messageSendingState().status);
  readonly messageSendErrorMessage = computed(() => this._messageSendingState().errorMessage);

  constructor() {
    this._initFromTransferState();
  }

  private _initFromTransferState(): void {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedChatDetail = this._transferState.get<MeetingReservationChatDetailState>(MEETING_RESERVATION_CHAT_DETAIL_STATE_KEY, initialMeetingReservationChatDetailState);
      // if (cachedChatDetail && cachedChatDetail.chatMessages) {
      //   Logger.debug('Hydrating meeting reservation chat detail from TransferState', cachedChatDetail);
      //   this._updateChatDetailState(cachedChatDetail);
      //   this._transferState.remove(MEETING_RESERVATION_CHAT_DETAIL_STATE_KEY);
      // }

      // const cachedMessageState = this._transferState.get<MeetingReservationChatMessageSendingState>(MEETING_RESERVATION_CHAT_MESSAGE_SENDING_STATE_KEY, initialMeetingReservationChatMessageSendingState);
      // if (cachedMessageState && cachedMessageState.lastBotResponse) {
      //   Logger.debug('Hydrating meeting reservation message sending state from TransferState', cachedMessageState);
      //   this._updateMessageSendingState(cachedMessageState);
      //   this._transferState.remove(MEETING_RESERVATION_CHAT_MESSAGE_SENDING_STATE_KEY);
      // }
    }
  }
  fetchMeetingReservationChat(reservationId: number): void {
    Logger.debug(`[MeetingReservationChatFacade] Fetching chat for reservation ID: ${reservationId}`);
    this._updateChatDetailState({ isLoading: true, errorMessage: null });

    this._apiClient.getReservationChatByReservationId(reservationId).pipe(
      tap((response: IApiResponse<IMeetingChatItem[]>) => {
        if (response.status && response.data) {
          const chatMessages: IMeetingChatItem[] = response.data as unknown as IMeetingChatItem[];

          this._updateChatDetailState({
            chatMessages: chatMessages,
            status: true,
            errorMessage: null
          });

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(MEETING_RESERVATION_CHAT_DETAIL_STATE_KEY, this._chatDetailState());
            Logger.debug('[MeetingReservationChatFacade] Stored chat detail in TransferState for SSR');
          }
          Logger.info(`[MeetingReservationChatFacade] Successfully fetched chat for reservation response: ${response}.`);
        } else {
          // API returned status: false (logical error)
          const errorMessage = response.message || this._localizationService.translateTextFromJson('meetingReservationChat.errorLoading');
          this._updateChatDetailState({
            status: response.status,
            errorMessage: errorMessage,
            chatMessages: null // Clear previous messages on error
          });
          // this._toastService.error(errorMessage);
          Logger.warn(`[MeetingReservationChatFacade] API reported an issue fetching chat for reservation ${reservationId}: ${errorMessage}`);
        }
      }),
      catchError((error: ApiError) => {
        // Network or unhandled server error
        const localizedError = this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
        this._updateChatDetailState({
          status: false,
          errorMessage: localizedError,
          chatMessages: null // Clear messages on critical error
        });
        handleApiErrors(error); // Centralized error handling
        // this._toastService.error(localizedError);
        Logger.error(`[MeetingReservationChatFacade] Failed to fetch chat for reservation ${reservationId}:`, error);
        return EMPTY; // Complete observable stream
      }),
      finalize(() => this._updateChatDetailState({ isLoading: false })) // Always reset loading state
    ).subscribe();
  }

  sendMessage(message: string, reservationId: number): void {
    if (!reservationId) {
      Logger.warn('[MeetingReservationChatFacade] Cannot send message: No reservation ID provided.');
      // this._toastService.error(this._localizationService.translateTextFromJson('meetingReservationChat.noReservationIdError'));
      return;
    }

    Logger.debug(`[MeetingReservationChatFacade] Sending message for reservation ${reservationId}: "${message}"`);
    this._updateMessageSendingState({ isSending: true, errorMessage: null });

    const request: ISendMessageRequestDto = { message, conversation_id: reservationId };

    this._apiClient.sendMeetingMessage(request).pipe(
      tap((response: IApiResponse<any>) => {
        if (response.status && response.data) {
          this._updateMessageSendingState({ lastBotResponse: response.data, status: true });
          Logger.debug(`[MeetingReservationChatFacade] Message sent successfully for reservation ${reservationId}. Bot response:`, response.data);

          // Add the new message (and potentially a bot response) to the chat messages list
          this._addMessageToChat(response.data); // Add the message that was sent/received
        } else {
          const errorMessage = response.message || this._localizationService.translateTextFromJson('meetingReservationChat.errorMessageSend');
          this._updateMessageSendingState({
            status: response.status,
            errorMessage: errorMessage
          });
          // this._toastService.error(errorMessage);
          Logger.warn(`[MeetingReservationChatFacade] API reported an issue sending message for reservation ${reservationId}: ${errorMessage}`);
        }
      }),
      catchError((error: ApiError) => {
        const localizedError = this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
        this._updateMessageSendingState({
          status: false,
          errorMessage: localizedError
        });
        handleApiErrors(error);
        // this._toastService.error(localizedError);
        Logger.error(`[MeetingReservationChatFacade] Failed to send message for reservation ${reservationId}:`, error);
        return EMPTY;
      }),
      finalize(() => this._updateMessageSendingState({ isSending: false }))
    ).subscribe();
  }

  resetStates(): void {
    this._chatDetailState.set(initialMeetingReservationChatDetailState);
    this._messageSendingState.set(initialMeetingReservationChatMessageSendingState);
    Logger.debug('[MeetingReservationChatFacade] Meeting reservation chat states have been reset');
  }

  private _updateChatDetailState(updates: Partial<MeetingReservationChatDetailState>): void {
    this._chatDetailState.update(state => ({
      ...state,
      ...updates
    }));
  }

  private _updateMessageSendingState(updates: Partial<MeetingReservationChatMessageSendingState>): void {
    this._messageSendingState.update(state => ({
      ...state,
      ...updates
    }));
  }

  /**
   * Adds a new message to the current chat conversation.
   * @param newMessage The message data to add.
   */
  private _addMessageToChat(newMessage: IMeetingChatItem): void {
    this._chatDetailState.update(state => {
      const currentMessages = state.chatMessages || [];
      const updatedMessages = [...currentMessages, newMessage];

      return {
        ...state,
        chatMessages: updatedMessages,
        status: true // Assuming adding a message means the conversation is active/successful
      };
    });
    Logger.debug('[MeetingReservationChatFacade] Message added to current chat:', newMessage);
    Logger.debug('[MeetingReservationChatFacade] Current chat messages after adding:', this.chatMessages());
  }
}
