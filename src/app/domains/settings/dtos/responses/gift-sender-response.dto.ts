export interface IGiftSenderDto {
    id: number;
    amount: number;
    sender: string;
    reciver: string | null;
    phone: string;
    recived: number;
    expired: number;
    date: string;
    status?: string; // for sender
    url: string | null;
}

export interface IGiftSenderResponseDto {
    status: boolean;
    message: string | null;
    data: IGiftSenderDto[] | null;
} 