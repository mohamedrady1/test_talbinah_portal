import { Component, effect, EventEmitter, inject, Input, Output, signal, ViewChild, OnInit, PLATFORM_ID } from '@angular/core'; // Added OnInit
import { ApiError, CardType, handleApiErrorsMessage, Logger, StorageService } from '../../../../common';
import { IComment } from '../../models'; // Keep IComment if still used for the comments array
import { CommentCardComponent } from '../comment-card';
import { CommentBoxComponent } from "../comment-box/comment-box.component";
import { AutoExactHeightParentDirective } from '../../../../common/core/directives/clickOutside/auto-exact-height-parent.directive';
import { ICreateCommentResponseDto, IPost, IUpdatePostBookmarkResponseDto, IUpdatePostReactionResponseDto, IUserIdentifyProfileData } from '../../dtos'; // Added IUpdatePostBookmarkResponseDto, IUpdatePostReactionResponseDto
import { ViewPostCardComponent } from '../view-post-card';
import { TalbinahCommunityApiClientProvider } from '../../clients';
import { StorageKeys, ToastService } from '../../../../shared';
import { finalize, take } from 'rxjs';
import { computed } from '@angular/core'; // Add computed import
import { isPlatformBrowser } from '@angular/common';
import { RoleGuardService, UserContextService } from '../../../authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-psychological-society-post',
  standalone: true,
  imports: [
    CommentCardComponent,
    CommentBoxComponent,
    AutoExactHeightParentDirective,
    ViewPostCardComponent
  ],
  templateUrl: './view-psychological-society-post.component.html',
  styleUrls: ['./view-psychological-society-post.component.scss']
})
export class ViewPsychologicalSocietyPostComponent implements OnInit { // Implement OnInit
  @Input() config!: { post: IPost, userIdentityProfileData: IUserIdentifyProfileData | null };
  // The userIdentityProfileData input here is redundant if it's part of the config object.
  // You might want to remove it and access it via this.config?.userIdentityProfileData.
  // For now, I'll keep it as it is in your provided code, but it's something to consider.
  @Input() userIdentityProfileData = signal<IUserIdentifyProfileData | null>(null);
  @Output() closed = new EventEmitter<void>();

  private readonly _PostsApiClientProvider = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _ToastService = inject(ToastService);

  // Signals to trigger API calls for Like and Bookmark
  private toggleLikeTrigger = signal<{ postId: number; isLiked: boolean } | null>(null);
  private toggleBookmarkTrigger = signal<{ postId: number; isBookmarked: boolean } | null>(null);

  // Signals to represent the current state (optimistically updated)
  protected _isLiked = signal<boolean>(false);
  protected _reactionsCount = signal<number>(0);
  protected _isMarked = signal<boolean>(false);

  // Signals to track API request loading/error states for Like and Bookmark
  protected isLoadingLike = signal<boolean>(false);
  protected isLoadingBookmark = signal<boolean>(false);
  protected likeError = signal<ApiError | null>(null);
  protected bookmarkError = signal<ApiError | null>(null);


  // Signals for comment creation (already present)
  private createCommentTrigger = signal<{ postId: number; content: string } | null>(null);
  protected isLoadingComment = signal<boolean>(false);
  protected commentError = signal<ApiError | null>(null);

  @Output() commentChanged = new EventEmitter<IPost>();
  protected isActions = signal<boolean>(true);

  @ViewChild(CommentBoxComponent) commentBox!: CommentBoxComponent;

  cardType = CardType;

  comments = signal<IComment[]>([
    {
      id: 1,
      author: 'Ahmed',
      avatarUrl: 'https://i.pravatar.cc/100?img=1',
      text: '🤝 مرّيت بنفس الشيء',
      likes: 3,
      replies: [
        {
          id: 2,
          author: 'Sara',
          avatarUrl: 'https://i.pravatar.cc/100?img=2',
          text: '🤝 مرّيت بنفس الشيء',
          likes: 1,
          replies: [
            {
              id: 2,
              author: 'Sara',
              avatarUrl: 'https://i.pravatar.cc/100?img=2',
              text: '🤝 مرّيت بنفس الشيء',
              likes: 1,
              replies: [],
              since: 944554,
            },

          ],
          since: 54554
        },
        {
          id: 2,
          author: 'Sara',
          avatarUrl: 'https://i.pravatar.cc/100?img=2',
          text: '🤝 مرّيت بنفس الشيء',
          likes: 1,
          replies: [],
          since: 54544554

        },
      ],
      since: 123456 // Add a suitable value for 'since'
    },
    {
      id: 1,
      author: 'Ahmed',
      avatarUrl: 'https://i.pravatar.cc/100?img=1',
      text: '🤝 مرّيت بنفس الشيء',
      likes: 3,
      replies: [
        {
          id: 2,
          author: 'Sara',
          avatarUrl: 'https://i.pravatar.cc/100?img=2',
          text: '🤝 مرّيت بنفس الشيء',
          likes: 1,
          replies: [
            {
              id: 2,
              author: 'Sara',
              avatarUrl: 'https://i.pravatar.cc/100?img=2',
              text: '🤝 مرّيت بنفس الشيء',
              likes: 1,
              replies: [],
              since: 54554
            },
          ],
          since: 4554

        },
        {
          id: 2,
          author: 'Sara',
          avatarUrl: 'https://i.pravatar.cc/100?img=2',
          text: '🤝 مرّيت بنفس الشيء',
          likes: 1,
          replies: [],
          since: 4

        },
      ],
      since: 554

    },
  ]);

