import { ITherapeuticProgramDetails } from "../../models";
export interface ITherapeuticProgramItemResponseDto {
  message: string | null; // message can be null based on data
  status: boolean;
  data: ITherapeuticProgramDetails; // Changed to an array of ITherapeuticProgram
}
