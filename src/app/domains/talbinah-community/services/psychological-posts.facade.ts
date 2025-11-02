import { Injectable, computed, inject, signal, effect } from '@angular/core';
import { EMPTY, finalize, tap, catchError, take } from 'rxjs';
import { IAllPostsResponseDto, IDeletePostResponseDto, IPost } from '../dtos';
import {
  IPaginationParameters,
  defaultPaginationParameters,
  ApiError,
  Logger,
  handleApiErrors,
  handleApiErrorsMessage,
} from '../../../common';
import { TalbinahCommunityApiClientProvider } from '../clients';
import { ToastService, LocalizationService } from '../../../shared';
import { UserIdentityStore } from '../routes/user-identity.service';
import { initialPsychologicalPostsState, PsychologicalPostsState } from '../models';

@Injectable({ providedIn: 'root' })
export class PsychologicalPostsFacade {
  private readonly apiClient = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly toast = inject(ToastService);
  private readonly i18n = inject(LocalizationService);
  private readonly userStore = inject(UserIdentityStore);

  private state = signal<PsychologicalPostsState>({ ...initialPsychologicalPostsState });

  readonly allPostsList = computed(() => this.state().allPostsResponse?.data?.data ?? []);
  readonly isLoadingPosts = computed(() => this.state().isLoading);
  readonly isLoadingPostsFilter = computed(() => this.state().isLoadingFilter);
  readonly isLoadingMorePosts = computed(() => this.state().isLoadingMore);
  readonly errorMessagePosts = computed(() => this.state().errorMessage);
  readonly statusPosts = computed(() => this.state().status);
  readonly totalPostsItems = computed(() => this.state().totalItems);

