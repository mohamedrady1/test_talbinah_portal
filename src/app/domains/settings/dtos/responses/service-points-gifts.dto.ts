export interface IServicePointsGiftItemDto {
  image: string;
  points: number;
  amount: number;
  title: string;
  description: string;
}

export interface IServicePointsGiftsResponseDto {
  status: boolean;
  message: string | null;
  data: IServicePointsGiftItemDto[];
}
