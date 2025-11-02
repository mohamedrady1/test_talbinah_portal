import { ITalbinahBotApiClient } from './i-talbinah-bot-api.client';
import { IChatConversationDataDto, IChatHistoryItemDataDto, IChatMessageDataDto, IEditChatNameRequestDto, IKhawiikBooksDataDto, IKhawiikVoiceActivitiesDataDto, IKhawiikVoiceRealtimeSessionDataDto, IKhawiikVoiceTypesDataDto, ISaveKhawiikVoiceTypeDataDto, ISendMessageRequestDto, IStartMissionDataDto, IStartMissionRequestDto, IStartNewChatRequestDto, ITalbinahBotResponseDto, IVoiceTrackDataDto } from '../dtos';
import { IVoiceTrackRequestDto } from '../dtos/requests/chat-requests.dto';
import { mockDeleteChat, mockEditChatName, mockGetConversation, mockHistoryChats, mockKhawiikBooks, mockKhawiikVoiceActivities, mockKhawiikVoiceRealtimeSession, mockKhawiikVoiceTypes, mockSaveKhawiikVoiceType, mockSendMessage, mockStartMission, mockStartNewChat, mockVoiceTrack } from '../data';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IApiResponse } from '../../../common';

@Injectable({ providedIn: 'root' })
export class TalbinahBotInMemoryApiClient implements ITalbinahBotApiClient {

  getChatsHistoryListing(params?: any): Observable<IApiResponse<IChatHistoryItemDataDto[]>> {
    return of(mockHistoryChats);
  }

  deleteChat(id: number): Observable<IApiResponse<void>> {
    return of(mockDeleteChat);
  }

  editChatName(id: number, request: IEditChatNameRequestDto): Observable<IApiResponse<IChatHistoryItemDataDto>> {
    return of(mockEditChatName);
  }

  getConversation(id: number): Observable<IApiResponse<IChatConversationDataDto[]>> {
    return of(mockGetConversation);
  }

  startNewChat(request: IStartNewChatRequestDto): Observable<IApiResponse<IChatConversationDataDto>> {
    return of(mockStartNewChat);
  }

  sendMessage(request: ISendMessageRequestDto): Observable<IApiResponse<IChatMessageDataDto>> {
    return of(mockSendMessage);
  }

  khawiikVoiceTypes(): Observable<IApiResponse<IKhawiikVoiceTypesDataDto>> {
    return of(mockKhawiikVoiceTypes);
  }
  saveKhawiikVoiceType(params?: any): Observable<IApiResponse<ISaveKhawiikVoiceTypeDataDto>> {
    return of(mockSaveKhawiikVoiceType);
  }
  khawiikVoiceActivities(): Observable<IApiResponse<IKhawiikVoiceActivitiesDataDto>> {
    return of(mockKhawiikVoiceActivities);
  }
  khawiikVoiceRealtimeSession(params?: { voice_slug?: string | null }): Observable<IApiResponse<IKhawiikVoiceRealtimeSessionDataDto>> {
    return of(mockKhawiikVoiceRealtimeSession);
  }

  khawiikBooks(): Observable<IApiResponse<IKhawiikBooksDataDto>> {
    return of(mockKhawiikBooks);
  }
  startMission(missionSlug: string, request: IStartMissionRequestDto): Observable<IApiResponse<IStartMissionDataDto>> {
    return of(mockStartMission);
  }

  voiceTrack(request: IVoiceTrackRequestDto): Observable<IApiResponse<IVoiceTrackDataDto>> {
    return of(mockVoiceTrack);
  }
}
