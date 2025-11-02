/**
 * Interface for a single item within the "duration_prices" array.
 * This reflects the actual structure found in your mock data.
 */
export interface IDurationPriceDetailDto {
  id: number;
  specialist_id: number;
  duration: number; // Represents the duration in minutes
  price: number;
  created_at: string; // e.g., "2024-01-28 21:31:27"
  updated_at: string; // e.g., "2024-01-28 21:31:27"
}

/**
 * Interface for the 'data' object within the response.
 * It contains both 'duration_prices' and 'problems'.
 */
export interface IEmergencyDurationsPriceDataDto {
  duration_prices: IDurationPriceDetailDto[];
  problems: string[];
}

/**
 * Main response interface for emergency durations and prices.
 * The 'data' property is now IEmergencyDurationsPriceDataDto.
 */
export interface IEmergencyDurationsPriceResponseDto {
  status: boolean;
  message: string | null;
  data: IEmergencyDurationsPriceDataDto; // Corrected to use IEmergencyDurationsPriceDataDto
}
