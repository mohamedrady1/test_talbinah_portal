export interface ILeaveRatingRequestDto {
  reservation_id: number;
  doctor_id: number;
  rating: number | string;
  description?: string;
}
