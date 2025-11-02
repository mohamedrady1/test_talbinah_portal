export interface IFaqsCategoriesResponseDto {
    success: boolean;
    message: string;
    data: IFaqsCategoryDto[];
}

export interface IFaqsCategoryDto {
    id: number;
    name: string;
    name_ar: string;
    name_en: string;
    description?: string;
    description_ar?: string;
    description_en?: string;
    icon?: string;
    color?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
} 