import { Component, Output, EventEmitter, inject, effect, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { TranslateApiPipe } from './../../../../../common/core/translations/pipes/translate-api.pipe';
import { UserIdentityStore } from '../../../../talbinah-community/routes/user-identity.service';
import { StorageService, Logger } from '../../../../../common';
import { UserContextService } from '../../services';
import { StorageKeys } from '../../../../../shared';
import { LogoutFacade } from '../../../../settings';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-out',
  standalone: true,
  imports: [
    CommonModule,

    TranslateApiPipe,
  ],
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogOutComponent implements OnDestroy {
  @Output() closed = new EventEmitter<void>();

  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);
  private readonly userContext = inject(UserContextService);
  private readonly userIdentityStore = inject(UserIdentityStore);
  private readonly logoutFacade = inject(LogoutFacade);
  readonly isLoading = this.logoutFacade.isLoading;

  private hasLoggedOut = false;

  constructor() {
    effect(() => {
      const logoutSuccess = this.logoutFacade.success();
      if (logoutSuccess && !this.hasLoggedOut) {
        this.hasLoggedOut = true;
        this.performLocalLogout();
        this.logoutFacade.resetState();
        this.closeModal();
      }
    });

    effect(() => {
      const logoutError = this.logoutFacade.errorMessage();
      if (logoutError && !this.hasLoggedOut) {
        this.hasLoggedOut = true;
        this.performLocalLogout();
        this.logoutFacade.resetState();
      }
    });
  }

  ngOnDestroy(): void {
    // Reset the logout state when component is destroyed
    this.hasLoggedOut = false;
    this.logoutFacade.resetState();
  }

  protected closeModal(): void {
    this.closed.emit();
  }

  protected confirmLogOut(): void {
    this.hasLoggedOut = false; // Reset flag when starting new logout

    // Set flag IMMEDIATELY when logout starts to prevent auth guard redirect
    Logger.debug('🔄 Logout component - Setting WAS_RECENTLY_LOGGED_IN flag immediately');
    this.storage.setItem('WAS_RECENTLY_LOGGED_IN', 'true', true);

    this.logoutFacade.logout();
  }

  private performLocalLogout(): void {
    Logger.debug('🔄 Logout component - performLocalLogout called');

    // Clear user context (this will trigger the effect and remove token)
    this.userContext.clear();
    // this.userIdentityStore.clear();
    this.storage.removeItem(StorageKeys.TOKEN);
    // Additional cleanup (token removal is handled by UserContextService effect)
    this.storage.removeItem(StorageKeys.CURRENT_USER_INFO);
    this.storage.removeItem(StorageKeys.QUCIK_ACCESS_CARDS);
  }
}
