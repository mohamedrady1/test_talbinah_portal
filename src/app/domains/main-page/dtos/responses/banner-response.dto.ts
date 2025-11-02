export interface IBannerItem {
    id: number;
    type: string;
    title: string;
    subTitle: string;
    icon: string;
    color: string;
    button_name: string | null;
    button_color: string;
    image: string;
    action: string;
    page: string;
    pageID: number | null;
    link: string;
    banner_type: string;
}

export interface IBannersResponseDto {
    status: boolean;
    message: string | null;
    data: {
        banners: IBannerItem[];
    };
}

