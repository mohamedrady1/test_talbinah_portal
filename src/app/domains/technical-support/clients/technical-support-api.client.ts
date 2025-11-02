import { ITechnicalSupportApiClient } from "./i-technical-support-api.client";
import { CollectionApiClient, IPaginationParameters } from "../../../common";
import { TechnicalSupportManagementCollections } from "../collections";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IAssignToCustomersSupportResponseDto, IAssignToDepartmentResponseDto, ICloseSupportConversationResponseDto, ICreateNewConversationToDepartmentResponseDto, ITechnicalSupportChatResponseDto, ITechnicalSupportConversationDetailsResponseDto, IUserSupportConversationLogRequestDto, IUserSupportConversationLogResponseDto } from "../dtos";
import { ICustomersSupportResponseDto, ITechnicalSupportDepartmentsResponseDto } from "../services";

@Injectable({ providedIn: 'root' })
export class TechnicalSupportApiClient implements ITechnicalSupportApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      TechnicalSupportManagementCollections.TechnicalSupport,
      this.http
    );
  }

  getTechnicalSupportChats(isSupport?: boolean): Observable<ITechnicalSupportChatResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TechnicalSupportManagementCollections.getTechnicalSupportChats(isSupport)
    });
  }

  getTechnicalSupportDepartments(): Observable<ITechnicalSupportDepartmentsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TechnicalSupportManagementCollections.getTechnicalSupportDepartments()
    });
  }
  assignToDepartment(conversation_id: number, department_id: number): Observable<IAssignToDepartmentResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TechnicalSupportManagementCollections.assignToDepartment(conversation_id),
      requestOptions: {
        params: {
          department_id: department_id
        }
      }
    });
  }

  getCustomersSupport(): Observable<ICustomersSupportResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TechnicalSupportManagementCollections.getCustomersSupport()
    });
  }
  assignToCustomerSupport(conversation_id: number, support_user_id: number): Observable<IAssignToCustomersSupportResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TechnicalSupportManagementCollections.assignToCustomerSupport(conversation_id),
      requestOptions: {
        params: {
          support_user_id: support_user_id
        }
      }
    });
  }

  customerAssignChatToHim(conversation_id: number): Observable<IAssignToCustomersSupportResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TechnicalSupportManagementCollections.customerAssignChatToHim(conversation_id)
    });
  }
  userAddChatToHim(conversation_id: number): Observable<IAssignToCustomersSupportResponseDto> {
    return this.collectionApiClient.put({
      collectionName: TechnicalSupportManagementCollections.userAddChatToHim(conversation_id)
    });
  }

  closeSupportConversation(conversation_id: number): Observable<ICloseSupportConversationResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TechnicalSupportManagementCollections.closeSupportConversation(conversation_id)
    });
  }

  createNewConversationToDepartmentId(department_id: number): Observable<ICreateNewConversationToDepartmentResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TechnicalSupportManagementCollections.createNewConversationToDepartmentId(),
      requestOptions: {
        params: {
          department_id: department_id
        }
      }
    });
  }
  technicalSupportConversationDetails(conversation_id: number): Observable<ITechnicalSupportConversationDetailsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TechnicalSupportManagementCollections.technicalSupportConversationDetails(conversation_id)
    });
  }

  UserSupportConversationLog(payload: IUserSupportConversationLogRequestDto): Observable<IUserSupportConversationLogResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TechnicalSupportManagementCollections.UserSupportConversationLog(),
      body: payload
    });
  }
}
