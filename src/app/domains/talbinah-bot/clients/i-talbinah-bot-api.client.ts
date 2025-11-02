import { IChatHistoryItemDataDto, IEditChatNameRequestDto, IChatConversationDataDto, IStartNewChatRequestDto, ISendMessageRequestDto, IChatMessageDataDto, IKhawiikVoiceTypesDataDto, ISaveKhawiikVoiceTypeDataDto, IKhawiikVoiceActivitiesDataDto, IKhawiikVoiceRealtimeSessionDataDto, IKhawiikBooksDataDto, IStartMissionDataDto, IVoiceTrackDataDto } from '../dtos';
import { IStartMissionRequestDto, IVoiceTrackRequestDto } from '../dtos/requests/chat-requests.dto';
import { IApiResponse } from '../../../common';
import { Observable } from 'rxjs';

export interface ITalbinahBotApiClient {

  getChatsHistoryListing(params?: any): Observable<IApiResponse<IChatHistoryItemDataDto[]>>;

  deleteChat(id: number): Observable<IApiResponse<void>>;

  editChatName(id: number, request: IEditChatNameRequestDto): Observable<IApiResponse<IChatHistoryItemDataDto>>;


  getConversation(id: number): Observable<IApiResponse<IChatConversationDataDto[]>>;

  startNewChat(request?: IStartNewChatRequestDto): Observable<IApiResponse<IChatConversationDataDto>>;

  sendMessage(request: ISendMessageRequestDto): Observable<IApiResponse<IChatMessageDataDto>>;

  khawiikVoiceTypes(): Observable<IApiResponse<IKhawiikVoiceTypesDataDto>>;
  saveKhawiikVoiceType(params?: any): Observable<IApiResponse<ISaveKhawiikVoiceTypeDataDto>>;
  khawiikVoiceActivities(): Observable<IApiResponse<IKhawiikVoiceActivitiesDataDto>>;
  khawiikBooks(): Observable<IApiResponse<IKhawiikBooksDataDto>>;
  khawiikVoiceRealtimeSession(params?: { voice_slug?: string | null }): Observable<IApiResponse<IKhawiikVoiceRealtimeSessionDataDto>>;

  startMission(missionSlug: string, request: IStartMissionRequestDto): Observable<IApiResponse<IStartMissionDataDto>>;

  voiceTrack(request: IVoiceTrackRequestDto): Observable<IApiResponse<IVoiceTrackDataDto>>;
}
