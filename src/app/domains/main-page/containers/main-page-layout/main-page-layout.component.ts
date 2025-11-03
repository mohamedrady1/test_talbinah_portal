import {
  ChangeDetectorRef,
  Component,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  effect
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, EMPTY } from 'rxjs';
import { tap, catchError, finalize, takeUntil } from 'rxjs/operators';

import { TranslateModule } from '@ngx-translate/core';
import { QuickAccessFeaturesCardsComponent, BannerCarouselComponent } from '../../components';
import { CommentBoxComponent, CreatePsychologicalSocietyPostComponent, IUserIdentifyProfileData, IUserIdentifyProfileResponseDto, IPost, TalbinahCommunityApiClientProvider } from '../../../talbinah-community';
import { SiteHeaderComponent } from '../../../header';
import { StorageService, Logger, MetadataService, ApiError } from '../../../../common';
import { ModalService, LocalizationService, ToastService, StorageKeys } from '../../../../shared';
import { ITab } from '../../../talbinah-community/models';
import { MainPageRouteData } from '../../constants';
import { UserContextService } from '../../../authentication';
import { PaymentStateService, RoutePaymentInfo } from '../../../payments';
import { ActivatedRoute, Router } from '@angular/router';
import { UrgentAppointmentOpenService } from '../../../urgent-appointment/services/urgent-appointment-open.service';
import { BookUrgentAppointmentComponent } from '../../../urgent-appointment';
import { UrgentAppointmentHeaderConfig } from '../../../urgent-appointment';
import { MainPageApiClientProvider } from '../../clients';
import { IBannerItem } from '../../dtos';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-main-page-layout',
  standalone: true,
  imports: [
    QuickAccessFeaturesCardsComponent,
    BannerCarouselComponent,
    SiteHeaderComponent,
    TranslateModule,
    CommentBoxComponent
  ],
  templateUrl: './main-page-layout.component.html',
  styleUrls: ['./main-page-layout.component.scss'],
})
export class MainPageLayoutComponent implements OnInit, OnDestroy {
  private readonly translationsFacade = inject(TranslationsFacade);

  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);

  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }

  // ----- Signals -----
  public userIdentityProfileDataSignal = signal<IUserIdentifyProfileData | null>(null);
  private userIdentityProfileState = signal<{ profileResponse: IUserIdentifyProfileResponseDto | null }>({ profileResponse: null });
  public tabs = signal<ITab[]>([{ id: 0, title: 'All Posts' }]); // default tab
  private isLoadingInterests = signal<boolean>(false);
  private hasLoadedInterests = signal<boolean>(false);

  // Banners signal
  public banners = signal<IBannerItem[]>([]);

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // Input signals for comment box
  protected placeholderHeader = signal<string>('share_feelings');
  protected readonlyOnClick = signal<boolean>(true);

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _PostsApiClientProvider = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _ModalService = inject(ModalService);
  private readonly _LocalizationService = inject(LocalizationService);
  private readonly _ToastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly seo = inject(MetadataService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _MainPageApiClient = inject(MainPageApiClientProvider).getClient();

  private readonly _paymentStateService = inject(PaymentStateService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _Router = inject(Router);
  private readonly _urgentOpenService = inject(UrgentAppointmentOpenService);

  private readonly _destroy$ = new Subject<void>();

  // ----- Auth / Guest Computed -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  protected readonly isLoggedIn = computed(() => !!this.token());

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }


  constructor() {
    this.setSeoMeta();

    // keep userIdentityProfileDataSignal in sync
    effect(() => {
      this.userIdentityProfileDataSignal.set(
        this.userIdentityProfileState().profileResponse?.data || null
      );
    });

    // React to auth changes without reload
    effect(() => {

      if (this.isLoggedIn()) {
        this.loadUserIdentifyProfile();
      } else {
        // Clear user-related state when logged out
        this.userIdentityProfileState.set({ profileResponse: null });
        this.userIdentityProfileDataSignal.set(null);
      }
    });

  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.setBodyOverflow(); // Set body overflow-y to empty string for main page

    // Fetch interests to align tabs with other modules (e.g., MySavedPosts)
    this.fetchPostInterests();

    // Profile loading is handled by the auth-reactive effect; avoid duplicate call here

    // Listen for login state recalls to refresh token and trigger effects
    this._UserContextService.recallUserDataViewed
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.refreshLoginStatus();
        // Refresh interests after login so all main page components get updated tabs
        this.fetchPostInterests();
        // Refresh home content
        this.fetchHomeContent();
      });

    // Use takeUntil to automatically unsubscribe when the component is destroyed
    this._paymentStateService.routePaymentInfo$
      .pipe(takeUntil(this._destroy$))
      .subscribe((data: RoutePaymentInfo | null) => {
        if (data) {
          Logger.debug('MainPageLayoutComponent: RoutePaymentInfo received:', data);

          // ✅ 1. Open Status Info popup automatically
          this._paymentStateService.openPaymentStatusInfo({ ...data }, data.pageType || null);

          // ✅ 2. Clear query params from URL (SSR-safe)
          this._Router.navigate([], {
            relativeTo: this._activatedRoute,
            queryParams: {},
            replaceUrl: true
          });

          // ✅ 3. Clear in-memory payment state so it doesn't reopen
          this._paymentStateService.clearRoutePaymentInfo();
        }
      });

    // Listen for urgent appointment open requests
    this._urgentOpenService.openRequested$
      .pipe(takeUntil(this._destroy$))
      .subscribe((shouldOpen: boolean) => {
        if (shouldOpen) {
          this._ModalService.open(BookUrgentAppointmentComponent, {
            width: '50%',
            inputs: { ...UrgentAppointmentHeaderConfig },
            outputs: {
              closed: () => { }
            }
          });
          this._urgentOpenService.consume();
        }
      });
  }

  private fetchHomeContent(): void {
    this._MainPageApiClient.getHomeContent()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response) => {
          Logger.debug('Main Page => Home Content (fetchHomeContent): ', response);
          if (response?.data?.banners && Array.isArray(response.data.banners)) {
            this.banners.set(response.data.banners);
            Logger.debug('Banners loaded:', response.data.banners);
          }
        },
        error: (error) => {
          Logger.error('Failed to load home content:', error);
        }
      });
  }

  private fetchPostInterests(): void {
    if (this.isLoadingInterests()) {
      return; // Avoid parallel requests
    }
    this.isLoadingInterests.set(true);
    this._PostsApiClientProvider.getPostInterests()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response: any) => {
          const interests = Array.isArray(response?.data) ? response.data : [];
          const dynamicTabs = interests.map((interest: any) => ({ id: interest.id, title: interest.name }));
          const allPostsTab = { id: 0, title: this._LocalizationService.translateTextFromJson('general.allPosts') };
          this.tabs.set([allPostsTab, ...dynamicTabs]);
          this.hasLoadedInterests.set(true);
          this.isLoadingInterests.set(false);
        },
        error: () => {
          const allPostsTab = { id: 0, title: this._LocalizationService.translateTextFromJson('general.allPosts') };
          this.tabs.set([allPostsTab]);
          this.hasLoadedInterests.set(true);
          this.isLoadingInterests.set(false);
        }
      });
  }

  private setSeoMeta(): void {
    const { title, meta } = MainPageRouteData.MainPage;
    const lang = this._LocalizationService.getCurrentLanguage() as keyof typeof title;
    this.seo.setMetaTags({
      title: title[lang],
      description: meta.description[lang],
      keywords: 'main-page, home, talbinah, الصفحة الرئيسية, تلبينة',
      image: 'https://talbinah.net/dashboard_assets/Talbinah.png',
      url: 'https://talbinah.com/',
      robots: 'index, follow',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      canonical: 'https://talbinah.com/',
    });
  }

  private loadUserIdentifyProfile(): void {
    const storedProfile = this._StorageService.getItem<IUserIdentifyProfileData>(
      StorageKeys.MY_COMMUNITY_USER_PROFILE_DATA
    );
    if (storedProfile) {
      this.userIdentityProfileState.set({
        profileResponse: { data: storedProfile } as IUserIdentifyProfileResponseDto,
      });
      this.userIdentityProfileDataSignal.set(storedProfile);
    } else {
      this.fetchUserIdentifyProfile();
    }
  }

  private fetchUserIdentifyProfile(): void {
    Logger.debug('Fetching user identity profile…');
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
    if (response && response.data) {
      this.userIdentityProfileState.set({ profileResponse: response });
      this._StorageService.setItem(StorageKeys.MY_COMMUNITY_USER_PROFILE_DATA, response.data, true);
    } else {
      this.userIdentityProfileState.set({ profileResponse: null });
    }
    this.cdr.detectChanges();
  }

  private handleFetchUserIdentityProfileError(error: ApiError): void {
    Logger.error('Failed to fetch user identity profile:', error);
    this._ToastService.add({
      severity: 'error',
      summary: 'an_error_has_occurred',
      detail: error?.message || 'Failed to fetch user identity profile.',
      life: 5000
    });
  }

  private finalizeUserIdentityProfileFetch(): void {
    this.cdr.detectChanges();
  }

  protected openAddEditPostPopup(postItem?: IPost): void {
    if (!this.isBrowser) return;
    this._ModalService.open(CreatePsychologicalSocietyPostComponent, {
      inputs: {
        image: 'images/community/icons/header-icon.png',
        title: 'new_post',
        subtitle: 'your_posts_help_others_feel_not_alone',
        data: {
          interests: this.tabs(),
          itemToEdit: postItem,
          userIdentityProfileData: this.userIdentityProfileDataSignal(),
          fromMainPage: true,
        },
      },
      outputs: {
        closed: () => {
        }
      },
      width: '60%',
      minHeight: '20rem',
      maxHeight: '70rem',
      isPhoneFromDown: true,
    });
  }

  protected openReelsPopup(postItem?: IPost): void {
    if (!this.isBrowser) return;
    this._ModalService.open(CreatePsychologicalSocietyPostComponent, {
      inputs: {
        selectedButtonId: 'reels',
        data: {
          interests: this.tabs(),
          itemToEdit: postItem,
          userIdentityProfileData: this.userIdentityProfileDataSignal(),
        },
      },
      width: '60%',
      minHeight: '20rem',
      maxHeight: '70rem',
      isPhoneFromDown: true,
    });
  }

  private setBodyOverflow(): void {
    if (this.isBrowser) {
      // Set overflow-y to empty string only on main page
      document.body.style.overflowY = '';
    }
  }

  private resetBodyOverflow(): void {
    if (this.isBrowser) {
      // Reset to default when leaving main page
      document.body.style.overflowY = 'auto';
    }
  }

  ngOnDestroy(): void {
    this.resetBodyOverflow(); // Reset body overflow when leaving main page
    this._destroy$.next();
    this._destroy$.complete();
  }
}
