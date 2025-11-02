export interface IPodcastCategory {
  id: number;
  name: string;
  color: string; // ✅ Added based on provided data
  image: string; // ✅ Added based on provided data
  created_at: string; // ✅ Added based on provided data
  updated_at: string; // ✅ Added based on provided data
}

export interface IPodcastCategoriesListingResponseDto {
  status: boolean;
  message: string | null;
  data: IPodcastCategory[]; // A list of categories
}
