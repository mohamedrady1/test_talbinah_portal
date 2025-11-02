import { IEmergencySpecialtiesResponseDto } from '../dtos';

export interface EmergencySpecialtiesLookupState {
    response: IEmergencySpecialtiesResponseDto | null;
    isLoading: boolean;
    status: boolean | null;
    errorMessage: string | null;
}

export const initialEmergencySpecialtiesLookupState: EmergencySpecialtiesLookupState = {
    response: null,
    isLoading: false,
    status: null,
    errorMessage: null
};


