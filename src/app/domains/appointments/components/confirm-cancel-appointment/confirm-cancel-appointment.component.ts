import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, OnInit, effect } from '@angular/core';
import { ICalcReservationCancelPriceData, ICancelReservationRequestDto, ICancelReservationResponseDto } from '../../dtos';
import { ICancelAppointmentSubmissionData } from '../cancel-appointment';
import { CalcReservationCancelPriceFacade, CancelReservationFacade, ReservationsListFacade } from '../../services';
import { IGlobalReservationModel } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { Logger } from '../../../../common';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-confirm-cancel-appointment',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './confirm-cancel-appointment.component.html',
  styleUrls: ['./confirm-cancel-appointment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmCancelAppointmentComponent implements OnInit {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input() public item?: IGlobalReservationModel;

  @Output() public closed: EventEmitter<{ status?: boolean, response: ICalcReservationCancelPriceData | null } | null> = new EventEmitter<{ status?: boolean, response: ICalcReservationCancelPriceData | null } | null>();

  public readonly calcPriceFacade = inject(CalcReservationCancelPriceFacade);
  constructor() {
    // Effect to react to cancellation success and close the modal
    effect(() => {
      // Check if cancellation was successful AND the cancelling process has finished
      if (this.calcPriceFacade.calcSuccess() && !this.calcPriceFacade.isCalculating()) {
        Logger.debug('ConfirmCancelAppointmentComponent => Cancellation Price successful, emitting closed event with form data.');
      }
      // You could also add a check for cancelError() here to handle closing on error
      else if (this.calcPriceFacade.calcError() && !this.calcPriceFacade.isCalculating()) {
        Logger.error('ConfirmCancelAppointmentComponent => Cancellation Price failed, closing modal.');
      }
    });
  }

  ngOnInit(): void {
    Logger.debug('ConfirmCancelAppointmentComponent initialized with data:', {
      item: this.item
    });
    // Optionally reset state on init if component is reused
    this.calcPriceFacade.resetState();
    this.calcPriceFacade.calcPrice(this.item?.id ?? 0);
  }

  protected onConfirmCancelAppointment(): void {
    console.log('onConfirmCancelAppointment', this.calcPriceFacade.isCalculating(), this.calcPriceFacade.calcSuccess(), this.calcPriceFacade.calculationResult());
    if (!this.calcPriceFacade.isCalculating() && this.calcPriceFacade.calcSuccess() && this.calcPriceFacade.calculationResult()) {
      this.closed.emit({
        status: true,
        response: this.calcPriceFacade.calculationResult()
      });
    }
  }

  protected onCancel(): void {
    this.closed.emit(null);
  }
}
