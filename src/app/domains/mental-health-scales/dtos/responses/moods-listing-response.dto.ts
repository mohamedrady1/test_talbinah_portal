export interface IMoodItem {
  id: number;
  feelings: string; // The Arabic name for the feeling/mood
  icon: string;     // URL to the icon image
  color: string;
  created_at: string;
  updated_at: string;
}

export interface IMoodsListingResponseDto {
  status: boolean;
  message: string | null;
  data: IMoodItem[]; // The 'data' key contains an array of IMoodItem
}
