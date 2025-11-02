export interface IPostInterest {
  id: number;
  name: string;
  image: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface IPostsInterestsListingResponseDto {
  status: boolean;
  message: string | null;
  data: IPostInterest[]; // A list of categories
}
