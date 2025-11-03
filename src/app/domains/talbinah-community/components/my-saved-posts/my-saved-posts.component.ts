import { Component, computed, effect, inject, Input, signal } from '@angular/core';
import { ITab } from '../../models';
import { TabSwitcherComponent } from '../tab-switcher';
import { EmptyStateComponent, ErrorStateComponent, LocalizationService, ModalService, ToastService } from '../../../../shared';
import { ApiError, CardType, defaultPaginationParameters, handleApiErrors, handleApiErrorsMessage, IPaginationParameters, Logger } from '../../../../common';
import { TalbinahCommunityApiClientProvider } from '../../clients';
import { IAllPostsResponseDto, ICreatePostResponseDto, IDeletePostResponseDto, IPost, IPostInterest, IPostsInterestsListingResponseDto, IUserIdentifyProfileData } from '../../dtos';
import { catchError, EMPTY, finalize, take, tap } from 'rxjs';
import { getCardsError, HeaderConfig, PostsEmptyState } from '../../configs';
import { UserIdentityStore } from '../../routes/user-identity.service';
import { CreatePsychologicalSocietyPostComponent } from '../create-psychological-society-post';
import { PsychologicalSocietyCardComponent } from '../psychological-society-card';
import { PsychologicalSocietyCardShemmerComponent } from '../psychological-society-card-shemmer';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { RefreshUserPostsService } from '../../services';

// State for Post Interests
interface PostInterestsListState {
  intrestsResponse: IPostsInterestsListingResponseDto | null;
  isLoading: boolean;
  errorMessage: string;
}
// Define state interface for posts
interface PsychologicalPostsState {
  allPostsResponse: IAllPostsResponseDto | null;
  isLoading: boolean;
  isLoadingFilter: boolean;
  errorMessage: string;
  totalItems: number;
}

@Component({
  selector: 'app-my-saved-posts',
  standalone: true,
  imports: [TabSwitcherComponent, PsychologicalSocietyCardShemmerComponent, PsychologicalSocietyCardComponent, EmptyStateComponent, ErrorStateComponent, AutoExactHeightDirective],
  templateUrl: './my-saved-posts.component.html',
  styleUrls: ['./my-saved-posts.component.scss']
})
export class MySavedPostsComponent {
  // Modify tabs to be initially empty or contain only the "All Posts" tab
  private _LocalizationService = inject(LocalizationService);
  private readonly _PostsApiClientProvider = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _ToastService = inject(ToastService);
  protected readonly _UserIdentityStore = inject(UserIdentityStore);
  protected readonly modalService = inject(ModalService);
  private readonly _RefreshUserPostsService = inject(RefreshUserPostsService);

  @Input() data!: {
    userIdentityProfileData: IUserIdentifyProfileData | null;
  };
  protected readonly userIdentityProfileDataSignal = signal<IUserIdentifyProfileData | null>(null);
  // Start Delete Post Variables
  private readonly postToDelete = signal<IPost | null>(null);
  protected isLoadingDeletePost = signal<boolean>(false);
  // End Delete Post Variables

