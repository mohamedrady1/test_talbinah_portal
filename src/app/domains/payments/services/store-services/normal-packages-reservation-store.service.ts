import { NormalPackagesReservationFacade, IStoreNormalPackagesReservationRequestDto, AppointmentsRoutesEnum } from '../../../../domains/appointments';
import { Logger, NavigationIntent, useNavigation } from '../../../../common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { StatusInfoComponent } from '../../components';
import { ModalService } from '../../../../shared';
import { extractDayIdFromDateString, IMappedReservationOutput, mapReservationsToSimplifiedFormat } from '../../utils';
import { WalletFacade } from '../../../settings';

@Injectable({
  providedIn: 'root'
})
export class NormalPackagesReservationStoreService {
  private readonly nav = useNavigation();
  private readonly modalService = inject(ModalService);
  private readonly walletService = inject(WalletFacade);
  private readonly _NormalPackagesReservationFacade = inject(NormalPackagesReservationFacade);

  public readonly isStoringLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  private lastTypeId: string | null = null;

  constructor() {
    effect(() => {
      this.isStoringLoading.set(this._NormalPackagesReservationFacade.isStoring());

      if (!this._NormalPackagesReservationFacade.isStoring()) {
        const storeSuccess = this._NormalPackagesReservationFacade.isSuccess();
        const storeError = this._NormalPackagesReservationFacade.storingError();
        const storedNormalPackageReservation = this._NormalPackagesReservationFacade.storedNormalPackagesReservation();

        const itemData = {
          isStoring: false,
          storeSuccess,
          storeError,
          response: storedNormalPackageReservation,
        };

        this.error.set(itemData.storeError);

        if (storeSuccess) {
          Logger.debug('NormalPackagesReservationStoreService: Normal Package Appointment stored successfully.');
          this.walletService.fetchWallet();

          if (storedNormalPackageReservation?.url) {
            this.nav.navigate(NavigationIntent.EXTERNAL_SAME_TAB, storedNormalPackageReservation.url);
          } else {
            this.openPaymentStatusInfo(itemData);
          }

          this._NormalPackagesReservationFacade.resetState();
        } else if (storeError) {
          Logger.error('NormalPackagesReservationStoreService: Failed to store Normal Package Appointment:', storeError);
          this.openPaymentStatusInfo(itemData);
          this._NormalPackagesReservationFacade.resetNormalPackagesOperationState();
        }
      }
    });
  }

  storeNormalPackagesAppointment(data: any, paymentMethodId: any, typeId: string | null = null, coupon_id?: number | null): void {
    this.lastTypeId = typeId;

    const sessionsArray: IMappedReservationOutput[] = data?.item?.AppointmentData?.packagesReservationsList
      ? mapReservationsToSimplifiedFormat(data.item.AppointmentData.packagesReservationsList)
      : [];

    Logger.debug('NormalPackagesReservationStoreService: Calling storeNormalPackagesAppointment with data:', data);

    if (!paymentMethodId) {
      Logger.error('NormalPackagesReservationStoreService: Cannot store Appointment, missing selected payment method ID.');
      this.isStoringLoading.set(false);
      return;
    }

    const payload: IStoreNormalPackagesReservationRequestDto = {
      payment_id: paymentMethodId,
      start_time: data?.item?.AppointmentData?.AppointmentData?.start_time,
      end_time: data?.item?.AppointmentData?.AppointmentData?.end_time,
      day_id: extractDayIdFromDateString(data?.item?.AppointmentData?.AppointmentData?.date) ?? null,

      full_name: data?.item?.AppointmentData?.PatientDetails?.name,
      gender: data?.item?.AppointmentData?.PatientDetails?.gender === 'female' ? '0' : '1',
      problem: data?.item?.AppointmentData?.PatientDetails?.problem,
      age: data?.item?.AppointmentData?.PatientDetails?.age,

      doctor_id: data?.item?.AppointmentData?.AppointmentData?.doctor_id,
      communication_id: data?.item?.AppointmentData?.AppointmentData?.communication_id,
      duration_id: data?.item?.AppointmentData?.AppointmentData?.duration_id,
      date: data?.item?.AppointmentData?.AppointmentData?.date,

      package_id: data?.item?.AppointmentData?.package_id ? String(data.item.AppointmentData.package_id) : null,
      sessions: sessionsArray,
      coupon_id: coupon_id
    };

    Logger.debug('NormalPackagesReservationStoreService: Calling storeNormalPackagesAppointment with payload:', payload);
    this._NormalPackagesReservationFacade.storeNormalPackagesReservation(payload, typeId);
  }

  private openPaymentStatusInfo(item: any | null): void {
    Logger.debug('NormalPackagesReservationStoreService => openPaymentStatusInfo => item:', item);

    const statusLabelsTexts = {
      buttonText: 'back_to_home',
      successTitle: 'reservation_reserved_successfully',
      successSubTitle: this._NormalPackagesReservationFacade?.successMessage() ?? 'meet_at_selected_appointment',
      errorTitle: 'something_want_wrong_try_again',
      errorSubTitle: this.error() ?? 'book_appointment_error_details_note'
    };

    const dataInput: any = { item, statusLabels: statusLabelsTexts };

    this.modalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: dataInput?.item?.storeSuccess ? 'subscription_confirmed' : 'subscription_faild',
        data: dataInput
      },
      outputs: {
        closed: (response: any) => {
          if (this.lastTypeId) {
            this.nav.navigate(
              NavigationIntent.INTERNAL,
              AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
              { typeId: this.lastTypeId }
            );
          } else {
            this.nav.navigate(
              NavigationIntent.INTERNAL,
              AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE
            );
          }
          Logger.debug('NormalPackagesReservationStoreService => StatusInfoComponent closed => response:', response);
        }
      },
      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem',
    });
  }
}
