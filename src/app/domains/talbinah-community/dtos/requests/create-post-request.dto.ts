export interface ICreatePostRequestDto {
  content: string;
  url?: string;
  interest_id?: string | number | null;
}
