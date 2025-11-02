import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  effect,
  Input,
  computed
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  PaymentMethodsEnum,
  UrgentAppointmentRoutesEnum
} from "../../../urgent-appointment";
import { TherapeuticProgramsRoutesEnum } from "../../../therapeutic-programs";
import { PaymentPricesSummaryComponent } from "../payment-prices-summary";
import { PaymentFlowService, ReservationService } from "../../services";
import { SupportGroupsRoutesEnum } from "../../../support-groups";
import { PaymentMethodComponent } from "../payment-method";
import { CalculateReservationPriceFacade, IPaymentMethod } from "../../../appointments";
import { PaymentFlowStep } from "../../enums";
import { Logger } from "../../../../common";
import { map } from "rxjs";

@Component({
  selector: "app-payment-popup",
  standalone: true,
  imports: [PaymentMethodComponent, PaymentPricesSummaryComponent],
  templateUrl: "./payment-popup.component.html",
  styleUrls: ["./payment-popup.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentPopupComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly activatedRoute = inject(ActivatedRoute);

  // Inject the services
  private paymentFlowService = inject(PaymentFlowService);
  private reservationService = inject(ReservationService);
  private readonly _CalculateReservationPriceFacade = inject(CalculateReservationPriceFacade);

  // Signals
  protected readonly selectedMethod = this.paymentFlowService.selectedMethod;
  protected readonly currentStep = this.paymentFlowService.currentStep;
  protected readonly dataSummary = this.paymentFlowService.dataSummary;

  @Output() closed = new EventEmitter<void>();
  @Input() data?: { item?: any; is_emergency?: boolean; type?: string };
  @Input() type!: string;

  // Loading signals
  protected readonly isCalculatingPriceLoading =
    this.paymentFlowService.isCalculatingPriceLoading;
  protected readonly isStoringProgrammeLoading =
    this.reservationService.isStoringProgrammeLoading;
  protected readonly isStoringSeminarLoading =
    this.reservationService.isStoringSeminarLoading;
  protected readonly isStoringEmergencyAppointmentLoading =
    this.reservationService.isStoringEmergencyAppointmentLoading;
  protected readonly isStoringNormalPackageLoading =
    this.reservationService.isStoringNormalPackageLoading;

  // SSR-safe typeId from query params
  readonly appointmentTypeId = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((params) => params.get("typeId") ?? null)
    )
  );

  protected readonly coupon_id = computed(() => this._CalculateReservationPriceFacade.calculatedPriceResponse()?.data?.coupon_id ?? null);

  protected readonly PaymentMethodsEnum = PaymentMethodsEnum;
  protected readonly PaymentFlowStep = PaymentFlowStep;
  protected readonly TherapeuticProgramsRoutesEnum =
    TherapeuticProgramsRoutesEnum;
  protected readonly SupportGroupsRoutesEnum = SupportGroupsRoutesEnum;
  protected readonly UrgentAppointmentRoutesEnum = UrgentAppointmentRoutesEnum;

  constructor() {
    effect(() => this.cdr.markForCheck());
  }

  ngOnInit() {
    this.paymentFlowService.resetFlow();
    Logger.debug("PaymentPopupComponent: Initializing with data:", this.data);
    Logger.debug("PaymentPopupComponent: Initializing with type:", this.type);
    this.paymentFlowService.setDataSummaryItem(this.data?.item);
    this.paymentFlowService.setCurrentStep(PaymentFlowStep.SELECT_METHOD);
  }

  protected handleDiscountApplied(code: string): void {
    const currentSummary = this.dataSummary();
    if (currentSummary) {
      this.dataSummary.set({
        ...currentSummary,
        item: {
          ...currentSummary.item,
          coupon: code
        }
      });
      this.paymentFlowService.setCoupon(code);
      Logger.debug("PaymentPopupComponent: Discount code applied:", code);
    }
    this.handleProceedWithPaymentMethod(this.selectedMethod()!);
  }

  protected handleDiscountRemoved(): void {
    const currentSummary = this.dataSummary();
    if (currentSummary) {
      this.dataSummary.set({
        ...currentSummary,
        item: {
          ...currentSummary.item,
          coupon: null
        }
      });
      this.paymentFlowService.setCoupon('');
      Logger.debug("PaymentPopupComponent: Discount code removed");
    }
    this.handleProceedWithPaymentMethod(this.selectedMethod()!);
  }

  protected handleSelectedMethod(method: IPaymentMethod): void {
    this.paymentFlowService.setSelectedMethod(method);
  }

  protected handleProceedWithPaymentMethod(method: IPaymentMethod): void {
    this.paymentFlowService.calculatePrice(method, this.data, this.type);
  }

  protected handleBackToMethodSelection(): void {
    this.paymentFlowService.resetFlow();
    this.cdr.markForCheck();
    Logger.debug(
      "PaymentPopupComponent: Back to method selection. State reset.",
      this.currentStep()
    );
  }

  protected handleConfirmFromSummary(): void {
    const data = this.data;
    const paymentMethodId = this.selectedMethod()?.id;
    const typeId = this.appointmentTypeId(); // SSR-safe

    if (!paymentMethodId) {
      Logger.error(
        "PaymentPopupComponent: Cannot confirm, no payment method selected."
      );
      return;
    }

    if (this.type === "normal" && typeId) {
      Logger.debug(
        "PaymentPopupComponent | Triggering store for Normal Package Appointment with typeId:",
        typeId
      );
      this.reservationService.storeNormalPackagesAppointment(
        data,
        paymentMethodId,
        typeId,
        this.coupon_id() ? Number(this.coupon_id()) : null
      );
      return;
    }

    if (
      this.type ===
      TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE &&
      data?.item?.id
    ) {
      this.reservationService.storeProgramme(data.item.id, paymentMethodId, this.coupon_id() ? Number(this.coupon_id()) : null);
      Logger.debug(
        "PaymentPopupComponent: Triggering store for Therapeutic Programme."
      );
    } else if (
      this.type === SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES &&
      data?.item?.id
    ) {
      this.reservationService.storeSeminar(data.item.id, paymentMethodId, this.coupon_id() ? Number(this.coupon_id()) : null);
      Logger.debug(
        "PaymentPopupComponent: Triggering store for Support Group (Seminar)."
      );
    } else if (
      this.type === UrgentAppointmentRoutesEnum.URGENT_APPOINTMENT_MAIN_PAGE
    ) {
      this.reservationService.storeEmergencyAppointment(
        data,
        paymentMethodId
      );
      Logger.debug(
        "PaymentPopupComponent | Triggering store for Emergency Appointment."
      );
    } else if (this.type === "normal") {
      this.reservationService.storeNormalPackagesAppointment(
        data,
        paymentMethodId,
        typeId,
        this.coupon_id() ? Number(this.coupon_id()) : null
      );
      Logger.debug(
        "PaymentPopupComponent | Triggering store for Normal Package Appointment."
      );
    } else {
      Logger.warn(
        "PaymentPopupComponent: No specific store action for this type or missing data for confirmation."
      );
    }
  }

  protected handleAddNewCard(): void {
    this.paymentFlowService.setCurrentStep(PaymentFlowStep.ADD_CARD);
    Logger.debug("PaymentPopupComponent: Moving to add new card step.");
  }

  protected handleCancelFlow(): void {
    this.closed.emit();
    Logger.debug(
      "PaymentPopupComponent: Cancelling payment flow for type:",
      this.type
    );
  }
}
