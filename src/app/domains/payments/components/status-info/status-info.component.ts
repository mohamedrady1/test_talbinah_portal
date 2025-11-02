import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Logger, useNavigation } from '../../../../common';
import { PaymentPageTypeEnum } from '../../constants';
import { ModalService } from '../../../../shared';
import { UrgentAppointmentOpenService } from '../../../urgent-appointment/services/urgent-appointment-open.service';
// Dynamic imports will be used instead of static imports to avoid circular dependencies
import { SeminarItemFacade } from '../../../../domains/support-groups/services/seminar-item.facade'
import { TherapeuticProgramItemFacade } from '../../../../domains/therapeutic-programs/services/therapeutic-program-item.facade';
import { ReservationDetailsFacade } from '../../../../domains/appointments/services/reservation-details.facade';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-status-info',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './status-info.component.html',
  styleUrls: ['./status-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusInfoComponent implements OnInit {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  private readonly nav = useNavigation();
  private readonly modalService = inject(ModalService);
  protected readonly seminarFacade = inject(SeminarItemFacade);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this._platformId);
  private readonly programFacade = inject(TherapeuticProgramItemFacade);
  private readonly reservationFacade = inject(ReservationDetailsFacade);
  private readonly urgentOpenService = inject(UrgentAppointmentOpenService);
  PaymentPageTypeEnum = PaymentPageTypeEnum;
  // protected readonly programFacade = inject(TherapeuticProgramItemFacade);
  @Input() public data: any;
  @Output() public closed = new EventEmitter<any>();
  @Output() public confirmed = new EventEmitter<void>();

  public status = false;
  @Input() statusTitleKey = '';
  @Input() statusSubtitleKey = '';
  @Input() confirmMode = false;
  @Input() onConfirmFn?: () => Promise<boolean>;

  public isSubmitting = false;

  itemId: number | null = null;
  pageType: string | null = null;
  repayURL: string | null = null;
  fromSuccessSite: boolean = false;

  public ngOnInit(): void {
    Logger.debug('StatusInfoComponent => ngOnInit => data:', this.data);
    this.processStatusInfo();
    if (this.fromSuccessSite) {
      this.goToDetails();
    }
  }

  private processStatusInfo(): void {
    const rawStatus = this.data?.item?.storeSuccess;
    this.status = rawStatus === true || rawStatus === 'true' || rawStatus === 'success';

    this.itemId = this.data?.item?.itemId ?? null;
    this.pageType = this.data?.item?.pageType ?? null;
    this.repayURL = this.data?.item?.repayUrl ?? null;
    this.fromSuccessSite = this.data?.item?.fromSuccessSite === true || this.data?.item?.fromSuccessSite === 'true';
    Logger.debug('StatusInfoComponent => processStatusInfo => fromSuccessSite:', this.fromSuccessSite);
    this.statusTitleKey = this.status
      ? this.data?.statusLabels?.successTitle ?? 'operation_successful'
      : this.data?.statusLabels?.errorTitle ?? 'operation_failed'

    this.statusSubtitleKey = this.status
      ? this.data?.statusLabels?.successSubTitle
      : this.data?.item?.storeError || this.data?.statusLabels?.errorSubTitle
  }

  protected goToDetails(): void {
    Logger.debug('StatusInfoComponent => goToDetails => status:', this.status, 'itemId:', this.itemId, 'pageType:', this.pageType);

    const targetUrl = this.data?.item?.url;
    if (targetUrl) {
      window.open(targetUrl, '_blank');
      this.closed.emit();
      return;
    }

    if (this.status && this.itemId) {
      this.openItemDetails();
      return;
    }

    this.modalService.closeAll();
    this.closed.emit();
  }

  protected openUrgentAppointment(): void {
    this.urgentOpenService.requestOpen();
    this.closed.emit();
  }

  private openItemDetails(): void {
    Logger.debug('StatusInfoComponent => openItemDetails => itemId:', this.itemId, 'pageType:', this.pageType);

    this.modalService.closeAll();

    switch (this.pageType) {
      case PaymentPageTypeEnum.SEMINAR:
        this.openSeminarDetails();
        break;
      case PaymentPageTypeEnum.PROGRAM:
        this.openProgramDetails();
        break;
      case PaymentPageTypeEnum.RESERVATION:
        this.openReservationDetails();
        break;
      default:
        Logger.warn('StatusInfoComponent => Unknown page type:', this.pageType);
        this.closed.emit();
        break;
    }
  }

  private openSeminarDetails(): void {
    Logger.debug('StatusInfoComponent => openSeminarDetails => itemId:', this.itemId);
    this.seminarFacade.openSeminarDetails.next(this.itemId ? { id: this.itemId } : null);
  }

  private openProgramDetails(): void {
    Logger.debug('StatusInfoComponent => openProgramDetails => itemId:', this.itemId);
    this.programFacade.openProgramDetails.next(this.itemId ? { id: this.itemId } : null);
  }

  private openReservationDetails(): void {
    Logger.debug('StatusInfoComponent => openReservationDetails => itemId:', this.itemId);
    this.reservationFacade.openReservationDetails.next(this.itemId ? { id: this.itemId } : null);
  }

  protected retryPayment(event?: Event): void {
    event?.preventDefault();
    if (this.isBrowser && this.repayURL) {
      window.location.href = this.repayURL;
    }
  }

  protected onCancel(): void {
    this.closed.emit();
    if (this.status && this.pageType !== PaymentPageTypeEnum.URGENT_APPOINTMENT && this.pageType !== 'send-gift' && this.pageType !== 'cancel-gift' && this.pageType !== 'accept-gift') {
      this.modalService.closeAll();
    }
  }

  protected onConfirm(): void {
    if (this.onConfirmFn) {
      this.isSubmitting = true;
      Promise.resolve(this.onConfirmFn())
        .then((ok) => {
          if (ok) {
            this.confirmed.emit();
            this.closed.emit();
          }
        })
        .finally(() => {
          this.isSubmitting = false;
        });
      return;
    }
    this.confirmed.emit();
  }
}
