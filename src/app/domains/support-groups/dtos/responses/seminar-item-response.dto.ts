import { IDoctorItem } from "../../../../shared";

// Interface for the Seminar data itself within the response
export interface ISeminarDataDto {
  id: number;
  title: string;
  description: string;
  doctor: IDoctorItem | any | null;
  link: string | null;
  price: number;
  discount: number;
  image: string | null;
  duration: number; // In minutes
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  max_users_count: number;
  users_attend_count: number;
  users_remaining_count: number;
  is_purchased: boolean;
  ended: 0 | 1; // 0 for not ended, 1 for ended
  created_at: string; // ISO 8601
}

/**
 * Represents the full response for fetching a single seminar item.
 */
export interface ISeminarItemResponseDto {
  status: boolean;
  message: string | null;
  data: ISeminarDataDto; // This now strongly types the 'data' property
}

// Re-exporting ISeminarItemDto from your listing DTO if you want to use the same structure
// for individual items in the listing and for the detailed single item fetch.
// If ISeminarItemDto (from the previous step) is simpler and doesn't contain the full doctor details,
// then keep ISeminarDataDto for the detailed response as defined above.
// For clarity, I've kept them distinct here.
// You might have:
// export { ISeminarItemDto } from './seminars-listing.dtos'; // if you split DTO files
