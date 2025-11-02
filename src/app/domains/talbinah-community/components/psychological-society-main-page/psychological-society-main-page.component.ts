import {
  Component,
  computed,
  inject,
  Input,
  signal,
  OnInit,
  effect,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CardType, Logger, StorageService } from '../../../../common';
import {
  IUserIdentifyProfileData,
  ICreatePostResponseDto,
  IUpdateUserIdentifyProfileResponseDto,
  IPost,
} from '../../dtos';
import { ModalService, PaginationListingComponent, PaginationConfig, StorageKeys } from '../../../../shared';
import {
  HeaderConfig,
  NotificationsEmptyState,
  NotificationsHeaderConfig,
  PostsEmptyState,
  getCardsError,
  getNotificationsError,
} from '../../configs';
import { TalbinahCommunityHeaderConfig } from '../../constants';
import { MoodStatisticsConfig, ITab } from '../../models/index';
import { RefreshService } from '../../services';
import { PsychologicalPostsFacade } from '../../services/psychological-posts.facade';
import { PostInterestsFacade } from '../../services/post-interests.facade';
import { CommunityNotificationsFacade } from '../../services/community-notifications.facade';
import { CreatePsychologicalSocietyPostComponent } from '../create-psychological-society-post';
import { UpdatePsychologicalSocietyComponent } from '../update-psychological-society';
import { SocietyNotificationsComponent } from '../society-notifications';
import { MyPsychologicalSocietyNotificationCardComponent } from '../my-psychological-society-notification-card';
import { MyPsychologicalSocietyInformationCardComponent } from '../my-psychological-society-information-card';
import { PsychologicalSocietyCardComponent } from '../psychological-society-card';
import { NeedSupportCardComponent } from '../need-support-card';
import { TabSwitcherComponent } from '../tab-switcher';
import { CommentBoxComponent } from "../comment-box/comment-box.component";
import { PsychologicalSocietyCardShemmerComponent } from '../psychological-society-card-shemmer';
import { EmptyStateComponent, ErrorStateComponent } from '../../../../shared';
import { NotificationSkeletonComponent } from '../notification-skeleton';
import { UserIdentityStore } from '../../routes/user-identity.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { RoleGuardService, UserContextService } from '../../../authentication';

@Component({
  selector: 'app-psychological-society-main-page',
  standalone: true,
  imports: [
    CommonModule,
    MyPsychologicalSocietyNotificationCardComponent,
    MyPsychologicalSocietyInformationCardComponent,
    PsychologicalSocietyCardComponent,
    NeedSupportCardComponent,
    TabSwitcherComponent,
    TranslateModule,
    CommentBoxComponent,
    PsychologicalSocietyCardShemmerComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    NotificationSkeletonComponent,
  ],
  templateUrl: './psychological-society-main-page.component.html',
  styleUrls: ['./psychological-society-main-page.component.scss']
})
export class PsychologicalSocietyMainPageComponent implements OnInit, OnDestroy {
  @Input() userIdentityProfileData = signal<IUserIdentifyProfileData | null>(null);
  @Output() userIdentityUpdated = new EventEmitter<IUserIdentifyProfileData>();

  private readonly modalService = inject(ModalService);
  private readonly refreshService = inject(RefreshService);

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _UserContextService = inject(UserContextService);

  // ----- Auth / Guest Signals -----
  private readonly token = signal<string | null>(
    this.isBrowser ? (this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null) : null
  );

  // ----- Auth / Guest Computed -----
  protected readonly isLoggedIn = computed(() => !!this.token());

  protected readonly psychologicalPostsFacade = inject(PsychologicalPostsFacade);
  protected readonly postInterestsFacade = inject(PostInterestsFacade);
  protected readonly communityNotificationsFacade = inject(CommunityNotificationsFacade);
  protected readonly userIdentityStore = inject(UserIdentityStore);

  cardType = CardType;
  @Input() readonlyOnClick = signal<boolean>(true);
  @Input() placeholderHeader = signal<string>('talbinahCommunity.commentInputPlaceholderHeader');

  protected moodStatistics: MoodStatisticsConfig = { number: 30, mood: { id: 2, title: 'سعيد' }, count: 20 };

