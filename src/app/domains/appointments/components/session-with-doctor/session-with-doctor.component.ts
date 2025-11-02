import {
  Component, ChangeDetectionStrategy, inject, PLATFORM_ID, signal, effect,
  ViewChild, ElementRef, OnInit, OnDestroy, computed, HostListener
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import {
  ActionsDropdownMenuComponent, IActionDropdownMenuItem,
  ICallTypeSelectedEvent,
  ILayoutGridHeaderConfig, ModalService, SvgIconComponent,
  TooltipComponent, useTimeAgoRealtime, ErrorStateCardComponent
} from '../../../../shared';
import { LanguageService, Logger, Position, TriggerTypes } from '../../../../common';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { SessionWithDoctorHeaderComponent } from '../session-with-doctor-header';
import { ChatMeetingMessagesComponent } from '../chat-meeting-messages';
import { VoiceVideoAgoraChatComponent } from '../voice-video-agora-chat';
import { MeetingChatInputComponent } from '../meeting-chat-input';
import { ReferencedMessageComponent } from '../referenced-message';
import { CallTypeSelectorComponent } from '../call-type-selector';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import {
  CheckDoctorAtReservationFacade,
  ReservationDetailsFacade, SessionWithDoctorFacade
} from '../../services';
import { IBlockUserActionData, IMeetingChatItem } from '../../dtos';
import { FirestoreService } from '../../../../common/core/services/firestore.service';
import { ChatActionsMenuItemsConfig, SessionWithDoctorHeaderConfig, GetReservationDetails } from '../../configs';
import { SessionDetailsModalComponent } from '../session-details-modal';
import { SessionTasksModalComponent } from '../session-tasks-modal';
import { LeaveRatingModalComponent } from '../leave-rating-modal';
import { BlockDoctorModalComponent } from '../block-doctor-modal';
import { ReportIssueModalComponent } from '../report-issue-modal';

// Facades/Services
import { ChatMeetingMessagesSkeletonComponent } from "../chat-meeting-messages-skeleton";
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-session-with-doctor',
  standalone: true,
  imports: [
    AutoExactHeightDirective,
    TranslateModule,
    TooltipModule,
    CommonModule,
    SessionWithDoctorHeaderComponent,
    ActionsDropdownMenuComponent,
    ChatMeetingMessagesComponent,
    VoiceVideoAgoraChatComponent,
    MeetingChatInputComponent,
    ReferencedMessageComponent,
    CallTypeSelectorComponent,
    TooltipComponent,
    SvgIconComponent,
    ChatMeetingMessagesSkeletonComponent,
    ErrorStateCardComponent,
    TranslateApiPipe
  ],
  templateUrl: './session-with-doctor.component.html',
  styleUrls: ['./session-with-doctor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionWithDoctorComponent implements OnInit, OnDestroy {
  @ViewChild('card') cardRef!: ElementRef;
  @ViewChild(ChatMeetingMessagesComponent) private chatMessagesCmp?: ChatMeetingMessagesComponent;

  // --- Configuration Data ---
  protected chatActionsMenuItems: IActionDropdownMenuItem[] = ChatActionsMenuItemsConfig;
  readonly headerConfig: ILayoutGridHeaderConfig = SessionWithDoctorHeaderConfig;

  private readonly _modalService = inject(ModalService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _destroy$ = new Subject<void>();
  private readonly _mainFacade = inject(SessionWithDoctorFacade);
  protected readonly _reservationDetailsFacade = inject(ReservationDetailsFacade);
  protected readonly _firestore = inject(FirestoreService);
  private readonly _languageService = inject(LanguageService);

  readonly reservationId = signal<number | null>(null);

  readonly isFullscreen = signal<boolean>(false);
  readonly isChatPanelExpanded = signal<boolean>(true);
  readonly isChatPanelExpandedIconVisible = computed(
    () => !this.isChatPanelExpanded()
  );

  readonly replyingToMessageContent = signal<IMeetingChatItem | null>(null);

  readonly currentLang = this._languageService.getCurrentLanguage();
  readonly Position = Position;
  readonly Trigger = TriggerTypes;

  readonly connectionStatus = computed(() => 'offline');
  statusFillColor = 'ff000';

  protected readonly _CheckDoctorAtReservationFacade = inject(CheckDoctorAtReservationFacade);
  private hasLoggedDoctorCheck = false;

  // Error state config
  readonly reservationDetailsErrorState = GetReservationDetails(() => {
    const id = this.reservationId();
    if (id) {
      this._reservationDetailsFacade.fetchReservationDetails(id);
    }
  });

  constructor() {
    this._mainFacade.setSeoMeta();

    effect(() => {
      const reservation = this._reservationDetailsFacade.currentReservation();
      const errorMessage = this._reservationDetailsFacade.reservationFetchErrorMessage();
      if (!reservation && !this._reservationDetailsFacade.reservationFetchStatus() && errorMessage) {
        Logger.error('[SessionWithDoctor] Failed to load reservation:', errorMessage);
        // Update error state config with dynamic error message
        this.reservationDetailsErrorState.message = errorMessage;
      }
    });

    effect(() => {
      const response = this._CheckDoctorAtReservationFacade.response();
      const isChecking = this._CheckDoctorAtReservationFacade.isChecking();

      if (!isChecking && response && !this.hasLoggedDoctorCheck) {
        Logger.debug('[SessionWithDoctor] Doctor check response:', response);
        this.hasLoggedDoctorCheck = true;
        this.toggleChatPanelExpansion();
      }
    });
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.pipe(takeUntil(this._destroy$)).subscribe(paramMap => {
      const idParam = paramMap.get('id');
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.reservationId.set(id);
        this._reservationDetailsFacade.fetchReservationDetails(id);
        Logger.debug(`[SessionWithDoctorComponent] Reservation ID: ${id}`);
      } else {
        Logger.warn('[SessionWithDoctorComponent] Invalid or missing reservation ID');
        this.reservationId.set(null);
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._reservationDetailsFacade.resetReservationDetailsState();
  }

  protected handleReplyingMessageChange(item: IMeetingChatItem | null): void {
    this.replyingToMessageContent.set(item);
  }

  protected clearReply(): void {
    this.replyingToMessageContent.set(null);
  }

  protected toggleChatPanelExpansion(): void {
    this.isChatPanelExpanded.set(!this.isChatPanelExpanded());
    this._CheckDoctorAtReservationFacade.resetState();
    this.hasLoggedDoctorCheck = false;
    this.scheduleScrollToBottom();
  }

  protected toggleSessionFullscreen(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cardEl = this.cardRef.nativeElement;
      if (!document.fullscreenElement) {
        cardEl.requestFullscreen().then(() => this.isFullscreen.set(true));
      } else {
        document.exitFullscreen().then(() => this.isFullscreen.set(false));
      }
    }
  }

  protected returnItemTimeAgo(id: number, date: Date | string): string {
    const { value, unit } = useTimeAgoRealtime(id, date)();
    const rtf = new Intl.RelativeTimeFormat(this.currentLang || undefined, { numeric: 'auto' });
    return rtf.format(-value, unit);
  }

  protected navigateToHomePage(): void {
    this._mainFacade.goToHome();
  }

  /** Copy code to clipboard */
  protected copyToClipboard(): void {
    const code = this._reservationDetailsFacade.currentReservation()?.id ?? '';
    if (code) navigator.clipboard.writeText('' + code);
  }

  protected handleMenuItemClick(item: IActionDropdownMenuItem): void {
    Logger.debug('SessionWithDoctorComponent => handleMenuItemClick => Selected:', item);
    if (item.isOpenModal) {
      this.openActionModal(item);
    } else {
      Logger.info(`Action '${item.action}' clicked, but not configured to open a modal.`);
    }
  }

  private openActionModal(item: IActionDropdownMenuItem): void {
    let componentToOpen: any;
    let modalInputs: any = {};
    let modalOutputs: any = {};
    let modalWidth: string = '40%'; // Default width
    let minWidth: string = '50%';
    let maxWidth: string = '70%';
    let minHeight: string = '45%';
    let isPhoneFromDown: boolean = false;
    const currentReservationData = this._reservationDetailsFacade.currentReservation(); // Get the current reservation details from the facade

    switch (item.action) {
      case 'session-tasks':
        componentToOpen = SessionTasksModalComponent;
        modalInputs = {
          image: 'images/modals-icons/tasks.png',
          title: 'session_tasks',
          subtitle: 'session_tasks_modal_subtitle',
          doctor: currentReservationData?.doctor,
          session: currentReservationData,
          type: 'session'
        };
        modalOutputs = {
          closed: () => {
            Logger.debug('Session Tasks modal closed.');
          },
        };
        minWidth = '50%';
        maxWidth = '70%';
        break;

      case 'leave-rating':
        componentToOpen = LeaveRatingModalComponent;
        modalInputs = {
          image: 'images/mentalHealthScale/icons/talbinah.png',
          title: 'sessionWithDoctor.LeaveRatingModalTitle',
          subtitle: 'sessionWithDoctor.LeaveRatingModalSubtitle',
          doctor: currentReservationData?.doctor,
          session: currentReservationData,
          type: 'session'
        };
        modalOutputs = {
          closed: (res: any) => {
            Logger.debug('Leave Rating modal closed.', res);
            if (res?.status === 'success') {
              Logger.info('Rating submitted successfully!');
            }
          },
        };
        isPhoneFromDown = true;
        break;

      case 'block-doctor':
        componentToOpen = BlockDoctorModalComponent;
        modalInputs = {
          image: 'images/mentalHealthScale/icons/talbinah.png',
          title: 'sessionWithDoctor.BlockDoctorModalTitle',
          subtitle: 'sessionWithDoctor.BlockDoctorModalSubtitle',
          doctor: currentReservationData?.doctor,
          session: currentReservationData,
          type: 'session'
        };
        modalOutputs = {
          closed: (res: IBlockUserActionData | null) => {
            Logger.debug('Block Doctor modal closed.', res);
          }
        };
        modalWidth = '30%';
        isPhoneFromDown = true;
        break;

      case 'report-issue':
        componentToOpen = ReportIssueModalComponent;
        modalInputs = {
          image: 'images/mentalHealthScale/icons/talbinah.png',
          title: 'sessionWithDoctor.ReportIssueModalTitle',
          subtitle: 'sessionWithDoctor.ReportIssueModalSubtitle',
          doctor: currentReservationData?.doctor,
          session: currentReservationData,
          type: 'session'
        };
        modalOutputs = {
          closed: (res: any) => {
            Logger.debug('Report Issue modal closed.', res);
            if (res?.status === 'submitted') {
              Logger.info('Issue reported successfully.');
            }
          },
        };
        break;

      case 'session-details':
        componentToOpen = SessionDetailsModalComponent;
        modalInputs = {
          image: 'images/home/icons/date.png',
          title: 'appointment_details',
          subtitle: 'appointments_list_page_subtitle',
          sessionDetails: currentReservationData,
          item: currentReservationData
        };
        modalOutputs = {
          closed: () => {
            Logger.debug('Session Details modal closed.');
          },
        };
        break;

      default:
        Logger.warn(`No modal component defined for action: ${item.action}`);
        return;
    }

    this._modalService.open(componentToOpen, {
      inputs: modalInputs,
      outputs: modalOutputs,
      width: modalWidth,
      minWidth: minWidth,
      maxWidth: maxWidth,
      minHeight: minHeight,
      isPhoneFromDown: isPhoneFromDown
    });
  }

  protected handleCallTypeSelection(event: ICallTypeSelectedEvent): void {
    Logger.debug(`Parent Component: Received selected call type: ${event.type}`);
    if (!this.hasLoggedDoctorCheck) {
      this._CheckDoctorAtReservationFacade.checkDoctorAtReservation(this._reservationDetailsFacade.currentReservation()?.id || 0);
    } else {
      this.toggleChatPanelExpansion();
    }
    this.scrollRightPanelToBottom();
    this.scheduleScrollToBottom();
  }

  private scrollRightPanelToBottom(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = document.getElementById('right-panel-content');
    console.log('el', el);
    if (!el) return;
    try {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } catch {
      el.scrollTop = el.scrollHeight;
    }
  }

  private scheduleScrollToBottom(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => setTimeout(() => {
      this.chatMessagesCmp?.scrollToBottom?.();
      this.scrollRightPanelToBottom();
    }, 60));
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.scheduleScrollToBottom();
  }
}
