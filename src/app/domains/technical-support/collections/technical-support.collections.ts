export class TechnicalSupportManagementCollections {
  static ModuleName: string = 'api';

  static TechnicalSupport: string = `${TechnicalSupportManagementCollections.ModuleName}`;

  static getTechnicalSupportChats(isSupport?: boolean): string {
    if (isSupport) {
      return `${TechnicalSupportManagementCollections.TechnicalSupport}/customer-support/conversation`;
    } else {
      return `${TechnicalSupportManagementCollections.TechnicalSupport}/user-support/conversations`;
    }
  }

  static getTechnicalSupportDepartments(): string {
    return `${TechnicalSupportManagementCollections.TechnicalSupport}/departments`;
  }
  static assignToDepartment(conversationId: number): string {
    return `${TechnicalSupportManagementCollections.TechnicalSupport}/customer-support/conversation/${conversationId}/assign-department`;
  }

  static getCustomersSupport(): string {
    return `${TechnicalSupportManagementCollections.TechnicalSupport}/users/support`;
  }
  static assignToCustomerSupport(conversationId: number): string {
    return `${TechnicalSupportManagementCollections.TechnicalSupport}/customer-support/conversation/${conversationId}/assign-support-user`;
  }

  static customerAssignChatToHim(conversationId: number): string {
    return `${TechnicalSupportManagementCollections.TechnicalSupport}/customer-support/conversation/${conversationId}/assign-me`;
  }
  static userAddChatToHim(conversationId: number): string {
    return `${TechnicalSupportManagementCollections.TechnicalSupport}/user-support/conversations/${conversationId}/start`;
  }

  static closeSupportConversation(conversationId: number): string {
    return `${TechnicalSupportManagementCollections.TechnicalSupport}/customer-support/conversation/${conversationId}/close`;
  }

  static createNewConversationToDepartmentId(): string {
    return `${TechnicalSupportManagementCollections.TechnicalSupport}/user-support/conversations`;
  }
  static technicalSupportConversationDetails(conversation_id: number): string {
    return `${TechnicalSupportManagementCollections.TechnicalSupport}/user-support/conversations/${conversation_id}`;
  }

  static UserSupportConversationLog(): string {
    return `${TechnicalSupportManagementCollections.TechnicalSupport}/user-support/conversations/conversationlog`;
  }
}
