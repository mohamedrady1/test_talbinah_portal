import { ICalculateReservationPriceResponseDto } from "../dtos";

export interface CalculateReservationPriceState {
  isCalculating: boolean;
  calculationSuccess: boolean;
  calculationError: string | null;
  calculatedPriceResponse: ICalculateReservationPriceResponseDto | null;
}

export const initialCalculateReservationPriceState: CalculateReservationPriceState = {
  isCalculating: false,
  calculationSuccess: false,
  calculationError: null,
  calculatedPriceResponse: null,
};
