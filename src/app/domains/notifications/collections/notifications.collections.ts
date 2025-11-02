export class NotificationsManagementCollections {
  static ModuleName: string = 'api';

  static Seminars: string = `${NotificationsManagementCollections.ModuleName}`;

  static getAllNotifications(): string {
    return `${NotificationsManagementCollections.Seminars}/notifications`;

  }

  static updatePreferredMsgChannel(): string {
    return `${NotificationsManagementCollections.Seminars}/preferred_msg_channel/update`;
  }

  static markNotificationAsRead(): string {
    return `${NotificationsManagementCollections.Seminars}/notifications/read`;
  }

  static SeminarsListing(): string {
    return `${NotificationsManagementCollections.Seminars}/seminars`;
  }


  static MySeminarsListing(): string {
    return `${NotificationsManagementCollections.Seminars}/seminars/my-seminars`;
  }

  static getSeminarById(id: number): string {
    return `${NotificationsManagementCollections.Seminars}/seminars/${id}`;
  }
}
