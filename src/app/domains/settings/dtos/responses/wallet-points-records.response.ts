export interface IWalletPointsRecordsResponseDto {
  status: boolean;
  message: string | null;
  data: IWalletPointsRecordsDataDto;
}

export interface IWalletPointsRecordsDataDto {
  balance: number;
  title: string;
  description: string;
  movement: IWalletPointsMovementItemDto[];
}

export interface IWalletPointsMovementItemDto {
  id: number;
  gift: any | null;
  service_name: string;
  name: string;
  points: number | null;
  point_before: number;
  point_original: number;
  point_after: number;
  type: string;
  original_type: string;
  expires_at: string;
  expired: boolean;
  created_at: string;
  updated_at: string;
}
