import { IPost } from "./talbinah-community-response.dto";

export interface IReactCommentResponseDto {
  status: boolean;
  message: string;
  data: {
    post: IPost;
  };
}
