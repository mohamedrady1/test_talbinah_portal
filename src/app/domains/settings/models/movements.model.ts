import { MovementItem } from '../dtos/responses/movements-response.dto';

export interface MovementsFeatureState {
    isLoading: boolean;
    errorMessage: string | null;
    movements: MovementItem[];
    movementsResponse: any;
}

export interface MovementsListState {
    movements: MovementItem[];
    filteredMovements: MovementItem[];
    searchTerm: string;
}

export const initialMovementsFeatureState: MovementsFeatureState = {
    isLoading: false,
    errorMessage: null,
    movements: [],
    movementsResponse: null
};

export const initialMovementsListState: MovementsListState = {
    movements: [],
    filteredMovements: [],
    searchTerm: ''
}; 