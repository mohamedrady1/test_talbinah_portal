import {
    Injectable,
    PLATFORM_ID,
    inject,
    signal,
    computed
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { Logger, StorageService, handleApiErrors } from '../../../common';
import { SettingsApiClientProvider } from '../clients';
import { AuthenticationRoutesEnum, UserContextService } from '../../authentication';
import { Router } from '@angular/router';
import { StorageKeys } from '../../../shared';
import { UserIdentityStore } from '../../talbinah-community/routes/user-identity.service';
import { ModalService, ToastService } from '../../../shared/services';
import { CommunityPostsFacade, UserIdentityProfileFacade } from '../../talbinah-community/services';
import { CommunityNotificationsFacade } from '../../talbinah-community/services/community-notifications.facade';

interface ILogoutState {
    isLoading: boolean;
    errorMessage: string | null;
    success: boolean;
}

const initialLogoutState: ILogoutState = {
    isLoading: false,
    errorMessage: null,
    success: false
};

@Injectable({ providedIn: 'root' })
export class LogoutFacade {
    private readonly _client = inject(SettingsApiClientProvider).getClient();
    private readonly _platformId = inject(PLATFORM_ID);
    private readonly _state = signal<ILogoutState>({ ...initialLogoutState });
    private readonly _storage = inject(StorageService);
    private readonly _userContext = inject(UserContextService);
    private readonly _userIdentityStore = inject(UserIdentityStore);
    private readonly _communityPostsFacade = inject(CommunityPostsFacade);
    private readonly _communityNotificationsFacade = inject(CommunityNotificationsFacade);
    private readonly _userIdentityProfileFacade = inject(UserIdentityProfileFacade);
    readonly isLoading = computed(() => this._state().isLoading);
    readonly errorMessage = computed(() => this._state().errorMessage);
    readonly success = computed(() => this._state().success);
    private readonly _router = inject(Router);
    private readonly _modalService = inject(ModalService);
    private readonly _updateUserDataViewed = inject(UserContextService).recallUserDataViewed;
    private readonly _toastService = inject(ToastService);
    /**
     * Request to logout user.
     */
    logout(): void {
        if (!isPlatformBrowser(this._platformId)) return;

        // Set flag IMMEDIATELY when logout starts to prevent auth guard redirect
        Logger.debug('🔄 Logout started - Setting WAS_RECENTLY_LOGGED_IN flag immediately');
        this._storage.setItem('WAS_RECENTLY_LOGGED_IN', 'true', true);

        this._updateState({ isLoading: true, errorMessage: null, success: false });

        this._client
            .logout()
            .pipe(
                tap((res: any) => {
                    this._updateState({
                        success: true,
                        errorMessage: null
                    });
                    this._modalService.closeAll();

                }),
                catchError((err) => {
                    Logger.error('[LogoutFacade] Failed to logout', err);
                    this._updateState({
                        success: false,
                        errorMessage: err.message ?? 'حدث خطأ أثناء تسجيل الخروج'
                    });
                    this._toastService.add({
                        severity: 'error',
                        summary: 'an_error_has_occurred',
                        detail: err.message ?? 'حدث خطأ أثناء تسجيل الخروج'
                    });
                    handleApiErrors(err);
                    return EMPTY;
                }),
                finalize(() => {
                    this._updateState({ isLoading: false })

                    Logger.debug('🔄 Logout finalize - Clearing user context');
                    // Clear user context (this will trigger the effect and remove token)
                    this._userContext.clear();
                    this._userIdentityStore.clear();

                    // Reset community state
                    this.resetCommunityState();

                    // Additional cleanup
                    this._storage.removeItem(StorageKeys.TOKEN);
                    this._storage.removeItem(StorageKeys.CURRENT_USER_INFO);
                    this._storage.removeItem(StorageKeys.QUCIK_ACCESS_CARDS);
                    this._storage.removeItem(StorageKeys.MY_COMMUNITY_USER_PROFILE_DATA);
                    this._updateUserDataViewed.next(true);

                    // Redirect to main page if on specific routes
                    this.redirectToMainPageIfNeeded();

                    Logger.debug('🔄 Logout finalize - Completed');

                })
            )
            .subscribe();
    }
    /**
     * Reset facade state to initial.
     */
    resetState(): void {
        this._state.set({ ...initialLogoutState });
    }

    /**
     * Safely updates partial state.
     */
    private _updateState(updates: Partial<ILogoutState>) {
        this._state.update((prev) => ({ ...prev, ...updates }));
    }

    /**
     * Resets all community-related state on logout.
     */
    private resetCommunityState(): void {
        Logger.debug('🔄 Logout - Resetting community state');
        this._communityPostsFacade.resetState();
        this._communityNotificationsFacade.resetState();
        // Note: UserIdentityProfileFacade doesn't have a reset method, but it will be cleared by user context
    }

    /**
     * Redirects to main page if current route is one of the specified routes.
     */
    private redirectToMainPageIfNeeded(): void {
        if (!isPlatformBrowser(this._platformId)) return;

        const currentUrl = this._router.url;
        const routesToRedirect = ['/khawiik', '/appointments', '/settings'];

        const shouldRedirect = routesToRedirect.some(route =>
            currentUrl.startsWith(route)
        );

        if (shouldRedirect) {
            Logger.debug('🔄 Logout - Redirecting to main page from:', currentUrl);
            this._router.navigate(['/']);
        }
    }
}
