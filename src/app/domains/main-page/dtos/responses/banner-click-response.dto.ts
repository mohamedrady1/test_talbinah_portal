export interface IBannerClickResponseDto {
    status: boolean;
    message: string | null;
    data: {
        id: number;
        click_count: number;
        original_active: any | null;
        users_clicked: number;
    };
}

