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
import { catchError, EMPTY, finalize, tap, Observable } from 'rxjs';
import {
  IPaginationParameters,
  defaultPaginationParameters,
  Logger,
  ApiError,
  handleApiErrors,
  handleApiErrorsMessage
} from '../../../common'; // Adjust path as needed
import { ToastService, LocalizationService } from '../../../shared'; // Adjust path as needed
import { TalbinahCommunityApiClientProvider, ITalbinahCommunityApiClient } from '../clients'; // Adjust path as needed
import { IUserIFollow, IUsersIFollowResponseDto } from '../dtos';

// TODO: Define these interfaces based on your actual API response and model

export interface UsersIFollowListState {
  response: IUserIFollow[];
  isLoading: boolean;
  isFiltering: boolean;
  errorMessage: string | null;
  status: boolean;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pagination: IPaginationParameters;
}

export interface UsersIFollowFeatureState {
  usersIFollow: UsersIFollowListState;
}
const fallbackPagination = {
  page: 1,
  perPage: 10,
};

export const initialUsersIFollowListState: UsersIFollowListState = {
  response: [],
  isLoading: false,
  isFiltering: false,
  errorMessage: null,
  status: false,
  totalItems: 5,
  currentPage: (defaultPaginationParameters?.page ?? fallbackPagination.page),
  totalPages: 1,
  pagination: {
    ...(defaultPaginationParameters ?? fallbackPagination),
    total: 5,
  }
};

export const initialUsersIFollowFeatureState: UsersIFollowFeatureState = {
  usersIFollow: initialUsersIFollowListState
};

const ALL_USERS_I_FOLLOW_STATE_KEY = makeStateKey<UsersIFollowFeatureState>('allUsersIFollow');

@Injectable({
  providedIn: 'root'
})
export class UsersIFollowFacade {
  // --- Dependencies ---
  private readonly _apiClient: ITalbinahCommunityApiClient = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  // --- Feature State (Signal) ---
  private readonly _featureState = signal<UsersIFollowFeatureState>(initialUsersIFollowFeatureState);

  // --- Selectors (Computed) ---
  readonly usersIFollow = computed(() => this._featureState().usersIFollow.response);
  readonly isLoading = computed(() => this._featureState().usersIFollow.isLoading);
  readonly isFiltering = computed(() => this._featureState().usersIFollow.isFiltering);
  readonly errorMessage = computed(() => this._featureState().usersIFollow.errorMessage);
  readonly status = computed(() => this._featureState().usersIFollow.status);
  readonly totalItems = computed(() => this._featureState().usersIFollow.totalItems);
  readonly currentPage = computed(() => this._featureState().usersIFollow.currentPage);
  readonly totalPages = computed(() => this._featureState().usersIFollow.totalPages);
  readonly currentPaginationParams = computed(() => this._featureState().usersIFollow.pagination);

  constructor() {
    // Hydrate state from TransferState during client-side hydration
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get<UsersIFollowFeatureState>(
      //   ALL_USERS_I_FOLLOW_STATE_KEY,
      //   initialUsersIFollowFeatureState
      // );
      // if (cachedState) {
      //   Logger.debug('Hydrating users I follow from TransferState', cachedState);
      //   this._updateUsersIFollowState(cachedState.usersIFollow);
      //   this._transferState.remove(ALL_USERS_I_FOLLOW_STATE_KEY);
      // }
    }
  }

