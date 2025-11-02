import { ISeminarItemDto } from "./seminars-listing-response.dto";


// Response DTO for the /Seminars/store API
export interface IStoreSeminarResponseDto {
  status: boolean;
  message: string | null;
  data: ISeminarItemDto | null; // The detailed program data on success
}
