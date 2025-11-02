import { IGlobalUserContactInfoModel, Logger, StorageService } from '../../../../common';
import { Component, ChangeDetectionStrategy, input, model, output, inject, ChangeDetectorRef, PLATFORM_ID, computed, signal } from '@angular/core';
import { DEFAULT_LANGUAGE_SELECTOR_CONFIG, LanguageSelectorConfig } from '../../configs';
import { ModalService, StorageKeys, SvgIconComponent } from '../../../../shared';
import { NotificationsComponent } from '../notifications';
import { WalletData } from '../../../../domains/settings';
import { WalletHeaderComponent } from "../wallet-header";
import { TranslateModule } from '@ngx-translate/core';
import { UserInfoComponent } from '../user-info';
import { ThemeService } from '../theme-toggle';
import { Router, RouterModule } from '@angular/router';
import { PointsComponent } from '../points';

import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { NewLoginComponent, RoleGuardService, UserContextService } from '../../../authentication';
import { SettingsRoutesEnum } from '../../../../domains/settings/constants/settings.routes.enum';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LanguageSelectorComponent } from '../language-selector';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [
    LazyLoadImageDirective,
    TranslateModule,
    CommonModule,
    RouterModule,
    NotificationsComponent,
    WalletHeaderComponent,
    UserInfoComponent,
    PointsComponent,
    LanguageSelectorComponent,
    SvgIconComponent,
  ],
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainHeaderComponent {
  points = input(0);
  walletBalance = input<WalletData | null>(null);

  isLoadingPoints = model(false);
  isLoadingWallet = model(false);

  onPointsClicked = output<void>();
  onWalletClicked = output<void>();
  onSettingsClicked = output<void>();
  private _StorageService = inject(StorageService);
  protected _Theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly _UserContextService = inject(UserContextService);
  protected userInfo!: IGlobalUserContactInfoModel;
  protected languageConfig: LanguageSelectorConfig = DEFAULT_LANGUAGE_SELECTOR_CONFIG;
  private token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );
  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }
  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ----- Injected services -----
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Computed Signals -----
  public readonly isLoggedIn = computed(() => !!this.token());

  ngOnInit(): void {
    const storedUserInfo = this._StorageService.getItem<{ user?: IGlobalUserContactInfoModel }>(
      StorageKeys.CURRENT_USER_INFO
    );

    if (storedUserInfo?.user) {
      this.userInfo = storedUserInfo.user;
    }

    // React to login/profile updates and logout
    this._UserContextService.recallUserDataViewed.subscribe((emitted: boolean) => {
      this.refreshLoginStatus();
      const refreshed = this._StorageService.getItem<{ user?: IGlobalUserContactInfoModel }>(
        StorageKeys.CURRENT_USER_INFO
      );

      if (emitted && refreshed?.user) {
        this.userInfo = refreshed.user;
      } else if (!refreshed?.user) {
        // On logout or cleared storage, remove user info so UI switches to login button
        this.userInfo = undefined as unknown as IGlobalUserContactInfoModel;
      }
      this.cdr.markForCheck();
    });
  }

  protected emitPointsClick(): void {
    this.refreshLoginStatus();

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }
    this.onPointsClicked.emit();
  }

  protected emitWalletClick(): void {
    this.refreshLoginStatus();

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }
    this.onWalletClicked.emit();
  }

  protected emitSettingsClick(): void {
    this.refreshLoginStatus();

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }
    this.router.navigate([SettingsRoutesEnum.SETTINGS_MAIN_PAGE]);
  }

  protected goToLoginPage(): void {
    const modalData = {
      image: 'images/icons/logo-2.png',
      title: 'login',
      description: 'welcome_safe_space',
    };

    this.modalService.open(NewLoginComponent, {
      inputs: modalData,
      minWidth: '70vh',
      maxWidth: '70vh',
      minHeight: '50vh',
      closeOnBackdropClick: false,
      outputs: {
        closed: (data: any): void => {
          Logger.debug('Login Modal closed with data:', data);
        }
      },
    });
  }
}
