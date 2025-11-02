export class UrgentAppointmentManagementCollections {
  static ModuleName: string = 'api';

  static UrgentAppointment: string = `${UrgentAppointmentManagementCollections.ModuleName}`;

  static getEmergencyDurationsPrice(): string {
    return `${UrgentAppointmentManagementCollections.UrgentAppointment}/emergency-reservation/duration-price`;
  }

  static storeEmergencyAppointment(): string {
    return `${UrgentAppointmentManagementCollections.UrgentAppointment}/emergency-reservation/store`;
  }

  static checkEmergencyAppointmentReservation(): string {
    return `${UrgentAppointmentManagementCollections.UrgentAppointment}/emergency-reservation/check-reservation-request`;
  }

  static cancelEmergencyAppointment(id: number): string {
    return `${UrgentAppointmentManagementCollections.UrgentAppointment}/emergency-reservation/${id}/cancel-request`;
  }

  static getEmergencySpecialties(): string {
    return `${UrgentAppointmentManagementCollections.UrgentAppointment}/emergency-reservation/get-specialties`;
  }

}
