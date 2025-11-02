export interface IUserSupportConversationLogRequestDto {
  sender_id: number;
  receiver_id: number | null;
  message: string;
  conversation_id: number;
}
