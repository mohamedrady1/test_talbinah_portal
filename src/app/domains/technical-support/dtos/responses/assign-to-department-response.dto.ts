import { ITechnicalSupportChatDto } from "./technical-support-listing-response.dto";

export interface IAssignToCustomersSupportResponseDto {
  status: boolean;
  message: string | null;
  data: ITechnicalSupportChatDto | null;
}
