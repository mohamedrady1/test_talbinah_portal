export interface IEmojiItem {
  id: number;
  // name: string; // ❌ Removed: 'name' is not present in the provided JSON data
  image: string;
  label: string | null; // ✅ Changed from 'name' and 'description' to 'label', and it can be null
  created_at: string;
  updated_at: string;
}

export interface IEmoijsListingResponseDto {
  status: boolean;
  message: string | null;
  data: IEmojiItem[]; // A list of emojis
}
