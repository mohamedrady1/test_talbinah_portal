export class AppointmentsManagementCollections {
  static ModuleName: string = 'api';

  static Reservations: string = `${AppointmentsManagementCollections.ModuleName}`;

  static Payment: string = `${AppointmentsManagementCollections.ModuleName}`;

  static PaymentMethods(): string {
    return `${AppointmentsManagementCollections.Payment}/payments`;
  }
  static calculateReservationPrice(): string {
    return `${AppointmentsManagementCollections.Payment}/reservations/calc-reservation-price/details`;
  }


  // Reservations
  static CheckDoctorAtReservation(reservation_id: number | string): string {
    return `${AppointmentsManagementCollections.Reservations}/reservations/check-reservation/${reservation_id}`;
  }
  static ReservationsListing(): string {
    return `${AppointmentsManagementCollections.Reservations}/reservations`;
  }
  static GetReservationById(id: number): string {
    return `${AppointmentsManagementCollections.Reservations}/reservations/${id}`;
  }
  // Cancel Reservation
  static CalcReservationCancelPrice(id: number): string {
    return `${AppointmentsManagementCollections.Reservations}/reservations/calc-reservation-cancel-price/${id}`;
  }
  static CancelReservationById(id: number): string {
    return `${AppointmentsManagementCollections.Reservations}/reservations/destroy/${id}`;
  }
  static ReasonsCancelation(): string {
    return `${AppointmentsManagementCollections.Reservations}/reasons-cancelation`;
  }

  // Schedule Reservation
  static ReasonsScheduling(): string {
    return `${AppointmentsManagementCollections.Reservations}/reasons-rescheduling`;
  }
  static DoctorDaysByIdDoctor(id: number): string {
    return `${AppointmentsManagementCollections.Reservations}/days/doctor/${id}`;
  }
  static GetDoctorSlotsTimes(day_id: number, duration_id: number, doctor_id: number): string {
    return `${AppointmentsManagementCollections.Reservations}/times/day/${day_id}/duration/${duration_id}/doctor/${doctor_id}`;
  }
  static ScheduleReservationById(id: number): string {
    return `${AppointmentsManagementCollections.Reservations}/reservations/${id}`;
  }

  static CheckPackagesReservation(): string {
    return `${AppointmentsManagementCollections.Reservations}/packages`;
  }
  static StoreNormalPackagesReservation(): string {
    return `${AppointmentsManagementCollections.Reservations}/reservations`;
  }

  // Reservation Chat
  static getReservationChatByReservationId(reservation_id: number): string {
    return `${AppointmentsManagementCollections.Reservations}/reservations/${reservation_id}/chat`;
  }

  static GetReservationHomework(id: number): string {
    return `${AppointmentsManagementCollections.Reservations}/reservations/${id}/homework`;
  }
  static ReviewHomework(): string {
    return `${AppointmentsManagementCollections.Reservations}/reservations/homework/review`;
  }
  static BlockUserById(): string {
    return `${AppointmentsManagementCollections.Reservations}/block-user`;
  }
  static LeaveRatingById(id: number): string {
    return `${AppointmentsManagementCollections.Reservations}/reviews`;
  }

  static SendMeetingMessage(): string {
    return `${AppointmentsManagementCollections.Reservations}/reservations/chat`;
  }

  static StoreChatFiles(reservationId: number): string {
    return `${AppointmentsManagementCollections.ModuleName}/chats/store-files/${reservationId}`;
  }
  static StoreSupportChatFiles(conversationId: number): string {
    return `${AppointmentsManagementCollections.ModuleName}/user-support/conversations/store-files/${conversationId}`;
  }
}
