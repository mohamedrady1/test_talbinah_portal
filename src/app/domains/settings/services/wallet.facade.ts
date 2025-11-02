import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, catchError, finalize, tap } from 'rxjs';
import { WalletResponse, WalletData } from '../dtos/responses/wallet-response.dto';
import { Logger } from '../../../common';
import { SettingsApiClient } from '../clients';

@Injectable({
  providedIn: 'root'
})
export class WalletFacade {
  private readonly _settingsApiClient = inject(SettingsApiClient);

  // State signals
  private readonly _isLoading = signal<boolean>(false);
  private readonly _errorMessage = signal<string | null>(null);
  private readonly _walletData = signal<WalletData | null>(null);
  private readonly _walletResponse = signal<WalletResponse | null>(null);

  // Cache mechanism
  private _lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 1000; // 1 seconds cache

  // Computed signals
  readonly isLoading = computed(() => this._isLoading());
  readonly errorMessage = computed(() => this._errorMessage());
  readonly walletData = computed(() => this._walletData());
  readonly walletResponse = computed(() => this._walletResponse());

  fetchWallet(): void {
    // Prevent multiple simultaneous calls
    if (this._isLoading()) {
      Logger.debug('WalletFacade: Already loading, skipping duplicate call');
      return;
    }

    // Check cache validity
    const now = Date.now();
    if (this._walletData() && (now - this._lastFetchTime) < this.CACHE_DURATION) {
      Logger.debug('WalletFacade: Using cached wallet data');
      return;
    }

    Logger.debug('WalletFacade: Fetching wallet data');

    this._isLoading.set(true);
    this._errorMessage.set(null);

    this._settingsApiClient.getWallet()
      .pipe(
        tap((response: WalletResponse) => {
          // Logger.debug('WalletFacade: Wallet data fetched successfully', {
          //     balance: response.data?.balance
          // });

          if (response.status && response.data) {
            this._walletData.set(response.data);
            this._walletResponse.set(response);
            this._lastFetchTime = Date.now(); // Update cache timestamp
          } else {
            this._errorMessage.set(response.message || 'Failed to fetch wallet data');
          }
        }),
        catchError((error) => {
          Logger.error('WalletFacade: Error fetching wallet data', error);
          this._errorMessage.set('An error occurred while fetching wallet data');
          throw error;
        }),
        finalize(() => {
          this._isLoading.set(false);
        })
      )
      .subscribe();
  }

  clearError(): void {
    this._errorMessage.set(null);
  }

  clearWalletData(): void {
    this._walletData.set(null);
    this._walletResponse.set(null);
    this._lastFetchTime = 0; // Reset cache timestamp
  }
}