  fetchAll(page?: number, filter: boolean = false, isLoading?: boolean): void {
    const currentParams = this._featureState().usersIFollow.pagination;
    const params: IPaginationParameters = {
      page: page ?? currentParams.page,
      per_page: currentParams.per_page,
      // Add other filter parameters if needed, e.g., search_query: currentParams.search_query
      total: currentParams.total,
    };

    Logger.debug(`Fetching users I follow - Page: ${params.page}, Filter: ${filter}`);

    // Conditionally set isLoading and isFiltering based on the passed isLoading parameter
    this._updateUsersIFollowState({
      isLoading: isLoading === false ? false : !filter, // If isLoading is explicitly false, keep it false, otherwise use !filter
      isFiltering: filter,
      currentPage: params.page,
      pagination: params, // Update pagination params in state
      errorMessage: null,
      status: false
    });

    // Attempt to use cached data from TransferState on browser, but only if not filtering
    // const cached = this._transferState.get<UsersIFollowFeatureState>(
    //   ALL_USERS_I_FOLLOW_STATE_KEY,
    //   null as any
    // );
    // if (isPlatformBrowser(this._platformId) && cached && !filter && params.page === 1) {
    //   Logger.debug('Using cached users I follow from TransferState');
    //   this._updateUsersIFollowState({
    //     response: cached.usersIFollow.response,
    //     isLoading: false,
    //     isFiltering: false,
    //     currentPage: cached.usersIFollow.currentPage,
    //     totalItems: cached.usersIFollow.totalItems,
    //     totalPages: cached.usersIFollow.totalPages,
    //     pagination: cached.usersIFollow.pagination
    //   });
    //   this._transferState.remove(ALL_USERS_I_FOLLOW_STATE_KEY);
    //   return;
    // }

    this._apiClient.TalbinahCommunityProfileUsersIFollow(params)
      .pipe(
        tap((response: IUsersIFollowResponseDto) => {
          // if (response && response.data?.data && response.data.data.length > 0) {
          //     this._updateUsersIFollowState({
          //         response: response.data.data,
          //         isLoading: isLoading === false ? false : !filter,
          //         currentPage: response?.data?.meta?.current_page,
          //         totalItems: response?.data?.meta?.total,
          //         totalPages: Math.ceil((response?.data?.meta?.total ?? 0) / (params.per_page || 1)),
          //         errorMessage: null,
          //         status: true
          //     });
          if (response && response.data) {
            this._updateUsersIFollowState({
              response: response.data,
              isLoading: isLoading === false ? false : !filter,
              // currentPage: response?.meta?.current_page,
              // totalItems: response?.meta?.total,
              // totalPages: Math.ceil((response?.meta?.total ?? 0) / (params.per_page || 1)),
              errorMessage: null,
              status: true
            });
            Logger.debug('Users I follow fetched successfully:', response);
          } else {
            this._updateUsersIFollowState({
              response: [],
              currentPage: params.page, // Keep current page even if no data
              totalItems: 0,
              totalPages: 1,
              errorMessage: ` 📭 ${this._localizationService.translateTextFromJson('messages.noUsersFound')}`, // TODO: Add this message to your localization JSON
              status: false
            });
            Logger.debug('No users I follow found.');
          }

          // Store full state for SSR
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(ALL_USERS_I_FOLLOW_STATE_KEY, this._featureState());
            Logger.debug('Stored users I follow state in TransferState for SSR');
          }
        }),
        catchError((error: ApiError) => {
          Logger.error('Error fetching users I follow:', error);
          handleApiErrors(error); // Shows toast messages via common handler
          this._updateUsersIFollowState({
            response: [],
            errorMessage: '🚨 Error loading followed users. Please try again later.',
            currentPage: params.page, // Keep current page
            totalItems: 0,
            totalPages: 1,
          });
          return EMPTY;
        }),
        finalize(() => {
          this._updateUsersIFollowState({
            isLoading: false,
            isFiltering: false
          });
        })
      )
      .subscribe();
  }

  /**
   * Removes a user from the current state locally after successful unfollow.
   * This prevents a full re-fetch of users for a single unfollow.
   * @param userId The ID of the user to remove.
   */
  removeUserLocally(userId: number): void {
    this._featureState.update(state => {
      const currentUsers = state.usersIFollow.response;
      const updatedUsers = currentUsers.filter(user => user.id !== userId);
      const newTotalItems = state.usersIFollow.totalItems - 1;
      const newTotalPages = Math.ceil(newTotalItems / (state.usersIFollow.pagination.per_page || 1));

      return {
        ...state,
        usersIFollow: {
          ...state.usersIFollow,
          response: updatedUsers,
          totalItems: newTotalItems < 0 ? 0 : newTotalItems, // Ensure non-negative
          totalPages: newTotalPages < 1 ? 1 : newTotalPages, // Ensure at least 1 page
        }
      };
    });
    Logger.debug(`User ID ${userId} removed locally from users I follow state.`);
  }

  /**
   * Resets the entire users I follow state to its initial values.
   */
  resetState(): void {
    this._featureState.set(initialUsersIFollowFeatureState);
    Logger.debug('Users I follow state has been reset.');
  }

  /**
   * Utility to update the users I follow list state immutably.
   * @param updates Partial state updates to apply.
   */
  private _updateUsersIFollowState(updates: Partial<UsersIFollowListState>): void {
    this._featureState.update(state => ({
      ...state,
      usersIFollow: {
        ...state.usersIFollow,
        ...updates
      }
    }));
  }
}

// Example of how you would define the API client method in ITalbinahCommunityApiClient
// This part would typically be in your TalbinahCommunityApiClient interface and implementation
// In TalbinahCommunityApiClient.ts:
/*
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient, IPaginationParameters } from '../../../common'; // Adjust path
import { IUsersIFollowResponseDto } from './dtos'; // Adjust path to your DTOs

export interface ITalbinahCommunityApiClient {
  TalbinahCommunityProfileUsersIFollow(paginationParameters?: IPaginationParameters): Observable<IUsersIFollowResponseDto>;
  // ... other methods
}

@Injectable({
  providedIn: 'root'
})
export class TalbinahCommunityApiClient implements ITalbinahCommunityApiClient {
  constructor(private readonly collectionApiClient: CollectionApiClient) {} // Assuming CollectionApiClient is your base API client

  TalbinahCommunityProfileUsersIFollow(paginationParameters?: IPaginationParameters): Observable<IUsersIFollowResponseDto> {
    return this.collectionApiClient.get({
      collectionName: 'TalbinahCommunityProfileUsersIFollow', // Or whatever your collection name is
      paginationParameters
    });
  }
  // ... other method implementations
}
*/
