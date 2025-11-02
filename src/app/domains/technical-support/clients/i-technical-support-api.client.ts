import { ICustomersSupportResponseDto, ITechnicalSupportDepartmentsResponseDto } from '../services';
import { IAssignToCustomersSupportResponseDto, IAssignToDepartmentResponseDto, ICloseSupportConversationResponseDto, ICreateNewConversationToDepartmentResponseDto, ITechnicalSupportChatResponseDto, ITechnicalSupportConversationDetailsResponseDto, IUserSupportConversationLogRequestDto, IUserSupportConversationLogResponseDto } from '../dtos';
import { Observable } from 'rxjs';

export interface ITechnicalSupportApiClient {
  getTechnicalSupportChats: (isSupport?: boolean) => Observable<ITechnicalSupportChatResponseDto>;

  getTechnicalSupportDepartments: () => Observable<ITechnicalSupportDepartmentsResponseDto>;
  assignToDepartment: (conversation_id: number, department_id: number) => Observable<IAssignToDepartmentResponseDto>;

  getCustomersSupport: () => Observable<ICustomersSupportResponseDto>;
  assignToCustomerSupport: (conversation_id: number, support_user_id: number) => Observable<IAssignToCustomersSupportResponseDto>;

  customerAssignChatToHim: (conversation_id: number) => Observable<IAssignToCustomersSupportResponseDto>;
  userAddChatToHim: (conversation_id: number) => Observable<IAssignToCustomersSupportResponseDto>;

  closeSupportConversation: (conversation_id: number) => Observable<ICloseSupportConversationResponseDto>;

  createNewConversationToDepartmentId: (department_id: number) => Observable<ICreateNewConversationToDepartmentResponseDto>;
  technicalSupportConversationDetails: (conversation_id: number) => Observable<ITechnicalSupportConversationDetailsResponseDto>;

  UserSupportConversationLog: (payload: IUserSupportConversationLogRequestDto) => Observable<IUserSupportConversationLogResponseDto>;
}
