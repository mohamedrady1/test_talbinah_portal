
import { IProgramme } from "../../models";

// Response DTO for the /programmes/store API
export interface IStoreProgrammeResponseDto {
  status: boolean;
  message: string | null;
  data: IProgramme; // The detailed program data on success
}