  readonly allPostsList = this.psychologicalPostsFacade.allPostsList;
  readonly isLoadingPosts = this.psychologicalPostsFacade.isLoadingPosts;
  readonly isLoadingMorePosts = this.psychologicalPostsFacade.isLoadingMorePosts;
  readonly errorMessagePosts = this.psychologicalPostsFacade.errorMessagePosts;
  readonly statusPosts = this.psychologicalPostsFacade.statusPosts;
  readonly totalPostsItems = this.psychologicalPostsFacade.totalPostsItems;
  readonly isLoadingPostsFilter = this.psychologicalPostsFacade.isLoadingPostsFilter;
  readonly hasMorePostsToLoad = computed(() => this.psychologicalPostsFacade.allPostsList().length < this.psychologicalPostsFacade.totalPostsItems());
  readonly isLoadingDeletePost = this.psychologicalPostsFacade.isLoadingDeletePost;

  readonly postInterests = this.postInterestsFacade.postInterests;
  readonly isLoadingPostInterests = this.postInterestsFacade.isLoadingPostInterests;
  readonly errorMessagePostInterests = this.postInterestsFacade.errorMessagePostInterests;
  readonly tabs = this.postInterestsFacade.tabs;

  readonly notificationsList = this.communityNotificationsFacade.notifications;
  readonly isLoadingNotifications = this.communityNotificationsFacade.isLoading;
  readonly errorMessageNotifications = this.communityNotificationsFacade.errorMessage;
  readonly notificationsStatus = this.communityNotificationsFacade.status;

  readonly isLoadingUserIdentity = this.userIdentityStore.isLoading;
  readonly errorMessageUserIdentity = this.userIdentityStore.error;
  readonly isUserIdentityProfile = this.userIdentityStore.isProfileLoaded;
  readonly userIdentityProfileDataSignal = this.userIdentityStore.profile;

