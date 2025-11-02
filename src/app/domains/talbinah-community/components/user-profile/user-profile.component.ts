import { Component, computed, effect, ElementRef, inject, Input, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { PageLayoutHeaderComponent } from "../../../../shared/components/page-layout-header/page-layout-header.component";
import { EmptyStateComponent, EmptyStateConfig, ErrorStateComponent, ILayoutGridHeaderConfig, LOCALIZATION_SERVICE, LocalizationService, MoodModalIntegrationService, ModalService, StorageKeys, ToastService } from '../../../../shared';
import { CommunityProfileHeaderConfig, TalbinahCommunityHeaderConfig, TalbinahCommunityRoutesEnum, TalbinahCommunityRouteData } from '../../constants';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ApiError, CardType, defaultPaginationParameters, handleApiErrors, handleApiErrorsMessage, IPaginationParameters, Logger, MetadataService, StorageService } from '../../../../common';
import { catchError, EMPTY, filter, finalize, Subscription, take, tap } from 'rxjs';
import { IAllPostsResponseDto, ICreatePostResponseDto, IDeletePostResponseDto, IPost, IPostInterest, IPostsInterestsListingResponseDto, IUpdateFollowResponseDto, IUserCommunityProfileResponseDto, IUserIdentifyProfileData, IUserIdentifyProfileResponseDto } from '../../dtos';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gender } from '../../../book-appointment';
import { MyPsychologicalSocietyInformationCardComponent } from "../my-psychological-society-information-card/my-psychological-society-information-card.component";
import { UpdatePsychologicalSocietyComponent } from '../update-psychological-society';
import { MyPsychologicalSocietyNotificationCardComponent } from "../my-psychological-society-notification-card/my-psychological-society-notification-card.component";
import { PsychologicalSocietyCardComponent } from "../psychological-society-card/psychological-society-card.component";
import { TalbinahCommunityApiClientProvider } from '../../clients';
import { CommentBoxComponent } from '../comment-box';
import { CreatePsychologicalSocietyPostComponent } from '../create-psychological-society-post';
import { getCardsError, HeaderConfig } from '../../configs';
import { PsychologicalSocietyCardShemmerComponent } from '../psychological-society-card-shemmer';
import { TabsShemmerComponent } from '../tabs-shemmer';
import { CommentBoxSkeletonComponent } from '../comment-box-skeleton';
import { TabSwitcherComponent } from '../tab-switcher';
import { UserIdentityStore } from '../../routes/user-identity.service';
import { ITab } from '../../models';
import { MySavedPostsComponent } from '../my-saved-posts';
import { UsersFollowComponent } from '../users-follow';
import { ProfileTriggerService, RefreshUserPostsService } from '../../services';
import { SiteHeaderComponent } from '../../../header';

// User profile interface (likely for display purposes, not direct API DTO)
import { RoleGuardService, UserContextService } from '../../../authentication';
import { MainPageRoutesEnum } from '../../../main-page';
import { TranslationsFacade } from '../../../../common/core/translations/services';
export interface UserProfile {
  name: string;
  followersCount: number;
  userImage: string;
  isFollowing: boolean;
  gender: number;
}

// Define state interface for user community profile data
interface UserCommunityProfileState {
  userCommunityProfileResponse: IUserCommunityProfileResponseDto | null;
  isLoading: boolean;
  isLoadingFilter: boolean; // For filtering operations (e.g., by tab/interest)
  errorMessage: string;
}

// State for all posts
interface PsychologicalPostsState {
  allPostsResponse: IAllPostsResponseDto | null;
  isLoading: boolean;
  isLoadingFilter: boolean;
  errorMessage: string;
  status: boolean | null; // Added status property
  totalItems: number;
}

// State for Post Interests
interface PostInterestsListState {
  intrestsResponse: IPostsInterestsListingResponseDto | null;
  isLoading: boolean;
  errorMessage: string;
}

