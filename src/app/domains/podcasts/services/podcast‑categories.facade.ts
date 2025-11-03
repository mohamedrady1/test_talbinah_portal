import {
  ApiError,
  handleApiErrors,
  Logger,
} from '../../../common';
import {
  inject,
  Injectable,
  makeStateKey,
  PLATFORM_ID,
  signal,
  TransferState,
  computed,
} from '@angular/core';
import {
  IPodcastsApiClient,
  PodcastsApiClientProvider,
  IPodcastCategoriesListingResponseDto,
} from '..';
import { LocalizationService, ToastService } from '../../../shared';
import { EMPTY, catchError, finalize, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

/* ────────────────────────────────────────────────────────────────── */
/* State keys for server‑side TransferState                          */
/* ────────────────────────────────────────────────────────────────── */
const CATEGORIES_STATE_KEY = makeStateKey<PodcastCategoriesState>(
  'podcastCategoriesState'
);

/* ────────────────────────────────────────────────────────────────── */
/* Facade                                                             */
/* ────────────────────────────────────────────────────────────────── */
@Injectable({ providedIn: 'root' })
export class PodcastCategoriesFacade {
  /* ────────────── dependencies ────────────── */
  private readonly _apiClient: IPodcastsApiClient = inject(PodcastsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localization = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  /* ────────────── feature state (signals) ────────────── */
  private readonly _state = signal<PodcastCategoriesState>(
    initialPodcastCategoriesState
  );

  /** Public readonly selectors */
  readonly categoriesResponse = computed(
    () => this._state().categoriesResponse
  );
  readonly isLoading = computed(() => this._state().isLoading);
  readonly errorMessage = computed(() => this._state().errorMessage);
  readonly status = computed(() => this._state().status);

  constructor() {
    /* Hydrate state on the client if pre‑rendered */
    if (isPlatformBrowser(this._platformId)) {
      const ssrState = this._transferState.get(
        CATEGORIES_STATE_KEY,
        null as PodcastCategoriesState | null
      );
      if (ssrState) {
        this._state.set(ssrState);
        this._transferState.remove(CATEGORIES_STATE_KEY);
      }
    }
  }

  /* ───────────────────────────────────────────── */
  /* Public API                                   */
  /* ───────────────────────────────────────────── */
  fetchCategories(): void {
    Logger.debug('[Categories] Initiating fetch …');
    this.updateState({
      isLoading: true,
      errorMessage: this._localization.translateTextFromJson(
        'general.loadingPodcastCategories'
      ),
    });

    /* Cached (SSR) response? */
    // const cached = this._transferState.get(
    //   CATEGORIES_STATE_KEY,
    //   null as PodcastCategoriesState | null
    // );
    // if (isPlatformBrowser(this._platformId) && cached) {
    //   this.updateState({ ...cached, isLoading: false });
    //   this._transferState.remove(CATEGORIES_STATE_KEY);
    //   return;
    // }

    this._apiClient
      .getCategories()
      .pipe(
        tap((resp) => this.processResponse(resp)),
        catchError((err: ApiError) => {
          this.handleError(err);
          return EMPTY;
        }),
        finalize(() => this.finalizeFetch())
      )
      .subscribe();
  }

  reset(): void {
    this._state.set(initialPodcastCategoriesState);
  }

  /* ───────────────────────────────────────────── */
  /* Internal helpers                             */
  /* ───────────────────────────────────────────── */
  private updateState(updates: Partial<PodcastCategoriesState>): void {
    this._state.update((cur) => ({ ...cur, ...updates }));
  }

  private processResponse(
    response: IPodcastCategoriesListingResponseDto
  ): void {
    const hasData =
      response && response.data && response.data.length > 0;

    if (hasData) {
      Logger.debug('[Categories] fetch success', response);
      this.updateState({
        categoriesResponse: response,
        errorMessage: null,
        status: true,
      });
    } else {
      this.updateState({
        categoriesResponse: null,
        status: response.status ?? false,
        errorMessage: this._localization.translateTextFromJson(
          'podcast.emptyState.noPodcastCategories'
        ),
      });
    }

    /* Persist for SSR transfer (server side only) */
    if (!isPlatformBrowser(this._platformId)) {
      this._transferState.set(CATEGORIES_STATE_KEY, this._state());
    }
  }

  private handleError(error: ApiError): void {
    Logger.error('[Categories] fetch error', error);
    handleApiErrors(error);

    const message = this._localization.translateTextFromJson(
      'an_error_has_occurredLoadingPodcastCategories'
    );

    this._toastService.add({
      severity: 'error',
      summary: this._localization.translateTextFromJson('an_error_has_occurred'),
      detail: error?.message ?? message,
      life: 5000,
    });

    this.updateState({
      errorMessage: message,
      categoriesResponse: null,
      status: false,
    });
  }

  private finalizeFetch(): void {
    this.updateState({ isLoading: false });
  }
}

/* ────────────────────────────────────────────────────────────────── */
/* State model & initial value                                        */
/* ────────────────────────────────────────────────────────────────── */
export interface PodcastCategoriesState {
  categoriesResponse: IPodcastCategoriesListingResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
  /** true = success, false = HTTP error, null = not requested yet */
  status: boolean | null;
}

export const initialPodcastCategoriesState: PodcastCategoriesState = {
  categoriesResponse: null,
  isLoading: false,
  errorMessage: null,
  status: null,
};
