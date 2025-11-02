export interface IPodcast {
  id: number;
  title: string;
  description: string;
  thumbnail_image?: string | null;
  background_color?: string;
  file?: string;
  file_type?: 'audio' | string; // extend with other possible types if needed
  link_type?: 'file' | string; // extend with other types like 'external' if needed
  duration?: string; // Format: MM:SS or HH:MM:SS
  type?: 'free' | 'paid' | string;
  visit_count?: number;
  is_bookmarked: boolean;
  status: number; // consider enum if statuses have specific meanings
  created_at: string; // ISO date string
  updated_at?: string; // ISO date string
  podcast_category?: null | string; // change type if category is an object later
  promo?: null | string; // change type if promo is an object later
  start_duration_from?: null | string | startDurationPodcast; // possibly time offset; or number if you convert it
  doctor_name?: string;
}

export interface startDurationPodcast {
  podcast_id: number;
  user_id: number;
  start_duration_from: number;
  visit_count: number;
  created_at: string | null;
  updated_at: string | null;
}
