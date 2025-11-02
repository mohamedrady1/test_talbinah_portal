import { NotificationTypeEnum } from '../enums/notification-type.enum';

export interface INotification {
  id: number;
  title: string;
  body: string;
  type?: NotificationTypeEnum | string;
  icon?: string;
  timestamp?: Date;
  life?: number;
  data?: any; // Additional data for navigation
}

