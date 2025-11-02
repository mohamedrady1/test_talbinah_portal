export interface IGiftReciverDto {
    id: number;
    amount: number;
    sender: string;
    reciver: string | null;
    phone: string;
    recived: number;
    expired: number;
    date: string;
    url: string | null;
}

export interface IGiftReciverResponseDto {
    status: boolean;
    message: string | null;
    data: IGiftReciverDto[] | null;
} 