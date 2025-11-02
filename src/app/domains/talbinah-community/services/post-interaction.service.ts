import { inject, Injectable, signal, effect } from '@angular/core';
import { finalize, take } from 'rxjs';
import { TalbinahCommunityApiClientProvider } from '../clients';
import { IPost, IUpdatePostBookmarkResponseDto, IUpdatePostReactionResponseDto, IUpdateFollowResponseDto, ICreateCommentResponseDto } from '../dtos';
import { ToastService } from '../../../shared';
import { ApiError, handleApiErrorsMessage, Logger } from '../../../common';

@Injectable({
  providedIn: 'root',
})
export class PostInteractionService {
  private readonly _PostsApiClientProvider = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _ToastService = inject(ToastService);

  // Signals to trigger API calls from components
  private _toggleLikeTrigger = signal<number | null>(null);
  private _toggleBookmarkTrigger = signal<number | null>(null);
  private _toggleFollowTrigger = signal<number | null>(null);
  private _createCommentTrigger = signal<{ postId: number; content: string } | null>(null);

  // Signals to expose loading and error states for consumers
  readonly isLoadingLike = signal<boolean>(false);
  readonly isLoadingBookmark = signal<boolean>(false);
  readonly isLoadingFollow = signal<boolean>(false);
  readonly isLoadingComment = signal<boolean>(false);

  readonly likeError = signal<ApiError | null>(null);
  readonly bookmarkError = signal<ApiError | null>(null);
  readonly followError = signal<ApiError | null>(null);
  readonly commentError = signal<ApiError | null>(null);

  // Signal to emit the updated IPost object on successful API calls
  readonly postUpdatedSuccess = signal<IPost | null>(null);

  constructor() {
    this.setupLikeEffect();
    this.setupBookmarkEffect();
    this.setupFollowEffect();
    this.setupCreateCommentEffect();
  }

  // --- Public methods for components to trigger actions ---
  triggerToggleLike(postId: number): void {
    if (this.isLoadingLike()) {
      Logger.warn(`Service: Cannot trigger like for post ${postId}, a request is already in progress.`);
      return;
    }
    Logger.debug(`Service: Triggering like for post ID: ${postId}`);
    this._toggleLikeTrigger.set(postId);
  }

  triggerToggleBookmark(postId: number): void {
    if (this.isLoadingBookmark()) {
      Logger.warn(`Service: Cannot trigger bookmark for post ${postId}, a request is already in progress.`);
      return;
    }
    Logger.debug(`Service: Triggering bookmark for post ID: ${postId}`);
    this._toggleBookmarkTrigger.set(postId);
  }

  triggerToggleFollow(userId: number): void {
    if (this.isLoadingFollow()) {
      Logger.warn(`Service: Cannot trigger follow for user ${userId}, a request is already in progress.`);
      return;
    }
    Logger.debug(`Service: Triggering follow for user ID: ${userId}`);
    this._toggleFollowTrigger.set(userId);
  }

  triggerCreateComment(postId: number, content: string): void {
    if (!content.trim()) {
      Logger.warn('Service: Cannot submit empty comment.');
      this._ToastService.add({
        severity: 'error',
        summary: 'general.error',
        detail: 'Comment cannot be empty.',
        life: 3000,
      });
      return;
    }
    if (!postId) {
      Logger.error('Service: Cannot submit comment, Post ID is missing.');
      this._ToastService.add({
        severity: 'error',
        summary: 'general.error',
        detail: 'Cannot submit comment, post ID is missing.',
        life: 5000,
      });
      return;
    }
    if (this.isLoadingComment()) {
      Logger.warn(`Service: Cannot trigger comment for post ${postId}, a request is already in progress.`);
      return;
    }
    Logger.debug(`Service: Triggering comment for post ID: ${postId}`);
    this._createCommentTrigger.set({ postId, content });
  }

  // --- Internal Effects to handle API calls ---

