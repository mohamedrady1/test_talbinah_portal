// src/app/domains/notifications/dtos/notifications-listing-response.dto.ts

/**
 * @interface INotificationsListingResponseDto
 * @description DTO for the API response when fetching a list of notifications.
 */
export interface INotificationsListingResponseDto {
  status: boolean;
  message: string | null;
  data: {
    current_page: number;
    data: INotificationDto[]; // Array of individual notification DTOs
    first_page_url: string | null;
    from: number | null;
    last_page: number;
    last_page_url: string | null;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  } | null; // Data can be null if status is false or no data
}

/**
 * @interface INotificationDto
 * @description DTO for a single notification item received from the API.
 */
export interface INotificationDto {
  id: number;
  title: string;
  body: string;
  action: string | null; // 'null' in your example, could be a string if actions are defined
  page: string;       // e.g., "postDetails", "user_followed"
  pageID: string;     // ID related to the page, e.g., "120" for post ID
  link: string;       // API or internal link
  received: number;   // In your example, always 0. Might be a boolean or count.
  type: string;       // e.g., "community", "user_followed"
  icon: string;       // URL to the notification icon
  is_read: 0 | 1;     // 0 for unread, 1 for read
  created_at: string; // ISO 8601 date string
}