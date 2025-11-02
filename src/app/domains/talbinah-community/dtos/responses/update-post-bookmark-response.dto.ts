import { IPost } from "./talbinah-community-response.dto";

export interface IUpdatePostBookmarkResponseDto {
  status: boolean;
  message: string;
  data: {
    id: number;
    post_id: number;
    user_id: number;
    marked: number;
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
    post: IPost;
  };
}
