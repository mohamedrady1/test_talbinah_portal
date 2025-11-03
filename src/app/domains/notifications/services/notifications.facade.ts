// notifications.facade.ts
import { ApiError, handleApiErrors, IPaginationParameters, defaultPaginationParameters, Logger } from '../../../common';
import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { LocalizationService, ToastService } from '../../../shared';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { INotificationsApiClient, NotificationsApiClientProvider } from '../clients';
import { INotificationsListingResponseDto, IMarkNotificationReadResponseDto } from '../dtos';
import { NotificationsFeatureState, NotificationsListState, initialNotificationsFeatureState, initialNotificationsListState } from '../models';

const ALL_NOTIFICATIONS_STATE_KEY = makeStateKey<NotificationsListState>('allNotificationsState');

@Injectable({
  providedIn: 'root',
})
export class NotificationsFacade {
  private _apiClient = inject(NotificationsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  private readonly _featureState = signal<NotificationsFeatureState>(initialNotificationsFeatureState);
  private _allNotificationsPaginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 10 };

  // Computed properties
  readonly allNotifications = computed(() => this._featureState().allNotifications.response);
  readonly isLoadingAllNotifications = computed(() => this._featureState().allNotifications.isLoading);
  readonly isLoadingMoreAllNotifications = computed(() => this._featureState().allNotifications.isLoadingMore);
  readonly allNotificationsStatus = computed(() => this._featureState().allNotifications.state);
  readonly allNotificationsErrorMessage = computed(() => this._featureState().allNotifications.errorMessage);
  readonly totalAllNotificationsItems = computed(() => this._featureState().allNotifications.totalItems);
  readonly currentAllNotificationsPage = computed(() => this._featureState().allNotifications.currentPage);
  readonly totalAllNotificationsPages = computed(() => this._featureState().allNotifications.totalPages);
  readonly canLoadMoreAllNotifications = computed(() =>
    (this.allNotifications()?.length || 0) < this.totalAllNotificationsItems()
  );

  // Unread notifications count
  readonly unreadCount = computed(() => {
    const notifications = this.allNotifications();
    return notifications?.filter(n => n.is_read === 0)?.length || 0;
  });

  fetchAllNotifications(
    page: number = 1,
    per_page: number = 10,
    filter: boolean = false,
    type: string | null = null
  ): void {
    Logger.debug(`Fetching notifications for page ${page}, type: ${type}`);

    this._allNotificationsPaginationParams = {
      ...this._allNotificationsPaginationParams,
      page,
      per_page,
      type: type ?? undefined
    };

    this.updateNotificationsListState('allNotifications', {
      isLoading: !filter,
      isFiltering: filter,
      isLoadingMore: false,
      errorMessage: null,
      state: null,
      currentPage: page,
      response: filter ? this._featureState().allNotifications.response : [],
      totalItems: filter ? this._featureState().allNotifications.totalItems : 0
    });

    this._apiClient.getAll(this._allNotificationsPaginationParams)
      .pipe(
        tap((response) => this.processNotificationsResponse(response, 'allNotifications')),
        catchError((error) => {
          this.handleFetchError(error, 'allNotifications', error.error);
          return EMPTY;
        }),
        finalize(() => this.finalizeFetch('allNotifications'))
      )
      .subscribe();
  }

  loadMoreAllNotifications(): void {
    if (!this.canLoadMoreAllNotifications()) return;

    const nextPage = (this.currentAllNotificationsPage() || 0) + 1;
    Logger.debug(`Loading more notifications - page ${nextPage}`);

    this.updateNotificationsListState('allNotifications', {
      isLoadingMore: true
    });

    this._allNotificationsPaginationParams.page = nextPage;

    this._apiClient.getAll(this._allNotificationsPaginationParams)
      .pipe(
        tap((response) => {
          const currentItems = this._featureState().allNotifications.response || [];
          const newItems = response.data?.data || [];

          this.updateNotificationsListState('allNotifications', {
            response: [...currentItems, ...newItems],
            currentPage: nextPage,
            state: true
          });
        }),
        catchError((error) => {
          this.handleFetchError(error, 'allNotifications', 'an_error_has_occurredLoadingMoreNotifications');
          return EMPTY;
        }),
        finalize(() => {
          this.updateNotificationsListState('allNotifications', {
            isLoadingMore: false
          });
        })
      )
      .subscribe();
  }

  private processNotificationsResponse(response: INotificationsListingResponseDto, listKey: keyof NotificationsFeatureState): void {
    const dataArray = response.data?.data || [];
    const meta = {
      total: response?.data?.total || 0,
      last_page: response?.data?.last_page || 1
    };

    this.updateNotificationsListState(listKey, {
      response: dataArray,
      totalItems: meta.total,
      totalPages: meta.last_page,
      errorMessage: dataArray.length ? null : this._localizationService.translateTextFromJson('notifications.emptyState.noNotificationsInCategory'),
      state: true
    });

    if (!isPlatformBrowser(this._platformId)) {
      this._transferState.set(ALL_NOTIFICATIONS_STATE_KEY, this._featureState().allNotifications);
    }
  }

  private updateNotificationsListState(
    listKey: keyof NotificationsFeatureState,
    updates: Partial<NotificationsListState>
  ): void {
    this._featureState.update(current => ({
      ...current,
      [listKey]: { ...current[listKey], ...updates }
    }));
  }

  private handleFetchError(error: ApiError, listKey: keyof NotificationsFeatureState, translationKey: string): void {
    Logger.error(`Error fetching ${listKey} notifications:`, error);
    handleApiErrors(error);

    this._toastService.add({
      severity: 'error',
      summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
      detail: this._localizationService.translateTextFromJson(translationKey),
      life: 5000
    });

    this.updateNotificationsListState(listKey, {
      errorMessage: this._localizationService.translateTextFromJson(translationKey),
      state: false
    });
  }

  private finalizeFetch(listKey: keyof NotificationsFeatureState): void {
    this.updateNotificationsListState(listKey, {
      isLoading: false,
      isFiltering: false
    });
  }

  /**
   * Mark notification as read
   * @param notificationId - The notification ID to mark as read
   */
  markAsRead(notificationId: number): void {
    if (!isPlatformBrowser(this._platformId)) {
      Logger.debug('NotificationsFacade | SSR: markAsRead skipped');
      return;
    }

    Logger.debug('NotificationsFacade | Marking notification as read:', notificationId);

    this._apiClient.markAsRead(notificationId)
      .pipe(
        tap((response) => {
          if (response.status) {
            Logger.debug('NotificationsFacade | Notification marked as read successfully');
            // Optionally update local state to mark as read
            const currentNotifications = this.allNotifications();
            if (currentNotifications) {
              const updatedNotifications = currentNotifications.map(notif =>
                notif.id === notificationId ? { ...notif, is_read: 1 as 0 | 1 } : notif
              );
              this.updateNotificationsListState('allNotifications', {
                response: updatedNotifications
              });
            }
          }
        }),
        catchError((error) => {
          Logger.error('NotificationsFacade | Error marking notification as read:', error);
          handleApiErrors(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  resetNotifications(): void {
    this._featureState.set(initialNotificationsFeatureState);
    this._allNotificationsPaginationParams = { ...defaultPaginationParameters, per_page: 10 };
    Logger.debug('Notifications state has been reset.');
  }
}