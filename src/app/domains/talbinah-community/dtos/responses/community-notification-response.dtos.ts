import { IUserCommunity } from "./talbinah-community-response.dto";

// Interface for a single Community notification item
export interface ICommunityNotification {
  id: number;
  title: string;
  body: string;
  user: IUserCommunity;
  created_at: string; // ISO 8601 string, e.g., "2025-06-17T08:23:30.000000Z"
  is_read: 0 | 1; // Changed to 0 | 1 based on mock data
  type: string; // e.g., "community" - made required based on mock
  link: string; // e.g., "/api/community/site/post/118" - made required based on mock
  action: string | null; // Added from mock, can be null
  page: string; // Added from mock, e.g., "post"
  pageID: string; // Added from mock, e.g., "118"
  received: number; // Added from mock, e.g., 0
}

// Interface for pagination metadata
export interface ICommunityNotificationsMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

// Interface for the data object containing notifications and metadata
export interface ICommunityNotificationsData {
  data: ICommunityNotification[];
  meta?: ICommunityNotificationsMeta;
}

// Overall API response DTO
export interface ICommunityNotificationsResponseDto {
  data: ICommunityNotificationsData;
  message: string | null;
  status: boolean;
}
