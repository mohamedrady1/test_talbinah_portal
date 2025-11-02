import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { WalletFacade } from '../../../settings/services/wallet.facade';
import { AutoExactHeightDirective, Logger } from '../../../../common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslationsFacade } from '../../../../common/core/translations/services';
import { MovementsFacade } from '../../../settings/services/movements.facade';
import { WalletCardComponent } from '../../../settings/components/wallet-card/wallet-card.component';
import { MovementItem } from '../../../settings';
import { getWalletErrorConfig, WalletEmptyConfig, WalletSearchConfig } from '../../../settings/configs/wallet.config';
import { getMovementsErrorConfig, MovementsEmptyConfig } from '../../../settings/configs/movements.config';
import { SvgIconComponent } from '../../../../shared';
import { ErrorStateCardComponent } from '../../../../shared/components/error-state-card/error-state-card.component';
import { EmptyStateCardComponent } from '../../../../shared/components/empty-state-card/empty-state-card.component';
import { GlobalSearchInputComponent } from '../../../../shared/components/global-search-input/components/global-search-input/global-search-input.component';
import { WalletLoadingComponent } from '../../../../shared/components/wallet-loading/wallet-loading.component';
import { ChargeWalletComponent } from '../../../settings/components/charge-wallet/charge-wallet.component';
import { ModalService } from '../../../../shared/services/model.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule,
    
    WalletLoadingComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    GlobalSearchInputComponent,
    AutoExactHeightDirective,
    WalletCardComponent,
    SvgIconComponent,
    WalletCardComponent
  ],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  private readonly walletFacade = inject(WalletFacade);
  private readonly movementsFacade = inject(MovementsFacade);
  private readonly modalService = inject(ModalService);
  private readonly _router = inject(Router);
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  // Signals for reactive state
  readonly isLoading = computed(() => this.walletFacade.isLoading() || this.movementsFacade.isLoading());
  readonly errorMessage = computed(() => this.walletFacade.errorMessage() || this.movementsFacade.errorMessage());
  readonly walletData = computed(() => this.walletFacade.walletData());
  readonly walletUser = computed(() => this.walletFacade.walletResponse()?.data.user);
  readonly movements = computed(() => this.movementsFacade.movements());
  readonly movementsError = computed(() => this.movementsFacade.errorMessage());
  readonly movementsStatus = computed(() => this.movementsFacade.movementsStatus());

  // Search functionality
  private readonly _searchTerm = signal<string>('');
  readonly searchTerm = computed(() => this._searchTerm());
  readonly filteredMovements = computed(() => {
    const movements = this.movements();
    const search = this.searchTerm().toLowerCase();

    if (!search) return movements;

    return movements.filter((movement: MovementItem) =>
      movement.name.toLowerCase().includes(search) ||
      movement.original_type.toLowerCase().includes(search)
    );
  });

  // Computed values
  readonly points = computed(() => this.walletData()?.balance || 0);
  readonly cards = computed(() => {
    this.filteredMovements();
  });

  // Configs
  readonly errorStateConfig = getWalletErrorConfig(() => this.walletFacade.fetchWallet());
  readonly emptyStateConfig = WalletEmptyConfig;
  readonly errorStateMovementsConfig = getMovementsErrorConfig(() => this.movementsFacade.fetchMovements());
  readonly emptyStateMovementsConfig = MovementsEmptyConfig;
  readonly searchConfig = WalletSearchConfig;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    Logger.debug('WalletComponent: Initializing component');
    this.loadData();
  }

  loadData(): void {
    Logger.debug('WalletComponent: Loading wallet and movements data');
    this.walletFacade.fetchWallet();
    this.movementsFacade.fetchMovements();
  }

  onSearchChange(searchTerm: string): void {
    Logger.debug('WalletComponent: Search term changed', { searchTerm });
    this._searchTerm.set(searchTerm);
  }

  onChargeWallet(): void {
    if (!this.isBrowser) return;
    this.modalService.open(ChargeWalletComponent, {
      inputs: {
        image: 'images/logos/icon.png',
        title: 'deposit_amount',
        walletId: this.walletData()?.id
      },
      width: '40%',
      isPhoneFromDown: true
    });
  }
  ngOnDestroy(): void {
    if (this.isBrowser) {
      const currentUrl = this._router.url;
      if (currentUrl === '/' || currentUrl === '/home') {
        document.body.style.overflow = '';
      }
    }
  }
}

