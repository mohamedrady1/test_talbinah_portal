export interface IEmergencySpecialtyImageDto {
    id: number;
    url: string;
    imageable_id: number;
    imageable_type: string;
    created_at: string;
    updated_at: string;
}

export interface IEmergencySpecialtyItemDto {
    id: number;
    name: string;
    description: string | null;
    original_active: string | null;
    image: IEmergencySpecialtyImageDto | null;
}

export interface IEmergencySpecialtiesResponseDto {
    status: boolean;
    message: string | null;
    data: IEmergencySpecialtyItemDto[];
}


