import { ITalbinahBotApiClient } from "./i-talbinah-bot-api.client";
import { CollectionApiClient, IApiResponse } from "../../../common";
import { KhawiikManagementCollections } from "../collections";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  IChatHistoryItemDataDto,
  IEditChatNameRequestDto,
  IChatConversationDataDto,
  IStartNewChatRequestDto,
  ISendMessageRequestDto,
  IChatMessageDataDto,
  IKhawiikVoiceTypesDataDto,
  ISaveKhawiikVoiceTypeDataDto,
  IKhawiikVoiceActivitiesDataDto,
  IKhawiikVoiceRealtimeSessionDataDto,
  IKhawiikBooksDataDto,
  IStartMissionRequestDto,
  IStartMissionDataDto,
  IVoiceTrackDataDto
} from '../dtos'; // Your DTOs
import { IVoiceTrackRequestDto } from '../dtos/requests/chat-requests.dto';

@Injectable({ providedIn: 'root' })
export class TalbinahBotApiClient implements ITalbinahBotApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      KhawiikManagementCollections.Khawiik,
      this.http
    );
  }

  getChatsHistoryListing(params?: any): Observable<IApiResponse<IChatHistoryItemDataDto[]>> {
    return this.collectionApiClient.get({
      collectionName: KhawiikManagementCollections.ChatsHistoryListing(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  deleteChat(id: number): Observable<IApiResponse<void>> {
    return this.collectionApiClient.delete({
      collectionName: KhawiikManagementCollections.DeleteChat(id)
    });
  }


  editChatName(id: number, request: IEditChatNameRequestDto): Observable<IApiResponse<IChatHistoryItemDataDto>> {
    return this.collectionApiClient.put({
      collectionName: KhawiikManagementCollections.EditChatName(id),
      body: request
    });
  }

  getConversation(id: number): Observable<IApiResponse<IChatConversationDataDto[]>> {
    return this.collectionApiClient.get({
      collectionName: KhawiikManagementCollections.GetConversation(id)
    });
  }

  startNewChat(request: IStartNewChatRequestDto): Observable<IApiResponse<IChatConversationDataDto>> {
    return this.collectionApiClient.post({
      collectionName: KhawiikManagementCollections.StartNewChat(),
      body: request
    });
  }

  sendMessage(request: ISendMessageRequestDto): Observable<IApiResponse<IChatMessageDataDto>> {
    return this.collectionApiClient.post({
      collectionName: KhawiikManagementCollections.SendMessage(),
      body: request
    });
  }

  khawiikVoiceTypes(): Observable<IApiResponse<IKhawiikVoiceTypesDataDto>> {
    return this.collectionApiClient.get({
      collectionName: KhawiikManagementCollections.khawiikVoiceTypes()
    });
  }
  saveKhawiikVoiceType(params?: any): Observable<IApiResponse<ISaveKhawiikVoiceTypeDataDto>> {
    return this.collectionApiClient.post({
      collectionName: KhawiikManagementCollections.saveKhawiikVoiceType(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }
  khawiikVoiceActivities(): Observable<IApiResponse<IKhawiikVoiceActivitiesDataDto>> {
    return this.collectionApiClient.get({
      collectionName: KhawiikManagementCollections.khawiikVoiceActivities()
    });
  }
  khawiikVoiceRealtimeSession(params?: { voice_slug?: string | null }): Observable<IApiResponse<IKhawiikVoiceRealtimeSessionDataDto>> {
    return this.collectionApiClient.post({
      collectionName: KhawiikManagementCollections.khawiikVoiceRealtimeSession(),
      body: params || {}
    });
  }

  khawiikBooks(): Observable<IApiResponse<IKhawiikBooksDataDto>> {
    return this.collectionApiClient.get({
      collectionName: KhawiikManagementCollections.khawiikBooks()
    });
  }
  startMission(missionSlug: string, request: IStartMissionRequestDto): Observable<IApiResponse<IStartMissionDataDto>> {
    return this.collectionApiClient.post({
      collectionName: KhawiikManagementCollections.startMission(missionSlug),
      body: request
    });
  }

  voiceTrack(request: IVoiceTrackRequestDto): Observable<IApiResponse<IVoiceTrackDataDto>> {
    return this.collectionApiClient.post({
      collectionName: KhawiikManagementCollections.voiceTrack(),
      body: request
    });
  }
}
