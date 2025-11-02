export interface IBlockUserResponseDto {
  status: boolean;
  message: string | null;
  data: IBlockUserActionData | null;
}

export interface IBlockUserActionData {
  id: number;
  doctor_id: number;
  user_id: number;
  type: 'user' | string;
  status: number;
  created_at: string;
  updated_at: string;
}
