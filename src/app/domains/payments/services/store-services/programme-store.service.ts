import { ProgrammeStoreFacade, TherapeuticProgramsFacade, TherapeuticProgramsRoutesEnum, IStoreProgrammeRequestDto } from '../../../therapeutic-programs';
import { useNavigation, Logger, NavigationIntent } from '../../../../common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { StatusInfoComponent } from '../../components';
import { ModalService } from '../../../../shared';
@Injectable({
  providedIn: 'root'
})
export class ProgrammeStoreService {
  private readonly nav = useNavigation();
  private modalService = inject(ModalService);

  private programmeStoreFacade = inject(ProgrammeStoreFacade);
  private _programsFacade = inject(TherapeuticProgramsFacade); // Needed for fetching programs after store

  public readonly isStoringLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.isStoringLoading.set(this.programmeStoreFacade.isStoringProgramme());

      if (!this.programmeStoreFacade.isStoringProgramme()) { // Operation finished
        const storeSuccess = this.programmeStoreFacade.storeSuccess();
        const storeError = this.programmeStoreFacade.storeError();
        const storedProgramme = this.programmeStoreFacade.storedProgramme();

        let itemProgramData: any = {
          isStoring: false,
          storeSuccess: storeSuccess,
          storeError: storeError,
          response: storedProgramme,
          // storedSeminar: storedProgramme // This was a mismatch, removing for clarity unless truly intended
        };

        this.error.set(itemProgramData.storeError);
        if (storeSuccess) {
          Logger.debug('ProgrammeStoreService: Programme stored successfully.');
          this._programsFacade.fetchMyTherapeuticPrograms();
          this._programsFacade.fetchAllTherapeuticPrograms();
          if (storedProgramme?.url) {
            Logger.debug('55555555', storedProgramme?.url)
            this.nav.navigate(NavigationIntent.EXTERNAL_SAME_TAB, storedProgramme.url);
          } else {
            this.openPaymentStatusInfo(itemProgramData, TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE);
          }
          this.programmeStoreFacade.resetStoreOperationState();
        } else if (storeError) {
          Logger.error('ProgrammeStoreService: Failed to store programme:', storeError);
          this.openPaymentStatusInfo(itemProgramData, TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE);
          this.programmeStoreFacade.resetStoreOperationState();
        }
      }
    });
  }

  storeProgramme(programmeId: any, paymentMethodId: any, coupon_id?: number | null): void {
    if (programmeId && paymentMethodId) {
      const payload: IStoreProgrammeRequestDto = {
        programme_id: programmeId,
        payment_id: paymentMethodId,
        coupon_id: coupon_id,
        device_type: 'web'
      };
      Logger.debug('ProgrammeStoreService: Calling storeProgramme with payload:', payload);
      this.programmeStoreFacade.storeProgramme(payload);
    } else {
      Logger.error('ProgrammeStoreService: Cannot store programme, missing programme ID or selected payment method ID.');
      this.isStoringLoading.set(false);
    }
  }

  // Renaming to be specific to this service
  private openPaymentStatusInfo(item: any | null, type: TherapeuticProgramsRoutesEnum): void {
    Logger.debug('ProgrammeStoreService => openPaymentStatusInfo => item to status info: ', item);
    const statusLabelsTexts = {
      buttonText: 'therapeutic_program_go_to_details_btn_label',
      successTitle: 'support_group_join_success',
      successSubTitle: 'therapeutic_programs_joined_success_details_text',
      errorTitle: 'therapeutic_programs_joined_error_title',
      errorSubTitle: this.error() ?? 'therapeutic_programs_joined_error_subtitle'
    };

    const dataInput: any = { item: { ...item, itemId: item?.response?.id }, statusLabels: statusLabelsTexts };
    this.modalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png', // Ensure path is correct for SSR
        title: dataInput?.item?.storeSuccess ? 'subscription_confirmed' : 'subscription_faild',
        data: dataInput
      },
      outputs: {
        closed: (response: any) => {
          Logger.debug('ProgrammeStoreService => StatusInfoComponent => The status modal is closed => response: ', response);
        }
      },
      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem',
    });
  }
}
