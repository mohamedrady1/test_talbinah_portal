export interface ILeaveRatingResponseDto {
  status: boolean;
  message: string | null;
  data: {
    id: number;
    created_at: string;
    // optional: reservationId, patientId, etc.
  } | null;
}