// State for user identity profile data
interface UserIdentityProfileState {
  profileResponse: IUserIdentifyProfileResponseDto | null;
  isLoading: boolean;
  errorMessage: string;
}
const PostsEmptyState: EmptyStateConfig = {
  imageUrl: 'images/not-found/community/no-data-icon.svg',
  title: 'no_posts_found_for_this_interest',
  gap: '1rem',
};
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    SiteHeaderComponent,
    PageLayoutHeaderComponent,
    AutoExactHeightDirective,
    TranslateModule,
    PsychologicalSocietyCardComponent,
    CommentBoxComponent,
    TabSwitcherComponent,
    CommentBoxSkeletonComponent,
    TabsShemmerComponent,
    PsychologicalSocietyCardShemmerComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements AfterViewInit {
  // Input signals for component configuration
  @Input() userIdentityProfileData = signal<any | null>(null);
  @Input() readonlyOnClick = signal<boolean>(true); // SSR-safe signal input
  @Input({ required: true }) config!: IPost; // This seems unusual for UserProfileComponent, typically used by a parent component passing post data

  // Signals for managing user profile data
  userProfileSignal: WritableSignal<IUserIdentifyProfileData | null> = signal(null);

  // Injected services
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ToastService = inject(ToastService);
  protected readonly _UserIdentityStore = inject(UserIdentityStore);
  private readonly modalService = inject(ModalService);
  private readonly _LocalizationService = inject(LocalizationService);
  private readonly roleGuard = inject(RoleGuardService);
  private readonly _PostsApiClientProvider = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly _ProfileTriggerService = inject(ProfileTriggerService);
  private readonly _RefreshUserPostsService = inject(RefreshUserPostsService);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);
  private readonly seo = inject(MetadataService);
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  // Component state signals
  private readonly userCommunityProfileId = signal<number | null>(null); // ID of the user whose profile is being viewed
  protected readonly isMyCommunityProfile = signal<boolean>(false); // True if the viewed profile belongs to the current user
  protected readonly disableHeaderLoading = signal<boolean>(false); // Flag to control header loading state
  protected readonly disableLoading = signal<boolean>(false); // Flag to control general loading state
  protected readonly isUserProfile = signal<boolean>(true); // Indicates this is a user profile page
  private readonly postToDelete = signal<IPost | null>(null); // Stores post marked for deletion

  protected followError = signal<ApiError | null>(null); // Stores API error for follow/unfollow operation
  protected isLoadingFollow = signal<boolean>(false); // Loading state for follow/unfollow
  protected _isFollowed = signal<boolean>(false); // Local state for follow status
  readonly isFollowed = computed(() => this._isFollowed()); // Computed property for follow status

  // Updated postsEmptyState and postsErrorState to accept parameters
  protected readonly postsEmptyState = PostsEmptyState;
  protected readonly postsErrorState = getCardsError(() => {
    // When the retry function is called, it will use the userId and interestId
    // that were provided when postsErrorState was initially defined (or evaluated).
    this.fetchPosts(true, this.userCommunityProfileId() ?? undefined, this.selectedTab()?.id !== undefined ? Number(this.selectedTab()?.id) : undefined); // Pass true for filter to show loading filter state on retry
  });

  // Tabs and pagination for posts
  readonly tabs = signal<ITab[]>([]); // Dynamic tabs based on post interests
  readonly selectedTab = signal<ITab | null>(null); // Currently selected tab
  private postsPaginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 5 }; // Pagination parameters for posts

  // State signals for various data fetches
  private UserCommunityProfileState = signal<UserCommunityProfileState>({
    userCommunityProfileResponse: null,
    isLoading: false,
    isLoadingFilter: false,
    errorMessage: '',
  });

  private psychologicalPostsState = signal<PsychologicalPostsState>({ // State for ALL posts (from getAll)
    allPostsResponse: null,
    isLoading: false,
    isLoadingFilter: false,
    errorMessage: '',
    status: null, // Initial status
    totalItems: 0,
  });

  private userIdentityProfileState = signal<UserIdentityProfileState>({
    profileResponse: null,
    isLoading: false,
    errorMessage: ''
  });

  private postInterestsState = signal<PostInterestsListState>({
    intrestsResponse: null,
    isLoading: false,
    errorMessage: ''
  });

  @Input() placeholderHeader = signal<string>('how_do_you_feel_today'); // SSR-safe signal input

  // Expose state properties as computed signals for easy access in template
  readonly userCommunityProfileResponse = computed(() => this.UserCommunityProfileState().userCommunityProfileResponse);
  readonly isLoadingProfile = computed(() => this.UserCommunityProfileState().isLoading);
  readonly errorMessageProfile = computed(() => this.UserCommunityProfileState().errorMessage);

  // Expose state properties for all posts
  readonly allPostsResponse = computed(() => this.psychologicalPostsState().allPostsResponse);
  readonly isLoadingPosts = computed(() => this.psychologicalPostsState().isLoading);
  readonly isLoadingPostsFilter = computed(() => this.psychologicalPostsState().isLoadingFilter);
  readonly errorMessagePosts = computed(() => this.psychologicalPostsState().errorMessage);
  readonly statusPosts = computed(() => this.psychologicalPostsState().status); // Expose status
  readonly totalPostsItems = computed(() => this.psychologicalPostsState().totalItems);
  protected currentPostsPage = signal<number>(1);
  protected totalPagesPosts = signal<number>(1);


  // Header configuration
  readonly headerConfig: ILayoutGridHeaderConfig = CommunityProfileHeaderConfig;

  // Other component properties
  readonly isFullscreen = signal(false);
  cardType = CardType;
  private subscription = new Subscription();

  @ViewChild('card') cardRef!: ElementRef<HTMLElement>; // Reference to a specific card element (if needed)
  private toggleFollowTrigger = signal<{ userId: number; isFollowing: boolean } | null>(null); // Trigger for follow/unfollow effect

  // Expose computed property for post Interests
  readonly postInterests = computed(() => this.postInterestsState().intrestsResponse?.data || []);
  readonly isLoadingPostInterests = computed(() => this.postInterestsState().isLoading);
  readonly errorMessagePostInterests = computed(() => this.postInterestsState().errorMessage);

  public userIdentityProfileDataSignal = signal<IUserIdentifyProfileData | null>(null);
  readonly userIdentityProfile = computed<IUserIdentifyProfileData | null>(() => this.userIdentityProfileState().profileResponse?.data || null);

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _Router = inject(Router);

  // ----- Auth / Guest Computed -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  protected readonly isLoggedIn = computed(() => !!this.token());

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  constructor() {
    this.setupPostDeletionEffect();
    this.setupFollowEffect();

    // Effect to update userIdentityProfileDataSignal when userIdentityProfile changes
    effect(() => {
      const currentProfileData = this.userIdentityProfile();
      this.userIdentityProfileDataSignal.set(currentProfileData);
      Logger.debug('Effect: userIdentityProfileDataSignal updated:', this.userIdentityProfileDataSignal());
    });
  }

  ngOnInit(): void {
    // Set initial user identity data from storage
    this.userIdentityProfileData.set(
      this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO) ?? null
    );
    Logger.debug('UserProfileComponent => userIdentityProfileData: ', this.userIdentityProfileData()?.user);

    // Subscribe to route parameters to get userCommunityProfileId
    this._ActivatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      const numericId = id !== null ? Number(id) : null;
      this.userCommunityProfileId.set(numericId);

      // If a user ID is present in the route, fetch their community profile
      if (numericId) {
        this.getUserCommunityProfile(undefined, false, false); // Fetch specific user's profile info
        this.fetchPosts(undefined, numericId); // Fetch posts filtered by this user ID
      } else {
        // If no specific user ID in route, fetch all posts (for a general feed, if applicable)
        this.fetchPosts();
      }
    });

    // Simulate initial loading state for user community profile
    this.updateUserCommunityProfileState({ isLoading: true });
    setTimeout(() => {
      this.updateUserCommunityProfileState({ isLoading: false });
    }, 1000);

    // Subscribe to profile trigger service to refetch profile data
    this.subscription.add(
      this._ProfileTriggerService.triggerProfileFetch$
        .pipe(filter((v): v is boolean => v !== null)) // ignore nulls
        .subscribe((disableLoading: boolean) => {
          const currentUserId = this.userCommunityProfileId();
          const currentInterestId = this.selectedTab()?.id === 0 ? undefined : this.selectedTab()?.id; // Get selected interest

          // Re-fetch profile and posts on trigger
          this.getUserCommunityProfile(false, false, disableLoading);
        })
    );

    this.syncConfigToSignals(); // Syncs @Input config with internal signals
    this.fetchPostsIntersets(); // Fetch available post interests
    if (this.isLoggedIn()) {
      this.fetchUserIdentifyProfile(); // Fetch current logged-in user's identity profile
    }
    this._RefreshUserPostsService._refreshUserPostsTrigger$.subscribe((shouldRefresh: boolean) => {
      if (shouldRefresh) {
        this.fetchPosts(true, this.userCommunityProfileId() ?? undefined, this.selectedTab()?.id !== undefined ? Number(this.selectedTab()?.id) : undefined); // Pass true for filter to show loading filter state on retry
      }
    });

    this.setUpFetchDataAfterLogin();
  }


  /** Set up listener to fetch data after login */
  private setUpFetchDataAfterLogin(): void {
    this._UserContextService.recallUserDataViewed
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('TalbinahCommunityLayoutComponent | currentUrl:', currentUrl);

        if (currentUrl.startsWith('/' + TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE) && this.isBrowser) {
          this.refreshLoginStatus();
          this.syncConfigToSignals();
          this.fetchPostsIntersets();
          if (this.isLoggedIn()) {
            this.fetchUserIdentifyProfile();
          } else {
            this.updateUserIdentityProfileState({
              profileResponse: null,
              errorMessage: ''
            });
          }
        }
      });
  }

  ngAfterViewInit(): void {
    // this.moodModalIntegrationService.checkMoodModal();

    this.cdr.detectChanges(); // Ensures view is updated after initialization
  }

  // --- Start: Fetching User Community Profile ---
  protected getUserCommunityProfile(filter?: boolean, disableHeaderLoading: boolean = false, disableLoading: boolean = false): void {
    this.disableHeaderLoading.set(disableHeaderLoading);
    this.disableLoading.set(disableLoading);

    Logger.debug('Initiating User Community Profile fetch...');
    if (filter) {
      this.updateUserCommunityProfileState({ isLoadingFilter: true, errorMessage: '' });
    } else {
      this.updateUserCommunityProfileState({ isLoading: true, errorMessage: '' });
    }

    const userId = this.userCommunityProfileId();
    if (userId === null) {
      this.updateUserCommunityProfileState({ isLoading: false, isLoadingFilter: false, errorMessage: 'User ID is missing.' });
      return;
    }

    // Call API to get a specific user's community profile
    this._PostsApiClientProvider.getUserCommunityProfile(userId, this.postsPaginationParams)
      .pipe(
        tap((response: IUserCommunityProfileResponseDto) => this.processUserCommunityProfileResponse(response)),
        catchError((error: ApiError) => {
          this.handlegetUserCommunityProfileError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizeUserCommunityProfileFetch(filter))
      )
      .subscribe();
  }

  private processUserCommunityProfileResponse(response: IUserCommunityProfileResponseDto): void {
    Logger.debug('User Community Profile Response: ', response);
    if (response && response.data) {
      this.updateUserCommunityProfileState({
        userCommunityProfileResponse: response,
        errorMessage: ''
      });
      // Determine if the viewed profile is the current user's profile
      this.isMyCommunityProfile.set(this.userCommunityProfileResponse()?.data.me ?? false)
      const profileData = this.userCommunityProfileResponse()?.data?.profileData;
      this.userProfileSignal.set(profileData ?? null); // Store profile data
      Logger.debug('User Community Profile fetched successfully:', response);

      // Setup SEO with user name
      this.setupSEO(profileData?.dummy_name);
    } else {
      this.updateUserCommunityProfileState({
        userCommunityProfileResponse: null,
        errorMessage: ` 📭 ${this.translate('messages.noPostsFound')}` // This message might be more suitable for posts
      });
    }
  }

  private handlegetUserCommunityProfileError(error: ApiError): void {
    Logger.error('Error fetching User Community Profile:', error);
    handleApiErrors(error);
    this.updateUserCommunityProfileState({ errorMessage: '🚨 Error loading user profile. Please try again later.' });
  }

  private finalizeUserCommunityProfileFetch(filter?: boolean): void {
    if (filter) {
      this.updateUserCommunityProfileState({ isLoadingFilter: false });
    } else {
      this.updateUserCommunityProfileState({ isLoading: false });
    }
  }

  private updateUserCommunityProfileState(update: Partial<UserCommunityProfileState>): void {
    this.UserCommunityProfileState.update((prev) => ({
      ...prev,
      ...update
    }));
  }
  // --- End: Fetching User Community Profile ---


  // --- Start: Fetching All Posts (with optional user_id and interest_id filters) ---
  /**
   * Fetches all posts, optionally filtered by a user ID and/or an interest ID.
   * @param filter - Boolean to indicate if this is a filter operation (affects loading state).
   * @param userId - Optional user ID to filter posts by.
   * @param interestId - Optional interest ID to filter posts by.
   */
  protected fetchPosts(filter?: boolean, userId?: number, interestId?: number): void {
    Logger.debug('Initiating all posts fetch...');
    if (filter) {
      this.updatePsychologicalPostsState({ isLoadingFilter: true, errorMessage: '', status: null });
    } else {
      this.updatePsychologicalPostsState({ isLoading: true, errorMessage: '', status: null });
    }

    // Set or clear user_id in pagination parameters based on provided userId
    if (userId !== undefined && userId !== null) {
      this.postsPaginationParams.user_id = userId;
    } else {
      delete this.postsPaginationParams.user_id; // Clear user_id if not provided
    }

    // Set or clear interest_id in pagination parameters based on provided interestId
    if (interestId !== undefined && interestId !== null) {
      this.postsPaginationParams.interest_id = interestId;
    } else {
      delete this.postsPaginationParams.interest_id; // Clear interest_id if not provided
    }


    // Call API to get all posts (or filtered by user_id and/or interest_id)
    this._PostsApiClientProvider.getAll(this.postsPaginationParams)
      .pipe(
        tap((response: IAllPostsResponseDto) => this.processAllPostsResponse(response)),
        catchError((error: ApiError) => {
          this.handleFetchPostsError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizeAllPostsFetch(filter))
      )
      .subscribe();
  }

  private processAllPostsResponse(response: IAllPostsResponseDto): void {
    Logger.debug('All Posts Response: ', response);
    if (response && response.data.data && response.data.data.length > 0) {
      this.updatePsychologicalPostsState({
        allPostsResponse: response,
        totalItems: response.data.meta.total,
        errorMessage: '',
        status: response.status ?? true
      });
      this.totalPagesPosts.set(Math.ceil(response.data.meta.total / this.postsPaginationParams.per_page!));
      this.currentPostsPage.set(response.data.meta.current_page);
      Logger.debug('All posts fetched successfully:', response);
    } else {
      this.updatePsychologicalPostsState({
        allPostsResponse: null,
        totalItems: 0,
        errorMessage: ` 📭 ${this.translate('messages.noPostsFound')}`,
        status: response.status ?? false // Set status from response, default to false if no data
      });
    }
  }

  private handleFetchPostsError(error: ApiError): void {
    Logger.error('Error fetching all posts:', error);
    handleApiErrors(error);
    this.updatePsychologicalPostsState({
      errorMessage: '🚨 Error loading posts. Please try again later.',
      status: false // Set status to false on error
    });
  }

  private finalizeAllPostsFetch(filter?: boolean): void {
    if (filter) {
      this.updatePsychologicalPostsState({ isLoadingFilter: false });
    } else {
      this.updatePsychologicalPostsState({ isLoading: false });
    }
  }

  private updatePsychologicalPostsState(update: Partial<PsychologicalPostsState>): void {
    this.psychologicalPostsState.update((prev) => ({
      ...prev,
      ...update
    }));
  }
  // --- End: Fetching All Posts (with optional user_id and interest_id filters) ---


  // --- Start: Post Management ---
  protected onCloseRequested(): void {
    this.router.navigate([`/${TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE}`]);
  }

  /**
   * Opens the modal for creating or editing a psychological society post.
   * @param postItem - The post to edit, if any.
   */
  protected openAddEditPostPopup(postItem?: IPost): void {
    this.modalService.open(CreatePsychologicalSocietyPostComponent, {
      inputs: {
        ...HeaderConfig,
        data: {
          interests: this.tabs(), // Pass available interests to the modal
          itemToEdit: postItem, // Pass item if editing
          userIdentityProfileData: this.userProfileSignal() // Pass current user profile data
        }
      },
      outputs: {
        closed: (response: ICreatePostResponseDto) => {
          console.log('The model is closed: ', response);
          if (response.status && response.data) {
            // Re-fetch posts on successful creation/update
            const currentUserId = this.userCommunityProfileId() ?? undefined;
            const currentInterestId = this.selectedTab()?.id === 0 ? undefined : this.selectedTab()?.id;
            this.fetchPosts(undefined, currentUserId, currentInterestId !== undefined ? Number(currentInterestId) : undefined);
          }
        }
      },
      width: '60%',
      minHeight: '20rem',
      maxHeight: '70rem',
      isPhoneFromDown: true,
    });
  }

  handleCommentChange($event: any) {
    // Handle comment change event from child component
  }

  /**
   * Marks a post for deletion, triggering an effect to handle the deletion.
   * @param item - The post to be deleted.
   */
  protected deletePost(item: IPost): void {
    if (!item?.id) {
      Logger.warn('Cannot delete post: item or item.id is undefined.');
      return;
    }
    Logger.debug('Marking post for deletion:', item);
    this.postToDelete.set(item); // Set signal to trigger the effect
  }

  /**
   * Effect to handle post deletion when `postToDelete` signal changes.
   */
  private setupPostDeletionEffect(): void {
    effect(() => {
      const itemToDelete = this.postToDelete();
      if (!itemToDelete?.id) return; // Exit if no post is marked or ID is missing

      this._PostsApiClientProvider.deletePost(itemToDelete.id).pipe(
        take(1), // Take only one emission
        finalize(() => {
          this.postToDelete.set(null); // Reset signal after operation
        })
      ).subscribe({
        next: (response: IDeletePostResponseDto) => {
          if (response.status) {
            Logger.debug('Post deleted successfully:', itemToDelete);
            // this._ToastService.add({
            //   severity: 'success',
            //   summary: 'general.success',
            //   detail: response.message ?? 'Post deleted successfully.',
            //   life: 3000
            // });
            this._UserIdentityStore.fetch(); // Re-fetch user identity to update post count
            const currentUserId = this.userCommunityProfileId() ?? undefined;
            const currentInterestId = this.selectedTab()?.id === 0 ? undefined : this.selectedTab()?.id;
            this.fetchPosts(undefined, currentUserId, currentInterestId !== undefined ? Number(currentInterestId) : undefined); // Re-fetch posts
          } else {
            Logger.warn('Post deletion error', response);
            this._ToastService.add({
              severity: 'error',
              summary: 'general.error',
              detail: response?.message || 'Error to delete post.',
              life: 5000
            });
          }
        },
        error: (error: ApiError) => {
          Logger.warn('Post deletion failed', error);
          handleApiErrorsMessage(error);
          this._ToastService.add({
            severity: 'error',
            summary: 'general.error',
            detail: error?.message || 'Failed to delete post.',
            life: 5000
          });
        }
      });
    });
  }
  // --- End: Post Management ---


  // --- Start: Follow/Unfollow Handlers ---
  protected toggleFollow(): void {
    if (this.userCommunityProfileId() === undefined || this.isLoadingFollow()) {
      Logger.warn('Cannot toggle follow: User ID is missing or a request is already in progress.');
      return;
    }
    const newFollowingStatus = !this._isFollowed();
    this._isFollowed.set(newFollowingStatus); // Optimistic update
    const userId = this.userCommunityProfileId();
    if (userId !== null) {
      this.toggleFollowTrigger.set({ userId, isFollowing: newFollowingStatus }); // Trigger follow effect
    }
  }

  private setupFollowEffect(): void {
    effect(() => {
      const trigger = this.toggleFollowTrigger();
      // If there's no trigger or a follow request is already loading, do nothing
      if (!trigger) { // Removed `|| this.isLoadingFollow()` here because the check is now in `toggleFollow()`
        return;
      }

      this.isLoadingFollow.set(true); // Set loading state to true when the API call starts
      this.followError.set(null); // Clear any previous follow errors

      this._PostsApiClientProvider.updateFollowUser({
        followed_user_id: trigger.userId
      }).pipe(
        take(1), // Ensure the observable completes after the first emission
        finalize(() => this.isLoadingFollow.set(false)) // Set loading state to false when the API call completes (success or error)
      ).subscribe({
        next: (res: IUpdateFollowResponseDto) => {
          if (!res.status) {
            // If the API call was not successful, revert the optimistic UI update
            const originalStatus = !trigger.isFollowing;
            this._isFollowed.set(originalStatus);
            // Also revert the config if it's directly bound to the UI
            if (this.config) {
              this.config.is_followed = originalStatus;
              this.config = { ...this.config }; // Trigger change detection for @Input config
            }
            return;
          }

          const isFollowed = res.data.is_followed ?? false;
          // Synchronize the component's internal _isFollowed state with the actual API response
          this._isFollowed.set(isFollowed);

          this.syncConfigToSignals(); // Sync the @Input config's is_followed with the signal state
          // Re-fetch the user profile to get the most updated follower/following counts
          this.getUserCommunityProfile(undefined, true, true);
          // this._ToastService.add({
          //   severity: 'success',
          //   summary: 'general.success',
          //   detail: res.message || (isFollowed ? 'User followed successfully!' : 'User unfollowed successfully!'),
          //   life: 3000,
          // });
          Logger.debug(`User ${isFollowed ? 'followed' : 'unfollowed'} successfully:`, res);
        },
        error: (error: ApiError) => {
          // Revert optimistic update on error
          const originalStatus = !trigger.isFollowing;
          this._isFollowed.set(originalStatus);
          // Also revert the config if it's directly bound to the UI
          if (this.config) {
            this.config.is_followed = originalStatus;
            this.config = { ...this.config }; // Trigger change detection for @Input config
          }

          this.followError.set(error); // Store the error
          Logger.error('Error updating user follow status:', error);
          handleApiErrorsMessage(error); // Display generic API error message
          this._ToastService.add({
            severity: 'error',
            summary: 'general.error',
            detail: error?.message || 'Error occurred while updating follow status.',
            life: 5000,
          });
        }
      });
    });
  }
  // --- End: Follow/Unfollow Handlers ---
  // --- End: Follow/Unfollow Handlers ---


  // --- Start: Saved Posts Handlers ---
  protected openSavedPosts(): void {
    this.modalService.open(MySavedPostsComponent, {
      inputs: {
        image: 'images/community/icons/header-icon.png',
        title: 'saved_posts',
        subtitle: 'share_experiences_with_safe_supportive_community',
        data: {
          userIdentityProfileData: this.userIdentityProfileDataSignal(),
        }
      },
      width: '60%',
    })
  }
  // --- End: Saved Posts Handlers ---


  // --- Start: Tab and Interest Management ---
  private syncConfigToSignals(): void {
    if (this.config) {
      this._isFollowed.set(this.config.is_followed ?? false);
    }
  }

  /**
   * Handles tab selection for post interests.
   * @param tab - The selected ITab object.
   */
  protected onTabInterestSelected(tab: ITab): void {
    this.selectedTab.set(tab);
    Logger.debug('Selected Post Category Tab: ', this.selectedTab());

    this.postsPaginationParams.page = 1; // Reset to first page on tab change

    const userId = this.userCommunityProfileId(); // Get current user ID from signal
    let interestIdToFilter: number | undefined;

    if (tab.id === 0) { // "All Posts" tab
      this.postsPaginationParams.interest_id = undefined; // Clear interest filter
      interestIdToFilter = undefined;
    } else {
      this.postsPaginationParams.interest_id = Number(tab.id); // Set interest filter as number
      interestIdToFilter = Number(tab.id);
    }
    // Re-fetch posts with the new interest filter and existing user filter
    this.fetchPosts(true, userId ?? undefined, interestIdToFilter);
  }

  /**
   * Fetches the list of all available post interests.
   */
  private fetchPostsIntersets(): void {
    // Logger.debug('Initiating post Interests fetch...');
    this.updatePostInterestsState({ isLoading: true, errorMessage: '' });
    this._PostsApiClientProvider.getPostInterests()
      .pipe(
        tap((response: IPostsInterestsListingResponseDto) => this.processPostInterestsResponse(response)),
        catchError((error: ApiError) => {
          this.handleFetchPostInterestsError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizePostInterestsFetch())
      )
      .subscribe();
  }

  private processPostInterestsResponse(response: IPostsInterestsListingResponseDto): void {
    if (response && response.data && response.data.length > 0) {
      this.updatePostInterestsState({
        intrestsResponse: response,
        errorMessage: ''
      });
      // Logger.debug('Post Interests fetched successfully:', response);

      // Map API response to ITab format and add "All Posts" tab
      const dynamicTabs: ITab[] = response.data.map((interest: IPostInterest) => ({
        id: interest.id,
        title: interest.name
      }));

      // Add "All Posts" as the first tab
      this.tabs.set([{ id: 0, title: this._LocalizationService.translateTextFromJson('general.allPosts') }, ...dynamicTabs]);
      Logger.debug('Interests Tabs: ', this.tabs());

      // Set "All Posts" as default selected tab if none is selected or if current is not "All Posts"
      if (!this.selectedTab() || this.selectedTab()?.id !== 0) {
        this.selectedTab.set(this.tabs()[0]);
      }
    } else {
      this.updatePostInterestsState({ intrestsResponse: null, errorMessage: '📭 No post Interests found.' });
      this.tabs.set([{ id: 0, title: this._LocalizationService.translateTextFromJson('general.allPosts') }]);
      this.selectedTab.set(this.tabs()[0]);
    }
  }

  private handleFetchPostInterestsError(error: ApiError): void {
    Logger.error('Error fetching post Interests:', error);
    handleApiErrors(error);
    this.updatePostInterestsState({ errorMessage: '🚨 Error loading post Interests. Please try again later.' });
  }

  private finalizePostInterestsFetch(): void {
    this.updatePostInterestsState({ isLoading: false });
  }

  private updatePostInterestsState(updates: Partial<PostInterestsListState>): void {
    this.postInterestsState.update(state => ({ ...state, ...updates }));
  }
  // --- End: Tab and Interest Management ---


  // --- Start: User Identity Profile ---
  private updateUserIdentityProfileState(partial: Partial<UserIdentityProfileState>): void {
    this.userIdentityProfileState.update(state => ({ ...state, ...partial }));
  }

  /**
   * Fetches the current logged-in user's identity profile.
   */
  protected fetchUserIdentifyProfile(): void {
    Logger.debug('Initiating user identity profile fetch...');
    this.updateUserIdentityProfileState({ isLoading: true, errorMessage: '🔄 Loading user identity profile... Please wait.' });
    if (this.roleGuard.isGuest()) {
      this.router.navigate([MainPageRoutesEnum.MAINPAGE]);
      return;
    }
    this._PostsApiClientProvider.getUserIdentifyProfile()
      .pipe(
        tap((response: IUserIdentifyProfileResponseDto) => this.processUserIdentityProfileResponse(response)),
        catchError((error: ApiError) => {
          this.handleFetchUserIdentityProfileError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizeUserIdentityProfileFetch())
      )
      .subscribe();
  }

  private processUserIdentityProfileResponse(response: IUserIdentifyProfileResponseDto): void {
    if (response && response.data && response.data.id) {
      this.updateUserIdentityProfileState({
        profileResponse: response,
        errorMessage: ''
      });
      // Store user identity data in local storage
      this._StorageService.setItem(StorageKeys.MY_COMMUNITY_USER_PROFILE_DATA, JSON.stringify(this.userIdentityProfileDataSignal()), true);
      Logger.debug('User identity profile fetched successfully:', response);
    } else {
      this.updateUserIdentityProfileState({ profileResponse: null, errorMessage: '' });
      Logger.warn('No user identity profile data found or ID missing.', { userIdentityProfile: this.userIdentityProfile() });
    }
    this.cdr.detectChanges(); // Force change detection
  }

  private handleFetchUserIdentityProfileError(error: ApiError): void {
    Logger.error('Failed to fetch user identity profile:', error);
    this.updateUserIdentityProfileState({
      isLoading: false,
      errorMessage: error?.message || '❌ Failed to fetch user identity profile.'
    });
    this.cdr.detectChanges();

    this._ToastService.add({
      severity: 'error',
      summary: 'general.error',
      detail: error?.message || '❌ Failed to fetch user identity profile.',
      life: 5000
    });
  }

  private finalizeUserIdentityProfileFetch(): void {
    this.updateUserIdentityProfileState({ isLoading: false });
    this.cdr.detectChanges();
  }
  // --- End: User Identity Profile ---


  // --- Start: Following List ---
  protected openFollowingList(): void {
    this.modalService.open(UsersFollowComponent, {
      inputs: {
        image: 'images/not-found/talbinah-2.png',
        title: 'follow3'
      },
      width: '60%'
    });
  }
  // --- End: Following List ---

  // --- Start: SEO Setup ---
  private setupSEO(userName?: string): void {
    const lang = this._LocalizationService.getCurrentLanguage();
    const routeData = TalbinahCommunityRouteData.TalbinahCommunityMainPage;

    // Build title with user name if available
    let title: string;
    if (userName) {
      title = lang === 'ar'
        ? `${userName} | مجتمع تلبينة`
        : `${userName} | Talbinah Community`;
    } else {
      title = lang === 'ar' ? routeData.title.ar : routeData.title.en;
    }

    const description = lang === 'ar' ? routeData.meta.description.ar : routeData.meta.description.en;

    this.seo.setMetaTags({
      title,
      description,
      keywords: 'user profile, community, talbinah, مجتمع, ملف شخصي, تلبينة',
      image: 'https://talbinah.net/dashboard_assets/Talbinah.png',
      url: `https://talbinah.net/khawiik/user-profile/${this.userCommunityProfileId() || ''}`,
      robots: 'index, follow',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      canonical: `https://talbinah.net/khawiik/user-profile/${this.userCommunityProfileId() || ''}`
    });
  }
  // --- End: SEO Setup ---

}
