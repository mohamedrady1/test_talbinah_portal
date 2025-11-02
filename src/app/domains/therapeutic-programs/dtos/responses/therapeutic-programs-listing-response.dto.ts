import { ITherapeuticProgram } from "../../models";
export interface ITherapeuticProgramsListingResponseDto {
  message: string | null; // message can be null based on data
  status: boolean;
  data: ITherapeuticProgram[]; // Changed to an array of ITherapeuticProgram
}
