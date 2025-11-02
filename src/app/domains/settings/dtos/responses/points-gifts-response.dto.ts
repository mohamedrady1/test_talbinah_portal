export interface IPointsGiftDto {
  id: number | null;
  service_key: string | null;
  service_name: string | null;
  description: string;
  points: number | string | null; // Sometimes string "2", sometimes number 30
  expiration_date: number;
  status: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface IPointsGiftsResponseDto {
  status: boolean;
  message: string | null;
  data: IPointsGiftDto[] | null;
}
