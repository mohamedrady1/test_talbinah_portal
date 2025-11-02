import {
  CalculateReservationPriceFacade,
  ICalculateReservationPriceRequestDto,
  IPaymentMethod,
  IPaymentSummary,
  PaymentFlowStep,
  SupportGroupsRoutesEnum,
  TherapeuticProgramsRoutesEnum,
  UrgentAppointmentRoutesEnum
} from "../..";
import { effect, inject, Injectable, signal } from "@angular/core";
import { Logger } from "../../../common";

@Injectable({
  providedIn: "root"
})
export class PaymentFlowService {
  private readonly _calculatePriceFacade = inject(CalculateReservationPriceFacade);

  public readonly currentStep = signal<PaymentFlowStep>(PaymentFlowStep.SELECT_METHOD);
  public readonly selectedMethod = signal<IPaymentMethod | null>(null);
  public readonly dataSummary = signal<IPaymentSummary>({
    paymentType: null,
    reservationsSummary: null,
    item: undefined
  });
  public readonly isCalculatingPriceLoading = signal<boolean>(false);

  // new: coupon signal
  readonly coupon = signal<string | null>(null);

  constructor() {
    // Effect to react to price calculation response
    effect(() => {
      this.isCalculatingPriceLoading.set(this._calculatePriceFacade.isCalculatingPrice());

      if (!this._calculatePriceFacade.isCalculatingPrice()) {
        const response = this._calculatePriceFacade.calculatedPriceResponse();

        if (this._calculatePriceFacade.calculationSuccess() && response?.data?.payments) {
          this.dataSummary.update(summary => ({
            ...summary,
            reservationsSummary: response.data!.payments,
            paymentType: this.selectedMethod()
          }));
          this.currentStep.set(PaymentFlowStep.VIEW_SUMMARY);
          Logger.debug(
            "PaymentFlowService: dataSummary updated with calculated price:",
            this.dataSummary().reservationsSummary
          );
        } else if (this._calculatePriceFacade.calculationError()) {
          Logger.error(
            "PaymentFlowService: Price calculation error:",
            this._calculatePriceFacade.calculationError()
          );
          this.dataSummary.update(summary => ({
            ...summary,
            reservationsSummary: null
          }));
        }
      }
    });
  }

  setCurrentStep(step: PaymentFlowStep): void {
    this.currentStep.set(step);
  }

  setSelectedMethod(method: IPaymentMethod): void {
    this.selectedMethod.set(method);
    this.dataSummary.update(summary => ({ ...summary, paymentType: method }));
    Logger.debug("PaymentFlowService: Selected method updated:", method);
  }

  setDataSummaryItem(item: any): void {
    this.dataSummary.update(summary => ({ ...summary, item }));
  }

  setCoupon(code: string): void {
    this.coupon.set(code);
    Logger.debug("PaymentFlowService: Coupon set:", code);
  }

  calculatePrice(method: IPaymentMethod, data: any | undefined, type: string): void {
    Logger.debug("PaymentFlowService: Proceeding with method:", method);
    Logger.debug("PaymentFlowService: Proceeding with data:", data);
    Logger.debug("PaymentFlowService: Proceeding with type:", type);

    if (!method) {
      Logger.warn("PaymentFlowService: Proceeding with method, method is missing.");
      this.isCalculatingPriceLoading.set(false);
      return;
    }

    let payload: ICalculateReservationPriceRequestDto = { payment_id: method.id };

    // attach coupon if exists
    if (this.coupon()) {
      payload.coupon = this.coupon();
      Logger.debug("PaymentFlowService: Coupon added to payload:", this.coupon());
    }

    if (type === TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE && data?.item?.id) {
      payload.programme_id = data.item.id;
    } else if (type === SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES && data?.item?.id) {
      payload.seminar_id = data.item.id;
    } else if (data?.is_emergency && type === UrgentAppointmentRoutesEnum.URGENT_APPOINTMENT_MAIN_PAGE) {
      payload.is_emergency = data.is_emergency ? 1 : 0;
      payload.specialist_id = data.item?.AppointmentData?.AppointmentData?.Speciality;
      payload.duration_id = data.item?.AppointmentData?.AppointmentData?.Duration;
      Logger.debug("PaymentFlowService: Emergency Appointment => Payload: ", payload);
    } else if (type === "normal") {
      payload.duration_id = data?.item?.AppointmentData?.AppointmentData?.duration_id ?? null;
      payload.doctor_id =
        (data?.item?.AppointmentData?.AppointmentData?.doctor_id ||
          data?.item?.AppointmentData?.doctor_id) ?? null;
      if (data?.item?.AppointmentData?.package_id) {
        payload.package_id = data?.item?.AppointmentData?.package_id ?? null;
      }
      Logger.debug("PaymentFlowService: Normal Packages Appointment => Payload: ", payload);
    } else {
      Logger.warn("PaymentFlowService: No valid item ID or emergency flag for price calculation.");
      this.isCalculatingPriceLoading.set(false);
      return;
    }

    this._calculatePriceFacade.calculateReservationPrice(payload);
  }

  resetFlow(): void {
    this.dataSummary.set({
      paymentType: null,
      reservationsSummary: null,
      item: undefined
    });
    this.selectedMethod.set(null);
    this.coupon.set(null);
    this.currentStep.set(PaymentFlowStep.SELECT_METHOD);
    this._calculatePriceFacade.resetState();
    Logger.debug("PaymentFlowService: Flow state reset.");
  }
}
