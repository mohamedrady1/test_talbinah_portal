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
import { ICommunityNotificationsResponseDto } from '../dtos'; // Adjust path
import { CommunityNotificationsFeatureState, CommunityNotificationsListState, initialCommunityNotificationsFeatureState } from '../models';



const ALL_COMMUNITY_NOTIFICATIONS_STATE_KEY = makeStateKey<CommunityNotificationsFeatureState>('allCommunityNotifications');



@Injectable({
  providedIn: 'root'
})
export class CommunityNotificationsFacade {
  // --- Dependencies ---
  private readonly _apiClient: ITalbinahCommunityApiClient = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);



  // --- Feature State (Signal) ---
  private readonly _featureState = signal<CommunityNotificationsFeatureState>(initialCommunityNotificationsFeatureState);



  // --- Selectors (Computed) ---
  readonly notifications = computed(() => this._featureState().notifications.response);
  readonly isLoading = computed(() => this._featureState().notifications.isLoading);
  readonly isFiltering = computed(() => this._featureState().notifications.isFiltering);
  readonly errorMessage = computed(() => this._featureState().notifications.errorMessage);
  readonly status = computed(() => this._featureState().notifications.status);
  readonly totalItems = computed(() => this._featureState().notifications.totalItems);
  readonly currentPage = computed(() => this._featureState().notifications.currentPage);
  readonly totalPages = computed(() => this._featureState().notifications.totalPages);
  readonly currentPaginationParams = computed(() => this._featureState().notifications.pagination);



  constructor() {
    // Hydrate state from TransferState during client-side hydration
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get<CommunityNotificationsFeatureState>(
      //   ALL_COMMUNITY_NOTIFICATIONS_STATE_KEY,
      //   initialCommunityNotificationsFeatureState
      // );
      // if (cachedState) {
      //   Logger.debug('Hydrating community notifications from TransferState', cachedState);
      //   this._updateNotificationsState(cachedState.notifications);
      //   this._transferState.remove(ALL_COMMUNITY_NOTIFICATIONS_STATE_KEY);
      // }
    }
  }

  fetchAll(page?: number, filter: boolean = false, interestId?: number, user_id?: number, isLoading?: boolean): void {
    const currentParams = this._featureState().notifications.pagination;
    const params: IPaginationParameters = {
      page: page ?? currentParams.page,
      per_page: currentParams.per_page,
      user_id: user_id ? currentParams.user_id : null,
      interest_id: interestId ?? currentParams.interest_id,
      // total: currentParams.total,
      total: currentParams.total,
    };

    Logger.debug(`Fetching community notifications - Page: ${params.page}, Filter: ${filter}, Interest ID: ${params.interest_id}`);

    // Conditionally set isLoading and isFiltering based on the passed isLoading parameter
    this._updateNotificationsState({
      isLoading: isLoading === false ? false : !filter, // If isLoading is explicitly false, keep it false, otherwise use !filter
      isFiltering: filter,
      currentPage: params.page,
      pagination: params, // Update pagination params in state
      errorMessage: null,
      // status: false // Removed from here, it should be set based on API response
    });



    // Attempt to use cached data from TransferState on browser, but only if not filtering
    // const cached = this._transferState.get<CommunityNotificationsFeatureState>(
    //   ALL_COMMUNITY_NOTIFICATIONS_STATE_KEY,
    //   null as any
    // );
    // if (isPlatformBrowser(this._platformId) && cached && !filter && params.page === 1 && !params.interest_id) {
    //   Logger.debug('Using cached community notifications from TransferState');
    //   this._updateNotificationsState({
    //     response: cached.notifications.response,
    //     isLoading: false,
    //     isFiltering: false,
    //     currentPage: cached.notifications.currentPage,
    //     totalItems: cached.notifications.totalItems,
    //     totalPages: cached.notifications.totalPages,
    //     pagination: cached.notifications.pagination,
    //     status: cached.notifications.status
    //   });
    //   this._transferState.remove(ALL_COMMUNITY_NOTIFICATIONS_STATE_KEY);
    //   return;
    // }



    this._apiClient.TalbinahCommunityNotifications(params)
      .pipe(
        tap((response: ICommunityNotificationsResponseDto) => {
          if (response && response.data?.data && response.data.data.length > 0) {
            this._updateNotificationsState({
              response: response.data.data,
              isLoading: isLoading === false ? false : !filter, // If isLoading is explicitly false, keep it false, otherwise use !filter
              currentPage: response?.data?.meta?.current_page,
              totalItems: response?.data?.meta?.total,
              totalPages: Math.ceil(response?.data?.meta?.total ?? 0 / (params.per_page || 1)),
              errorMessage: null,
              status: true // Set to true on success with data
            });
            Logger.debug('Community notifications fetched successfully:', response);
          } else {
            this._updateNotificationsState({
              response: [],
              currentPage: params.page, // Keep current page even if no data
              totalItems: 0,
              totalPages: 1,
              errorMessage: ` 📭 ${this._localizationService.translateTextFromJson('messages.noNotificationsFound')}`,
              status: false // Set to false when no data
            });
            Logger.debug('No community notifications found.');
          }



          // Store full state for SSR
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(ALL_COMMUNITY_NOTIFICATIONS_STATE_KEY, this._featureState());
            Logger.debug('Stored community notifications state in TransferState for SSR');
          }
        }),
        catchError((error: ApiError) => {
          Logger.error('Error fetching community notifications:', error);
          handleApiErrors(error); // Shows toast messages via common handler
          this._updateNotificationsState({
            response: [],
            errorMessage: '🚨 Error loading notifications. Please try again later.',
            currentPage: params.page, // Keep current page
            totalItems: 0,
            totalPages: 1,
            status: false // Set to false on error
          });
          return EMPTY;
        }),
        finalize(() => {
          this._updateNotificationsState({
            isLoading: false,
            isFiltering: false
            // REMOVED: status: false from here
          });
        })
      )
      .subscribe();
  }

  setFilter(interestId: number | undefined): void {
    this._featureState.update(state => ({
      ...state,
      notifications: {
        ...state.notifications,
        pagination: {
          ...state.notifications.pagination,
          interest_id: interestId,
          page: 1 // Always reset to page 1 when changing filters
        }
      }
    }));
    Logger.debug(`Filter set in facade: interest_id=${interestId}`);
  }

  removeNotificationLocally(notificationId: number): void {
    this._featureState.update(state => {
      const currentNotifications = state.notifications.response;
      const updatedNotifications = currentNotifications.filter(notification => notification.id !== notificationId);
      const newTotalItems = state.notifications.totalItems - 1;
      const newTotalPages = Math.ceil(newTotalItems / (state.notifications.pagination.per_page || 1));

      return {
        ...state,
        notifications: {
          ...state.notifications,
          response: updatedNotifications,
          totalItems: newTotalItems < 0 ? 0 : newTotalItems, // Ensure non-negative
          totalPages: newTotalPages < 1 ? 1 : newTotalPages, // Ensure at least 1 page
        }
      };
    });
    Logger.debug(`Notification ID ${notificationId} removed locally from state.`);
  }

  resetState(): void {
    this._featureState.set(initialCommunityNotificationsFeatureState);
    Logger.debug('Community notifications state has been reset.');
  }

  private _updateNotificationsState(updates: Partial<CommunityNotificationsListState>): void {
    this._featureState.update(state => ({
      ...state,
      notifications: {
        ...state.notifications,
        ...updates
      }
    }));
  }
}
