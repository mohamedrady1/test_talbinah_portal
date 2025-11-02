import {
  Component,
  OnInit,
  inject,
  PLATFORM_ID,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { PaymentStateService, RoutePaymentInfo } from '../../services';
import { PaymentPageTypeEnum } from '../../constants';
import { TherapeuticProgramsRoutesEnum } from '../../../therapeutic-programs';
import { Logger, NavigationIntent, useNavigation } from '../../../../common';
import { SupportGroupsRoutesEnum } from '../../../support-groups';
import { AppointmentsRoutesEnum } from '../../../appointments';
import { MainPageRoutesEnum } from '../../../main-page';

export interface PaymentQueryParams {
  reservation_id?: string | null;
  payment_id?: string | null;
  tap_id?: string | null;
  item_id?: string | null;
  type?: string | null;
  status?: string | null;
  repay_url?: string | null;
  appointmentTypeId?: string | null;
  fromSuccessSite?: boolean | null;
}

export interface PaymentStatusState {
  paymentStatus: string;
  isSuccess: boolean;
  statusText: string;
  statusSubText: string | null;
  reservationId: string | null;
  paymentId: string | null;
  itemId: number | null;
  repayUrl: string | null;
  tapId: string | null;
  pageType: PaymentPageTypeEnum | null;
  appointmentTypeId: string | null;
  fromSuccessSite: boolean;
}

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentStatusComponent implements OnInit, OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly nav = useNavigation();
  private readonly _translate = inject(TranslateService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroy$ = new Subject<void>();
  private readonly _paymentStateService = inject(PaymentStateService);
  private readonly isBrowser = isPlatformBrowser(this._platformId);

  public state: PaymentStatusState = {
    paymentStatus: 'pending',
    isSuccess: false,
    statusText: '',
    statusSubText: null,
    reservationId: null,
    paymentId: null,
    itemId: null,
    repayUrl: null,
    tapId: null,
    pageType: null,
    appointmentTypeId: null,
    fromSuccessSite: false
  };

  ngOnInit(): void {
    if (!this.isBrowser) {
      this.state.statusText = this._translate.instant('paymentStatus.ssrDefaultMessage');
      this.state.paymentStatus = 'unknown';
      return;
    }

    this._activatedRoute.queryParamMap
      .pipe(takeUntil(this._destroy$))
      .subscribe((paramsMap) => {
        const params: PaymentQueryParams = {
          reservation_id: paramsMap.get('reservation_id'),
          payment_id: paramsMap.get('payment_id'),
          tap_id: paramsMap.get('tap_id'),
          item_id: paramsMap.get('item_id'),
          type: paramsMap.get('type'),
          status: paramsMap.get('status'),
          repay_url: paramsMap.get('repay_url'),
          appointmentTypeId: paramsMap.get('typeId'),
          fromSuccessSite: paramsMap.get('fromSuccessSite') === 'true' || paramsMap.get('fromSuccessSite') === '1' || false
        };

        this.state.reservationId = params.reservation_id ?? null;
        this.state.paymentId = params.payment_id ?? null;
        this.state.tapId = params.tap_id ?? null;
        this.state.itemId = params.item_id ? +params.item_id : null;
        this.state.pageType = (params.type as PaymentPageTypeEnum) ?? null;
        this.state.paymentStatus = this.mapStatus(params.status);
        this.state.isSuccess = this.state.paymentStatus === 'success';
        this.state.repayUrl = params.repay_url ? decodeURIComponent(params.repay_url) : null;
        this.state.appointmentTypeId = params.appointmentTypeId ?? null;
        this.state.fromSuccessSite = params.fromSuccessSite == true;
        Logger.debug('PaymentStatusComponent → Updated state from query params:', { ...this.state });

        this.updateStatusMessagesAndNavigate();
      });
  }

  private mapStatus(status?: string | null): string {
    switch (status) {
      case 'success':
      case 'fail':
      case 'pending':
        return status;
      default:
        return 'unknown';
    }
  }

  private updateStatusMessagesAndNavigate(): void {
    const { isSuccess, pageType } = this.state;

    if (isSuccess) {
      if (pageType === PaymentPageTypeEnum.PROGRAM) {
        const paymentInfo: RoutePaymentInfo = {
          itemId: this.state.itemId,
          status: true,
          repayUrl: this.state.repayUrl,
          fromSuccessSite: this.state.fromSuccessSite,
        };
        this._paymentStateService.setRoutePaymentInfo(paymentInfo);

        if (this.isBrowser) {
          this.nav.navigate(
            NavigationIntent.INTERNAL,
            TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE,
            { state: paymentInfo } // ✅ pass via navigation state, no query params
          );
        }
      }
      else if (pageType === PaymentPageTypeEnum.SEMINAR) {
        const paymentInfo: RoutePaymentInfo = {
          itemId: this.state.itemId,
          status: this.state.isSuccess,
          repayUrl: this.state.repayUrl,
          fromSuccessSite: this.state.fromSuccessSite,
        };
        this._paymentStateService.setRoutePaymentInfo(paymentInfo);
        Logger.debug('PaymentStatusComponent → updateStatusMessagesAndNavigate | paymentInfo:', paymentInfo);
        if (this.isBrowser) {
          this.nav.navigate(
            NavigationIntent.INTERNAL,
            SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES,
            { state: paymentInfo }
          );
        }
      }
      else if (pageType === PaymentPageTypeEnum.RESERVATION) {
        const paymentInfo: RoutePaymentInfo = {
          itemId: this.state.itemId,
          status: true,
          repayUrl: this.state.repayUrl,
          fromSuccessSite: this.state.fromSuccessSite,
        };
        this._paymentStateService.setRoutePaymentInfo(paymentInfo);

        if (this.isBrowser) {
          this.nav.navigate(
            NavigationIntent.INTERNAL,
            AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
            { typeId: this.state.appointmentTypeId ?? 10, state: paymentInfo } // ✅ pass via navigation state, no query params
          );
        }
      }
      else if (pageType === PaymentPageTypeEnum.CHARGE_WALLET) {
        const paymentInfo: RoutePaymentInfo = {
          status: true,
          repayUrl: this.state.repayUrl,
          fromSuccessSite: this.state.fromSuccessSite,
          pageType: PaymentPageTypeEnum.CHARGE_WALLET
        };
        this._paymentStateService.setRoutePaymentInfo(paymentInfo);

        if (this.isBrowser) {
          this.nav.navigate(
            NavigationIntent.INTERNAL,
            MainPageRoutesEnum.MAINPAGE,
            { state: paymentInfo } // ✅ pass via navigation state, no query params
          );
        }
      }
      else if (pageType === PaymentPageTypeEnum.URGENT_APPOINTMENT) {
        const paymentInfo: RoutePaymentInfo = {
          status: true,
          repayUrl: this.state.repayUrl,
          fromSuccessSite: this.state.fromSuccessSite,
          pageType: PaymentPageTypeEnum.URGENT_APPOINTMENT
        };
        this._paymentStateService.setRoutePaymentInfo(paymentInfo);

        if (this.isBrowser) {
          this.nav.navigate(
            NavigationIntent.INTERNAL,
            MainPageRoutesEnum.MAINPAGE,
            { state: paymentInfo } // ✅ pass via navigation state, no query params
          );
        }
        // send behavior subject to open URGENT APPOINTMENT modal in case of success  

      }
      else {
        this.state.statusText = this._translate.instant('paymentStatus.generalSuccessText');
        this.state.statusSubText = this._translate.instant('paymentStatus.downloadAppMessage');
      }
    } else {
      switch (this.state.paymentStatus) {
        case 'fail':
          this.state.statusText = this._translate.instant('paymentStatus.failureText');
          break;
        case 'pending':
          this.state.statusText = this._translate.instant('paymentStatus.pendingText');
          break;
        default:
          this.state.statusText = this._translate.instant('paymentStatus.unknownText');
          break;
      }

      this.state.statusSubText = null;

      if (pageType === PaymentPageTypeEnum.PROGRAM) {
        const paymentInfo: RoutePaymentInfo = {
          itemId: this.state.itemId,
          status: false,
          repayUrl: this.state.repayUrl,
          fromSuccessSite: this.state.fromSuccessSite,
        };
        this._paymentStateService.setRoutePaymentInfo(paymentInfo);
        Logger.debug('PaymentStatusComponent → updateStatusMessagesAndNavigate | paymentInfo:', paymentInfo);
        if (this.isBrowser) {
          this.nav.navigate(
            NavigationIntent.INTERNAL,
            TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE,
            { state: paymentInfo }
          );
        }
      }
      else if (pageType === PaymentPageTypeEnum.SEMINAR) {
        const paymentInfo: RoutePaymentInfo = {
          itemId: this.state.itemId,
          status: false,
          repayUrl: this.state.repayUrl,
          fromSuccessSite: this.state.fromSuccessSite,
        };
        this._paymentStateService.setRoutePaymentInfo(paymentInfo);
        Logger.debug('PaymentStatusComponent → updateStatusMessagesAndNavigate | paymentInfo:', paymentInfo);
        if (this.isBrowser) {
          this.nav.navigate(
            NavigationIntent.INTERNAL,
            SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES,
            { state: paymentInfo }
          );
        }
      }
      else if (pageType === PaymentPageTypeEnum.RESERVATION) {
        const paymentInfo: RoutePaymentInfo = {
          itemId: this.state.itemId,
          status: false,
          repayUrl: this.state.repayUrl,
          fromSuccessSite: this.state.fromSuccessSite,
        };
        this._paymentStateService.setRoutePaymentInfo(paymentInfo);

        if (this.isBrowser) {
          this.nav.navigate(
            NavigationIntent.INTERNAL,
            AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
            { typeId: this.state.appointmentTypeId ?? 10, state: paymentInfo } // ✅ pass via navigation state, no query params
          );
        }
      }
      else if (pageType === PaymentPageTypeEnum.CHARGE_WALLET) {
        const paymentInfo: RoutePaymentInfo = {
          status: false,
          repayUrl: this.state.repayUrl,
          pageType: PaymentPageTypeEnum.CHARGE_WALLET
        };
        this._paymentStateService.setRoutePaymentInfo(paymentInfo);

        if (this.isBrowser) {
          this.nav.navigate(
            NavigationIntent.INTERNAL,
            MainPageRoutesEnum.MAINPAGE,
            { state: paymentInfo } // ✅ pass via navigation state, no query params
          );
        }
      }
      else if (pageType === PaymentPageTypeEnum.URGENT_APPOINTMENT) {
        const paymentInfo: RoutePaymentInfo = {
          status: false,
          repayUrl: this.state.repayUrl,
          fromSuccessSite: this.state.fromSuccessSite,
          pageType: PaymentPageTypeEnum.URGENT_APPOINTMENT,
        };
        this._paymentStateService.setRoutePaymentInfo(paymentInfo);

        if (this.isBrowser) {
          this.nav.navigate(
            NavigationIntent.INTERNAL,
            MainPageRoutesEnum.MAINPAGE,
            { state: paymentInfo } // ✅ pass via navigation state, no query params
          );
        }
      }
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public goToPaymentsDashboard(): void {
    Logger.info('Navigating to payments dashboard');
  }

  protected downloadApp(platform: 'ios' | 'android'): void {
    if (!this.isBrowser) return;
    if (platform === 'ios') {
      window.open('https://apps.apple.com/sa/app/%D8%AA%D9%84%D8%A8%D9%8A%D9%86%D8%A9-talbinah/id6464413895', '_blank');
    } else {
      window.open('https://play.google.com/store/apps/details?id=com.talbinah.talbinah&pli=1', '_blank');
    }
  }
}
