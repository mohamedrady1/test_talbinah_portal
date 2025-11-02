import { ActionsDropdownMenuComponent, IActionDropdownMenuItem, LocalizationService, ModalService } from '../../../../shared';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { ConfirmCancelAppointmentComponent } from '../confirm-cancel-appointment';
import { APPOINTMENT_CATEGORIES, AppointmentsRoutesEnum } from '../../constants';
import { IAppointmentCategory, IGlobalReservationModel } from '../../models';
import { SessionDetailsModalComponent } from '../session-details-modal';
import { CardType, LanguageService, Logger } from '../../../../common';
import { ScheduleAppointmentComponent } from '../schedule-appointment';
import { ChatAppointmentMenuItemActionsConfig } from '../../configs';
import { CancelAppointmentComponent } from '../cancel-appointment';
import { ICalcReservationCancelPriceData } from '../../dtos';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { BookApoointmentPopupComponent } from '../../../book-appointment';
import { CancelReservationFacade } from '../../services';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    ActionsDropdownMenuComponent,
    TranslateApiPipe
  ],
  templateUrl: './appointment-card.component.html',
  styleUrls: ['./appointment-card.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppointmentCardComponent implements OnInit {
  /** Exposed CardType enum for template usage. */
  protected readonly cardTypes = CardType;

  private _ModalService = inject(ModalService);
  private readonly _router = inject(Router);
  private readonly _cancelFacade = inject(CancelReservationFacade);
  /** Injected LocalizationService for text translation. */
  private readonly _localizationService = inject(LocalizationService);
  protected readonly languageService = inject(LanguageService);
  private readonly _datePipe = inject(DatePipe); // Inject DatePipe

  /** Holds the current language string, initialized in ngOnInit. */
  protected currentLang: string = 'ar';

  /** The type of card to display, defaults to SUMMARY. */
  @Input({ required: false }) type!: CardType;
  @Input({ required: true }) item!: IGlobalReservationModel;
  @Input({ required: false }) hideStatus!: boolean;
  @Input({ required: false }) hideActions!: boolean;

  /** Emits when the card is clicked to open a popup or similar action. */
  @Output() public readonly cardClick: EventEmitter<void> = new EventEmitter<void>();

  /** Computed signal to determine if the current view is 'details'. */
  protected readonly isDetailsView = computed(() => this.type === this.cardTypes.DETAILS);

  // --- Configuration Data ---
  protected chatActionsMenuItems: IActionDropdownMenuItem[] = ChatAppointmentMenuItemActionsConfig;

  protected isToday: boolean = false;

  public ngOnInit(): void {
    this.currentLang = this._localizationService.getCurrentLanguage();
    // this.onCardClick();
    this.checkIfAppointmentIsToday();
  }

  private checkIfAppointmentIsToday(): void {
    if (!this.item || !this.item.date) {
      this.isToday = false;
      return;
    }

    const today = new Date();
    // Format today's date to YYYY-MM-DD
    const formattedToday = this._datePipe.transform(today, 'yyyy-MM-dd');

    // Assuming this.item.date is already in YYYY-MM-DD format from your API
    const appointmentDate = this.item.date;

    this.isToday = (formattedToday === appointmentDate);
    Logger.debug(`Appointment ${this.item.id} date: ${appointmentDate}, Today: ${formattedToday}, Is Today: ${this.isToday}`);
  }

  protected onCardClick(): void {
    // this.openActionModal(chatActionsMenuItems[0]);
    // return;
    // if (this.item.id !== 2815) return;
    this.cardClick.emit();
    this._ModalService.open(SessionDetailsModalComponent, {
      inputs: {
        image: 'images/home/icons/date.png',
        title: 'appointment_details',
        subtitle: 'appointments_list_page_subtitle',
        item: this.item
      },
      outputs: {
        closed: () => {
          console.log('The model is closed');
        }
      },
      width: '50%',
      height: '75%'
    });
  }

  protected getBadgeClass(status: number, isStart: number, isEnd: number | null): string {
    const category = APPOINTMENT_CATEGORIES.find((cat: IAppointmentCategory) => {
      // Special handling for cancelled status
      if (cat.status === 0 && status === 0) {
        return true;
      }
      // General match for other statuses
      return cat.status === status && cat.is_start === isStart && cat.is_end === isEnd;
    });
    return category?.badge_class ?? 'badge-secondary';
  }

  protected getStatusName(status: number, isStart: number, isEnd: number | null): string {
    const category = APPOINTMENT_CATEGORIES.find((cat: IAppointmentCategory) => {
      if (cat.status === 0 && status === 0) {
        return true;
      }
      return cat.status === status && cat.is_start === isStart && cat.is_end === isEnd;
    });

    let statusName: string = category ? this._localizationService.translateTextFromJson(category.name) : this._localizationService.translateTextFromJson('general.pending');

    // This logic might be specific to Arabic "ال" prefix.
    // Consider moving this translation-specific logic into the LocalizationService if it's broadly applicable.
    if (statusName.startsWith('ال')) {
      statusName = statusName.substring(2);
    }
    return statusName;
  }

  protected isMyType(type: string): boolean {
    return APPOINTMENT_CATEGORIES.some((cat: IAppointmentCategory) => {
      return cat.id === type &&
        this.item.is_start === cat.is_start &&
        this.item.is_end === cat.is_end &&
        this.item.status === cat.status;
    });
  }

  protected getFormattedDate(dateString: string, timeString: string | null = null, format: string): string | null {
    if (!dateString) {
      return null;
    }
    const dateTime = timeString ? `${dateString}T${timeString}` : dateString;
    return this._datePipe.transform(dateTime, format, undefined, this.currentLang);
  }

  protected onJoinAppointment(): void {
    // Logic for joining the appointment (e.g., navigating to a video call)
    Logger.debug('Join appointment clicked for:', this.item.id);
    this._router.navigate([AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE, AppointmentsRoutesEnum.APPOINTMENTS_SESSION, this.item.id]);
  }

  protected onImageError(event: Event, gender: number | null): void {
    const target = event.target as HTMLImageElement;
    target.src = gender === 1 ? 'images/not-found/no-woman-doctor.svg' : 'images/not-found/no-doctor.svg';
  }

  protected handleMenuItemClick(item: IActionDropdownMenuItem): void {
    Logger.debug('AppointmentCardComponent => handleMenuItemClick => Selected:', item);
    if (item.isOpenModal) {
      this.openActionModal(item);
    } else {
      Logger.info(`Action '${item.action}' clicked, but not configured to open a modal.`);
    }
  }

  protected openActionModal(item: IActionDropdownMenuItem): void {
    let componentToOpen: any;
    let modalInputs: any = {};
    let modalOutputs: any = {};
    let modalWidth: string = '40%'; // Default width
    let modalHeight!: string;

    switch (item.action) {
      case 'schedule-appointment':
        componentToOpen = ScheduleAppointmentComponent;
        modalInputs = {
          image: 'images/mentalHealthScale/icons/talbinah.png',
          title: 'reschedule_other_appointment',
          subtitle: 'reschedule_other_appointment_subtitle',
          item: this.item,
        };
        modalOutputs = {
          closed: () => Logger.debug('Schedule Appointment modal closed.'),
        };
        break;

      case 'cancel-appointment':
        componentToOpen = ConfirmCancelAppointmentComponent;
        modalInputs = {
          image: 'images/mentalHealthScale/icons/talbinah.png',
          title: 'appointment_canceled_confirm',
          subtitle: 'are_you_sure_you_want_to_cancel_this_appointment',
          item: this.item,
        };
        modalOutputs = {
          closed: (res: { status?: boolean, response: ICalcReservationCancelPriceData | null } | null) => {
            Logger.debug('Cancel Appointment modal closed.', res);
            if (res?.status) {
              Logger.info('Appointment cancelled successfully.');
              this.openCancelModal(this.item, res);
            } else {
              Logger.warn('Appointment cancellation was not successful.');
            }
          },
        };
        modalHeight = 'fit-content';
        break;

      default:
        Logger.warn(`No modal component defined for action: ${item.action}`);
        return;
    }


    this._ModalService.open(componentToOpen, {
      inputs: modalInputs,
      outputs: modalOutputs,
      width: modalWidth,
      height: modalHeight
    });
  }

  private openCancelModal(item: IGlobalReservationModel, responseCancel: { status?: boolean, response: ICalcReservationCancelPriceData | null } | null): void {
    let componentToOpen: any = CancelAppointmentComponent;
    let modalInputs: any = {};
    let modalOutputs: any = {};
    let modalWidth: string = '40%'; // Default width
    modalInputs = {
      image: 'images/mentalHealthScale/icons/talbinah.png',
      title: 'cancel_appointment',
      data: {
        item: item,
        responseCancel: responseCancel
      }
    };
    modalOutputs = {
      closed: () => {
        Logger.debug('Confirm Cancel Appointment modal closed.');
        setTimeout(() => {
          this._cancelFacade.resetCancelOperationState();
        }, 0);
      }
    };


    this._ModalService.open(componentToOpen, {
      inputs: modalInputs,
      outputs: modalOutputs,
      width: modalWidth,
    });
  }

  protected createNewReservation(): void {
    this._ModalService.open(BookApoointmentPopupComponent, {
      inputs: {
        image: 'images/home/icons/date.png',
        title: 'doctor_details',
        subtitle: 'book_appointment_modal_subtitle',
        item: this.item,
        doctorId: this.item?.doctor?.id
      },
      outputs: {
        closed: () => {
          console.log('The model is closed');
        }
      },
      width: '50%',
    });
  }
}
