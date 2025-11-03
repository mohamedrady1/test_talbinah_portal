import { TechnicalSupportChatsFacade } from './technical-support-chats-list.facade';
import { inject, Injectable, signal, DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TechnicalSupportApiClientProvider } from '../clients';
import { IAssignToCustomersSupportResponseDto } from '../dtos';
import { catchError, finalize, of } from 'rxjs';
import { ToastService } from '../../../shared';

@Injectable({
  providedIn: 'root',
})
export class AssignToCustomerSupportFacade {
  private readonly api = inject(TechnicalSupportApiClientProvider).getClient();
  private readonly destroyRef = inject(DestroyRef);
  private readonly _ToastService = inject(ToastService);
  private readonly _TechnicalSupportChatsFacade = inject(TechnicalSupportChatsFacade);

  // --- Signals for state management ---
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly response = signal<IAssignToCustomersSupportResponseDto | null>(null);

  constructor() {
    // 👇 Effect: runs whenever loading/response changes
    effect(() => {
      const isLoading = this.loading();
      const response = this.response();

      if (!isLoading && response) {
        // success handler
        if (response?.status) {
          this._ToastService.add({
            severity: 'success',
            summary: 'success',
            detail: response?.message || 'Assigned successfully',
            life: 5000,
          });
        } else {
          this._ToastService.add({
            severity: 'error',
            summary: 'an_error_has_occurred',
            detail: response?.message || 'Assign completed with issues',
            life: 5000,
          });
        }
      }

      if (!isLoading && this.error()) {
        // error handler
        this._ToastService.add({
          severity: 'error',
          summary: 'an_error_has_occurred',
          detail: this.error() || 'Unknown error',
          life: 5000,
        });
      }
    });
  }

  /**
   * Assign a conversation to a department
   */
  assign(support_user_id: number, departmentId: number, isSupport?: boolean): void {
    this.loading.set(true);
    this.error.set(null);
    this.response.set(null);

    this.api
      .assignToCustomerSupport(support_user_id, departmentId)
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
            this._TechnicalSupportChatsFacade.fetchChats(isSupport);
          }
        }
      });
  }

  /**
   * Reset all states
   */
  reset(): void {
    this.loading.set(false);
    this.error.set(null);
    this.response.set(null);
  }
}
