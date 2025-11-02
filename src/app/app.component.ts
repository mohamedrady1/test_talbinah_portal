import {
  NotificationFirebaseService,
  IGlobalPodcastItemModel,
  AppLanguageService,
  DEFAULT_META_TAGS,
  MetadataService,
  PlatformService,
  StorageService,
  RouteService,
  TranslationsFacade,
  Logger
} from './common';
import { OpenPodcastAudioPlayerState, PodcastAudioPlayerComponent, PodcastsListFacade, SiteHeaderComponent, UrgentAppointmentFloatingWindowComponent, checkReservationRequestFacade } from './domains';
import { UserContextService } from './domains/authentication/user-authentication/services/user-context.service';
import { ModalOutletComponent, StorageKeys, ToastService, MoodModalIntegrationService, NotificationSoundService, TranslationLoadingScreenComponent } from './shared';
// import { NotificationService } from './shared/services/notification.service';
// import { NotificationTypeEnum } from './shared/enums/notification-type.enum';
import { Component, OnInit, DoCheck, inject, signal, PLATFORM_ID, computed, effect } from '@angular/core';
import { ToastComponent } from './shared/components/toast/toast.component';
// import { NotificationComponent } from './shared/components/notification/notification.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import JSON_LD_SCHEMA from './common/assets/seo/schema.json';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TranslateModule,
    RouterModule,
    CommonModule,
    ToastModule,
    UrgentAppointmentFloatingWindowComponent,
    PodcastAudioPlayerComponent,
    ModalOutletComponent,
    SiteHeaderComponent,
    ToastComponent,
    TranslationLoadingScreenComponent,
    // NotificationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, DoCheck {
  readonly title = 'talbinah-portal';
  readonly isServer = signal<boolean>(false);
  readonly shouldRender = signal<boolean>(false);

  private readonly _ToastService = inject(ToastService);
  // private readonly _NotificationService = inject(NotificationService);
  private readonly _StorageService = inject(StorageService);
  private readonly _PodcastsListFacade = inject(PodcastsListFacade);
  private readonly _NotificationFirebaseService = inject(NotificationFirebaseService);
  private readonly _checkReservationRequestFacade = inject(checkReservationRequestFacade);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _NotificationSoundService = inject(NotificationSoundService);

  readonly shouldPodcastAudioPlayer = signal<boolean>(true);
  readonly shouldUrgentAppointmentFloatingWindow = signal<boolean>(true);
  protected selectedPodcast = signal<IGlobalPodcastItemModel | null>(null);
  protected selectedPodcastCurrentTime = signal<number>(0);

  // Translation loading state
  protected readonly isTranslationsLoading = computed(() => this._TranslationsFacade.isLoading());

  // ----- Auth / Guest Computed -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  protected readonly isLoggedIn = computed(() => !!this.token());

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  private readonly platformId = inject(PLATFORM_ID);
  private readonly platformService = inject(PlatformService);
  private readonly _AppLanguageService = inject(AppLanguageService);
  private readonly _TranslationsFacade = inject(TranslationsFacade);
  private readonly routeService = inject(RouteService);
  private readonly metadataService = inject(MetadataService);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);

  constructor() {
    this.platformService.detect();
    this.routeService.listen();
    this.shouldRender.set(this.routeService.shouldRender());
    this.isServer.set(this.platformService.isServer());

    // Effect to monitor login status changes and check for urgent appointments
    effect(() => {
      const isLoggedIn = this.isLoggedIn();
      if (isLoggedIn && isPlatformBrowser(this.platformId)) {
        Logger.debug('User logged in, checking for urgent appointment reservation');
        this._checkReservationRequestFacade.checkReservationOnStartup();
      }
    });
  }

  ngOnInit(): void {
    // Refresh login status on component initialization
    this.refreshLoginStatus();

    this._PodcastsListFacade._openPodcastAudioPlayer$.subscribe((subscribe: OpenPodcastAudioPlayerState | null) => {
      this.shouldPodcastAudioPlayer.set(subscribe?.isOpen ?? false);
      this.selectedPodcast.set(subscribe?.item ?? null);
      this.selectedPodcastCurrentTime.set(subscribe?.currentTime ?? 0);
    });

    // Subscribe to urgent appointment window state
    this._checkReservationRequestFacade._openUrgentAppointmentWindow$.subscribe((state) => {
      // Only show floating window if it's open AND search waiting doctor modal is not open
      const shouldShow = (state?.isOpen ?? false) && !this._checkReservationRequestFacade.isSearchWaitingDoctorOpen();
      this.shouldUrgentAppointmentFloatingWindow.set(shouldShow);
    });

    // Subscribe to user data changes (login/logout)
    this._UserContextService.recallUserDataViewed.subscribe((emitted: boolean) => {
      if (emitted && isPlatformBrowser(this.platformId)) {
        this.refreshLoginStatus();
        Logger.debug('User data changed, refreshed login status');
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const existingToken = localStorage.getItem(StorageKeys.FCM_TOKEN);
      this._NotificationFirebaseService.initialize(existingToken);

      this._NotificationFirebaseService.currentMessage$.subscribe(payload => {
        if (payload) {
          this.handleNotificationPayload(payload);
        }
      });

      this.isServer.set(false);
      queueMicrotask(async () => {
        this.platformService.setIsServer(false);
        this._AppLanguageService.initialize();
        this.metadataService.setMetaTags(DEFAULT_META_TAGS);
        this.metadataService.injectJSONLdSchema(JSON_LD_SCHEMA);
        this.metadataService.injectGoogleTagManager('GTM-XXXX');

        // Initialize API translations for current language
        this.initializeTranslations();

        // Check reservation request will be called automatically when user logs in via the effect
      });


      // setTimeout(() => {
      //   this._NotificationService.add({
      //     title: 'تم تأكيد الحجز ✅',
      //     body: 'موعدك مع د.أحمد يوم السبت 10 صباحاً',
      //     type: NotificationTypeEnum.RESERVATION,
      //     data: { 
      //       reservationId: 123,
      //       notification_id: 79689 // ✅ ID for mark as read API
      //     }
      //   });
      // }, 2000);

      // setTimeout(() => {
      //   this._NotificationService.add({
      //     title: 'حلقة جديدة 🎙️',
      //     body: 'استمع الآن: كيف تتعامل مع القلق والتوتر',
      //     type: NotificationTypeEnum.PODCAST,
      //     data: { podcastId: 456 }
      //   });
      // }, 4000);

      // setTimeout(() => {
      //   this._NotificationService.add({
      //     title: 'تفاعل جديد 💬',
      //     body: 'أحمد محمد علق على منشورك في المجتمع',
      //     type: NotificationTypeEnum.COMMUNITY,
      //     data: { 
      //       postId: 789,
      //       userId: 101 
      //     }
      //   });
      // }, 6000);

      // setTimeout(() => {
      //   this._NotificationService.add({
      //     title: 'مهمة جديدة 📝',
      //     body: 'لديك مهمة منزلية من جلستك الأخيرة مع الطبيب',
      //     type: NotificationTypeEnum.TASK,
      //     data: { 
      //       sessionId: 555,
      //       taskId: 888 
      //     }
      //   });
      // }, 8000);

      // setTimeout(() => {
      //   this._NotificationService.add({
      //     title: 'عرض خاص! 🎉',
      //     body: 'احصل على خصم 30% على البرنامج العلاجي الشامل',
      //     type: NotificationTypeEnum.OFFER,
      //     data: { 
      //       offerId: 999,
      //       discountPercentage: 30 
      //     }
      //   });
      // }, 10000);

      // setTimeout(() => {
      //   this._NotificationService.add({
      //     title: 'تذكير بالجلسة ⏰',
      //     body: 'جلستك مع د.سارة ستبدأ بعد 15 دقيقة',
      //     type: NotificationTypeEnum.SESSION_REMINDER,
      //     data: { sessionId: 777 }
      //   });
      // }, 12000);

      // setTimeout(() => {
      //   this._NotificationService.add({
      //     title: 'تم بنجاح ✅',
      //     body: 'تم حفظ التغييرات بنجاح',
      //     type: NotificationTypeEnum.SUCCESS
      //   });
      // }, 14000);

      // setTimeout(() => {
      //   this._NotificationService.add({
      //     title: 'تحذير ⚠️',
      //     body: 'يرجى استكمال ملفك الشخصي للحصول على تجربة أفضل',
      //     type: NotificationTypeEnum.WARNING,
      //     data: { url: '/settings/profile' }
      //   });
      // }, 16000);

      // setTimeout(() => {
      //   this._NotificationService.add({
      //     title: 'حدث خطأ ❌',
      //     body: 'فشل الاتصال بالخادم، يرجى المحاولة مرة أخرى',
      //     type: NotificationTypeEnum.ERROR
      //   });
      // }, 18000);

      // setTimeout(() => {
      //   const notifications = [
      //     { title: '🔴 حجز', body: 'حجز جديد', type: NotificationTypeEnum.RESERVATION, data: { reservationId: 1 } },
      //     { title: '🟠 بودكاست', body: 'حلقة جديدة', type: NotificationTypeEnum.PODCAST, data: { podcastId: 2 } },
      //     { title: '🔵 مجتمع', body: 'تفاعل جديد', type: NotificationTypeEnum.COMMUNITY, data: { postId: 3 } },
      //     { title: '🟡 مهمة', body: 'مهمة جديدة', type: NotificationTypeEnum.TASK, data: { sessionId: 4 } },
      //     { title: '🟢 عرض', body: 'عرض خاص', type: NotificationTypeEnum.OFFER, data: { offerId: 5 } }
      //   ];
      //   
      //   notifications.forEach((notif, index) => {
      //     setTimeout(() => {
      //       this._NotificationService.add(notif as any);
      //     }, index * 1500);
      //   });
      // }, 2000);
    }
  }

  private handleNotificationPayload(payload: any) {
    Logger.debug('App Component | handleNotificationPayload | payload: ', payload);

    const title = payload?.data?.title || payload?.notification?.title || 'Notification';
    const body = payload?.data?.body || payload?.notification?.body || '';
    const notificationType = payload?.data?.type || payload?.notification?.type || 'general';
    const notificationId = payload?.data?.notification_id || payload?.notification?.notification_id;

    // Play notification sound with lower volume (30%)
    this._NotificationSoundService.playNotificationSound(0.3);
    // Show in-app toast
    this._ToastService.add({
      severity: 'info', // could map severity based on payload.data.type
      summary: title,
      detail: body,
      life: 5000 // 5 seconds
    });

    // const notificationType = payload?.data?.type || payload?.notification?.type;

    // this._NotificationService.add({
    //   title: title,
    //   body: body,
    //   type: notificationType,
    //   icon: 'images/icons/logo-2.png',
    //   life: 88888000, // 8 seconds
    //   data: {
    //     ...payload?.data,
    //     notification_id: notificationId // ✅ Include notification_id for mark as read
    //   }
    // });

    switch (notificationType) {
      case 'session_reminder':
        this.handleSessionReminder(payload);
        break;
      case 'new_message':
        this.handleNewMessage(payload);
        break;
      default:
        this.handleDefaultNotification(payload);
    }
  }


  private handleSessionReminder(payload: any) {
    console.log('Session reminder:', payload);
    // Add specific handling for session reminders
  }

  private handleNewMessage(payload: any) {
    console.log('New message:', payload);
    // Add specific handling for new messages
  }

  private handleDefaultNotification(payload: any) {
    console.log('Default notification:', payload);
    // Add default handling for other notifications
  }

  /**
   * Initialize API translations for current language
   * Loads translations from API with caching and TransferState support
   */
  private initializeTranslations(): void {
    const currentLang = this._StorageService.getItem<string>(StorageKeys.LANGUAGE) || 'ar';

    Logger.debug(`[AppComponent] Initializing API translations for ${currentLang}`);

    this._TranslationsFacade.initialize(currentLang).subscribe({
      next: () => {
        Logger.debug(`[AppComponent] API translations loaded successfully for ${currentLang}`);
      },
      error: (error) => {
        Logger.error('[AppComponent] Failed to load API translations', error);
      }
    });
  }

  ngDoCheck(): void {
    this.routeService.updateShouldRender();
    this.shouldRender.set(this.routeService.shouldRender());
  }
}
