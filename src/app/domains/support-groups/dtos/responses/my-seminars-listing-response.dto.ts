import { ISeminarItemDto } from "./seminars-listing-response.dto";

export interface IMySeminarsResponseDto {
  status: boolean;
  message: string | null;
  data: ISeminarItemDto[];
  // If your API returns pagination meta data directly in this DTO, you'd add it here.
  // For example:
  // meta?: {
  //   current_page: number;
  //   from: number;
  //   last_page: number;
  //   links: Array<{ url: string | null; label: string; active: boolean }>;
  //   path: string;
  //   per_page: number;
  //   to: number;
  //   total: number;
  // };
}
