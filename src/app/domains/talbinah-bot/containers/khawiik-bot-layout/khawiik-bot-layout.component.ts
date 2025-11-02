import { PageLayoutHeaderComponent } from './../../../../shared/components/page-layout-header/page-layout-header.component';
import { SiteHeaderComponent } from './../../../header/containers/site-header/site-header.component';
import { AutoExactHeightDirective } from './../../../../common/core/directives/clickOutside/auto-exact-height.directive';
import {
  CommonModule,
  isPlatformBrowser,
} from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
  inject,
  signal,
  computed,
  effect,
  HostListener,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import {
  IGlobalUserContactInfoModel,
  Logger,
  MetadataService,
  StorageService,
} from '../../../../common';
import {
  ILayoutGridHeaderConfig,
  LocalizationService,
  MoodModalIntegrationService,
  StorageKeys,
} from '../../../../shared';
import { MainPageRoutesEnum } from '../../../main-page';
import { IChatHistoryItemDataDto } from '../../dtos';
import { ChatHistoryFacade } from '../../services';
import { khawiiHeaderConfig, KhawiikBotRouteData, KhawiikBotRoutesEnum } from '../../constants';
import { filter } from 'rxjs/operators';
import { UserContextService } from '../../../authentication';


@Component({
  selector: 'app-khawiik-bot-layout',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    AutoExactHeightDirective,
    SiteHeaderComponent,
    PageLayoutHeaderComponent,
  ],
  templateUrl: './khawiik-bot-layout.component.html',
  styleUrls: ['./khawiik-bot-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KhawiikBotLayoutComponent implements OnInit, AfterViewInit {
  // ====== Config ======
  readonly headerConfig: ILayoutGridHeaderConfig =
    khawiiHeaderConfig;

  // ====== Dependencies ======
  private readonly _storageService = inject(StorageService);
  private readonly _userContextService = inject(UserContextService);

  private readonly seo = inject(MetadataService);
  private readonly localization = inject(LocalizationService);

  private readonly chatHistoryFacade = inject(ChatHistoryFacade);
  private readonly router = inject(Router);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);

  // ====== SSR flags ======
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser: boolean;
  private readonly screenWidth = signal<number>(1200);
  protected hasChatBackground = signal<boolean>(false);

  // ====== State Signals ======
  readonly isLoadingHistory = this.chatHistoryFacade.isLoading;
  readonly errorMessageHistory = this.chatHistoryFacade.errorMessage;

  readonly chatSelectedItem = signal<IChatHistoryItemDataDto | null>(null);
  readonly chatTitle = signal<string>('عنوان الشات');
  readonly isFullscreen = signal<boolean>(false);

  // ====== Responsive Computeds ======
  readonly itemsPerPage = computed<number>(() => {
    const width = this.screenWidth();
    if (width < 640) return 1;
    if (width < 768) return 2;
    return 4;
  });

  readonly skeletonCount = computed<number>(() => {
    const width = this.screenWidth();
    if (width < 640) return 1;
    if (width < 768) return 2;
    return 2;
  });

  // ====== Template Refs ======
  @ViewChild('card', { static: false })
  private _cardRef!: ElementRef<HTMLElement>;

  // Signal version for template binding
  protected cardRef = signal<ElementRef<HTMLElement> | null>(null);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.screenWidth.set(window.innerWidth);
    }
    if (this.isBrowser) {
      effect(() => {
        const newTitle = this.chatSelectedItem()?.name ?? 'عنوان الشات';
        if (this.chatTitle() !== newTitle) {
          this.chatTitle.set(newTitle);
        }
      });
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // this.chatHistoryFacade.fetchChatHistory();
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          const url = event.urlAfterRedirects;
          const shouldHaveBg =
            url.includes(KhawiikBotRoutesEnum.VOICE_CHAT) || url.includes(KhawiikBotRoutesEnum.TEXT_CHAT);
          this.hasChatBackground.set(shouldHaveBg);
        });

      const currentUrl = this.router.url;
      const shouldHaveBg =
        currentUrl.includes(KhawiikBotRoutesEnum.VOICE_CHAT) || currentUrl.includes(KhawiikBotRoutesEnum.TEXT_CHAT);
      this.hasChatBackground.set(shouldHaveBg);

      // this.moodModalIntegrationService.checkMoodModal();

      // ✅ Subscribe to user data changes (refresh userId)
      this.setUpUserIdRefresh();
    }
  }

  private setUpUserIdRefresh(): void {
    if (!this.isBrowser) return;

    this._userContextService.recallUserDataViewed.subscribe(() => {
      const storedUser = this.getStoredUser();
      const newUserId = storedUser?.user?.id ?? null;

      if (!newUserId) {
        Logger.warn('KhawiikBotLayout | UserId not available, skipping KHAWIAAK_USER update.');
        return;
      }

      Logger.debug('KhawiikBotLayout | Updated KHAWIAAK_USER after login/status change:', {
        userId: newUserId,
        isStartKhawiaak: true
      });
      const currentUrl = this.router.url;
      if (currentUrl.startsWith('/' + KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE) && this.isBrowser) {
        const storedKhawiaakUser: { userId: number, isStartKhawiaak: boolean, type?: string | null } | null =
          this._storageService.getItem(StorageKeys.KHAWIAAK_USER) ?? null;

        if (newUserId === storedKhawiaakUser?.userId && storedKhawiaakUser?.isStartKhawiaak) {
          void this.router.navigate([`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.TEXT_CHAT]);

          // Redirect based on stored type
          switch (storedKhawiaakUser?.type) {
            case KhawiikBotRoutesEnum.TEXT_CHAT:
              void this.router.navigate([`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.TEXT_CHAT]);
              return;
            case KhawiikBotRoutesEnum.VOICE_CHAT:
              void this.router.navigate([`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.VOICE_CHAT]);
              return;
            default:
              void this.router.navigate([`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.TEXT_CHAT]);
              return;
          }
        }
      }
    });
  }

  private getStoredUser(): { token: string, user: IGlobalUserContactInfoModel } | null {
    if (!this.isBrowser) return null;
    try {
      const raw = this._storageService.getItem<{ token: string, user: IGlobalUserContactInfoModel }>(StorageKeys.CURRENT_USER_INFO);
      if (!raw) return null;
      return raw; // Already an object, no JSON.parse
    } catch (err) {
      Logger.error('KhawiikBotLayoutComponent | Failed to get stored user:', err);
      return null;
    }
  }

  // ====== Handlers ======
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    if (!this.isBrowser) return;
    const target = event.target as Window;
    this.screenWidth.set(target.innerWidth);
  }

  protected onChatSelected(chat: IChatHistoryItemDataDto | null): void {
    if (!chat) return;
    Logger.debug('KhawiikBotLayout → selected chat:', chat);
    this.chatSelectedItem.set(chat);
  }

  protected goHome(): void {
    if (!this.isBrowser) return;
    void this.router.navigate([MainPageRoutesEnum.MAINPAGE]);
  }

  protected toggleFullscreen(): void {
    if (!this.isBrowser) return;
    const cardEl = this._cardRef?.nativeElement;
    if (!cardEl) return;

    if (!document.fullscreenElement) {
      cardEl
        .requestFullscreen()
        .then(() => this.isFullscreen.set(true))
        .catch((err) =>
          Logger.error(
            'KhawiikBotLayout → Failed to enter fullscreen:',
            err
          )
        );
    } else {
      document.exitFullscreen().then(() =>
        this.isFullscreen.set(false)
      );
    }
  }

  ngAfterViewInit(): void {
    // Update the cardRef signal after view init
    if (this._cardRef) {
      this.cardRef.set(this._cardRef);
    }
  }
}