  private setupLikeEffect(): void {
    effect(() => {
      const postId = this._toggleLikeTrigger();
      if (postId === null) return; // Use === null to handle initial null state

      this.isLoadingLike.set(true);
      this.likeError.set(null);
      Logger.debug(`Service: Making API call to update post reaction for post ID: ${postId}`);

      this._PostsApiClientProvider.updatePostReaction({ post_id: postId, react_id: 1 }).pipe(
        take(1),
        finalize(() => {
          this.isLoadingLike.set(false);
          // Reset trigger after call is complete
          this._toggleLikeTrigger.set(null);
          Logger.debug(`Service: Finished API call for post reaction on ID: ${postId}`);
        })
      ).subscribe({
        next: (res: IUpdatePostReactionResponseDto) => {
          if (res.status) {
            if (res.data.post) {
              this.postUpdatedSuccess.set(res.data.post); // Emit the updated post data
              Logger.debug('Service: Post reaction updated successfully, emitting updated post:', res.data.post);
            } else {
              Logger.warn('Service: Post reaction updated successfully but no updated post data received.');
            }
          } else {
            this.likeError.set({ message: res.message || 'Failed to update like status.', timestamp: new Date().toISOString() });
            this._ToastService.add({
              severity: 'error',
              summary: 'general.error',
              detail: res.message || 'Failed to update like status.',
              life: 5000,
            });
            Logger.warn(`Service: Failed to update like status for post ${postId}:`, res);
          }
        },
        error: (error: ApiError) => {
          this.likeError.set({ ...error, timestamp: new Date().toISOString() }); // Add timestamp for error tracking
          Logger.error('Service: Error updating post reaction:', error);
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

  private setupBookmarkEffect(): void {
    effect(() => {
      const postId = this._toggleBookmarkTrigger();
      if (postId === null) return;

      this.isLoadingBookmark.set(true);
      this.bookmarkError.set(null);
      Logger.debug(`Service: Making API call to update bookmark for post ID: ${postId}`);

      this._PostsApiClientProvider.updateBookmarkReaction({ post_id: postId }).pipe(
        take(1),
        finalize(() => {
          this.isLoadingBookmark.set(false);
          this._toggleBookmarkTrigger.set(null);
          Logger.debug(`Service: Finished API call for bookmark on ID: ${postId}`);
        })
      ).subscribe({
        next: (res: IUpdatePostBookmarkResponseDto) => {
          if (res.status) {
            // this._ToastService.add({
            //   severity: 'success',
            //   summary: 'general.success',
            //   detail: res.message || 'Post bookmark updated successfully!',
            //   life: 3000,
            // });
            if (res.data.post) {
              this.postUpdatedSuccess.set(res.data.post); // Emit the updated post data
              Logger.debug('Service: Post bookmark updated successfully, emitting updated post:', res.data.post);
            } else {
              Logger.warn('Service: Post bookmark updated successfully but no updated post data received.');
            }
          } else {
            this.bookmarkError.set({ message: res.message || 'Failed to update bookmark status.', timestamp: new Date().toISOString() });
            this._ToastService.add({
              severity: 'error',
              summary: 'general.error',
              detail: res.message || 'Failed to update bookmark status.',
              life: 5000,
            });
            Logger.warn(`Service: Failed to update bookmark status for post ${postId}:`, res);
          }
        },
        error: (error: ApiError) => {
          this.bookmarkError.set({ ...error, timestamp: new Date().toISOString() });
          Logger.error('Service: Error updating post bookmark:', error);
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

  private setupFollowEffect(): void {
    effect(() => {
      const userId = this._toggleFollowTrigger();
      if (userId === null) return;

      this.isLoadingFollow.set(true);
      this.followError.set(null);
      Logger.debug(`Service: Making API call to update follow status for user ID: ${userId}`);

      this._PostsApiClientProvider.updateFollowUser({ followed_user_id: userId }).pipe(
        take(1),
        finalize(() => {
          this.isLoadingFollow.set(false);
          this._toggleFollowTrigger.set(null);
          Logger.debug(`Service: Finished API call for follow on user ID: ${userId}`);
        })
      ).subscribe({
        next: (res: IUpdateFollowResponseDto) => {
          if (res.status) {
            // this._ToastService.add({
            //   severity: 'success',
            //   summary: 'general.success',
            //   detail: res.message || 'User follow status updated successfully!',
            //   life: 3000,
            // });
            if (res.data.post) { // Assuming follow response might return post data relevant to the user
              this.postUpdatedSuccess.set(res.data.post);
              Logger.debug('Service: User follow status updated successfully, emitting updated post:', res.data.post);
            } else {
              Logger.warn('Service: User follow status updated successfully but no relevant post data received.');
            }
          } else {
            this.followError.set({ message: res.message || 'Failed to update follow status.', timestamp: new Date().toISOString() });
            this._ToastService.add({
              severity: 'error',
              summary: 'general.error',
              detail: res.message || 'Failed to update follow status.',
              life: 5000,
            });
            Logger.warn(`Service: Failed to update follow status for user ${userId}:`, res);
          }
        },
        error: (error: ApiError) => {
          this.followError.set({ ...error, timestamp: new Date().toISOString() });
          Logger.error('Service: Error updating user follow status:', error);
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

  private setupCreateCommentEffect(): void {
    effect(() => {
      const trigger = this._createCommentTrigger();
      if (!trigger) return;

      this.isLoadingComment.set(true);
      this.commentError.set(null);
      Logger.debug(`Service: Making API call to create comment for post ID: ${trigger.postId}`);

      this._PostsApiClientProvider.createPostComment(trigger.postId, { content: trigger.content, post_id: trigger.postId }).pipe(
        take(1),
        finalize(() => {
          this.isLoadingComment.set(false);
          this._createCommentTrigger.set(null);
          Logger.debug(`Service: Finished API call for comment on ID: ${trigger.postId}`);
        })
      ).subscribe({
        next: (res: ICreateCommentResponseDto) => {
          if (res.status) {
            // this._ToastService.add({
            //   severity: 'success',
            //   summary: 'general.success',
            //   detail: res.message || 'Comment added successfully!',
            //   life: 3000,
            // });
            if (res.data.post) {
              this.postUpdatedSuccess.set(res.data.post); // Emit the updated post data
              Logger.debug('Service: Comment created successfully, emitting updated post:', res.data.post);
            } else {
              Logger.warn('Service: Comment created successfully but no updated post data received.');
            }
          } else {
            this.commentError.set({ message: res.message || 'Failed to add comment.', timestamp: new Date().toISOString() });
            this._ToastService.add({
              severity: 'error',
              summary: 'general.error',
              detail: res.message || 'Failed to add comment.',
              life: 5000,
            });
            Logger.warn(`Service: Failed to add comment for post ${trigger.postId}:`, res);
          }
        },
        error: (error: ApiError) => {
          this.commentError.set({ ...error, timestamp: new Date().toISOString() });
          Logger.error('Service: Error creating comment:', error);
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
}
