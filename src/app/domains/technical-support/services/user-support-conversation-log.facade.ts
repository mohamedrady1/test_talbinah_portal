// facades/user-support-conversation-log.facade.ts

import { inject, Injectable, signal, DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';
import { ToastService } from '../../../shared';
import { TechnicalSupportChatsFacade } from './technical-support-chats-list.facade';
import { TechnicalSupportApiClientProvider } from '../clients';
import { IUserSupportConversationLogRequestDto, IUserSupportConversationLogResponseDto } from '../dtos';

@Injectable({
  providedIn: 'root',
})
export class UserSupportConversationLogFacade {
  private readonly api = inject(TechnicalSupportApiClientProvider).getClient();
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);
  private readonly chatsFacade = inject(TechnicalSupportChatsFacade);

  // --- Signals for state management ---
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly response = signal<IUserSupportConversationLogResponseDto | null>(null);

  constructor() {
    effect(() => {
      const isLoading = this.loading();
      const res = this.response();
      const err = this.error();

      if (!isLoading && res) {
        if (res.status) {
          // this.toast.add({
          //   severity: 'success',
          //   summary: 'success',
          //   detail: res.message || 'Message sent successfully',
          //   life: 5000,
          // });
        } else {
          this.toast.add({
            severity: 'error',
            summary: 'an_error_has_occurred',
            detail: res.message || 'Message failed',
            life: 5000,
          });
        }
      }

      if (!isLoading && err) {
        this.toast.add({
          severity: 'error',
          summary: 'an_error_has_occurred',
          detail: err,
          life: 5000,
        });
      }
    });
  }

  /**
   * Send a conversation log entry
   */
  sendConversationLog(
    payload: IUserSupportConversationLogRequestDto,
  ): void {
    this.loading.set(true);
    this.error.set(null);
    this.response.set(null);

    this.api
      .UserSupportConversationLog(payload)
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
        }
      });
  }

  /**
   * Reset states
   */
  reset(): void {
    this.loading.set(false);
    this.error.set(null);
    this.response.set(null);
  }
}
