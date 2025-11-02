import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Logger } from '../../../common';
import { ModalService } from '../../../shared';
import { StatusInfoComponent } from '../components';
import { PaymentPageTypeEnum } from '../constants';

export interface RoutePaymentInfo {
  itemId?: number | null | undefined;
  status: boolean;
  repayUrl: string | null;
  pageType?: string | null; // optional, PROGRAM/SEMINAR etc.
  fromSuccessSite?: boolean;
}

/**
 * In-memory handoff for payment state between routes.
 * SSR-safe (no window usage).
 */
@Injectable({ providedIn: 'root' })
export class PaymentStateService {
  private readonly _routePaymentInfo = new BehaviorSubject<RoutePaymentInfo | null>(null);
  readonly routePaymentInfo$: Observable<RoutePaymentInfo | null> = this._routePaymentInfo.asObservable();

  private readonly modalService = inject(ModalService);

  setRoutePaymentInfo(info: RoutePaymentInfo): void {
    this._routePaymentInfo.next(info);
    Logger.debug('PaymentStateService: Route payment info set', info);
  }

  clearRoutePaymentInfo(): void {
    this._routePaymentInfo.next(null);
    Logger.debug('PaymentStateService: Route payment info cleared');
  }

  get snapshot(): RoutePaymentInfo | null {
    return this._routePaymentInfo.value;
  }

  /**
   * Opens the payment status modal with translated labels.
   */
  openPaymentStatusInfo(paymentInfo: any | null, type: string | null): void {
    Logger.debug('PaymentStateService => openPaymentStatusInfo => item:', {
      paymentInfo: paymentInfo,
      type: type
    });

    const info = paymentInfo;
    if (!info) return;
    let statusLabelsTexts: any;

    if (type === PaymentPageTypeEnum.PROGRAM) {
      statusLabelsTexts = {
        buttonText: 'therapeutic_program_go_to_details_btn_label',
        successTitle: 'support_group_join_success',
        successSubTitle: 'therapeutic_programs_joined_success_details_text',
        errorTitle: 'therapeutic_programs_joined_error_title',
        errorSubTitle: 'therapeutic_programs_joined_error_subtitle',
      };
    }

    if (type === PaymentPageTypeEnum.SEMINAR) {
      statusLabelsTexts = {
        buttonText: 'go_to_group',
        successTitle: 'support_group_join_success',
        successSubTitle: 'therapeutic_programs_joined_success_details_text',
        errorTitle: 'seminar_error_subscription_text',
        errorSubTitle: 'seminar_error_problem_text',
      };
    }

    if (type === PaymentPageTypeEnum.RESERVATION) {
      statusLabelsTexts = {
        buttonText: 'back_to_home',
        successTitle: 'reservation_reserved_successfully',
        successSubTitle: 'meet_at_selected_appointment',
        errorTitle: 'something_want_wrong_try_again',
        errorSubTitle: 'book_appointment_error_details_note',
      };
    }

    if (type === PaymentPageTypeEnum.URGENT_APPOINTMENT) {
      statusLabelsTexts = {
        buttonText: 'back_to_home',
        successTitle: 'the_appointment_has_been_confirmed',
        successSubTitle: 'your_emergency_appointment_has_been_booked_successfully',
        errorTitle: 'an_error_has_occurred',
        errorSubTitle: 'emergency_appointment_request_failed_try_later_or_contact_support',
      };
    }

    if (type === PaymentPageTypeEnum.CHARGE_WALLET) {
      statusLabelsTexts = {
        buttonText: 'back_to_home',
        successTitle: 'ChargeWallet.chargeSuccess',
        successSubTitle: 'ChargeWallet.chargeSuccessText',
        errorTitle: 'ChargeWallet.chargeError',
        errorSubTitle: 'ChargeWallet.chargeErrorText',
      };
    }

    const dataInput: any = {
      statusLabels: statusLabelsTexts,
      storeSuccess: info.status,
      itemId: info?.itemId,
      pageType: type,
      repayUrl: info?.repayUrl,
      fromSuccessSite: info?.fromSuccessSite
    };
    Logger.debug('PaymentStateService => openPaymentStatusInfo => dataInput:', dataInput);

    this.modalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/icons/logo-2.png',
        title: info.status
          ? 'general.subscriptionConfirmed'
          : 'general.subscriptionFaild',
        data: {
          item: dataInput,
          statusLabels: statusLabelsTexts
        },
      },
      outputs: {
        closed: (response: any) => {
          Logger.debug('PaymentStateService => StatusInfoComponent closed => response:', response);
        },
      },
      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem'
    });
  }
}
