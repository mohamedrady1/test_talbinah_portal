export interface IArticlesListingResponseDto {
  status: boolean;
  message: string | null;
  data: {
    data: IArticle[]; // Changed from 'articles' to 'data'
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
  };
}

export interface IArticle {
  id: number;
  article_category: IArticleCategory; // Changed from 'category: string' to a nested object
  keywords: any[]; // Assuming keywords can be an array of any type
  title: string;
  description: string;
  trending: number; // New property
  original_trending: string; // New property
  image: string | null;
  is_bookmark: boolean; // New property
  created_at: string;
  new: boolean; // New property
}

export interface IArticleCategory {
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
