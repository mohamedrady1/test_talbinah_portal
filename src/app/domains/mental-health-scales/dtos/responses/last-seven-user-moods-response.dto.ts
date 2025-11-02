export interface ILastSevenUserMoodsResponseDto {
  status: boolean;
  message: string | null;
  data: LastSevenModeItem[] | null;
}

export interface LastSevenModeItem {
  mood_id: number;
  feelings: string; // The Arabic name for the feeling/mood
  icon: string;     // URL to the icon image
  color: string;
  created_at: string;
}
