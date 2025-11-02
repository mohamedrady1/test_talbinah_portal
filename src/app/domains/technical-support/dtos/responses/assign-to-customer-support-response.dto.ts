import { ITechnicalSupportChatDto } from "./technical-support-listing-response.dto";

export interface IAssignToDepartmentResponseDto {
  status: boolean;
  message: string | null;
  data: ITechnicalSupportChatDto | null;
}
