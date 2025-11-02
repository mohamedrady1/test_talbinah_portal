import { Component, computed, EnvironmentInjector, EventEmitter, Input, Output, inject, effect, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { CardType, FirestoreService, htmlToPlainText, LanguageService, Logger, ReservationModel, StorageService } from '../../../../common';
import { ReservationHomeworkFacade } from '../../../appointments/services/reservation-homework.facade';
import { IArticle } from '../../dtos';
import { ModalService, StorageKeys } from '../../../../shared';
import { ArticleDetailsComponent } from '../article-details';
import { ToggleFavoriteArticleFacade } from '../../services';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { RoleGuardService } from '../../../authentication';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    LazyLoadImageDirective,
  ],
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleCardComponent {
  private readonly injector = inject(EnvironmentInjector);

  @Input() isTask!: { status: boolean } | null;
  @Input() messageRef!: any;
  @Input() reservationModel!: ReservationModel | null;
  @Input() review!: number | any;
  @Input() assignment_id!: number | null;
  @Input() reservation_id!: number | null;
  @Input() hideFavouriteAction!: boolean | null;
  @Input() hideDescription!: boolean | null;
  @Input() allowShortTexts!: boolean | null;
  @Input() hideButtonAction!: boolean | null;

  protected readonly toggleFavoriteArticleFacade = inject(ToggleFavoriteArticleFacade);
  protected readonly languageService = inject(LanguageService);
  protected readonly currentLang = this.languageService.getCurrentLanguage();
  private readonly modalService = inject(ModalService);
  private readonly firestoreService = inject(FirestoreService);
  private readonly reservationHomeworkFacade = inject(ReservationHomeworkFacade);
  protected readonly cardTypes = CardType;

  @Input() item!: IArticle | any;
  @Input() type: CardType = CardType.SUMMARY;

  @Output() favouriteToggled = new EventEmitter<IArticle>();
  @Output() openPopupAction = new EventEmitter<void>();
  @Output() reservationSelected = new EventEmitter<ReservationModel>();

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Computed Signals -----
  public readonly isLoggedIn = computed(() => {
    if (!this.isBrowser) return false;
    const token = this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null;
    return !!token;
  });

  readonly isDetailsView = computed(() => this.type === this.cardTypes.DETAILS);
  protected description = '';

  protected isToggleLoading = computed(() => {
    return this.item && this.toggleFavoriteArticleFacade.loadingArticleIds().has(this.item.id);
  });

  protected handleFavouriteToggle(event: Event): void {
    event.stopPropagation();

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    if (!this.item || this.isToggleLoading()) {
      Logger.debug('Attempted to toggle favorite on invalid item or while already loading.');
      return;
    }

    Logger.debug('Toggling favorite status for article ID:', this.item.id);

    this.toggleFavoriteArticleFacade.toggleArticleFavorite(this.item.id)
      .subscribe({
        next: () => {
          Logger.debug(`Favorite toggle for article ${this.item.id} request completed.`);
          this.favouriteToggled.emit(this.item);
          this.item.is_bookmark = !this.item.is_bookmark;
        },
        error: () => {
          Logger.error(`Favorite toggle for article ${this.item.id} failed, reverting UI.`);
        }
      });
  }

  protected async cardClicked(): Promise<void> {
    const assignmentId = this.assignment_id;

    if (assignmentId && this.reservationModel && this.reservationModel.user?.id && this.review !== 1) {
      this.firestoreService.markHomeworkChatMeetingMessageAsOpened(this.reservationModel, assignmentId);
    }

    if (this.messageRef && this.reservationModel && this.messageRef.isMessageOpened !== '1') {
      Logger.debug('Marking message as opened:', { messageId: this.messageRef.id, reservation: this.reservationModel });
      this.firestoreService.markChatMeetingMessageAsOpened(this.reservationModel, this.messageRef.id);
    }

    this.openArticlePopup();
    this.openPopupAction.emit();
    if (this.reservationModel) {
      this.reservationSelected.emit(this.reservationModel);
    }
  }

  protected openArticlePopup(): void {
    if (this.item) {
      this.modalService.open(ArticleDetailsComponent, {
        inputs: {
          image: 'images/articles/calender-2.png',
          title: 'home_card_articles_title',
          subtitle: 'articles_page_subtitle',
          data: {
            article: this.item
          }
        },
        outputs: {
          closed: (data: any): void => {
            Logger.debug('Modal closed with data:', data);
          }
        },
        width: '70%',
        minHeight: '60%',
        maxHeight: '70%',
      });
    }
  }

  ngOnInit(): void {
    if (this.item && this.item.description) {
      this.description = htmlToPlainText(this.item.description, this.injector);
    }
  }

  constructor() {
    effect(() => {
      const lastToggledId = this.toggleFavoriteArticleFacade.lastToggledArticleId();
      if (lastToggledId === this.item?.id) {
        if (this.toggleFavoriteArticleFacade.lastToggleSuccess()) {
          Logger.debug(`Favorite toggle for article ${this.item?.id} successful (effect reaction).`);
        }
        if (this.toggleFavoriteArticleFacade.lastToggleError()) {
          Logger.error(`Favorite toggle for article ${this.item?.id} failed (effect reaction). Error:`,
            this.toggleFavoriteArticleFacade.lastToggleError());
        }
      }
    });
  }

  protected logCheckboxState(event: Event): void {
    event.stopPropagation();
    Logger.debug('ArticleCardComponent => isTask: ', { isTask: this.isTask, item: this.item });
  }
}
