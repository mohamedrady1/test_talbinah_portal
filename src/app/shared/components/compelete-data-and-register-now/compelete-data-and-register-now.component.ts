import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, effect, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { UserIdentityStore } from '../../../domains/talbinah-community/routes/user-identity.service';
import { UserContextService } from '../../../domains/authentication/user-authentication/services';
import { AuthenticationRoutesEnum } from '../../../domains/authentication/user-authentication/constants';
import { LogoutFacade } from '../../../domains/settings/services/logout.facade';
import { StorageKeys } from '../../config/constants/storage.keys';
import { StorageService } from '../../../common/core/data-access/storages/session-local-storages/session-local-storage.service';
import { ModalService } from '../../services/model.service';
import { NewLoginComponent } from '../../../domains/authentication/user-authentication/components/new-login/new-login.component';
import { TranslateApiPipe } from '../../../common/core/translations/pipes/translate-api.pipe';
@Component({
  selector: 'app-compelete-data-and-register-now',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    TranslateApiPipe
  ],
  templateUrl: './compelete-data-and-register-now.component.html',
  styleUrls: ['./compelete-data-and-register-now.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompeleteDataAndRegisterNowComponent implements OnDestroy {
  // ====== SSR Check ======
  private readonly platformId = inject(PLATFORM_ID);
  @Input() isEmptyState: boolean = false;
  protected readonly isBrowser: boolean;
  @Output() closed = new EventEmitter<void>();
  // ====== Services ======
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);
  private readonly userContext = inject(UserContextService);
  private readonly userIdentityStore = inject(UserIdentityStore);
  private readonly modalService = inject(ModalService);
  protected readonly logoutFacade = inject(LogoutFacade);

  private hasLoggedOut = false;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // ✅ Success effect
    effect(() => {
      const logoutSuccess = this.logoutFacade.success();
      if (logoutSuccess && !this.hasLoggedOut) {
        this.hasLoggedOut = true;
        this.performLocalLogout();
        this.logoutFacade.resetState();

        // Don't redirect after logout - let user stay on current page
        // The auth guard will handle the navigation logic
      }
    });

    // ✅ Error effect (fallback: still clear but don't redirect)
    effect(() => {
      const logoutError = this.logoutFacade.errorMessage();
      if (logoutError && !this.hasLoggedOut) {
        this.hasLoggedOut = true;
        this.performLocalLogout();
        this.logoutFacade.resetState();

        // Don't redirect after logout error - let user stay on current page
        // The auth guard will handle the navigation logic
      }
    });
  }

  ngOnDestroy(): void {
    this.hasLoggedOut = false;
    this.logoutFacade.resetState();
  }

  // ====== Actions ======
  protected Register(): void {
    if (!this.isBrowser) {
      return; // SSR safety
    }

    // Open NewLoginComponent modal instead of direct logout
    this.openLoginModal();
  }

  private openLoginModal(): void {
    this.closed.emit();
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
      outputs: {
        closed: (data: any): void => {
        }
      },
    });
  }

  // ====== Helpers ======
  private performLocalLogout(): void {
    this.userContext.clear();
    this.userIdentityStore.clear();

    this.storage.removeItem(StorageKeys.TOKEN);
    this.storage.removeItem(StorageKeys.CURRENT_USER_INFO);
    this.storage.removeItem(StorageKeys.QUCIK_ACCESS_CARDS);
    this.storage.removeItem(StorageKeys.MY_COMMUNITY_USER_PROFILE_DATA);
  }
}
