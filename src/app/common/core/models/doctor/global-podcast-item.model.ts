export interface IGlobalPodcastItemModel {
  id: number;
  title: string;
  description: string;

  // Existing properties (optional as required)
  thumbnail_image?: string | null;
  background_color?: string;
  file?: string;
  file_type?: 'audio' | string;
  link_type?: 'file' | string;
  duration?: string;
  type?: 'free' | 'paid' | string;
  visit_count?: number;
  is_bookmarked?: boolean | undefined | null; // Not present in object, keep optional
  status: number;
  created_at: string;
  updated_at?: string;

  // Optional properties not present in the object
  doctor_name?: string | null;
  podcast_category?: string | null;
  promo?: string | null;
  start_duration_from?: string | startDurationGlobalPodcast | null;

  // Property present in object but missing in interface → now added
  podcast_category_id?: number;
  podcast_promo_id?: number | null;
}


export interface startDurationGlobalPodcast {
  podcast_id: number;
  user_id: number;
  start_duration_from: number;
  visit_count: number;
  created_at: string | null;
  updated_at: string | null;
}

