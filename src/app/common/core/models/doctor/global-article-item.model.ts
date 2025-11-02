export interface IGlobalArticleItemModel {
  id: number;
  title: string;
  description: string;

  main_lang?: string; // Made optional because it's missing from the example
  translate_id?: number | null;
  article_category_id?: number;

  trending?: number;
  original_trending?: string | null;
  reading_time?: number; // Made optional because it's missing in the example
  is_bookmark?: boolean;
  new?: boolean;
  type?: string;
  active?: number;
  deleted_at?: string | null;

  created_at: string;
  updated_at?: string; // Made optional because missing in the mock

  original_active?: string;
  image?: IGlobalArticleImage | string | null;
  article_category?: IGlobalArticleCategory;
  keywords?: string[];
  category?: string;
}


export interface IGlobalArticleImage {
  id: number;
  url: string;
  imageable_id: number;
  imageable_type: string;
  created_at: string;
  updated_at: string;
}

export interface IGlobalArticleCategory {
  id: number;
  name: string;
  image: string | null;
  created_at: string;
  // Removed properties not present in mock data for article_category
  // main_lang: string;
  // translate_id: number | null;
  // active: number;
  // deleted_at: string | null;
  // updated_at: string;
  // original_active: string;
}


