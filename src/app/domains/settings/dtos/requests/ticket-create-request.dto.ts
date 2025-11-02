export interface ITicketCreateRequestDto {
    problem_id: number;
    description: string;
    images?: File[] | string[];
} 