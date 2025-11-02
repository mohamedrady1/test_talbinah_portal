import { ITechnicalSupportChatDto } from "./technical-support-listing-response.dto";

export interface ITechnicalSupportConversationDetailsResponseDto {
  status: boolean;
  message: string | null;
  data: ITechnicalSupportChatDto | null;
}
