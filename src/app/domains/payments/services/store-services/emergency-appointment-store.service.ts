import { EmergencyAppointmentStoreFacade, IStoreEmergencyAppointmentRequestDto, SearchWaitingDoctorComponent, UrgentAppointmentRoutesEnum } from '../../../urgent-appointment';
import { DetailsHeaderConfig } from '../../../../domains/therapeutic-programs';
import { Logger, NavigationIntent, useNavigation } from '../../../../common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { StatusInfoComponent } from '../../components';
import { ModalService } from '../../../../shared';

@Injectable({
  providedIn: 'root'
})
export class EmergencyAppointmentStoreService {
  private readonly nav = useNavigation();
  private modalService = inject(ModalService);

  private _EmergencyAppointmentStoreFacade = inject(EmergencyAppointmentStoreFacade);

  public readonly isStoringLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.isStoringLoading.set(this._EmergencyAppointmentStoreFacade.isStoringEmergencyAppointment());

      if (!this._EmergencyAppointmentStoreFacade.isStoringEmergencyAppointment()) { // Operation finished
        const storeSuccess = this._EmergencyAppointmentStoreFacade.storeSuccess();
        const storeError = this._EmergencyAppointmentStoreFacade.storeError();
        const storedEmergencyAppointment = this._EmergencyAppointmentStoreFacade.storedEmergencyAppointment();

        let itemUrgentEmergencyData: any = {
          isStoring: false,
          storeSuccess: storeSuccess,
          storeError: storeError,
          response: storedEmergencyAppointment,
        };
        this.error.set(itemUrgentEmergencyData.storeError);
        if (storeSuccess) {
          Logger.debug('EmergencyAppointmentStoreService: Emergency Appointment stored successfully.');
          if (storedEmergencyAppointment?.url) {
            this.nav.navigate(NavigationIntent.EXTERNAL_SAME_TAB, storedEmergencyAppointment.url);
          } else {
            this.openSearchWaitingDoctor(itemUrgentEmergencyData.response);
          }
          this._EmergencyAppointmentStoreFacade.resetStoreOperationState();
        } else if (storeError) {
          Logger.error('EmergencyAppointmentStoreService: Failed to store Emergency Appointment:', storeError);
          this.openPaymentStatusInfo(itemUrgentEmergencyData, UrgentAppointmentRoutesEnum.URGENT_APPOINTMENT_MAIN_PAGE);
          this._EmergencyAppointmentStoreFacade.resetStoreOperationState();
        }
      }
    });
  }

  storeEmergencyAppointment(data: any, paymentMethodId: any): void {
    if (paymentMethodId) {
      const payload: IStoreEmergencyAppointmentRequestDto = {
        payment_id: paymentMethodId,
        duration_price_id: data?.item?.AppointmentData?.AppointmentData?.Duration,
        specialist_id: data?.item?.AppointmentData?.AppointmentData?.Speciality,
        problem: data?.item?.AppointmentData?.PatientDetails?.problem,
        full_name: data?.item?.AppointmentData?.PatientDetails?.name,
        age: data?.item?.AppointmentData?.PatientDetails?.age,
        gender: data?.item?.AppointmentData?.PatientDetails?.gender == 'female' ? '0' : '1'
      };
      Logger.debug('EmergencyAppointmentStoreService: Calling storeEmergencyAppointment with payload:', payload);
      this._EmergencyAppointmentStoreFacade.storeEmergencyAppointment(payload);
    } else {
      Logger.error('EmergencyAppointmentStoreService: Cannot store Emergency Appointment, missing selected payment method ID.');
      this.isStoringLoading.set(false);
    }
  }

  private openSearchWaitingDoctor(item: any | null): void {
    const componentConfig: any = { ...DetailsHeaderConfig }; // Keep DetailsHeaderConfig if it's used elsewhere for modals
    const dataInput: any = {
      item: item,
      statusLabels: {
        buttonText: 'supportGroups.goToProgramDetails', // Assuming these are i18n keys
        successTitle: 'supportGroups.therapySubscriptionSuccess',
        successSubTitle: 'supportGroups.therapySubscriptionSuccessText',
        errorTitle: 'supportGroups.therapySubscriptionError',
        errorSubTitle: 'supportGroups.therapySubscriptionErrorText'
      }
    };
    this.modalService.open(SearchWaitingDoctorComponent, {
      inputs: {
        image: 'images/urgent-appointment/calender.png',
        title: 'waitingDoctorTitle',
        subtitle: 'waiting_doctor_modal_subtitle',
        data: dataInput
      },
      outputs: {
        closed: (response: any) => {
          Logger.debug('EmergencyAppointmentStoreService => openSearchWaitingDoctor => The status modal is closed => response: ', response);
        }
      },
      width: '40%'
    });
  }

  // Renaming to be specific to this service
  private openPaymentStatusInfo(item: any | null, type: UrgentAppointmentRoutesEnum): void {
    Logger.debug('EmergencyAppointmentStoreService => openPaymentStatusInfo => item to status info: ', item);
    const statusLabelsTexts = {
      buttonText: 'back_to_home',
      successTitle: 'the_appointment_has_been_confirmed',
      successSubTitle: 'your_emergency_appointment_has_been_booked_successfully',
      errorTitle: 'an_error_has_occurred',
      errorSubTitle: this.error() ?? 'emergency_appointment_request_failed_try_later_or_contact_support'
    };

    const dataInput: any = { item: item, statusLabels: statusLabelsTexts };
    this.modalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png', // Ensure path is correct for SSR
        title: dataInput?.item?.storeSuccess ? 'subscription_confirmed' : 'subscription_faild',
        data: dataInput
      },
      outputs: {
        closed: (response: any) => {
          Logger.debug('EmergencyAppointmentStoreService => StatusInfoComponent => The status modal is closed => response: ', response);
        }
      },
      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem',
    });
  }
}
