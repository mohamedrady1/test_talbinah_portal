export interface MovementItem {
    id: number;
    wallet_id: number;
    name: string;
    original_value: number;
    balance_before: number;
    balance_after: number;
    coupon_type: string | null;
    discount: number;
    type: number;
    original_type: string;
    reservation_id: number | null;
    reservation_price: number | null;
    time: string;
}

export interface MovementsResponse {
    status: boolean;
    message: string | null;
    data: MovementItem[];
} 