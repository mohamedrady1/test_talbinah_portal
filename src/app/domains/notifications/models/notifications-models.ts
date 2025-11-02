// src/app/domains/notifications/models/notification.model.ts

/**
 * @interface INotification
 * @description Represents a single notification item in the application.
 * This is derived from INotificationDto but with potentially more refined types.
 */
export interface INotification {
  id: number;
  title: string;
  content: string; // Using 'content' for 'body' for better semantic naming
  action: string | null;
  page: string;       // e.g., "postDetails", "user_followed"
  pageID: string;     // ID related to the page, e.g., "120" for post ID
  link: string;       // API or internal link
  receivedCount: number; // Using 'receivedCount' for 'received' for clarity
  notification_type: string; // Renamed 'type' to 'notification_type' to avoid conflict with JS 'type' keyword
  iconUrl: string; // Renamed 'icon' to 'iconUrl'
  is_read: boolean; // Mapped from 0 | 1 to boolean
  createdAt: Date; // Mapped from string to Date object for easier manipulation
}