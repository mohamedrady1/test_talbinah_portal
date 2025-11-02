import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { MainHeaderComponent } from '../../components';
import { SettingsPointsComponent } from '../../../../domains/settings/components/settings-points/settings-points.component';
import { WalletComponent } from '../../../../domains/settings/components/wallet/wallet.component';
import { WalletPointsRecordsFacade } from '../../../../domains/settings/services/wallet-points-records.facade';
import { WalletFacade } from '../../../../domains/settings/services/wallet.facade';

import { IGlobalUserContactInfoModel, Logger } from '../../../../common';
import { ModalService, StorageKeys } from '../../../../shared';
import { StorageService } from '../../../../common/core/data-access/storages/session-local-storages/session-local-storage.service';
import { UserContextService } from '../../../../domains/authentication/user-authentication/services/user-context.service';
import { WalletData } from '../../../../domains/settings/dtos/responses/wallet-response.dto';
import { Router } from '@angular/router';
import { RoleGuardService } from '../../../authentication';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [MainHeaderComponent],
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeaderComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly walletPointsRecordsFacade = inject(WalletPointsRecordsFacade);
  private readonly walletFacade = inject(WalletFacade);
  private readonly modalService = inject(ModalService);
  private readonly storage = inject(StorageService);
  private readonly userContext = inject(UserContextService);

  protected points = signal(0);
  protected walletBalance = signal<WalletData | null>(null);
  protected loadingPoints = signal(false);
  protected loadingWallet = signal(false);
  protected userInfo = signal<{ token: string; user: IGlobalUserContactInfoModel } | null>(null);

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _RoleGuardService = inject(RoleGuardService);

  // Flag to prevent multiple calls
  private isDataFetching = false;

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
    // reactively update points when balance changes
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.points.set(this.walletPointsRecordsFacade.balance());
      this.loadingPoints.set(false);
    });

    // reactively update wallet balance
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.walletBalance.set(this.walletFacade.walletData());
      this.loadingWallet.set(false);
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // ✅ do nothing on the server, avoids localStorage access
      return;
    }
    this.setUpFetchDataAfterLogin();

    try {
      const token =
        this.storage.getItem<string>(StorageKeys.TOKEN) ??
        this.userContext.token() ??
        null;

      if (token) {
        // try to restore user data if available
        const userData = this.storage.getItem<{ token: string; user: IGlobalUserContactInfoModel }>(
          StorageKeys.CURRENT_USER_INFO
        );

        this.userInfo.set(
          userData ?? { token, user: {} as IGlobalUserContactInfoModel }
        );

        // fetch data only when logged in
        this.loadingPoints.set(true);
        this.loadingWallet.set(true);
      }
    } catch (error) {
      Logger.error('Error initializing SiteHeaderComponent:', error);
    }
  }

  protected handlePointsClick(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    Logger.debug('[SiteHeaderComponent] handlePointsClick');

    this.modalService.open(SettingsPointsComponent, {
      inputs: {
        image: 'images/settings/modal-icons/points.png',
        title: 'settings.points.title',
        subtitle: 'settings.points.subtitle',
        data: {},
      },
      outputs: {
        closed: (data: { status: boolean; data: any }) => {
          Logger.debug('Points Modal closed. Status:', data.status, 'Data:', data.data);
        },
      },
      width: '60%',
    });
  }

  protected handleWalletClick(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    Logger.debug('[SiteHeaderComponent] handleWalletClick');

    this.modalService.open(WalletComponent, {
      inputs: {
        image: 'images/settings/modal-icons/wallet.png',
        title: 'settings.wallet.title',
        subtitle: 'settings.wallet.subtitle',
        data: {},
      },
      outputs: {
        closed: (data: { status: boolean; data: any }) => {
          Logger.debug('Wallet Modal closed. Status:', data.status, 'Data:', data.data);
        },
      },
      width: '60%',
      height: '80%',
    });
  }

  protected get userToken(): string | null {
    return this.userInfo()?.token ?? null;
  }
  /** Set up listener to fetch data after login */
  private setUpFetchDataAfterLogin(): void {
    this._UserContextService.recallUserDataViewed
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('SiteHeaderComponent | currentUrl:', currentUrl);

        if (currentUrl.startsWith('/') && this.isBrowser && !this.isDataFetching) {
          this.isDataFetching = true;
          this.refreshLoginStatus();
          Logger.debug('refreshLoginStatus');

          if (this.isLoggedIn()) {
            // Only fetch if not already loading to prevent duplicate calls
            if (!this.walletPointsRecordsFacade.isLoading()) {
              this.walletPointsRecordsFacade.fetchWalletPoints();
            }
            if (!this.walletFacade.isLoading()) {
              this.walletFacade.fetchWallet();
            }
          } else {
            this.walletPointsRecordsFacade.resetWalletPoints();
            Logger.debug('Wallet points records state has been reset.');
            this.walletFacade.clearWalletData();
            Logger.debug('Wallet state has been reset.');
          }

          // Reset flag after a short delay to allow for legitimate updates
          setTimeout(() => {
            this.isDataFetching = false;
          }, 1000);
        }
      });
  }
}
