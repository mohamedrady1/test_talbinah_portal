export interface ISendNotificationRequestDto {
  user_id: number;
  title: string | null;
  body: string | any;
  action: 'CHAT' | 'SYSTEM' | 'ALERT' | 'SUPPORT'; // Add other actions as needed
  model_id: number; // Optional field
  data?: Record<string, any>; // Additional payload
}