  readonly postsPaginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this.psychologicalPostsFacade.currentPostsPage(),
    totalPages: this.psychologicalPostsFacade.totalPagesPosts(),
    onPageChange: this.handlePostsPageChange.bind(this)
  }));

  protected showAll = signal(false);
  readonly selectedTab = signal<ITab | null>({ id: 0, title: 'general.all' } as ITab);

  protected readonly postsEmptyState = PostsEmptyState;
  protected readonly postsErrorState = getCardsError(() => this.psychologicalPostsFacade.fetchPosts());
  protected readonly notificationsEmptyState = NotificationsEmptyState;
  protected readonly notificationsErrorState = getNotificationsError(() => this.communityNotificationsFacade.fetchAll());

  @ViewChild('endOfAsidesElement') endOfAsidesElement!: ElementRef;
  @ViewChild('loadMoreContainer') loadMoreContainer!: ElementRef;
  private sidebarObserver?: IntersectionObserver;
  private endOfAsidesObserver?: IntersectionObserver;
  private loadMoreObserver?: IntersectionObserver;
  private refreshSub?: Subscription;
  private loginStatusSub?: Subscription;

  constructor() {
    effect(() => {
      Logger.debug('Main Page => User Identity Profile Data (effect): ', this.userIdentityProfileDataSignal());
    });

    effect(() => {
      Logger.debug('Main Page => Notifications List (effect): ', this.notificationsList());
    });

    effect(() => {
      const allTabs = this.tabs();
      if (allTabs.length > 0 && !this.selectedTab()) {
        this.selectedTab.set(allTabs[0]);
      }
    });
  }

  ngOnInit(): void {
    Logger.debug('Main Page => User Identity Profile Data (onInit): ', this.userIdentityProfileDataSignal());
    this.refreshLoginStatus();

    if (this.isLoggedIn()) {
      this.userIdentityStore.fetch();
      this.communityNotificationsFacade.fetchAll();
    }
    this.psychologicalPostsFacade.fetchPosts();
    this.postInterestsFacade.fetchPostInterests();

    this.refreshSub = this.refreshService.refreshTrigger$.subscribe((shouldRefresh: boolean) => {
      if (shouldRefresh) {
        this.communityNotificationsFacade.fetchAll(undefined, undefined, undefined, undefined, true);
      }
    });

    // Listen for login/logout changes
    this.setUpLoginStatusListener();

    if (this.isBrowser) {
      setTimeout(() => {
        if (this.endOfAsidesElement) this.setupEndOfAsidesIntersectionObserver();
        if (this.loadMoreContainer) this.setupLoadMoreIntersectionObserver();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.sidebarObserver?.disconnect();
    this.endOfAsidesObserver?.disconnect();
    this.loadMoreObserver?.disconnect();
    this.refreshSub?.unsubscribe();
    this.loginStatusSub?.unsubscribe();
    try { this.psychologicalPostsFacade.resetState(); } catch (e) { Logger.warn('Failed to reset facade on destroy', e); }
  }

  private setupEndOfAsidesIntersectionObserver(): void {
    this.endOfAsidesObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) Logger.debug('Reached the end of asides (#endOfAsidesElement) - element is now visible!');
      });
    }, { root: null, rootMargin: '0px', threshold: 0 });
    this.endOfAsidesObserver.observe(this.endOfAsidesElement.nativeElement);
  }

  private setupLoadMoreIntersectionObserver(): void {
    this.loadMoreObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) Logger.debug('تم التمرير وظهر زر "تحميل المزيد".');
      });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });
    this.loadMoreObserver.observe(this.loadMoreContainer.nativeElement);
  }

  protected onCommentSubmit(comment: string): void {
    Logger.debug('User comment:', comment);
  }

  protected openAddEditPostPopup(postItem?: IPost): void {

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
    }

    this.modalService.open(CreatePsychologicalSocietyPostComponent, {
      inputs: {
        ...HeaderConfig,
        data: { interests: this.tabs(), userIdentityProfileData: this.userIdentityProfileDataSignal(), itemToEdit: postItem }
      },
      outputs: {
        closed: (response: ICreatePostResponseDto) => {
          if (response?.status && response.data) {
            this.psychologicalPostsFacade.resetPagination();
            this.psychologicalPostsFacade.fetchPosts(true, false);
          }
        }
      },
      width: '60%',
      minHeight: '20rem',
      maxHeight: '70rem',
      isPhoneFromDown: true,
    });
  }

  protected openEditProfilePopup(): void {
    this.modalService.open(UpdatePsychologicalSocietyComponent, {
      inputs: { ...TalbinahCommunityHeaderConfig, data: { interests: this.tabs(), userIdentityProfileData: this.userIdentityProfileDataSignal() } },
      outputs: {
        closed: (response: IUpdateUserIdentifyProfileResponseDto) => {
          if (response.status && response.data) {
            this.userIdentityStore.updateProfileData(response.data);
            this.userIdentityUpdated.emit(response.data);
          }
        }
      },
      width: '60%'
    });
  }

  protected onTabInterestSelected(tab: ITab): void {
    this.selectedTab.set(tab);
    Logger.debug('Selected Post Category Tab: ', tab);
    this.psychologicalPostsFacade.setInterestFilterAndFetch(tab.id === 0 ? undefined : Number(tab.id));
  }

  protected handlePostsPageChange(page: number): void {
    this.psychologicalPostsFacade.setCurrentPageAndFetch(page);
  }

  protected loadMore(): void {
    this.psychologicalPostsFacade.loadMorePosts();
  }

  protected showAllNotifications(): void {
    this.modalService.open(SocietyNotificationsComponent, {
      inputs: { ...NotificationsHeaderConfig, data: { notificationsList: this.notificationsList() } },
      width: '70%'
    });
  }

  protected handleCommentChange(item: any): void {
    Logger.debug('Main Page => Comment received from card:', item);
  }

  protected editPostDetails(data: any): void {
    Logger.debug('Main Page => Item to edit at card: ', data);
    this.openAddEditPostPopup(data);
  }

  protected deletePost(item: IPost): void {
    this.psychologicalPostsFacade.deletePost(item);
    this.communityNotificationsFacade.fetchAll();
  }

  protected fetchUserIdentifyProfile(): void {
    this.userIdentityStore.fetch();
  }

  /** Refresh login status from storage */
  protected refreshLoginStatus(): void {
    if (this.isBrowser) {
      const newToken = this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null;
      this.token.set(newToken);
      Logger.debug('PsychologicalSocietyMainPageComponent: Login status refreshed - isLoggedIn:', !!newToken);
    }
  }

  /** Set up listener to monitor login/logout changes */
  private setUpLoginStatusListener(): void {
    this.loginStatusSub = this._UserContextService.recallUserDataViewed.subscribe((emitted: boolean) => {
      Logger.debug('PsychologicalSocietyMainPageComponent: Login status change detected');
      this.refreshLoginStatus();

      // Reset relevant data when user logs out
      if (!this.isLoggedIn()) {
        Logger.debug('PsychologicalSocietyMainPageComponent: User logged out, resetting community data');
        this.userIdentityStore.clear();
        this.communityNotificationsFacade.resetState();
      } else {
        Logger.debug('PsychologicalSocietyMainPageComponent: User logged in, fetching community data');
        this.userIdentityStore.fetch();
        this.communityNotificationsFacade.fetchAll();
      }
    });
  }
}
