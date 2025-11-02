import { Component, Input, signal, computed, inject, OnInit, effect, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentBoxComponent } from "../comment-box/comment-box.component";
import { animate, style, transition, trigger } from '@angular/animations';
import { LocalizationService, useTimeAgoRealtime, ToastService } from '../../../../shared';
import { TranslateModule } from '@ngx-translate/core';
import { ApiError, LanguageService, Logger, handleApiErrorsMessage } from '../../../../common';
import { TalbinahCommunityApiClientProvider } from '../../clients';
import { finalize, take } from 'rxjs';
import { ICommentPost, IReactCommentResponseDto, IReactPostCommentRequestDto, IUserIdentifyProfileData } from '../../dtos';
import { Router } from '@angular/router';
import { TalbinahCommunityRoutesEnum } from '../../constants';
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  imports: [CommonModule, CommentBoxComponent, TranslateModule, TranslateApiPipe],
  styleUrls: ['./comment-card.component.scss'],
  standalone: true,
  animations: [
    trigger('slideFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class CommentCardComponent implements OnInit {
  @Input({ required: true }) comment!: ICommentPost;

  readonly _LanguageService = inject(LanguageService);
  private readonly _ToastService = inject(ToastService);
  private readonly _PostsApiClientProvider = inject(TalbinahCommunityApiClientProvider).getClient();
  private _Router = inject(Router)

  private currentLang = this._LanguageService.getCurrentLanguage();
  protected isActions = signal<boolean>(true);
  protected isLoadingComment = signal<boolean>(false); // Associated with comment creation
  @Input() userIdentityProfileData = signal<IUserIdentifyProfileData | null>(null);
  @Output() closePopup = new EventEmitter<void>();


  likeAnimation = signal(false);
  showReplies = signal(false);
  showReplyBox = signal(false);

  protected hasLiked = signal<boolean>(false);
  protected commentReactionsCount = signal<number>(0);

  private toggleCommentLikeTrigger = signal<{ commentId: number; isLiked: boolean } | null>(null);

  protected isLoadingCommentLike = signal<boolean>(false);
  protected commentLikeError = signal<ApiError | null>(null);

  private readonly localization = inject(LocalizationService);

  constructor() {
    this.setupCommentLikeEffect();
  }

  ngOnInit() {
    // Initialize signals based on the @Input comment data
    if (this.comment) {
      this.hasLiked.set(this.comment.is_liked?.id === 1);
      this.commentReactionsCount.set(this.comment.reactions_count ?? 0);

      // Fallback dummy data for user if missing from the input,
      // though typically the parent component should ensure `comment.user` is complete.
      if (!this.comment.user) {
        Logger.warn('Comment user data is missing, using dummy data.');
        this.comment.user = {
          "id": 2266,
          "dummy_name": "إسلام عفيفي",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [],
          "my_post_count": 0,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": ""
        };
      }
    } else {
      Logger.error('Comment input is undefined in CommentCardComponent ngOnInit.');
    }
  }

  protected toggleReplyBox(): void {
    this.showReplyBox.update((prev) => !prev);
  }

  protected likePostComment(comment: ICommentPost): void {
    Logger.debug("CommentCardComponent => likePostComment triggered for comment:", comment);

    if (!comment.id || this.isLoadingCommentLike()) {
      Logger.warn('Cannot toggle like: Comment ID is missing or a request is already in progress.');
      return;
    }

    const newLikedStatus = !this.hasLiked();
    this.hasLiked.set(newLikedStatus);
    this.commentReactionsCount.update(count =>
      newLikedStatus ? count + 1 : Math.max(0, count - 1)
    );

    if (newLikedStatus) {
      this.likeAnimation.set(true);
      setTimeout(() => this.likeAnimation.set(false), 1000);
    }

    this.toggleCommentLikeTrigger.set({ commentId: comment.id, isLiked: newLikedStatus });
  }

  private setupCommentLikeEffect(): void {
    effect(() => {
      const trigger = this.toggleCommentLikeTrigger();
      if (!trigger) return;

      this.isLoadingCommentLike.set(true);
      this.commentLikeError.set(null);

      this._PostsApiClientProvider.reactPostComment({ comment_id: trigger.commentId, react_id: 1 }).pipe(
        take(1),
        finalize(() => this.isLoadingCommentLike.set(false))
      ).subscribe({
        next: (res: IReactCommentResponseDto) => {
          if (res.status) {
            // Find the specific comment in the updated post's comments array
            const updatedCommentInPost = res.data.post?.comments?.find(
              (item) => item.id === this.comment.id
            );

            if (updatedCommentInPost) {
              // Update the @Input comment object with the full updated data
              this.comment = { ...this.comment, ...updatedCommentInPost };
              // Re-sync local signals with the updated comment input
              this.hasLiked.set(this.comment.is_liked?.id === 1);
              this.commentReactionsCount.set(this.comment.reactions_count ?? 0);
              Logger.debug('Comment successfully updated from API response:', this.comment);
            } else {
              Logger.warn('Comment reaction successful, but matching comment not found in returned post data.');
              // In this case, we rely on the optimistic update
            }

            // this._ToastService.add({
            //   severity: 'success',
            //   summary: 'general.success',
            //   detail: res.message || (this.hasLiked() ? 'Comment liked!' : 'Comment unliked!'),
            //   life: 3000,
            // });
            Logger.debug(`Comment ${this.hasLiked() ? 'liked' : 'unliked'} successfully:`, res);
          } else {
            this.revertCommentLikeOptimisticUpdate(trigger);
            this._ToastService.add({
              severity: 'error',
              summary: 'general.error',
              detail: res.message || 'Failed to update comment like status.',
              life: 5000,
            });
            Logger.warn(`Failed to update like status for comment ${trigger.commentId}:`, res);
          }
        },
        error: (error: ApiError) => {
          this.revertCommentLikeOptimisticUpdate(trigger);
          this.commentLikeError.set(error);
          Logger.error('Error updating comment reaction:', error);
          handleApiErrorsMessage(error);
          this._ToastService.add({
            severity: 'error',
            summary: 'general.error',
            detail: error?.message || 'Error occurred while updating comment like status.',
            life: 5000,
          });
        }
      });
    });
  }
  revertCommentLikeOptimisticUpdate(trigger: { commentId: number; isLiked: boolean }): void {
    this.hasLiked.set(!trigger.isLiked);
    this.commentReactionsCount.update(count => trigger.isLiked ? Math.max(0, count - 1) : count + 1);
  }

  protected onCommentSubmit(e: any): void {
    console.log(e);
    // TODO: Implement reply submission logic here
  }

  protected toggleReplies(): void {
    this.showReplies.update((v) => !v);
  }

  // Timeago Action
  protected returnItemTimeAgo(id: number, date: Date): string {
    const { value, unit } = useTimeAgoRealtime(id, date)();
    const rtf = new Intl.RelativeTimeFormat(this.currentLang || undefined, { numeric: 'auto' });
    return rtf.format(-value, unit);
  }

  protected getCreatedAtDate(): Date {
    return this.comment?.created_at ? new Date(this.comment.created_at) : new Date();
  }
  protected goToProfile(id: number): void {
    this._Router.navigate([TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE + '/' + TalbinahCommunityRoutesEnum.USER_COMMUNITY_PROFILE, id]);
    this.closePopup.emit();
  }
}
