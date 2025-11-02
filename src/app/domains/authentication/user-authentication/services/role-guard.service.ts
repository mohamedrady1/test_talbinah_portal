import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { CompeleteDataAndRegisterNowComponent, ModalService, StorageKeys } from '../../../../shared';
import { IGlobalUserContactInfoModel, Logger } from '../../../../common';

export type UserRole = 'guest' | 'user' | 'doctor' | null;

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly modalService = inject(ModalService);

  // signal for current role (SSR-safe)
  private readonly role = signal<UserRole>(null);

  // computed for convenience
  readonly isGuest = computed(() => this.role() === 'guest');

  constructor() {
    this.initializeRoleFromStorage();
  }

  /**
   * Initialize role from localStorage (SSR-safe)
   */
  private initializeRoleFromStorage(): void {
    if (!this.isBrowser) {
      return; // Skip on server side
    }

    try {
      let storedUserData: { token: string, user: IGlobalUserContactInfoModel } = JSON.parse(this.getStoredUser() || '{}');
      const storedRole = storedUserData?.user?.role as UserRole;
      if (storedRole && ['guest', 'user', 'doctor'].includes(storedRole)) {
        this.role.set(storedRole);
        Logger.debug('RoleGuardService | Role loaded from localStorage:', storedRole);
      }
    } catch (error) {
      Logger.error('RoleGuardService | Error reading role from localStorage:', error);
    }
  }

  /**
   * Set the current user role (from API/Auth context).
   */
  setRole(role: UserRole): void {
    this.role.set(role);

    // Also store in localStorage for persistence
    if (this.isBrowser) {
      try {
        Logger.debug('RoleGuardService | Role saved to localStorage:', role);
      } catch (error) {
        Logger.error('RoleGuardService | Error saving role to localStorage:', error);
      }
    }
  }

  private getStoredUser(): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem(StorageKeys.CURRENT_USER_INFO);
    } catch {
      return null;
    }
  }

  /**
   * Clear the stored role (for logout scenarios)
   */
  clearRole(): void {
    this.role.set('guest');

    if (this.isBrowser) {
      try {
        Logger.debug('RoleGuardService | Role cleared from localStorage');
      } catch (error) {
        Logger.error('RoleGuardService | Error clearing role from localStorage:', error);
      }
    }
  }

  checkAccessOrOpenModal(): boolean {
    if (!this.isBrowser) {
      // ✅ on SSR, don't open modals
      return false;
    }

    if (this.isGuest()) {
      this.modalService.open(CompeleteDataAndRegisterNowComponent, {
        inputs: {
          image: 'images/icons/logo-2.png',
          title: 'complete_your_registration',
          subtitle: 'provide_your_data',
        },
        outputs: {
          closed: () => {
            Logger.debug('RoleGuardService | Modal closed');
          },
        },
        width: '40%',
        minHeight: '30vh',
        maxHeight: '78vh',
        onCloseClick: () => {
          Logger.debug('RoleGuardService | onCloseClick | Modal closed');
        },
      });

      return false;
    }

    return true;
  }

  openLoginModal(): void {
    if (!this.isBrowser) {
      // ✅ on SSR, don't open modals
      return;
    }

    this.modalService.open(CompeleteDataAndRegisterNowComponent, {
      inputs: {
        image: 'images/icons/logo-2.png',
        title: 'complete_your_registration',
        subtitle: 'provide_your_data',
      },
      outputs: {
        closed: () => {
          Logger.debug('RoleGuardService | Modal closed');
        },
      },
      width: '40%',
      minHeight: '30vh',
      maxHeight: '78vh',
      onCloseClick: () => {
        Logger.debug('RoleGuardService | onCloseClick | Modal closed');
      },
    });
  }
}