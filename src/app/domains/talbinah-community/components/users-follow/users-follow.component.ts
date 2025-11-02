import { Component, computed, inject, PLATFORM_ID, signal, OnInit, ChangeDetectionStrategy, effect, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { PaginationListingComponent, PaginationConfig, ToastService, EmptyStateComponent, EmptyStateConfig, ErrorStateComponent, ErrorStateConfig } from '../../../../shared';
import { Logger, defaultPaginationParameters, IPaginationParameters, handleApiErrorsMessage, ApiError } from '../../../../common';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { ProfileTriggerService, UsersIFollowFacade } from '../../services';
import { IUpdateFollowResponseDto, IUserIFollow } from '../../dtos';
import { TalbinahCommunityApiClientProvider } from '../../clients';
import { UserIdentityStore } from '../../routes/user-identity.service';
import { Router } from '@angular/router';
import { TalbinahCommunityRoutesEnum } from '../../constants';
import { finalize, take } from 'rxjs';
import { TranslateApiPipe } from '../../../../common/core/translations';

// --- Helper interfaces for Empty/Error States ---

export const UsersIFollowEmptyState: EmptyStateConfig = {
  imageUrl: 'images/not-found/community/avatars/no-avatar.svg', // Replace with an actual asset path
  title: 'not_following_any_users_yet', // Translate key
  gap: '.5rem'
};

export const getUsersIFollowError = (retryAction: () => void): ErrorStateConfig => ({
  imageUrl: 'images/not-found/community/avatars/no-avatar-error.svg', // Replace with an actual asset path
  title: 'an_error_has_occurred', // Translate key
  onRetry: retryAction,
});


@Component({
  selector: 'app-users-follow',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    AutoExactHeightDirective,
    FormsModule,
    EmptyStateComponent,
    ErrorStateComponent,
    PaginationListingComponent,
    TranslateApiPipe
  ],
  templateUrl: './users-follow.component.html',
  styleUrls: ['./users-follow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersFollowComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  protected usersIFollowFacade = inject(UsersIFollowFacade);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _PostsApiClientProvider = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _UserIdentityStore = inject(UserIdentityStore);
  private readonly _ToastService = inject(ToastService);
  private _profileTriggerService = inject(ProfileTriggerService);
  private readonly _Router = inject(Router);

  protected isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // --- Facade Selectors ---
  readonly usersIFollow = this.usersIFollowFacade.usersIFollow;
  readonly isLoading = this.usersIFollowFacade.isLoading;
  readonly errorMessage = this.usersIFollowFacade.errorMessage;
  readonly status = this.usersIFollowFacade.status;
  readonly totalPages = this.usersIFollowFacade.totalPages;
  readonly totalItems = this.usersIFollowFacade.totalItems;

  protected readonly usersFollowEmptyState = UsersIFollowEmptyState;

  // Error state configuration, includes a retry action
  protected readonly usersFollowErrorState = getUsersIFollowError(() =>
    this.usersIFollowFacade.fetchAll(this.currentPage())
  );

  private _paginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 10 };
  readonly currentPage = signal<number>(1);

  readonly paginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this.currentPage(),
    totalPages: this.totalPages(),
    onPageChange: this.handlePageChange.bind(this)
  }));

  // Signal to trigger API calls for unfollow action
  private unfollowTrigger = signal<number | null>(null);

  // NEW: Signal to track which specific user is being unfollowed
  protected unfollowingUserId = signal<number | null>(null); // New signal

  // No longer needed as we're tracking per-user loading
  // protected isLoadingUnfollow = signal<boolean>(false);
  protected unfollowError = signal<ApiError | null>(null);


  constructor() {
    this.setupUnfollowEffect();
  }

  ngOnInit(): void {
    this.usersIFollowFacade.fetchAll(
      this._paginationParams.page ?? 1,
      false
    );
  }

  /**
   * Helper function to check if a specific user is currently being unfollowed.
   */
  protected isUnfollowingUser(userId: number): boolean {
    return this.unfollowingUserId() === userId;
  }

  /**
   * Handles page changes from the pagination component.
   * @param page The new page number.
   */
  private handlePageChange(page: number): void {
    if (this.isBrowser()) {
      Logger.debug('Users I Follow list - Page changed to:', page);
      this.currentPage.set(page);
      this.usersIFollowFacade.fetchAll(page, false);
    }
  }

  /**
   * Handles user card interaction (e.g., clicking to view profile).
   * @param user The user item that was interacted with.
   */
  protected handleUserInteraction(user: IUserIFollow): void {
    if (this.isBrowser()) {
      Logger.debug('User interacted with:', user);
      // Example: this._Router.navigate(['/community/profile', user.id]);
    }
  }

  /**
   * Initiates the unfollow action for a given user.
   * Sets loading state for the specific user and triggers the API call.
   * @param userId The ID of the user to unfollow.
   */
  protected unfollowUser(userId: number): void {
    if (!this.isBrowser()) return;
    // Prevent multiple clicks for this specific user
    if (this.unfollowingUserId() === userId) return;

    this.unfollowingUserId.set(userId); // Set the ID of the user being unfollowed

    // Trigger the effect with the user ID to make the API call
    this.unfollowTrigger.set(userId);
  }

  /**
   * Effect for handling Unfollow API call.
   * This effect reacts to changes in `unfollowTrigger` signal.
   */
  private setupUnfollowEffect(): void {
    effect(() => {
      const userIdToUnfollow = this.unfollowTrigger();
      if (userIdToUnfollow === null) return;

      this.unfollowError.set(null); // Clear any previous unfollow error

      this._PostsApiClientProvider.updateFollowUser({ followed_user_id: userIdToUnfollow }).pipe(
        take(1),
        finalize(() => {
          this.unfollowingUserId.set(null); // Reset the unfollowing user ID when complete
          this.unfollowTrigger.set(null); // Reset the trigger
        })
      ).subscribe({
        next: (res: IUpdateFollowResponseDto) => {
          if (res.status) {
            this.usersIFollowFacade.removeUserLocally(userIdToUnfollow); // Remove user from local list
            // this._ToastService.add({
            //   severity: 'success',
            //   summary: 'general.success',
            //   detail: res.message || ('talbinahCommunity.unfollowedSuccess'),
            //   life: 3000,
            // });
            Logger.debug(`User ${userIdToUnfollow} unfollowed successfully:`, res);
            this._UserIdentityStore.fetch();
            this._profileTriggerService.triggerFetchWithDisableLoading(true);

          } else {
            this._ToastService.add({
              severity: 'error',
              summary: 'general.error',
              detail: res.message || ('talbinahCommunity.unfollowFailed'),
              life: 5000,
            });
            Logger.warn(`Failed to unfollow user ${userIdToUnfollow}:`, res);
            this.usersIFollowFacade.fetchAll(this.currentPage(), false);
          }
        },
        error: (error: ApiError) => {
          this.unfollowError.set(error);
          Logger.error('Error unfollowing user:', error);
          handleApiErrorsMessage(error);
          this._ToastService.add({
            severity: 'error',
            summary: 'general.error',
            detail: error?.message !== undefined && error?.message !== null ? String(error?.message) : ('talbinahCommunity.unfollowErrorOccurred'),
            life: 5000,
          });
          this.usersIFollowFacade.fetchAll(this.currentPage(), false);
        }
      });
    });
  }

  private revertUnfollowOptimisticUpdate(userId: number): void {
    Logger.warn(`Unfollow for user ID: ${userId} failed. Refetching current page for consistency.`);
    this.usersIFollowFacade.fetchAll(this.currentPage(), false);

    this._ToastService.add({
      severity: 'error',
      summary: 'general.warning',
      detail: 'talbinahCommunity.unfollowReverted',
      life: 3000,
    });
  }
  protected goToProfile(id: number): void {
    if (!this.isBrowser()) return;
    this._Router.navigate([TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE + '/' + TalbinahCommunityRoutesEnum.USER_COMMUNITY_PROFILE, id]);
    this.close.emit();
  }
}
