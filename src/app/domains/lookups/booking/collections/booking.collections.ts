export class BookingCollections {
  // static ModuleName: string = 'Booking-management';
  static ModuleName: string = 'api';

  // static Lookups: string = `${BookingCollections.ModuleName}/lookups`;
  static Lookups: string = `${BookingCollections.ModuleName}`;

  static Specialities(): string {
    return `${BookingCollections.Lookups}/specialties`;
  }
  static Durations(doctor_id?: number): string {
    if (doctor_id) {
      return `${BookingCollections.Lookups}/durations/${doctor_id}`;

    } else {
      return `${BookingCollections.Lookups}/durations`;
    }
  }

  static Communications(): string {
    return `${BookingCollections.Lookups}/communications`;
  }
}
