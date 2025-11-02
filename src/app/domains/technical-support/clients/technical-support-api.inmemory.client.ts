import { mockAssignToCustomerSupport, mockassignToDepartment, mockcloseSupportConversation, mockCustomersSupport, mockNewConversationToDepartment, mockTechnicalSupportConversationDetails, mockTechnicalSupportDepartments, mockTechnicalSupportListing, mockUserSupportConversationLog } from '../data';
import { ITechnicalSupportApiClient } from './i-technical-support-api.client';
import { ICustomersSupportResponseDto, ITechnicalSupportDepartmentsResponseDto } from '../services';
import { IAssignToCustomersSupportResponseDto, IAssignToDepartmentResponseDto, ICloseSupportConversationResponseDto, ICreateNewConversationToDepartmentResponseDto, ITechnicalSupportChatResponseDto, ITechnicalSupportConversationDetailsResponseDto, IUserSupportConversationLogRequestDto, IUserSupportConversationLogResponseDto } from '../dtos';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TechnicalSupportInMemoryApiClient implements ITechnicalSupportApiClient {

  getTechnicalSupportChats(isSupport?: boolean): Observable<ITechnicalSupportChatResponseDto> {
    return of(mockTechnicalSupportListing);
  }

  getTechnicalSupportDepartments(): Observable<ITechnicalSupportDepartmentsResponseDto> {
    return of(mockTechnicalSupportDepartments);
  }
  assignToDepartment(conversation_id: number, department_id: number): Observable<IAssignToDepartmentResponseDto> {
    return of(mockassignToDepartment);
  }

  getCustomersSupport(): Observable<ICustomersSupportResponseDto> {
    return of(mockCustomersSupport);
  }
  assignToCustomerSupport(conversation_id: number, support_user_id: number): Observable<IAssignToCustomersSupportResponseDto> {
    return of(mockAssignToCustomerSupport);
  }

  customerAssignChatToHim(conversation_id: number): Observable<IAssignToCustomersSupportResponseDto> {
    return of(mockAssignToCustomerSupport);
  }
  userAddChatToHim(conversation_id: number): Observable<IAssignToCustomersSupportResponseDto> {
    return of(mockAssignToCustomerSupport);
  }

  closeSupportConversation(conversation_id: number): Observable<ICloseSupportConversationResponseDto> {
    return of(mockcloseSupportConversation);
  }

  createNewConversationToDepartmentId(department_id: number): Observable<ICreateNewConversationToDepartmentResponseDto> {
    return of(mockNewConversationToDepartment);
  }
  technicalSupportConversationDetails(conversation_id: number): Observable<ITechnicalSupportConversationDetailsResponseDto> {
    return of(mockTechnicalSupportConversationDetails);
  }

  UserSupportConversationLog(payload: IUserSupportConversationLogRequestDto): Observable<IUserSupportConversationLogResponseDto> {
    return of(mockUserSupportConversationLog);
  }
}
