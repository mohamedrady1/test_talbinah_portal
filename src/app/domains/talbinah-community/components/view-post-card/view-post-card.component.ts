import { Component, computed, Input, signal, SimpleChanges, inject, Output, ViewChild, ChangeDetectionStrategy, EventEmitter, OnInit, effect, PLATFORM_ID } from '@angular/core';
import { ApiError, CardType, handleApiErrorsMessage, LanguageService, Logger, StorageService } from '../../../../common';
import { StorageKeys, ToastService, useTimeAgoRealtime } from '../../../../shared';
import { IPost, IUpdateFollowResponseDto, IUpdatePostBookmarkResponseDto, IUpdatePostReactionResponseDto, IUserIdentifyProfileData } from '../../dtos';
import { TranslateModule } from '@ngx-translate/core';
import { CommentBoxComponent } from '../comment-box';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { finalize, take } from 'rxjs';
import { TalbinahCommunityApiClientProvider } from '../../clients';
import { TalbinahCommunityRoutesEnum } from '../../constants';
import { Router } from '@angular/router';
import { ProfileTriggerService } from '../../services';
import { RoleGuardService, UserContextService } from '../../../authentication';

// Define action types for clarity and type safety
export type PostActionType = 'favourite' | 'comment' | 'bookmark' | 'follow' | 'add'; // 'add' seems to be for bookmark based on your HTML

