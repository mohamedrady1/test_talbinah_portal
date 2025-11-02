import { ITechnicalSupportChatDto } from "./technical-support-listing-response.dto";

export interface ICloseSupportConversationResponseDto {
  status: boolean;
  message: string | null;
  data: ITechnicalSupportChatDto | null;
}
