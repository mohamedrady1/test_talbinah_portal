export class BookAppointmentManagementCollections {
  static ModuleName: string = 'api';

  static Doctors: string = `${BookAppointmentManagementCollections.ModuleName}`;

  static DoctorsListing(): string {
    return `${BookAppointmentManagementCollections.Doctors}/doctors`;
  }
  static DoctorsFitrationParameters(): string {
    return `${BookAppointmentManagementCollections.Doctors}/doctors/fitration-parameters`;
  }
  static AppointmentTypeSelections(): string {
    return `${BookAppointmentManagementCollections.Doctors}/parent-specialties`;
  }
  static GetDoctorById(id: number): string {
    return `${BookAppointmentManagementCollections.Doctors}/profile/show/doctor/${id}`;
  }
  static ToggleFavoriteDoctor(id: number, fav: boolean): string {
    if (fav) {
      return `${BookAppointmentManagementCollections.Doctors}/favorites/destroy`;
    } else {
      return `${BookAppointmentManagementCollections.Doctors}/favorites`;
    }
  }
}
