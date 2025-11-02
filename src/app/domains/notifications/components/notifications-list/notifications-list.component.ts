import { Component, computed, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MyPsychologicalSocietyNotificationCardComponent } from "../../../talbinah-community/components/my-psychological-society-notification-card/my-psychological-society-notification-card.component";
import { Logger, CardType, NotificationFilterType, IPaginationParameters, defaultPaginationParameters } from '../../../../common';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { AutoExactHeightDirective, ClickOutsideDirective } from '../../../../common/core/directives';
import { getNotificationsError, NotificationsEmptyState } from '../../../talbinah-community';
import { NotificationsFacade } from '../../services/notifications.facade';
import { ModalService, SvgIconComponent } from '../../../../shared';
import { INotificationDto } from "../../dtos";
import { NotificationsSettingsModalComponent } from '../notifications-settings-modal';
import { Router } from '@angular/router';
import { TranslateApiPipe } from '../../../../common/core/translations';

interface FilterOption {
  label: string;
  value: NotificationFilterType | null;
}

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AutoExactHeightDirective,
    LazyLoadImageDirective,
    ClickOutsideDirective,
    MyPsychologicalSocietyNotificationCardComponent,
    SvgIconComponent,
    TranslateApiPipe
  ],
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {
  protected readonly facade = inject(NotificationsFacade);
  private readonly _modalService = inject(ModalService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _router = inject(Router);
  // State
  protected displayFilterPopup = false;
  protected selectedFilterType: string | null = null;
  protected currentAppliedFilterType: string | null = null;
  private _paginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 10 };

  // Constants
  protected readonly cardTypes = CardType;
  protected readonly notificationsEmptyState = NotificationsEmptyState;
  protected readonly filterOptions: FilterOption[] = [
    { label: 'all', value: null },
    { label: 'reservation', value: NotificationFilterType.RESERVATION },
    { label: 'special_offer', value: NotificationFilterType.OFFER },
    { label: 'podcast', value: NotificationFilterType.PODCAST },
    { label: 'talbinah_community2', value: NotificationFilterType.COMMUNITY },
    { label: 'sessions_tasks', value: NotificationFilterType.TASK }
  ];

  // Computed properties
  protected readonly notificationsErrorState = computed(() =>
    getNotificationsError(() => this.facade.fetchAllNotifications(
      1,
      this._paginationParams.per_page,
      false,
      this.currentAppliedFilterType
    ))
  );

  protected readonly isLoading = computed(() =>
    this.facade.isLoadingAllNotifications() && !this.facade.isLoadingMoreAllNotifications()
  );

  protected readonly isLoadingMore = computed(() =>
    this.facade.isLoadingMoreAllNotifications()
  );

  ngOnInit(): void {
    this.facade.fetchAllNotifications(
      this._paginationParams.page,
      this._paginationParams.per_page,
      false,
      this.currentAppliedFilterType
    );
  }

  protected openFilterPopup(): void {
    this.selectedFilterType = this.currentAppliedFilterType;
    this.displayFilterPopup = true;
  }

  protected applyFilter(value: string): void {
    this.currentAppliedFilterType = value;
    this.displayFilterPopup = false;
    this.facade.fetchAllNotifications(1, this._paginationParams.per_page, false, value);
  }

  protected resetFilter(): void {
    this.currentAppliedFilterType = null;
    this.displayFilterPopup = false;
    this.facade.fetchAllNotifications(1, this._paginationParams.per_page, true, null);
  }

  protected loadMoreNotifications(): void {
    if (this.facade.canLoadMoreAllNotifications()) {
      this.facade.loadMoreAllNotifications();
    }
  }

  protected handleNotificationInteraction(notification: INotificationDto): void {
    if (this.isBrowser()) {
      Logger.debug('Notification clicked:', notification);
      // Handle notification click logic here
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  protected openNotificationsSettings(): void {
    this._modalService.open(NotificationsSettingsModalComponent, {
      inputs: {
        image: 'images/notifications/notifications.png',
        title: 'notification_settings',
        // subtitle: 'enable_notifications'
      },
      outputs: {
        closed: () => {
          Logger.debug('Notifications Settingse Modal closed.');
        }
      },
      width: "30%"
    });
  }
  ngOnDestroy(): void {
    if (this.isBrowser()) {
      const currentUrl = this._router.url;
      if (currentUrl === '/' || currentUrl === '/home') {
        document.body.style.overflow = '';
      }
    }
  }
}