  // Pagination parameters for posts
  private postsPaginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 5, is_bookmarked: true }; // Adjust per_page as needed
  readonly currentPostsPage = signal<number>(1);
  readonly totalPagesPosts = signal<number>(1);

  readonly tabs = signal<ITab[]>([
    { id: 0, title: this._LocalizationService.translateTextFromJson('general.allPosts') }, // Keep an "All Posts" tab with a special ID (e.g., 0)
  ]);
  readonly selectedTab = signal<ITab | null>(this.tabs()[0]); // Set initial selected tab to "All Posts"
  // State for Post Interests
  private postInterestsState = signal<PostInterestsListState>({
    intrestsResponse: null,
    isLoading: false,
    errorMessage: ''
  });
  // State for All Posts
  private psychologicalPostsState = signal<PsychologicalPostsState>({
    allPostsResponse: null,
    isLoading: false,
    isLoadingFilter: false,
    errorMessage: '',
    totalItems: 0
  });
  // Expose computed property for post Interests
  readonly postInterests = computed(() => this.postInterestsState().intrestsResponse?.data || []);
  readonly isLoadingPostInterests = computed(() => this.postInterestsState().isLoading);
  readonly errorMessagePostInterests = computed(() => this.postInterestsState().errorMessage);

  // Expose state properties as computed signals
  readonly allPostsResponse = computed(() => this.psychologicalPostsState().allPostsResponse);
  readonly isLoadingPosts = computed(() => this.psychologicalPostsState().isLoading);
  readonly errorMessagePosts = computed(() => this.psychologicalPostsState().errorMessage);
  readonly totalPostsItems = computed(() => this.psychologicalPostsState().totalItems);
  readonly isLoadingPostsFilter = computed(() => this.psychologicalPostsState().isLoadingFilter);
  protected readonly postsEmptyState = PostsEmptyState;
  protected readonly postsErrorState = getCardsError(() => this.fetchPosts());

  cardType = CardType;

  constructor() {
    effect(() => {
      const userData = this.data.userIdentityProfileData;
      Logger.debug('Main Page => User Identity Profile Data (effect): ', userData);
    });
    this.setupPostDeletionEffect();
  }
  // NEW: START: Fetch Post Interests List with RxJS
  ngOnInit(): void {
    this.fetchPosts(); // Initial fetch of all posts
    this.fetchPostsIntersets(); // Initial fetch of post Interests
    if (this.data.userIdentityProfileData) {
      console.log('Main Page => User Identity Profile Data (ngOnInit): ', this.data.userIdentityProfileData);
      this.userIdentityProfileDataSignal.set(this.data.userIdentityProfileData);

    } else {
      console.log('Main Page => User Identity Profile Data (ngOnInit): null');
    }
  }

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

      const dynamicTabs: ITab[] = response.data.map((interest: IPostInterest) => ({
        id: interest.id,
        title: interest.name
      }));

      this.tabs.set([{ id: 0, title: this._LocalizationService.translateTextFromJson('general.allPosts') }, ...dynamicTabs]);
      Logger.debug('Interests Tabs: ', this.tabs());

      if (!this.selectedTab() || this.selectedTab()?.id !== 0) { // Ensure "All Posts" is default if not already selected
        this.selectedTab.set(this.tabs()[0]);
      }

    } else {
      this.updatePostInterestsState({ intrestsResponse: null, errorMessage: '📭 No post Interests found.' });
      this.tabs.set([{ id: 0, title: this._LocalizationService.translateTextFromJson('general.allPosts') }]);
      this.selectedTab.set(this.tabs()[0]);
    }
    // No need for cdr.detectChanges() here.
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

  // END: Fetch Post Interests List with RxJS

  protected onTabInterestSelected(tab: ITab): void {
    this.selectedTab.set(tab);
    Logger.debug('Selected Post Category Tab: ', this.selectedTab());

    this.postsPaginationParams.page = 1;
    this.currentPostsPage.set(1);

    if (tab.id === 0) { // "All Posts" tab
      this.postsPaginationParams.interest_id = undefined; // Clear interest filter
    } else {
      this.postsPaginationParams.interest_id = typeof tab.id === 'number' ? tab.id : Number(tab.id); // Set interest filter
    }
    this.fetchPosts(true); // Fetch posts with the new filter
  }

  // Start Fetch All Posts List with RxJS
  protected fetchPosts(filter?: boolean): void {
    Logger.debug('Initiating all posts fetch...');
    if (filter) {
      this.updatePsychologicalPostsState({ isLoadingFilter: true, errorMessage: '' });
    } else {
      this.updatePsychologicalPostsState({ isLoading: true, errorMessage: '' });
    }

    this._PostsApiClientProvider.getAll(this.postsPaginationParams)
      .pipe(
        tap((response: IAllPostsResponseDto) => this.processAllPostsResponse(response)),
        catchError((error: ApiError) => {
          this.handleFetchPostsError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizePostsFetch(filter))
      )
      .subscribe();
  }
  private processAllPostsResponse(response: IAllPostsResponseDto): void {
    Logger.debug('All Posts Response: ', response);
    if (response && response.data.data && response.data.data.length > 0) {
      this.updatePsychologicalPostsState({
        allPostsResponse: response,
        totalItems: response.data.meta.total,
        errorMessage: ''
      });

      this.totalPagesPosts.set(Math.ceil(response.data.meta.total / this.postsPaginationParams.per_page!));
      this.currentPostsPage.set(response.data.meta.current_page);

      Logger.debug('All posts fetched successfully:', response);
    } else {
      this.updatePsychologicalPostsState({
        allPostsResponse: null,
        totalItems: 0,
        errorMessage: ` 📭 ${this._LocalizationService.translateTextFromJson('messages.noPostsFound')}`
      });
    }
    // No need for cdr.detectChanges() here as signals handle reactivity.
  }
  private handleFetchPostsError(error: ApiError): void {
    Logger.error('Error fetching all posts:', error);
    handleApiErrors(error);
    this.updatePsychologicalPostsState({ errorMessage: '🚨 Error loading posts. Please try again later.' });
  }
  private finalizePostsFetch(filter?: boolean): void {
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
  protected handlePostsPageChange(page: number): void {
    this.postsPaginationParams.page = page;
    this.currentPostsPage.set(page);
    this.fetchPosts(true);
  }
  protected resetPostsPagination(): void {
    this.postsPaginationParams = { ...defaultPaginationParameters, per_page: 5 };
    this.currentPostsPage.set(1);
    this.totalPagesPosts.set(1);
    this.updatePsychologicalPostsState({
      allPostsResponse: null,
      isLoading: false,
      isLoadingFilter: false,
      errorMessage: '',
      totalItems: 0
    });
  }

  protected openAddEditPostPopup(postItem?: IPost): void {
    this.modalService.open(CreatePsychologicalSocietyPostComponent, {
      inputs: {
        ...HeaderConfig,
        data: {
          interests: this.tabs(),
          itemToEdit: postItem,
          // Pass the signal's current value to the child component
          userIdentityProfileData: this.data.userIdentityProfileData
        }
      },
      outputs: {
        closed: (response: ICreatePostResponseDto) => {
          console.log('The model is closed: ', response);
          if (response.status && response.data) {
            this.fetchPosts(); // Re-fetch all posts on successful creation/update
          }
        }
      },
      width: '60%',
      minHeight: '20rem',
      maxHeight: '70rem',
      isPhoneFromDown: true,
    });
  }

  // Start Delete Post Functions
  protected deletePost(item: IPost): void {
    if (!item?.id) {
      Logger.warn('Cannot delete post: item or item.id is undefined.');
      return;
    }

    Logger.debug('Marking post for deletion:', item);
    this.postToDelete.set(item); // Triggers effect
  }
  private setupPostDeletionEffect(): void {
    effect(() => {
      const itemToDelete = this.postToDelete();
      if (!itemToDelete?.id) return;

      this.isLoadingDeletePost.set(true);
      this._PostsApiClientProvider.deletePost(itemToDelete.id).pipe(
        take(1),
        finalize(() => {
          this.isLoadingDeletePost.set(false);
          this.postToDelete.set(null); // Reset signal
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

            // --- Update psychologicalPostsState without re-fetching ---
            this.psychologicalPostsState.update(currentState => {
              if (!currentState.allPostsResponse) {
                return currentState;
              }

              const updatedData = currentState.allPostsResponse.data.data.filter(
                post => post.id !== itemToDelete.id
              );
              const updatedMeta = {
                ...currentState.allPostsResponse.data.meta,
                total: currentState.allPostsResponse.data.meta.total - 1
              };
              const updatedAllPostsResponse = {
                ...currentState.allPostsResponse,
                data: {
                  ...currentState.allPostsResponse.data,
                  data: updatedData,
                  meta: updatedMeta
                }
              };

              return {
                ...currentState,
                allPostsResponse: updatedAllPostsResponse,
                totalItems: updatedMeta.total
              };
            });
            // --- End of update ---

            // ✅ Re-fetch profile data to update my_post_count
            this._UserIdentityStore.fetch();
            this._RefreshUserPostsService.triggerRefresh();


          } else {
            Logger.warn('Post deletion error', response);
            this._ToastService.add({
              severity: 'error',
              summary: 'an_error_has_occurred',
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
            summary: 'an_error_has_occurred',
            detail: error?.message || 'Failed to delete post.',
            life: 5000
          });
        }
      });
    });
  }

  // End Delete Post Functions

  protected handleCommentChange(item: any): void {
    Logger.debug('Main Page => Comment received from card:', item);
  }
  protected editPostDetails(data: any): void {
    Logger.debug('Main Page => Item to edit at card: ', data);
    this.openAddEditPostPopup(data);
  }
}