  // Expose computed signals for template binding
  readonly isLiked = computed(() => this._isLiked());
  readonly reactionsCount = computed(() => this._reactionsCount());
  readonly isMarked = computed(() => this._isMarked());

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
    this.setupCreateCommentEffect();
    this.setupLikeEffect(); // Call the new like effect
    this.setupBookmarkEffect(); // Call the new bookmark effect
  }

  ngOnInit() {
    Logger.debug('ViewPsychologicalSocietyPostComponent => config: ', this.config);
    this.userIdentityProfileData.set(this.config?.userIdentityProfileData); // Keep if you still want this separate signal
    Logger.debug('ViewPsychologicalSocietyPostComponent => config: ', this.userIdentityProfileData());
    // Initialize comments and other states from the provided config
    if (this.config && this.config.post) {
      this.syncConfigToSignals(); // Sync initial like/bookmark states
    }
  }

  // New method to sync post config to signals (copied from PsychologicalSocietyCardComponent)
  private syncConfigToSignals(): void {
    if (this.config?.post) { // Access post property
      this._isLiked.set(this.config.post.is_liked?.id === 1);
      this._reactionsCount.set(this.config.post.reactions_count ?? 0);
      this._isMarked.set(this.config.post.is_marked ?? false);
      // No _isFollowed here as that's related to the card component's context
    }
  }

  // --- Like Effect ---
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
              // Update the config.post object directly
              this.config.post = { ...this.config.post, ...res.data.post };
              this.syncConfigToSignals(); // Re-sync signals after config update
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
    if (this.config?.post) {
      this.config.post.reactions_count = this._reactionsCount(); // Revert config as well
    }
  }

  // --- Bookmark Effect ---
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
              this.config.post = { ...this.config.post, ...res.data.post };
              this.syncConfigToSignals(); // Re-sync signals after config update
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
    if (this.config?.post) {
      this.config.post.is_marked = this._isMarked(); // Revert config as well
    }
  }

  // --- Comment Effect (already present) ---
  private setupCreateCommentEffect(): void {
    effect(() => {
      const trigger = this.createCommentTrigger();
      if (!trigger) return;

      this.isLoadingComment.set(true);
      this.commentError.set(null);

      this._PostsApiClientProvider.createPostComment(trigger.postId, { content: trigger.content, post_id: trigger.postId }).pipe(
        take(1),
        finalize(() => this.isLoadingComment.set(false))
      ).subscribe({
        next: (res: ICreateCommentResponseDto) => {
          if (res.status) {
            if (res.data.post) {
              this.config.post = { ...this.config.post, ...res.data.post }; // Update the nested post object
              this.comments.set(
                (res.data.post.comments || []).map((commentPost: any) => ({
                  author: commentPost.author || '',
                  avatarUrl: commentPost.avatarUrl || '',
                  text: commentPost.content || commentPost.text || '',
                  likes: commentPost.likes || 0,
                  since: commentPost.since || commentPost.created_at || '',
                  ...commentPost
                }))
              ); // Update comments signal with the new list
            }

            // this._ToastService.add({
            //   severity: 'success',
            //   summary: 'general.success',
            //   detail: res.message || 'Comment added successfully!',
            //   life: 3000,
            // });
            Logger.debug('Comment created successfully:', res);
            this.clearAndFocusCommentBox();
            this.commentChanged.emit(this.config.post); // Emit the updated post object
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
    });
  }

  protected clearAndFocusCommentBox(): void {
    if (this.commentBox) {
      this.commentBox.clearComment();
      this.commentBox.focusInput();
    } else {
      Logger.warn('CommentBoxComponent not yet available for clearing/focusing.');
    }
  }

  protected onCommentSubmit(comment: string): void {
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
    // Access post.id from the nested config
    if (!this.config?.post?.id) {
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
    this.createCommentTrigger.set({ postId: this.config.post.id, content: comment });
  }

  // --- Public methods to trigger the like/bookmark actions ---
  protected toggleFavourite(postId: number): void {

    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

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
    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }


    if (!postId || this.isLoadingBookmark()) {
      Logger.warn('Cannot toggle bookmark: Post ID is missing or a request is already in progress.');
      return;
    }
    const newBookmarkedStatus = !this._isMarked();
    this._isMarked.set(newBookmarkedStatus); // Optimistic update
    this.toggleBookmarkTrigger.set({ postId: postId, isBookmarked: newBookmarkedStatus });
  }

  protected onActionEmittedFromCard(event: IPost): void {
    Logger.debug(`Action clicked in ViewPsychologicalSocietyPostComponent (from child): ${event}, Post ID: ${this.config.post.id}`, event);
    this.config.post = { ...this.config.post, ...event };
    this.syncConfigToSignals(); // Re-sync signals after config update
  }

  // Stub for toggleFollow to avoid compile error
  protected toggleFollow(userId: number): void {
    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    Logger.info(`toggleFollow called with userId: ${userId} (method not implemented).`);
    // Implement follow/unfollow logic here if needed
  }
  protected closeModal(): void {
    this.closed.emit();
  }
}
