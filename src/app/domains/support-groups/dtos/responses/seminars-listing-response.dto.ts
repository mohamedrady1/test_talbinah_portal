/**
 * Represents a single seminar item in a listing.
 */
export interface ISeminarItemDto {
  id: number;
  url: string | null;
  title: string;
  doctor_name: string;
  doctor_gender: 0 | 1; // 0 for male, 1 for female based on mock data
  description: string;
  price: number;
  discount: number;
  image: string | null;
  duration: number; // Duration in minutes
  date: string; // Date in "YYYY-MM-DD" format
  time: string; // Time in "HH:MM:SS" format
  max_users_count: number;
  users_attend_count: number;
  users_remaining_count: number;
  is_purchased: boolean;
  ended: 0 | 1; // 0 for not ended, 1 for ended
  created_at: string; // ISO 8601 string for creation timestamp

  // --- New Optional Keys from the second JSON snippet ---
  remaining_time?: number; // Added as optional
  full_name?: string; // Added as optional
  specialist_id?: number; // Added as optional, assuming it's a number ID
  reservation?: any | null; // Added as optional, type `any` or more specific if structure is known
  payment_id?: number; // Added as optional, assuming it's a number ID
  problem?: string; // Added as optional
  payment_status?: number; // Added as optional
  original_payment_status?: string; // Added as optional
  status?: any | null; // Added as optional, type `any` or more specific
  original_status?: any | null; // Added as optional, type `any` or more specific
  updated_at?: string; // Already in your mock, but often distinct from created_at
  repayUrl?: string | null;
  link?: string | null;
}
/**
 * Represents the response structure for a listing of all seminars.
 */
export interface ISeminarsListingResponseDto {
  status: boolean;
  message: string | null;
  data: ISeminarItemDto[];
  // If your API returns pagination meta data directly in this DTO, you'd add it here.
  // For example:
  // meta?: {
  //   current_page: number;
  //   from: number;
  //   last_page: number;
  //   links: Array<{ url: string | null; label: string; active: boolean }>;
  //   path: string;
  //   per_page: number;
  //   to: number;
  //   total: number;
  // };
}
