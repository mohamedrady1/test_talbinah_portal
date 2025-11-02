import { TalbinahItemType } from "../enums";

export interface IChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface IDoctorAvailability {
  id: number;
  doctor_id: number;
  day_id: number;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface IDoctor {
  id: number;
  full_name: string;
  specialist: string[];
  specialist_id: number[];
  bio: string;
  gender: number;
  reservation_count: number;
  avg_rate: number;
  count_rate: number;
  image: string;
  price_half_hour: number;
  years_experience: number;
  copouns: any[]; // adjust if needed
  nextAvailability: IDoctorAvailability;
}

// Placeholder for future types (e.g., podcast, article)
export interface IPodcast {
  id: number;
  title: string;
  url: string;
  description: string;
  thumbnail_image?: string | null;
}
export interface IArticleImage {
  id: number;
  url: string;
  imageable_id: number;
  imageable_type: string;
  created_at: string;
  updated_at: string;
}
export interface IArticleCategory {
  id: number;
  main_lang?: string;
  translate_id?: number | null;
  name: string;
  active?: number;
  deleted_at?: string | null;
  created_at: string;
  updated_at?: string;
  original_active?: string;
  image?: string | null;
}
export interface IArticle {
  id: number;
  main_lang?: string;
  translate_id?: number | null;
  article_category_id?: number | null; // Only in main article
  title: string;
  description: string; // HTML content
  trending?: number; // Only in main article
  reading_time?: number;
  type?: string; // Only in main article (e.g., "free")
  active?: number; // Only in main article
  deleted_at?: string | null; // Only in main article
  created_at: string;
  updated_at?: string;
  original_active?: string; // Only in main article
  image?: string | IArticleImage | null; // Only in main article
  original_trending?: string | null;
  article_category?: IArticleCategory | null; // Only in main article
  is_bookmark?: boolean;
  new?: boolean;
  keywords?: string[]; // Only in main article
  category?: string; // Only in related articles
}

export interface IResponseList<T = any> {
  type: TalbinahItemType;
  items: T[];
}
