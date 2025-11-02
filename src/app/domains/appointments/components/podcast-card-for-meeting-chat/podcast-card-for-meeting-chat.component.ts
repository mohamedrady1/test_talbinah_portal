import {
  ChangeDetectionStrategy,
  EventEmitter,
  Component,
  Input,
  Output,
  inject,
  signal,
  computed
} from '@angular/core';
import { PodcastDetailsComponent, PodcastDetailsHeaderConfig, PodcastsListFacade, ToggleFavoritePodcastFacade } from '../../../podcasts';
import { LocalizationService, ModalService } from '../../../../shared';
import { FirestoreService, IGlobalPodcastItemModel, Logger, ReservationModel } from '../../../../common';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ReservationHomeworkFacade } from '../../services';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-podcast-card-for-meeting-chat',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    
  ],
  templateUrl: './podcast-card-for-meeting-chat.component.html',
  styleUrls: ['./podcast-card-for-meeting-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PodcastCardForMeetingChatComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  @Input({ required: true }) item!: IGlobalPodcastItemModel | null;

  @Input() isTask!: { status: boolean } | null;
  @Input() hideFavouriteAction!: boolean | null;
  @Input() messageRef!: any;
  @Input() review!: number | any;
  @Input() reservationModel!: ReservationModel;
  @Input() reservation_id!: number | null;
  @Input() assignment_id!: number | null;
  @Input() hideDescription!: boolean | null;
  @Input() preventDetailsModal!: boolean | null;
  @Input() actionNotWorking!: boolean | null;

  //
  @Input() allowShortTexts!: boolean | null;
  @Input() hideButtonAction!: boolean | null;


  @Output() cardClicked = new EventEmitter<IGlobalPodcastItemModel>();

  private readonly localizationService = inject(LocalizationService);
  readonly currentLang = this.localizationService.getCurrentLanguage();

  // Dependencies
  private readonly _PodcastsListFacade = inject(PodcastsListFacade);
  private readonly _modalService = inject(ModalService);
  private readonly _firestoreService = inject(FirestoreService);
  private readonly _reservationHomeworkFacade = inject(ReservationHomeworkFacade);
  @Input() externalFavouriteToggled = signal<IGlobalPodcastItemModel | null>(null);
  @Output() public favouriteToggled = new EventEmitter<IGlobalPodcastItemModel>();
  protected readonly _ToggleFavoritePodcastFacade = inject(ToggleFavoritePodcastFacade);
  protected isToggleLoading = computed(() => {
    return this.item && this._ToggleFavoritePodcastFacade.loadingPodcastIds().has(this.item.id);
  });

  protected onCardClicked(podcast: IGlobalPodcastItemModel): void {
    this.cardClicked.emit(podcast);
    Logger.debug('onCardClicked => preventDetailsModal : ', this.preventDetailsModal);
    if (!this.preventDetailsModal && !this.actionNotWorking) {
      this.openPodcastDetailsModal();
      if (this.messageRef?.id && this.reservationModel && this.messageRef.isMessageOpened !== '1') {
        this._firestoreService.markChatMeetingMessageAsOpened(this.reservationModel, this.messageRef.id);
        const assignmentId = Number(this.messageRef?.homeworkId);
        if (!Number.isNaN(assignmentId) && assignmentId > 0 && this.messageRef.isMessageOpened !== '1') {
        }
      }
      if (this.assignment_id && this.reservationModel && this.reservationModel.user?.id && this.review !== 1) {
        this._firestoreService.markHomeworkChatMeetingMessageAsOpened(this.reservationModel, this.assignment_id);
      }
      else {
        this.ClosePodcastAudioPlayer();
      }
    }
  }
  protected openPodcastDetailsModal(): void {
    let modalInputs: any = {};
    let modalOutputs: any = {};

    modalInputs = {
      ...PodcastDetailsHeaderConfig,
      item: this.item,
      review: this.review
    };
    modalOutputs = {
      closed: () => {
        Logger.debug('Podcast Details modal closed.');
      },
    };

    this._modalService.open(PodcastDetailsComponent, {
      inputs: modalInputs,
      outputs: modalOutputs,
      width: '70%',
      height: '78vh'
    });
  }

  protected OpenPodcastAudioPlayer(): void {
    if (this.actionNotWorking) {
      return;
    }
    this._PodcastsListFacade._openPodcastAudioPlayer$.next({
      isOpen: true,
      item: this.item,
    });
    if (this.messageRef?.id && this.reservationModel && this.messageRef.isMessageOpened !== '1') {
      this._firestoreService.markChatMeetingMessageAsOpened(this.reservationModel, this.messageRef.id);
      const assignmentId = Number(this.messageRef?.homeworkId);
      if (!Number.isNaN(assignmentId) && assignmentId > 0 && this.messageRef.isMessageOpened !== '1') {
      }
    }
    if (this.assignment_id && this.reservationModel && this.reservationModel.user?.id && this.review !== 1) {
      this._firestoreService.markHomeworkChatMeetingMessageAsOpened(this.reservationModel, this.assignment_id);
    }
  }

  protected ClosePodcastAudioPlayer(): void {
    this._PodcastsListFacade._openPodcastAudioPlayer$.next({
      isOpen: false,
      item: null
    });
  }

  protected handleFavouriteToggle(event: Event): void {
    event.stopPropagation();

    if (!this.item || this.isToggleLoading()) {
      Logger.debug('Attempted to toggle favorite on invalid item or while already loading.');
      return;
    }

    Logger.debug('Toggling favorite status for podcast ID:', this.item.id);
    console.log(this.review)
    this._ToggleFavoritePodcastFacade.togglePodcastFavorite(this.item.id)
      .subscribe({
        next: () => {
          Logger.debug(`Favorite toggle for podcast ${this.item?.id} request completed.`);
          this.favouriteToggled.emit(this.item!);
          this.item!.is_bookmarked = !this.item!.is_bookmarked;
        },
        error: () => {
          Logger.error(`Favorite toggle for podcast ${this.item?.id} failed, reverting UI.`);
        }
      });
  }

  protected logCheckboxState(event: Event): void {
    event.stopPropagation(); // Prevent the main button click
    Logger.debug('PodcastCardForMeetingChatComponent => isTask: ', { isTask: this.isTask, item: this.item });
  }
}

