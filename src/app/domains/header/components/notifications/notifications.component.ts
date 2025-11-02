import { getProfileNotificationsError, NotificationsFacade, NotificationsListComponent, NotificationsProfileEmptyState, RoleGuardService, TalbinahCommunityRoutesEnum, UserContextService } from '../../../../domains';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output, PLATFORM_ID, signal } from '@angular/core';
import { CardType, ClickOutsideDirective, defaultPaginationParameters, IPaginationParameters, Logger, StorageService } from '../../../../common';
import { isBrowser, ModalService, PublicService, StorageKeys, SvgIconComponent } from '../../../../shared';
import { HeaderNotificationCardComponent } from '../header-notification-card';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,

    HeaderNotificationCardComponent,
    ClickOutsideDirective,
    SvgIconComponent
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input() type: string = 'default';
  @Output() notificationAction: EventEmitter<string> = new EventEmitter<string>();

  private readonly _ModalService = inject(ModalService);
  protected readonly _NotificationsFacade = inject(NotificationsFacade);
  private readonly _PublicService = inject(PublicService);
  private readonly roleGuard = inject(RoleGuardService);
  protected readonly isGuestSignal = this.roleGuard.isGuest;

  protected currentLanguage = signal<string>('en');
  protected openNotifications = signal<boolean>(false);

  protected cardType = CardType;
  protected readonly notificationsEmptyState = NotificationsProfileEmptyState;
  protected readonly notificationsErrorState = getProfileNotificationsError(() => this._NotificationsFacade.fetchAllNotifications(this._paginationParams.page ?? 1));

  private _paginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 10 };

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
    if (isBrowser()) {
      this.currentLanguage.set(this._PublicService.getCurrentLanguage() || 'en');
    }
  }
  ngOnInit(): void { }

  protected toggleNotifications(): void {
    this.refreshLoginStatus();

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }
    const willOpen = !this.openNotifications();
    this.openNotifications.set(willOpen);

    if (willOpen) {
      this.setUpFetchDataAfterLogin();
    }

    Logger.debug(`Notifications dropdown toggled to: ${willOpen}`);
  }


  protected closeNotifications(): void {
    this.refreshLoginStatus();

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }
    if (this.openNotifications()) {
      this.openNotifications.set(false);
      Logger.debug('Notifications dropdown closed by click outside.');
    }
  }


  protected triggerAction(item: any): void {
    if (!this.isBrowser) {
      Logger.debug('NotificationsComponent | SSR: Navigation skipped');
      return;
    }

    Logger.debug('NotificationsComponent | Notification clicked:', item);

    // Mark as read if not already read
    if (item.is_read === 0 && item.id) {
      Logger.debug('NotificationsComponent | Marking notification as read:', item.id);
      this._NotificationsFacade.markAsRead(item.id);
    }

    // Navigate based on page and pageID
    if (item.page && item.pageID) {
      this.navigateToNotificationPage(item);
    } else if (item.link) {
      // Fallback to link if available
      this._Router.navigate([item.link]);
    }

    // Close dropdown
    this.openNotifications.set(false);
    this.notificationAction.emit(item);
  }

  private navigateToNotificationPage(item: any): void {
    const page = item.page;
    const pageID = item.pageID;

    Logger.debug('NotificationsComponent | Navigating to:', page, pageID);

    switch (page) {
      case 'postDetails':
      case 'user_followed':
      case 'community':
        // Navigate to community
        this._Router.navigate([TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE], {
          queryParams: { postId: pageID }
        });
        break;

      case 'appointment':
      case 'session':
      case 'reservation':
        // Navigate to appointments
        this._Router.navigate([`appointments/${pageID}`]);
        break;

      case 'podcast':
        // Navigate to podcasts
        this._Router.navigate(['podcasts'], {
          queryParams: { id: pageID }
        });
        break;

      case 'task':
        // Navigate to session with task
        this._Router.navigate([`appointments/session/${pageID}`]);
        break;

      case 'offer':
      case 'program':
        // Navigate to therapeutic programs
        this._Router.navigate(['therapeutic-programs'], {
          queryParams: { offerId: pageID }
        });
        break;

      default:
        // Fallback navigation
        if (item.link) {
          this._Router.navigate([item.link]);
        }
        Logger.warn('NotificationsComponent | Unknown page type:', page);
    }
  }

  protected viewAllNotifications(): void {
    this.closeNotifications();
    this._ModalService.open(NotificationsListComponent, {
      inputs: {
        image: 'images/notifications/notifications.png',
        title: 'notifications',
        subtitle: 'notifications_subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { isSaved: boolean } | void): void => {
          Logger.debug('viewAllNotifications => Modal closed with data:', data);

        }
      },
      width: '70%',
      minHeight: '50%',
      maxHeight: '70%'
    });
  }
  /** Set up listener to fetch data after login */
  private setUpFetchDataAfterLogin(): void {
    this._UserContextService.recallUserDataViewed
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('TalbinahCommunityLayoutComponent | currentUrl:', currentUrl);

        if (currentUrl.startsWith('/') && this.isBrowser) {
          this.refreshLoginStatus();
          if (this.isLoggedIn()) {
            this._NotificationsFacade.fetchAllNotifications(1, this._paginationParams.per_page, false, null);
          } else {
            this._NotificationsFacade.resetNotifications();
          }
        }
      });
  }
}
