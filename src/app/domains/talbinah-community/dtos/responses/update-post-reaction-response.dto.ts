import { IPost } from "./talbinah-community-response.dto";

export interface IUpdatePostReactionResponseDto {
  status: boolean;
  message: string;
  data: {
    id: number;
    post_id: number;
    user_id: number;
    react: number; // This likely represents the reaction type or status
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
    post: IPost; // This is the full updated post object
  };
}

