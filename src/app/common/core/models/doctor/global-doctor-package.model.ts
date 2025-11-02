export interface IGlobalDoctorPackageModel {
  id: number;
  package_id: number;
  price: number;
  number_of_reservations: number;
  usage_reservations: number;
  reminder_reservation: number;
  max_reservation_price: number | null;
  package_period: string | null; // If this is a string (e.g., "monthly") — otherwise adjust type
  end_in_days: number;
  discount: number;
  end_at: string; // ISO 8601 date format, e.g., "2025-08-01"
  type: 'doctor' | string; // If only "doctor" allowed, keep literal type
  duration: number; // in minutes or days? (based on context)
}
