import { ProgrammeStoreService, SeminarStoreService, EmergencyAppointmentStoreService, NormalPackagesReservationStoreService } from './store-services';
import { inject, Injectable, computed } from '@angular/core';
import { Logger } from '../../../common';
import { WalletFacade } from '../../settings';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  // Inject the specific store services
  private programmeStoreService = inject(ProgrammeStoreService);
  private seminarStoreService = inject(SeminarStoreService);
  private emergencyAppointmentStoreService = inject(EmergencyAppointmentStoreService);
  private normalPackagesReservationStoreService = inject(NormalPackagesReservationStoreService);

  // Expose combined loading and error signals for the UI to consume if needed
  public readonly isStoringProgrammeLoading = this.programmeStoreService.isStoringLoading;
  public readonly isStoringSeminarLoading = this.seminarStoreService.isStoringLoading;
  public readonly isStoringEmergencyAppointmentLoading = this.emergencyAppointmentStoreService.isStoringLoading;
  public readonly isStoringNormalPackageLoading = this.normalPackagesReservationStoreService.isStoringLoading;

  // You can create a computed signal if you need to know if ANY of them are loading
  public readonly isAnyStoringLoading = computed(() =>
    this.isStoringProgrammeLoading() ||
    this.isStoringSeminarLoading() ||
    this.isStoringEmergencyAppointmentLoading() ||
    this.isStoringNormalPackageLoading()
  );

  // Expose individual errors if the UI needs to display them
  public readonly programmeError = this.programmeStoreService.error;
  public readonly seminarError = this.seminarStoreService.error;
  public readonly emergencyAppointmentError = this.emergencyAppointmentStoreService.error;
  public readonly normalPackagesError = this.normalPackagesReservationStoreService.error;

  constructor() {
    // No effects here, all effects are in the specific store services
  }

  // Delegate methods to the specific store services
  storeProgramme(programmeId: any, paymentMethodId: any, coupon_id?: number | null): void {
    Logger.debug('ReservationService: Delegating storeProgramme to ProgrammeStoreService.');
    this.programmeStoreService.storeProgramme(programmeId, paymentMethodId, coupon_id);
  }

  storeSeminar(seminarId: any, paymentMethodId: any, coupon_id?: number | null): void {
    Logger.debug('ReservationService: Delegating storeSeminar to SeminarStoreService.');
    this.seminarStoreService.storeSeminar(seminarId, paymentMethodId);
  }

  storeEmergencyAppointment(data: any, paymentMethodId: any): void {
    Logger.debug('ReservationService: Delegating storeEmergencyAppointment to EmergencyAppointmentStoreService.');
    this.emergencyAppointmentStoreService.storeEmergencyAppointment(data, paymentMethodId);
  }

  storeNormalPackagesAppointment(data: any, paymentMethodId: any, typeId: string | null = null, coupon_id?: number | null): void {
    Logger.debug('ReservationService: Delegating storeNormalPackagesAppointment to NormalPackagesReservationStoreService.');
    this.normalPackagesReservationStoreService.storeNormalPackagesAppointment(data, paymentMethodId, typeId, coupon_id);
  }

  // Remove the private modal opening methods from here. They are now private to each specific store service.
}
