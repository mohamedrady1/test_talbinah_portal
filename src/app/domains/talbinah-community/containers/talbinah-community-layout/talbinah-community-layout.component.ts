// talbinah-community-layout.component.ts
import { Component, inject, signal, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit, effect, PLATFORM_ID, computed } from '@angular/core';
import { ILayoutGridHeaderConfig, PageLayoutHeaderComponent, ErrorStateCardComponent, MoodModalIntegrationService, StorageKeys, LocalizationService } from '../../../../shared';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { MainPageShemmerComponent, MyPsychologicalSocietyComponent, PsychologicalSocietyMainPageComponent } from '../../components';
import { TalbinahCommunityHeaderConfig, TalbinahCommunityRoutesEnum, TalbinahCommunityRouteData } from '../../constants';
import { MainPageRoutesEnum } from '../../../main-page';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GetCommunity } from '../../configs';
import { UserIdentityProfileFacade, CommunityPostsFacade, CommunityNotificationsFacade, PostInterestsFacade, IdentityFormFacade } from '../../services';
import { IUserIdentifyProfileData } from '../../dtos';
import { SiteHeaderComponent } from '../../../header';
import { RoleGuardService, UserContextService } from '../../../authentication';
import { Logger, StorageService, MetadataService } from '../../../../common';

@Component({
  selector: 'app-talbinah-community-layout',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AutoExactHeightDirective,
    SiteHeaderComponent,
    PageLayoutHeaderComponent,
    PsychologicalSocietyMainPageComponent,
    MainPageShemmerComponent,
    ErrorStateCardComponent,
    MyPsychologicalSocietyComponent
  ],
  templateUrl: './talbinah-community-layout.component.html',
  styleUrls: ['./talbinah-community-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TalbinahCommunityLayoutComponent implements OnInit {
  private readonly seo = inject(MetadataService);
  private readonly localization = inject(LocalizationService);
  protected readonly _UserIdentityProfileFacade = inject(UserIdentityProfileFacade);
  private readonly _CommunityPostsFacade = inject(CommunityPostsFacade);
  private readonly _CommunityNotificationsFacade = inject(CommunityNotificationsFacade);
  private readonly _PostInterestsFacade = inject(PostInterestsFacade);
  private readonly _IdentityFormFacade = inject(IdentityFormFacade);
  private readonly router = inject(Router);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);

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

  @ViewChild('card') cardRef!: ElementRef<HTMLElement>;

  readonly isFullscreen = signal(false);
  readonly headerConfig: ILayoutGridHeaderConfig = TalbinahCommunityHeaderConfig;
  protected readonly userIdentityProfileLoaded = signal(false);
  protected readonly userIdentityProfileErrorState = signal<any | null>(null);
  // Expose facade properties with same names as before
  readonly userIdentityProfileDataSignal = signal<IUserIdentifyProfileData | null>(null);
  get isLoadingUserIdentity() {
    return this._UserIdentityProfileFacade.isLoadingUserIdentity;
  }
  get errorMessageUserIdentity() {
    return this._UserIdentityProfileFacade.errorMessageUserIdentity;
  }
  get isUserIdentityProfile() {
    return this._UserIdentityProfileFacade.isUserIdentityProfile;
  }

  constructor() {
    this.setSeoMeta();

    // Reactively track user identity profile loading state
    effect(() => {
      const userIdentityProfile = this._UserIdentityProfileFacade.userIdentityProfile();
      const isLoading = this._UserIdentityProfileFacade.isLoadingUserIdentity();
      const errorMessage = this._UserIdentityProfileFacade.errorMessageUserIdentity();

      // Update loaded state based on whether we have data or finished loading
      if (userIdentityProfile) {
        this.userIdentityProfileLoaded.set(true);
        this.userIdentityProfileDataSignal.set(userIdentityProfile);
        this.userIdentityProfileErrorState.set(null); // Clear error state on success
      } else if (!isLoading && errorMessage) {
        // If not loading and there's an error, set loaded to true but show error
        this.userIdentityProfileLoaded.set(false);
        this.userIdentityProfileErrorState.set(
          GetCommunity(() => this._UserIdentityProfileFacade.fetchUserIdentifyProfile())
        );
      } else if (!isLoading && !errorMessage) {
        // If not loading and no error, but no data either, set loaded to true
        this.userIdentityProfileLoaded.set(true);
        this.userIdentityProfileErrorState.set(null);
      }
    });
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    if (this.isLoggedIn()) {
      Logger.debug('TalbinahCommunityLayoutComponent: User is logged in, fetching user identity profile');
      this._UserIdentityProfileFacade.fetchUserIdentifyProfile();
    } else {
      Logger.debug('TalbinahCommunityLayoutComponent: User is not logged in, resetting all data');
      this.resetAllData();
    }

    // Show mood modal on talbinah community page (if conditions are met)
    setTimeout(() => {
      // this.moodModalIntegrationService.checkMoodModal();
    }, 2500); // 2.5 seconds delay to ensure page is loaded

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
          if (this.isLoggedIn()) {
            Logger.debug('TalbinahCommunityLayoutComponent: User logged in, fetching user identity profile');
            this._UserIdentityProfileFacade.fetchUserIdentifyProfile();
          } else {
            Logger.debug('TalbinahCommunityLayoutComponent: User logged out, resetting all data');
            this.resetAllData();
          }
        }
      });
  }

  /** Reset all component data when user logs out */
  private resetAllData(): void {
    Logger.debug('TalbinahCommunityLayoutComponent: Resetting all community data');

    // Reset user identity profile facade
    this._UserIdentityProfileFacade.resetProfile();

    // Reset community posts facade
    this._CommunityPostsFacade.resetState();

    // Reset community notifications facade
    this._CommunityNotificationsFacade.resetState();

    // Note: PostInterestsFacade doesn't have a resetState method
    // Post interests are typically fetched fresh when needed

    // Reset identity form facade
    this._IdentityFormFacade.resetState();

    // Reset component state signals
    this.userIdentityProfileLoaded.set(false);
    this.userIdentityProfileErrorState.set(null);
    this.userIdentityProfileDataSignal.set(null);

    Logger.debug('TalbinahCommunityLayoutComponent: All community data has been reset');
  }

  protected onCloseRequested(): void {
    if (!this.isBrowser) return;
    this.router.navigate([`/${MainPageRoutesEnum.MAINPAGE}`]);
  }

  protected onUserIdentityUpdated(updatedData: IUserIdentifyProfileData): void {
    if (!this.isBrowser) return;
    if (this.isLoggedIn()) {
      this._UserIdentityProfileFacade.updateProfileData(updatedData);
      // Optional: Re-fetch to ensure sync with backend
      this._UserIdentityProfileFacade.fetchUserIdentifyProfile();
    }
  }

  private setSeoMeta(): void {
    const { title, meta } = TalbinahCommunityRouteData.TalbinahCommunityMainPage;
    const lang = this.localization.getCurrentLanguage() as keyof typeof title;
    this.seo.setMetaTags({
      title: title[lang],
      description: meta.description[lang],
      keywords: 'talbinah, community, psychological society, mental health, مجتمع, صحة نفسية, تلبينة',
      image: 'https://talbinah.net/dashboard_assets/Talbinah.png',
      url: 'https://talbinah.com/khawiik',
      robots: 'index, follow',
      locale: lang === 'en' ? 'en_US' : 'ar_SA',
      canonical: 'https://talbinah.com/khawiik',
    });
  }
}