  private paginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 10, page: 1 };
  readonly currentPostsPage = signal<number>(1);
  readonly totalPagesPosts = signal<number>(1);
  readonly interestFilter = signal<number | undefined>(undefined);

  private postToDelete = signal<IPost | null>(null);
  readonly isLoadingDeletePost = signal<boolean>(false);

  constructor() {
    this.setupDeleteEffect();
  }

  resetState(): void {
    this.state.set({ ...initialPsychologicalPostsState });
    this.currentPostsPage.set(1);
    this.totalPagesPosts.set(1);
    this.interestFilter.set(undefined);
    this.paginationParams = { ...defaultPaginationParameters, per_page: 10, page: 1 };
  }

  resetPagination(): void {
    this.paginationParams.page = 1;
    this.currentPostsPage.set(1);
  }

  clearFilters(): void {
    this.interestFilter.set(undefined);
    delete this.paginationParams.interest_id;
  }

  setInterestFilterAndFetch(interestId?: number): void {
    this.interestFilter.set(interestId);
    if (interestId !== undefined) this.paginationParams.interest_id = interestId;
    else delete this.paginationParams.interest_id;
    this.resetPagination();
    this.fetchPosts(true, false);
  }

  setCurrentPageAndFetch(page: number): void {
    this.paginationParams.page = page;
    this.currentPostsPage.set(page);
    this.fetchPosts(true, false);
  }

  fetchPosts(isFilter = false, isLoadMore = false): void {
    const page = this.paginationParams.page ?? 1;
    if (isFilter && !isLoadMore) this.state.update(s => ({ ...s, isLoadingFilter: true, errorMessage: '', status: false }));
    else if (isLoadMore) this.state.update(s => ({ ...s, isLoadingMore: true, errorMessage: '', status: false }));
    else this.state.update(s => ({ ...s, isLoading: true, errorMessage: '', status: false }));

    this.apiClient.getAll(this.paginationParams).pipe(
      tap((res: IAllPostsResponseDto) => {
        if (res?.data?.data) {
          const incoming = res.data.data;
          const current = this.state().allPostsResponse?.data?.data ?? [];
          const isFirstPage = (this.paginationParams.page ?? 1) === 1;
          const combined = (isFilter || isFirstPage) ? incoming : [...current, ...incoming];
          const newAllPosts: IAllPostsResponseDto = {
            ...res,
            data: {
              ...res.data,
              data: combined,
              meta: { ...res.data.meta }
            }
          };
          this.state.update(s => ({
            ...s,
            allPostsResponse: newAllPosts,
            totalItems: res.data.meta.total ?? combined.length,
            errorMessage: '',
            status: true
          }));
          const perPage = this.paginationParams.per_page ?? res.data.meta.per_page ?? 10;
          this.totalPagesPosts.set(Math.max(1, Math.ceil((res.data.meta.total ?? combined.length) / perPage)));
          this.currentPostsPage.set(res.data.meta.current_page ?? this.currentPostsPage());
        } else {
          this.state.update(s => ({ ...s, allPostsResponse: null, totalItems: 0, errorMessage: 'Invalid response', status: false }));
          this.totalPagesPosts.set(1);
          this.currentPostsPage.set(1);
        }
      }),
      catchError((err: ApiError) => {
        handleApiErrors(err);
        this.state.update(s => ({ ...s, errorMessage: err?.message ?? 'Failed to fetch posts', status: false }));
        return EMPTY;
      }),
      finalize(() => {
        if (isFilter) this.state.update(s => ({ ...s, isLoadingFilter: false }));
        else if (isLoadMore) this.state.update(s => ({ ...s, isLoadingMore: false }));
        else this.state.update(s => ({ ...s, isLoading: false }));
      })
    ).subscribe();
  }

  loadMorePosts(): void {
    const current = this.currentPostsPage();
    const total = this.totalPagesPosts();
    if (current < total) {
      this.paginationParams.page = current + 1;
      this.currentPostsPage.set(current + 1);
      this.fetchPosts(false, true);
    }
  }

  deletePost(post: IPost): void {
    if (!post?.id) return;
    this.postToDelete.set(post);
  }

  private setupDeleteEffect(): void {
    effect(() => {
      const p = this.postToDelete();
      if (!p?.id) return;
      this.isLoadingDeletePost.set(true);
      this.apiClient.deletePost(p.id).pipe(
        take(1),
        finalize(() => {
          this.isLoadingDeletePost.set(false);
          this.postToDelete.set(null);
        })
      ).subscribe({
        next: (res: IDeletePostResponseDto) => {
          if (res?.status) {
            this.removePostFromState(p.id);
            this.userStore.fetch();
            this.toast.add({
              severity: 'success',
              summary: this.i18n.translateTextFromJson('general.success'),
              detail: res.message ?? this.i18n.translateTextFromJson('general.postDeletedSuccessfully'),
              life: 3000
            });
          } else {
            this.toast.add({
              severity: 'error',
              summary: this.i18n.translateTextFromJson('general.error'),
              detail: res?.message ?? this.i18n.translateTextFromJson('error_to_delete_post'),
              life: 5000
            });
          }
        },
        error: (err: ApiError) => {
          handleApiErrorsMessage(err);
          this.toast.add({
            severity: 'error',
            summary: this.i18n.translateTextFromJson('general.error'),
            detail: err?.message ?? this.i18n.translateTextFromJson('general.failedToDeletePost'),
            life: 5000
          });
        }
      });
    });
  }

  private removePostFromState(deletedId: number): void {
    this.state.update(s => {
      if (!s.allPostsResponse) return s;
      const updated = s.allPostsResponse.data.data.filter(x => x.id !== deletedId);
      const updatedMeta = { ...s.allPostsResponse.data.meta, total: Math.max(0, (s.allPostsResponse.data.meta.total ?? 0) - 1) };
      const newAllPosts = { ...s.allPostsResponse, data: { ...s.allPostsResponse.data, data: updated, meta: updatedMeta } };
      return { ...s, allPostsResponse: newAllPosts, totalItems: updatedMeta.total };
    });
  }
}
