import { SeminarStoreFacade, SeminarsFacade, SupportGroupsRoutesEnum, IStoreSeminarRequestDto } from '../../../support-groups';
import { Logger, NavigationIntent, useNavigation } from '../../../../common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { StatusInfoComponent } from '../../components';
import { ModalService } from '../../../../shared';
import { WalletFacade } from '../../../settings';

@Injectable({
  providedIn: 'root'
})
export class SeminarStoreService {
  private readonly nav = useNavigation();
  private modalService = inject(ModalService);

  private _SeminarStoreFacade = inject(SeminarStoreFacade);
  protected readonly _SeminarsFacade = inject(SeminarsFacade);

  public readonly isStoringLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.isStoringLoading.set(this._SeminarStoreFacade.isStoringSeminar());

      if (!this._SeminarStoreFacade.isStoringSeminar()) { // Operation finished
        const storeSuccess = this._SeminarStoreFacade.storeSuccess();
        const storeError = this._SeminarStoreFacade.storeError();
        const storedSeminar = this._SeminarStoreFacade.storedSeminar();

        let itemSeminarData: any = {
          isStoring: false,
          storeSuccess: storeSuccess,
          storeError: storeError,
          response: storedSeminar,
        };
        this.error.set(itemSeminarData.storeError);
        if (storeSuccess) {
          Logger.debug('SeminarStoreService: Seminar stored successfully.');
          this._SeminarsFacade.fetchAllSeminars();
          this._SeminarsFacade.fetchMySeminars();
          if (storedSeminar?.url) {
            this.nav.navigate(NavigationIntent.EXTERNAL_SAME_TAB, storedSeminar.url);
          } else {
            this.openPaymentStatusInfo(itemSeminarData, SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES);
          }
          this._SeminarStoreFacade.resetStoreOperationState();
        } else if (storeError) {
          Logger.error('SeminarStoreService: Failed to store seminar:', storeError);
          this.openPaymentStatusInfo(itemSeminarData, SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES);
          this._SeminarStoreFacade.resetStoreOperationState();
        }
      }
    });
  }

  storeSeminar(seminarId: any, paymentMethodId: any): void {
    if (seminarId && paymentMethodId) {
      const payload: IStoreSeminarRequestDto = {
        seminar_id: seminarId,
        payment_id: paymentMethodId
      };
      Logger.debug('SeminarStoreService: Calling storeSeminar with payload:', payload);
      this._SeminarStoreFacade.storeSeminar(payload);
    } else {
      Logger.error('SeminarStoreService: Cannot store Seminar, missing Seminar ID or selected payment method ID.');
      this.isStoringLoading.set(false);
    }
  }

  // Renaming to be specific to this service
  private openPaymentStatusInfo(item: any | null, type: SupportGroupsRoutesEnum): void {
    Logger.debug('SeminarStoreService => openPaymentStatusInfo => item to status info: ', item);
    const statusLabelsTexts = {
      buttonText: 'go_to_group',
      successTitle: 'support_group_join_success',
      successSubTitle: 'therapeutic_programs_joined_success_details_text',
      errorTitle: 'seminar_error_subscription_text',
      errorSubTitle: this.error() ?? 'seminar_error_problem_text'
    };

    const dataInput: any = { item: item, statusLabels: statusLabelsTexts };
    this.modalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/icons/logo-2.png',
        title: dataInput?.item?.storeSuccess ? 'general.subscriptionConfirmed' : 'general.subscriptionFaild',
        data: dataInput
      },
      outputs: {
        closed: (response: any) => {
          Logger.debug('SeminarStoreService => StatusInfoComponent => The status modal is closed => response: ', response);
        }
      },
      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem',
    });
  }
}
