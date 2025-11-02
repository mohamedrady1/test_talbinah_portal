import {
  inject,
  Injectable,
  signal,
  computed,
  PLATFORM_ID,
  makeStateKey,
  TransferState
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import {
  IPaginationParameters,
  defaultPaginationParameters,
  Logger,
  ApiError,
  handleApiErrors,
  handleApiErrorsMessage // Added for consistency
} from '../../../common'; // Adjust path
import { ToastService, LocalizationService } from '../../../shared'; // Adjust path
import { TalbinahCommunityApiClientProvider, ITalbinahCommunityApiClient } from '../clients'; // Adjust path
import { IAllPostsResponseDto, IPost } from '../dtos'; // Adjust path
import {
  CommunityPostsListState,
  CommunityPostsFeatureState,
  initialCommunityPostsFeatureState
} from '../models/community-posts.models'; // Adjust path

const ALL_COMMUNITY_POSTS_STATE_KEY = makeStateKey<CommunityPostsFeatureState>('allCommunityPosts');

@Injectable({
  providedIn: 'root'
})
export class CommunityPostsFacade {
  // --- Dependencies ---
  private readonly _apiClient: ITalbinahCommunityApiClient = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  // --- Feature State (Signal) ---
  private readonly _featureState = signal<CommunityPostsFeatureState>(initialCommunityPostsFeatureState);

  // --- Selectors (Computed) ---
  readonly posts = computed(() => this._featureState().posts.response);
  readonly isLoading = computed(() => this._featureState().posts.isLoading);
  readonly isFiltering = computed(() => this._featureState().posts.isFiltering);
  readonly errorMessage = computed(() => this._featureState().posts.errorMessage);
  readonly totalItems = computed(() => this._featureState().posts.totalItems);
  readonly currentPage = computed(() => this._featureState().posts.currentPage);
  readonly totalPages = computed(() => this._featureState().posts.totalPages);
  readonly currentPaginationParams = computed(() => this._featureState().posts.pagination);

  constructor() {
    // Hydrate state from TransferState during client-side hydration
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get<CommunityPostsFeatureState>(
      //   ALL_COMMUNITY_POSTS_STATE_KEY,
      //   initialCommunityPostsFeatureState
      // );
      // if (cachedState) {
      //   Logger.debug('Hydrating community posts from TransferState', cachedState);
      //   this._updatePostsState(cachedState.posts);
      //   this._transferState.remove(ALL_COMMUNITY_POSTS_STATE_KEY);
      // }
    }
  }

  fetchAll(page?: number, filter: boolean = false, interestId?: number, user_id?: number): void {
    const currentParams = this._featureState().posts.pagination;
    const params: IPaginationParameters = {
      page: page ?? currentParams.page,
      per_page: currentParams.per_page,
      user_id: user_id ? currentParams.user_id : null,
      interest_id: interestId ?? currentParams.interest_id
    };

    Logger.debug(`Fetching community posts - Page: ${params.page}, Filter: ${filter}, Interest ID: ${params.interest_id}`);

    this._updatePostsState({
      isLoading: !filter,
      isFiltering: filter,
      currentPage: params.page,
      pagination: params, // Update pagination params in state
      errorMessage: null
    });

    // Attempt to use cached data from TransferState on browser, but only if not filtering
    // const cached = this._transferState.get<CommunityPostsFeatureState>(
    //   ALL_COMMUNITY_POSTS_STATE_KEY,
    //   null as any
    // );
    // if (isPlatformBrowser(this._platformId) && cached && !filter && params.page === 1 && !params.interest_id) {
    //   Logger.debug('Using cached community posts from TransferState');
    //   this._updatePostsState({
    //     response: cached.posts.response,
    //     isLoading: false,
    //     isFiltering: false,
    //     currentPage: cached.posts.currentPage,
    //     totalItems: cached.posts.totalItems,
    //     totalPages: cached.posts.totalPages,
    //     pagination: cached.posts.pagination
    //   });
    //   this._transferState.remove(ALL_COMMUNITY_POSTS_STATE_KEY);
    //   return;
    // }

    this._apiClient.getAll(params)
      .pipe(
        tap((response: IAllPostsResponseDto) => {
          if (response && response.data?.data && response.data.data.length > 0) {
            this._updatePostsState({
              response: response.data.data,
              currentPage: response.data.meta.current_page,
              totalItems: response.data.meta.total,
              totalPages: Math.ceil(response.data.meta.total / (params.per_page || 1)),
              errorMessage: null
            });
            Logger.debug('Community posts fetched successfully:', response);
          } else {
            this._updatePostsState({
              response: [],
              currentPage: params.page, // Keep current page even if no data
              totalItems: 0,
              totalPages: 1,
              errorMessage: ` 📭 ${this._localizationService.translateTextFromJson('messages.noPostsFound')}`
            });
            Logger.debug('No community posts found.');
          }

          // Store full state for SSR
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(ALL_COMMUNITY_POSTS_STATE_KEY, this._featureState());
            Logger.debug('Stored community posts state in TransferState for SSR');
          }
        }),
        catchError((error: ApiError) => {
          Logger.error('Error fetching community posts:', error);
          handleApiErrors(error); // Shows toast messages via common handler
          this._updatePostsState({
            response: [],
            errorMessage: '🚨 Error loading posts. Please try again later.',
            currentPage: params.page, // Keep current page
            totalItems: 0,
            totalPages: 1,
          });
          return EMPTY;
        }),
        finalize(() => {
          this._updatePostsState({
            isLoading: false,
            isFiltering: false
          });
        })
      )
      .subscribe();
  }

  /**
   * Updates the filter parameters in the facade's state.
   * This should be called *before* `fetchAll` when applying a new filter.
   * @param interestId The ID of the interest to filter by, or `undefined` to clear filter.
   */
  setFilter(interestId: number | undefined): void {
    this._featureState.update(state => ({
      ...state,
      posts: {
        ...state.posts,
        pagination: {
          ...state.posts.pagination,
          interest_id: interestId,
          page: 1 // Always reset to page 1 when changing filters
        }
      }
    }));
    Logger.debug(`Filter set in facade: interest_id=${interestId}`);
  }

  /**
   * Removes a post from the current state locally after successful deletion.
   * This prevents a full re-fetch of posts for a single deletion.
   * @param postId The ID of the post to remove.
   */
  removePostLocally(postId: number): void {
    this._featureState.update(state => {
      const currentPosts = state.posts.response;
      const updatedPosts = currentPosts.filter(post => post.id !== postId);
      const newTotalItems = state.posts.totalItems - 1;
      const newTotalPages = Math.ceil(newTotalItems / (state.posts.pagination.per_page || 1));

      return {
        ...state,
        posts: {
          ...state.posts,
          response: updatedPosts,
          totalItems: newTotalItems < 0 ? 0 : newTotalItems, // Ensure non-negative
          totalPages: newTotalPages < 1 ? 1 : newTotalPages, // Ensure at least 1 page
        }
      };
    });
    Logger.debug(`Post ID ${postId} removed locally from state.`);
  }

  /**
   * Resets the entire posts state to its initial values.
   */
  resetState(): void {
    this._featureState.set(initialCommunityPostsFeatureState);
    Logger.debug('Community posts state has been reset.');
  }

  /**
   * Utility to update the posts list state immutably.
   * @param updates Partial state updates to apply.
   */
  private _updatePostsState(updates: Partial<CommunityPostsListState>): void {
    this._featureState.update(state => ({
      ...state,
      posts: {
        ...state.posts,
        ...updates
      }
    }));
  }
}
