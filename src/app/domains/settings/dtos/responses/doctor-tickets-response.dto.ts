export interface IDoctorTicketsResponseDto {
  status: boolean;
  message: string | null;
  data: IDoctorTicketDto[] | null;
}

export interface IDoctorTicketDto {
  id: number;
  problem: IDoctorTicketProblemDto | null;
  reservation: any | null;
  image: IDoctorTicketImageDto[];
  first_answer: string | null;
  second_answer: string | null;
  status: string;
  reservation_id: number | null;
  other_problem: string | null;
  description: string;
  created_at: string;
}

export interface IDoctorTicketProblemDto {
  id: number;
  problem: string;
}

export interface IDoctorTicketImageDto {
  id: number;
  url: string;
  imageable_id: number;
  imageable_type: string;
  created_at: string;
  updated_at: string;
}