@Component({
  selector: 'app-view-post-card',
  standalone: true,
  imports: [CommonModule, CommentBoxComponent, TranslateModule],
  templateUrl: './view-post-card.component.html',
  styleUrls: ['./view-post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Use OnPush for better performance
})
export class ViewPostCardComponent implements OnInit { // Implement OnInit
  readonly _LanguageService = inject(LanguageService);
  private currentLang = this._LanguageService.getCurrentLanguage();
  private _profileTriggerService = inject(ProfileTriggerService);

  // Inputs: The component now receives the post data and user profile data.
  // @Input({ required: true }) config!: IPost;
  @Input({ required: true }) config: any;
  @Input({ required: false }) type: CardType = CardType.DETAILS;
  @Input({ required: false }) isEnableCommented: boolean = false;
  @Input({ required: false }) hasBorder: boolean = false;
  @Input({ required: false }) readOnly: boolean = false;

  // The parent will pass down the `userIdentityProfileData`
  @Input() userIdentityProfileData = signal<IUserIdentifyProfileData | null>(null);

  // Outputs: The component emits events for actions that it doesn't handle directly (e.g., follow, comment submission).
  @Output() actionEmitted = new EventEmitter<IPost>(); // Emits for 'follow' and 'comment' click
  @Output() commentSubmitted = new EventEmitter<string>(); // Emits the comment content
  @Output() closed = new EventEmitter<void>();

  private readonly _PostsApiClientProvider = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _ToastService = inject(ToastService);

  // Signals to trigger API calls for Like and Bookmark
  private toggleLikeTrigger = signal<{ postId: number; isLiked: boolean } | null>(null);
  private toggleBookmarkTrigger = signal<{ postId: number; isBookmarked: boolean } | null>(null);
  private toggleFollowTrigger = signal<{ userId: number; isFollowing: boolean } | null>(null);

  // Internal signals for optimistic UI updates for Like and Bookmark
  protected _isLiked = signal<boolean>(false);
  protected _reactionsCount = signal<number>(0);
  protected _isMarked = signal<boolean>(false);
  protected _isFollowed = signal<boolean>(false);

  // Internal signals to track API request loading/error states for Like and Bookmark
  protected isLoadingLike = signal<boolean>(false);
  protected isLoadingBookmark = signal<boolean>(false);
  protected likeError = signal<ApiError | null>(null);
  protected bookmarkError = signal<ApiError | null>(null);
  protected isLoadingFollow = signal<boolean>(false);
  protected followError = signal<ApiError | null>(null);

  // Signals for comment creation (if handled here, but still emitting commentSubmitted)
  protected isLoadingComment = signal<boolean>(false); // This is now an internal signal, not an @Input
  protected commentError = signal<ApiError | null>(null);


  // Expose computed signals for template binding (these now reflect internal signals)
  // Note: These are now directly derived from the internal _isLiked, _reactionsCount, _isMarked
  // and config.comments_count, config.is_followed for display.
  readonly isLiked = computed(() => this._isLiked());
  readonly reactionsCount = computed(() => this._reactionsCount());
  readonly isMarked = computed(() => this._isMarked());
  readonly commentsCount = computed(() => this.config.comments_count ?? 0);
  readonly isFollowed = computed(() => this.config.is_followed ?? false);

  protected isActions = signal<boolean>(true); // Consider if this is still needed or can be removed

  @ViewChild(CommentBoxComponent) commentBox!: CommentBoxComponent;

  cardType = CardType;
  showSupport = computed(() => this.config?.interest);
  showGratitude = computed(() => this.config?.interest);

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _Router = inject(Router);

  // ----- Auth / Guest Computed -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  protected readonly isLoggedIn = computed(() => !!this.token());

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  constructor() {
    this.setupLikeEffect();
    this.setupBookmarkEffect();
    this.setupFollowEffect();
    // No setupCreateCommentEffect here, as comment submission is emitted to parent.
  }

  ngOnInit() {
    Logger.debug('ViewPostCardComponent => config: ', this.config);
    // Initialize internal signals from the config when the component starts
    this.syncConfigToSignals();
    Logger.debug('ViewPostCardComponent = > userIdentityProfileData: ', this.userIdentityProfileData());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      // When the @Input config changes, re-sync internal signals to reflect the new state
      Logger.debug('ViewPostCardComponent config changed:', this.config);
      this.syncConfigToSignals();
    }
  }

  // New method to sync post config to internal signals
  private syncConfigToSignals(): void {
    if (this.config) {
      this._isLiked.set(this.config.is_liked?.id === 1);
      this._reactionsCount.set(this.config.reactions_count ?? 0);
      this._isMarked.set(this.config.is_marked ?? false);
    }
    this.actionEmitted.emit(this.config);
  }

  protected returnItemTimeAgo(id: number, date: Date): string {
    const { value, unit } = useTimeAgoRealtime(id, date)();
    const rtf = new Intl.RelativeTimeFormat(this.currentLang || undefined, { numeric: 'auto' });
    return rtf.format(-value, unit); // Negative for past time
  }

  protected getCreatedAtDate(): Date {
    return this.config?.created_at ? new Date(this.config.created_at) : new Date();
  }

  /**
   * Handles clicks on various action buttons (favourite, comment, bookmark, follow).
   * It now directly handles 'favourite' and 'bookmark' and emits for 'follow' and 'comment'.
   * @param name The type of action clicked.
   */
  protected onActionClick(name: PostActionType): void {
    Logger.debug(`Action clicked in ViewPostCardComponent: ${name}, Post ID: ${this.config?.id}`);

    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    switch (name) {
      case 'favourite':
        this.toggleFavourite(this.config?.id);
        break;
      case 'bookmark':
      case 'add': // 'add' in your HTML corresponds to bookmarking
        this.toggleBookmark(this.config?.id);
        break;
      case 'follow':
        if (this.config?.user?.id === undefined || this.isLoadingFollow()) {
          Logger.warn('Cannot toggle follow: User ID is missing or a request is already in progress.');
          return;
        }
        const newFollowingStatus = !this._isFollowed();
        this._isFollowed.set(newFollowingStatus); // Optimistic update
        this.toggleFollowTrigger.set({ userId: this.config?.user?.id, isFollowing: newFollowingStatus });
        break;
      case 'comment':
        // Emit 'comment' action to parent, typically to scroll or open a comment section.
        // this.actionEmitted.emit('comment');
        break;
      default:
        Logger.warn(`Unhandled action type: ${name}`);
    }
  }

  // --- Like Effect (now internal to ViewPostCardComponent) ---
  private setupLikeEffect(): void {
    effect(() => {
      const trigger = this.toggleLikeTrigger();
      if (!trigger) return;

      this.isLoadingLike.set(true);
      this.likeError.set(null);

      this._PostsApiClientProvider.updatePostReaction({ post_id: trigger.postId, react_id: 1 }).pipe(
        take(1),
        finalize(() => this.isLoadingLike.set(false))
      ).subscribe({
        next: (res: IUpdatePostReactionResponseDto) => {
          if (res.status) {
            if (res.data.post) {
              this.config = { ...this.config, ...res.data.post };
              this.syncConfigToSignals(); // Re-sync internal signals after config update
            }
            // this._ToastService.add({
            //   severity: 'success',
            //   summary: 'general.success',
            //   detail: res.message || (this._isLiked() ? 'Post liked!' : 'Post unliked!'),
            //   life: 3000,
            // });
            Logger.debug(`Post ${this._isLiked() ? 'liked' : 'unliked'} successfully:`, res);
          } else {
            this.revertLikeOptimisticUpdate(trigger);
            this._ToastService.add({
              severity: 'error',
              summary: 'general.error',
              detail: res.message || 'Failed to update like status.',
              life: 5000,
            });
            Logger.warn(`Failed to update like status for post ${trigger.postId}:`, res);
          }
        },
        error: (error: ApiError) => {
          this.revertLikeOptimisticUpdate(trigger);
          this.likeError.set(error);
          Logger.error('Error updating post reaction:', error);
          handleApiErrorsMessage(error);
          this._ToastService.add({
            severity: 'error',
            summary: 'general.error',
            detail: error?.message || 'Error occurred while updating like status.',
            life: 5000,
          });
        }
      });
    });
  }
  private revertLikeOptimisticUpdate(trigger: { postId: number; isLiked: boolean }): void {
    this._isLiked.set(!trigger.isLiked);
    this._reactionsCount.update(count => trigger.isLiked ? count - 1 : count + 1);
  }

  // --- Bookmark Effect (now internal to ViewPostCardComponent) ---
  private setupBookmarkEffect(): void {
    effect(() => {
      const trigger = this.toggleBookmarkTrigger();
      if (!trigger) return;

      this.isLoadingBookmark.set(true);
      this.bookmarkError.set(null);

      this._PostsApiClientProvider.updateBookmarkReaction({ post_id: trigger.postId }).pipe(
        take(1),
        finalize(() => this.isLoadingBookmark.set(false))
      ).subscribe({
        next: (res: IUpdatePostBookmarkResponseDto) => {
          if (res.status) {
            Logger.debug('bookmarked: ', res.data.post);
            if (res.data.post) {
              this.config = { ...this.config, ...res.data.post };
              this.syncConfigToSignals(); // Re-sync internal signals after config update
              this.actionEmitted.emit(this.config);
            }
            // this._ToastService.add({
            //   severity: 'success',
            //   summary: 'general.success',
            //   detail: res.message || (this._isMarked() ? 'Post bookmarked!' : 'Post unbookmarked!'),
            //   life: 3000,
            // });
            Logger.debug(`Post ${this._isMarked() ? 'bookmarked' : 'unbookmarked'} successfully:`, res);
          } else {
            this.revertBookmarkOptimisticUpdate(trigger);
            this._ToastService.add({
              severity: 'error',
              summary: 'general.error',
              detail: res.message || 'Failed to update bookmark status.',
              life: 5000,
            });
            Logger.warn(`Failed to update bookmark status for post ${trigger.postId}:`, res);
          }
        },
        error: (error: ApiError) => {
          this.revertBookmarkOptimisticUpdate(trigger);
          this.bookmarkError.set(error);
          Logger.error('Error updating post bookmark:', error);
          handleApiErrorsMessage(error);
          this._ToastService.add({
            severity: 'error',
            summary: 'general.error',
            detail: error?.message || 'Error occurred while updating bookmark status.',
            life: 5000,
          });
        }
      });
    });
  }
  private revertBookmarkOptimisticUpdate(trigger: { postId: number; isBookmarked: boolean }): void {
    this._isMarked.set(!trigger.isBookmarked);
    // As with like, if you need to revert the actual `config` object, do it here.
  }

  // --- Folloe Effect (now internal to ViewPostCardComponent) ---
  private setupFollowEffect(): void {
    effect(() => {
      const trigger = this.toggleFollowTrigger();
      if (!trigger) return;

      this.isLoadingFollow.set(true);
      this.followError.set(null);

      this._PostsApiClientProvider.updateFollowUser({ followed_user_id: trigger.userId }).pipe(
        take(1),
        finalize(() => this.isLoadingFollow.set(false))
      ).subscribe({
        next: (res: IUpdateFollowResponseDto) => {
          if (res.status) {
            // if (res.data.post) {
            this.config.is_followed = res.data.is_followed;
            this.config = { ...this.config };
            this.syncConfigToSignals(); // Re-sync signals after config update
            // }
            // this._ToastService.add({
            //   severity: 'success',
            //   summary: 'general.success',
            //   detail: res.message || (this._isFollowed() ? 'User followed!' : 'User unfollowed!'),
            //   life: 3000,
            // });
            Logger.debug(`User ${this._isFollowed() ? 'followed' : 'unfollowed'} successfully:`, res);
            this._profileTriggerService.triggerFetchWithDisableLoading(true);
          } else {
            this._isFollowed.set(!trigger.isFollowing); // Revert optimistic update
            this.config.is_followed = this._isFollowed(); // Revert config
            this._ToastService.add({
              severity: 'error',
              summary: 'general.error',
              detail: res.message || 'Failed to update follow status.',
              life: 5000,
            });
            Logger.warn(`Failed to update follow status for user ${trigger.userId}:`, res);
          }
        },
        error: (error: ApiError) => {
          this._isFollowed.set(!trigger.isFollowing); // Revert optimistic update
          this.config.is_followed = this._isFollowed(); // Revert config
          this.followError.set(error);
          Logger.error('Error updating user follow status:', error);
          handleApiErrorsMessage(error);
          this._ToastService.add({
            severity: 'error',
            summary: 'general.error',
            detail: error?.message || 'Error occurred while updating follow status.',
            life: 5000,
          });
        }
      });
    });
  }
  // --- Public methods to trigger the internal like/bookmark actions ---
  protected toggleFavourite(postId: number): void {
    if (!postId || this.isLoadingLike()) {
      Logger.warn('Cannot toggle favourite: Post ID is missing or a request is already in progress.');
      return;
    }
    const newLikedStatus = !this._isLiked();
    const currentReactionCount = this._reactionsCount();
    this._isLiked.set(newLikedStatus); // Optimistic update
    this._reactionsCount.set(newLikedStatus ? currentReactionCount + 1 : Math.max(0, currentReactionCount - 1)); // Optimistic update
    this.toggleLikeTrigger.set({ postId: postId, isLiked: newLikedStatus });
  }

  protected toggleBookmark(postId: number): void {
    if (!postId || this.isLoadingBookmark()) {
      Logger.warn('Cannot toggle bookmark: Post ID is missing or a request is already in progress.');
      return;
    }
    const newBookmarkedStatus = !this._isMarked();
    this._isMarked.set(newBookmarkedStatus); // Optimistic update
    this.toggleBookmarkTrigger.set({ postId: postId, isBookmarked: newBookmarkedStatus });
  }

  /**
   * Clears and optionally focuses the comment box.
   * This method is still useful here as it interacts with a @ViewChild.
   */
  protected clearAndFocusCommentBox(): void {
    if (this.commentBox) {
      this.commentBox.clearComment();
      this.commentBox.focusInput();
    } else {
      Logger.warn('CommentBoxComponent not yet available for clearing/focusing.');
    }
  }

  /**
   * Determines if an action icon should appear "active" based on the current internal state.
   * @param name The name of the action ('favourite', 'comment', 'add'/'bookmark').
   * @returns True if the action is active, false otherwise.
   */
  protected isActive(name: 'favourite' | 'comment' | 'add'): boolean {
    switch (name) {
      case 'favourite':
        return this._isLiked(); // Use internal signal
      case 'add':
        return this._isMarked(); // Use internal signal
      case 'comment':
        return false;
      default:
        return false;
    }
  }

  /**
   * Handles the submission of a comment from the CommentBoxComponent.
   * Emits the comment content to the parent.
   * @param comment The content of the submitted comment.
   */
  protected onCommentSubmit(comment: string): void {
    Logger.info('Comment submitted from ViewPostCardComponent, emitting to parent:', comment);
    this.commentSubmitted.emit(comment); // Emit the comment content
  }

  protected goToProfile(id: number): void {
    this._Router.navigate([TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE + '/' + TalbinahCommunityRoutesEnum.USER_COMMUNITY_PROFILE, id]);
    this.closed.emit();
  }
}
