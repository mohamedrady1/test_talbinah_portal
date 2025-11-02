export interface IGiftSendResponseDto {
  status: boolean;
  message: string | null;
  data: IGiftSendResponseData;
}

export interface IGiftSendResponseData {
  id: number;
  amount: number;
  sender: string;
  reciver: string;
  phone: string;
  recived: number;
  expired: number;
  date: string; // ISO 8601 format
  status: 'sending' | 'received' | 'cancelled' | string;
  url: string | null;
}
