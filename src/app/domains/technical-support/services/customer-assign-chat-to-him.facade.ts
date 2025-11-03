import { inject, Injectable, signal, DestroyRef, effect, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TechnicalSupportApiClientProvider } from '../clients';
import { IAssignToCustomersSupportResponseDto } from '../dtos';
import { catchError, finalize, of } from 'rxjs';
import { ToastService } from '../../../shared';
import { TechnicalSupportChatsFacade } from './technical-support-chats-list.facade';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CustomerAssignChatToHimFacade {
  private readonly api = inject(TechnicalSupportApiClientProvider).getClient();
  private readonly destroyRef = inject(DestroyRef);
  private readonly _ToastService = inject(ToastService);
  private readonly _TechnicalSupportChatsFacade = inject(TechnicalSupportChatsFacade);
  private readonly platformId = inject(PLATFORM_ID);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly response = signal<IAssignToCustomersSupportResponseDto | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        const isLoading = this.loading();
        const response = this.response();

        if (!isLoading && response) {
          if (response?.status) {
            // this._ToastService.add({
            //   severity: 'success',
            //   summary: 'success',
            //   detail: response?.message || 'Chat assigned to you successfully',
            //   life: 5000,
            // });
          } else {
            this._ToastService.add({
              severity: 'error',
              summary: 'an_error_has_occurred',
              detail: response?.message || 'Chat assignment failed',
              life: 5000,
            });
          }
        }

        if (!isLoading && this.error()) {
          this._ToastService.add({
            severity: 'error',
            summary: 'an_error_has_occurred',
            detail: this.error() || 'Unknown error',
            life: 5000,
          });
        }
      });
    }
  }

  /**
   * Customer assigns a chat to themselves
   */
  assignToSelf(chatId: number): void {
    if (!isPlatformBrowser(this.platformId)) return; // 🚫 avoid SSR execution

    this.loading.set(true);
    this.error.set(null);
    this.response.set(null);

    this.api
      .customerAssignChatToHim(chatId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          this.error.set(err?.message || 'Unknown error');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((res) => {
        if (res) {
          this.response.set(res);
          if (res.status) {
            this._TechnicalSupportChatsFacade.fetchChats();
          }
        }
      });
  }

  reset(): void {
    this.loading.set(false);
    this.error.set(null);
    this.response.set(null);
  }
}
