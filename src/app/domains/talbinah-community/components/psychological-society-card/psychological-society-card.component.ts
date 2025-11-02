// psychological-society-card.component.ts
import { IPost, IUpdatePostBookmarkResponseDto, IUpdatePostReactionResponseDto, IUpdateFollowResponseDto, IUserIdentifyProfileData, ICreateCommentResponseDto } from '../../dtos';
import { Component, computed, Input, signal, SimpleChanges, inject, Output, ViewChild, ChangeDetectionStrategy, effect, OnInit, PLATFORM_ID } from '@angular/core';
import { ModalService, ShareSocialComponent, StorageKeys, ToastService, useTimeAgoRealtime } from '../../../../shared';
import { ApiError, CardType, handleApiErrorsMessage, LanguageService, Logger, StorageService } from '../../../../common';
import { ViewPsychologicalSocietyPostComponent } from '../view-psychological-society-post';
import { UserIdentityStore } from '../../routes/user-identity.service';
import { TalbinahCommunityApiClientProvider } from '../../clients';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TalbinahCommunityRoutesEnum } from '../../constants';
import { OpenPostMenuComponent } from '../open-post-menu';
import { TranslateModule } from '@ngx-translate/core';
import { CommentBoxComponent } from '../comment-box';
import { RefreshService } from '../../services';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { RoleGuardService } from '../../../authentication';
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
  selector: 'app-psychological-society-card',
  standalone: true,
  templateUrl: './psychological-society-card.component.html',
  styleUrls: ['./psychological-society-card.component.scss'],
  imports: [
    TranslateModule,
    CommonModule,

    OpenPostMenuComponent,
    ShareSocialComponent,
    CommentBoxComponent,
    TranslateApiPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PsychologicalSocietyCardComponent implements OnInit {

  protected readonly _LanguageService = inject(LanguageService);
  private currentLang = this._LanguageService.getCurrentLanguage();

  private RefreshService = inject(RefreshService);
  private modalService = inject(ModalService);
  private platformId = inject(PLATFORM_ID);
  private _Router = inject(Router);

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Computed Signals -----
  public readonly isLoggedIn = computed(() => {
    if (!this.isBrowser()) return false;
    const token = this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null;
    return !!token;
  });

  @Output() deletePostAction: EventEmitter<IPost> = new EventEmitter();
  @Output() editPostAction: EventEmitter<IPost> = new EventEmitter();

  @Input({ required: true }) config!: IPost;
  @Input() type: CardType = CardType.DETAILS;
  @Input() isEnableCommented: boolean = false;
  @Input() hasBorder: boolean = false;
  @Input() readOnly: boolean = false;

  @Input() isUserProfile = signal<boolean>(false);

  @Input() userIdentityProfileData = signal<IUserIdentifyProfileData | null>(null);
  @Output() commentChanged = new EventEmitter<IPost>();

  protected isActions = signal<boolean>(true);

  @ViewChild(CommentBoxComponent) commentBox!: CommentBoxComponent;

  private readonly _PostsApiClientProvider = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _ToastService = inject(ToastService);
  protected readonly _UserIdentityStore = inject(UserIdentityStore);

  // Signals to trigger API calls
  private toggleLikeTrigger = signal<{ postId: number; isLiked: boolean } | null>(null);
  private toggleBookmarkTrigger = signal<{ postId: number; isBookmarked: boolean } | null>(null);
  private toggleFollowTrigger = signal<{ userId: number; isFollowing: boolean } | null>(null);
  private createCommentTrigger = signal<{ postId: number; content: string } | null>(null);

  // Signals to represent the current state (optimistically updated)
  protected _isLiked = signal<boolean>(false);
  protected _reactionsCount = signal<number>(0);
  protected _isMarked = signal<boolean>(false);
  protected _isFollowed = signal<boolean>(false);

  // Signals to track API request loading/error states
  protected isLoadingLike = signal<boolean>(false);
  protected isLoadingBookmark = signal<boolean>(false);
  protected isLoadingFollow = signal<boolean>(false);
  protected isLoadingComment = signal<boolean>(false);
  protected likeError = signal<ApiError | null>(null);
  protected bookmarkError = signal<ApiError | null>(null);
  protected followError = signal<ApiError | null>(null);
  protected commentError = signal<ApiError | null>(null);

  // Expose computed signals for template binding
  readonly isLiked = computed(() => this._isLiked());
  readonly reactionsCount = computed(() => this._reactionsCount());
  readonly isMarked = computed(() => this._isMarked());
  readonly commentsCount = computed(() => this.config.comments_count ?? 0);
  readonly isFollowed = computed(() => this._isFollowed());

  protected cardType = CardType;
  protected showSupport = computed(() => this.config?.interest);
  protected showGratitude = computed(() => this.config?.interest);

  // Helper to check if running in a browser environment
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  constructor() {
    this.setupLikeEffect();
    this.setupBookmarkEffect();
    this.setupFollowEffect();
    this.setupCreateCommentEffect();
  }

  ngOnInit(): void {
    this.syncConfigToSignals();
  }

  // Use `ngOnChanges` for `@Input` updates to resync signals
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && this.config) {
      this.syncConfigToSignals();
    }
  }

  private syncConfigToSignals(): void {
    // Defensive checks for config properties
    if (this.config) {
      this._isLiked.set(this.config.is_liked?.id === 1);
      this._reactionsCount.set(this.config.reactions_count ?? 0);
      this._isMarked.set(this.config.is_marked ?? false);
      this._isFollowed.set(this.config.is_followed ?? false);
    }
  }

  // Timeago Action - ensure `useTimeAgoRealtime` handles initial render gracefully
  protected returnItemTimeAgo(id: number, date: Date): string {
    const { value, unit } = useTimeAgoRealtime(id, date)();
    const rtf = new Intl.RelativeTimeFormat(this.currentLang || undefined, { numeric: 'auto' });
    return rtf.format(-value, unit);
  }

  protected getCreatedAtDate(): Date {
    return this.config?.created_at ? new Date(this.config.created_at) : new Date(0);
  }

  // Toggle Follow Action - Guard with `isBrowser()` for client-side API calls
  protected toggleFollow(userId: number | undefined): void {

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    if (!this.isBrowser() || userId === undefined || this.isLoadingFollow()) {
      Logger.warn('Cannot toggle follow: Not in browser, User ID is missing, or a request is already in progress.');
      return;
    }
    const newFollowingStatus = !this._isFollowed();
    this._isFollowed.set(newFollowingStatus); // Optimistic update
    this.toggleFollowTrigger.set({ userId: userId, isFollowing: newFollowingStatus });
    this.RefreshService.triggerRefresh();

  }

  // Effect for handling Like API call
  private setupLikeEffect(): void {
    effect(() => {
      const trigger = this.toggleLikeTrigger();
      if (!trigger) return;

      this.isLoadingLike.set(true);
      this.likeError.set(null);

      // Only make API call if in browser, otherwise the effect just sets loading state
      if (this.isBrowser()) {
        this._PostsApiClientProvider.updatePostReaction({ post_id: trigger.postId, react_id: 1 }).pipe(
          take(1),
          finalize(() => this.isLoadingLike.set(false))
        ).subscribe({
          next: (res: IUpdatePostReactionResponseDto) => {
            if (res.status) {
              if (res.data?.post) {
                this.config = { ...this.config, ...res.data.post };
                this.syncConfigToSignals();
              }
              Logger.debug(`Post ${this._isLiked() ? 'liked' : 'unliked'} successfully:`, res);
              this.RefreshService.triggerRefresh();

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
      }
    });
  }

  private revertLikeOptimisticUpdate(trigger: { postId: number; isLiked: boolean }): void {
    this._isLiked.set(!trigger.isLiked);
    this._reactionsCount.update(count => trigger.isLiked ? count - 1 : count + 1);
    this.config.reactions_count = this._reactionsCount();
  }

  // Effect for handling Bookmark API call
  private setupBookmarkEffect(): void {
    effect(() => {
      const trigger = this.toggleBookmarkTrigger();
      if (!trigger) return;

      this.isLoadingBookmark.set(true);
      this.bookmarkError.set(null);

      if (this.isBrowser()) {
        this._PostsApiClientProvider.updateBookmarkReaction({ post_id: trigger.postId }).pipe(
          take(1),
          finalize(() => this.isLoadingBookmark.set(false))
        ).subscribe({
          next: (res: IUpdatePostBookmarkResponseDto) => {
            if (res.status) {
              if (res.data?.post) {
                this.config = { ...this.config, ...res.data.post };
                this.syncConfigToSignals();
              }
              // this._ToastService.add({
              //   severity: 'success',
              //   summary: 'general.success',
              //   detail: res.message || (this._isMarked() ? 'Post bookmarked!' : 'Post unbookmarked!'),
              //   life: 3000,
              // });
              Logger.debug(`Post ${this._isMarked() ? 'bookmarked' : 'unbookmarked'} successfully:`, res);
              this.RefreshService.triggerRefresh();

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
      }
    });
  }

  private revertBookmarkOptimisticUpdate(trigger: { postId: number; isBookmarked: boolean }): void {
    this._isMarked.set(!trigger.isBookmarked);
    this.config.is_marked = this._isMarked();
  }

  // Effect for handling Follow API call
  private setupFollowEffect(): void {
    effect(() => {
      const trigger = this.toggleFollowTrigger();
      if (!trigger) return;

      this.isLoadingFollow.set(true);
      this.followError.set(null);

      if (this.isBrowser()) {
        this._PostsApiClientProvider.updateFollowUser({ followed_user_id: trigger.userId }).pipe(
          take(1),
          finalize(() => this.isLoadingFollow.set(false))
        ).subscribe({
          next: (res: IUpdateFollowResponseDto) => {
            if (res.status) {
              this.config.is_followed = res.data?.is_followed ?? false; // Use nullish coalescing
              this.config = { ...this.config };
              this.syncConfigToSignals();

              // this._ToastService.add({
              //   severity: 'success',
              //   summary: 'general.success',
              //   detail: res.message || (this._isFollowed() ? 'User followed!' : 'User unfollowed!'),
              //   life: 3000,
              // });
              Logger.debug(`User ${this._isFollowed() ? 'followed' : 'unfollowed'} successfully:`, res);
              this._UserIdentityStore.fetch(); // ✅ FETCH LATEST USER PROFILE DATA HERE
              this.RefreshService.triggerRefresh();
            } else {
              this.revertFollowOptimisticUpdate(trigger); // Revert on API failure
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
            this.revertFollowOptimisticUpdate(trigger); // Revert on error
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
      }
    });
  }

  private revertFollowOptimisticUpdate(trigger: { userId: number; isFollowing: boolean }): void {
    this._isFollowed.set(!trigger.isFollowing);
    if (this.config.user) {
      this.config.user.is_followed = this._isFollowed();
    }
  }

  // New effect for creating comments
  protected clearAndFocusCommentBox(): void {
    if (this.isBrowser() && this.commentBox) {
      this.commentBox.clearComment();
      this.commentBox.focusInput();
    } else {
      Logger.warn('CommentBoxComponent not available or not in browser for clearing/focusing.');
    }
  }

  protected onCommentSubmit(comment: string): void {
    if (!this.isBrowser()) {
      Logger.warn('Cannot submit comment: Not in browser environment.');
      return;
    }
    if (!comment.trim()) {
      Logger.warn('Cannot submit empty comment.');
      this._ToastService.add({
        severity: 'error',
        summary: 'general.error',
        detail: 'Comment cannot be empty.',
        life: 3000,
      });
      return;
    }
    if (!this.config?.id) {
      Logger.error('Cannot submit comment: Post ID is missing.');
      this._ToastService.add({
        severity: 'error',
        summary: 'general.error',
        detail: 'Cannot submit comment, post ID is missing.',
        life: 5000,
      });
      return;
    }

    Logger.info('Post Card User Comment:', comment);
    this.createCommentTrigger.set({ postId: this.config.id, content: comment });
  }

  private setupCreateCommentEffect(): void {
    effect(() => {
      const trigger = this.createCommentTrigger();
      if (!trigger) return;

      this.isLoadingComment.set(true);
      this.commentError.set(null);

      if (this.isBrowser()) {
        this._PostsApiClientProvider.createPostComment(trigger.postId, { content: trigger.content, post_id: trigger.postId }).pipe(
          take(1),
          finalize(() => this.isLoadingComment.set(false))
        ).subscribe({
          next: (res: ICreateCommentResponseDto) => {
            if (res.status) {
              if (res.data?.post) { // Use safe navigation
                this.config = { ...this.config, ...res.data.post };
                this.syncConfigToSignals();
              }
              // this._ToastService.add({
              //   severity: 'success',
              //   summary: 'general.success',
              //   detail: res.message || 'Comment added successfully!',
              //   life: 3000,
              // });
              Logger.debug('Comment created successfully:', res);
              this.clearAndFocusCommentBox();
              this.commentChanged.emit(this.config);
              this.RefreshService.triggerRefresh();
            } else {
              this.commentError.set({ message: res.message || 'Failed to add comment.', timestamp: new Date().toISOString() });
              this._ToastService.add({
                severity: 'error',
                summary: 'general.error',
                detail: res.message || 'Failed to add comment.',
                life: 5000,
              });
              Logger.warn('Failed to add comment:', res);
            }
          },
          error: (error: ApiError) => {
            this.commentError.set(error);
            Logger.error('Error creating comment:', error);
            handleApiErrorsMessage(error);
            this._ToastService.add({
              severity: 'error',
              summary: 'general.error',
              detail: error?.message || 'Error occurred while adding comment.',
              life: 5000,
            });
          }
        });
      }
    });
  }

  protected onActionClick(name: 'favourite' | 'comment' | 'bookmark' | 'follow') {
    if (!this.isBrowser()) return;

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    Logger.debug('Config on action click:', this.config);
    switch (name) {
      case 'comment':
        Logger.debug('ViewPostDetails called, Method comment implemented.');
        if (this.config) {
          this.ViewPostDetails(this.config);
        }
        break;
      case 'favourite':
        if (this.config?.id) {
          this.toggleFavourite(this.config.id);
        }
        break;
      case 'bookmark':
        if (this.config?.id) {
          this.toggleBookmark(this.config.id);
        }
        break;
      case 'follow':
        if (this.config?.user?.id) {
          this.toggleFollow(this.config.user.id);
        }
        break;
    }
  }

  protected emitInputClicked(config?: IPost): void {
    if (!this.isBrowser()) return;

    Logger.debug("Readonly + Emit Input Clicked: ", config);
    if (config) {
      this.ViewPostDetails(config);
    }
  }

  protected ViewPostDetails(config: IPost): void {
    if (!this.isBrowser()) return;

    this.modalService.open(ViewPsychologicalSocietyPostComponent, {
      inputs: {
        image: 'images/community/icons/header-icon.png',
        title: 'view_post',
        config: {
          post: config,
          userIdentityProfileData: this.userIdentityProfileData()
        }
      },
      outputs: {
        closed: () => {
          Logger.debug('The post view modal is closed');
        }
      },
      width: '60%'
    });
  }

  protected editPostDetails(data: any): void {
    if (!this.isBrowser()) return;

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    Logger.debug('Card=> Item to edit at card: ', data);
    this.editPostAction.emit(data);
  }

  protected deletePostDetails(data: any): void {
    if (!this.isBrowser()) return;

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    Logger.debug('Card=> Item to delete at card: ', data);
    this.deletePostAction.emit(data);
  }

  protected toggleFavourite(postId: number): void {

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    if (!this.isBrowser() || !postId || this.isLoadingLike()) {
      Logger.warn('Cannot toggle favourite: Not in browser, Post ID is missing or a request is already in progress.');
      return;
    }
    const newLikedStatus = !this._isLiked();
    const currentReactionCount = this._reactionsCount();
    this._isLiked.set(newLikedStatus);
    this._reactionsCount.set(newLikedStatus ? currentReactionCount + 1 : Math.max(0, currentReactionCount - 1));
    this.toggleLikeTrigger.set({ postId: postId, isLiked: newLikedStatus });
  }

  protected toggleBookmark(postId: number): void {
    if (!this.isBrowser() || !postId || this.isLoadingBookmark()) {
      Logger.warn('Cannot toggle bookmark: Not in browser, Post ID is missing or a request is already in progress.');
      return;
    }
    const newBookmarkedStatus = !this._isMarked();
    this._isMarked.set(newBookmarkedStatus);
    this.toggleBookmarkTrigger.set({ postId: postId, isBookmarked: newBookmarkedStatus });
  }

  protected goToProfile(id: number): void {
    if (!this.isBrowser()) return;
    this._Router.navigate([TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE + '/' + TalbinahCommunityRoutesEnum.USER_COMMUNITY_PROFILE, id]);
  }
}
