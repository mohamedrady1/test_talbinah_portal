export interface IPaginationParameters {
  sortColumn?: string;
  sortOrder?: string;
  search?: string;
  category_id?: string | number | null;
  page?: number;
  per_page?: number;
  status?: number | boolean | null | undefined;
  is_start?: number | boolean | null | undefined;
  is_end?: number | boolean | null | undefined;
  interest_id?: number | boolean | null | undefined;
  user_id?: string | number | null;
  type?: string;
  is_bookmarked?: boolean;
  total?: number;
  from_date?: string | Date | null;
  to_date?: string | Date | null;

  parent_id?: string | null;

  // Doctor-specific filter parameters
  specialty?: number; // Assuming specialty ID
  day?: number; // Assuming day ID or number (e.g., 1 for Monday)
  services_ids?: number[]; // Array of service IDs
  languages_ids?: number[]; // Array of language IDs
  gender?: 'male' | 'female' | 'other' | string; // Assuming specific strings or a wider range
  min_price?: number;
  max_price?: number;
  rate?: number; // Minimum average rate
  points?: number[];
}

export interface ISoftDeletablePaginationParameters extends IPaginationParameters {
  // isActive?: boolean;
}
