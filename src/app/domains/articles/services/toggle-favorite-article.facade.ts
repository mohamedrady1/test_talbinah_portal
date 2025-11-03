import {
  inject,
  Injectable,
  signal,
  computed,
} from '@angular/core';
import { catchError, EMPTY, finalize, tap, Observable } from 'rxjs'; // Removed 'of' as it's not strictly necessary in this refactor
import { Logger, ApiError, handleApiErrors } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';
import { IArticlesApiClient, ArticlesApiClientProvider } from '../clients';
import { IToggleFavoriteArticleResponseDto } from '../dtos';
import { FavoriteArticlesFacade } from './favorite-articles.facade';

// Define the state for the outcome of the *last completed* toggle operation
interface LastToggleArticleResultState {
  response: IToggleFavoriteArticleResponseDto | null; // The full API response
  success: boolean; // True if the last operation succeeded
  error: string | null; // Error message if the last operation failed
  articleId: number | null; // ID of the article involved in the last operation
}

const initialLastToggleArticleResultState: LastToggleArticleResultState = {
  response: null,
  success: false,
  error: null,
  articleId: null,
};

@Injectable({ providedIn: 'root' })
export class ToggleFavoriteArticleFacade {
  // --- Dependencies ---
  private readonly _apiClient: IArticlesApiClient = inject(ArticlesApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  protected readonly _FavoriteArticlesFacade = inject(FavoriteArticlesFacade);

  // --- State for tracking loading status of *individual* articles (used by ArticleCardComponent) ---
  readonly loadingArticleIds = signal<Set<number>>(new Set<number>());

  // --- State for storing the *last* toggle operation's overall result and status ---
  private readonly _lastToggleResultState = signal<LastToggleArticleResultState>(initialLastToggleArticleResultState);

  // --- Exposed Selectors (Computed Signals) for the last operation's result ---
  readonly lastToggleResponse = computed(() => this._lastToggleResultState().response);
  readonly lastToggleSuccess = computed(() => this._lastToggleResultState().success);
  readonly lastToggleError = computed(() => this._lastToggleResultState().error);
  readonly lastToggledArticleId = computed(() => this._lastToggleResultState().articleId);


  toggleArticleFavorite(articleId: number): Observable<IToggleFavoriteArticleResponseDto> {
    Logger.debug(`Attempting to toggle favorite status for article ID: ${articleId}`);

    // Add article ID to the loading set (for per-item loading indicator in UI)
    this.loadingArticleIds.update(ids => new Set(ids).add(articleId));

    // Reset the last toggle result state for this new operation
    this._lastToggleResultState.set({
      response: null,
      success: false,
      error: null,
      articleId: articleId,
    });

    return this._apiClient.ToggleFavoriteArticle({
      article_id: articleId
    }).pipe(
      tap((response: IToggleFavoriteArticleResponseDto) => {
        if (response && response.status) {
          Logger.debug(`Favorite status for article ID ${articleId} toggled successfully.`);
          // this._toastService.add({
          //   severity: 'success',
          //   summary: this._localizationService.translateTextFromJson('general.success'),
          //   detail: response?.message || this._localizationService.translateTextFromJson('general.favoriteStatusUpdated'),
          //   life: 5000
          // });
          // Update the last result state for success
          this._lastToggleResultState.set({
            response: response,
            success: true,
            error: null,
            articleId: articleId,
          });
          this._FavoriteArticlesFacade.fetchFavoriteArticles();
        } else {
          // API call succeeded, but backend reported a failure (e.g., status: false)
          const errorMessage = response?.message || this._localizationService.translateTextFromJson('general.failedUpdateFavoriteStatus');
          Logger.warn(`Failed to toggle favorite status for article ID ${articleId}: ${errorMessage}`);
          this._toastService.add({
            severity: 'error',
            summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
            detail: errorMessage,
            life: 5000
          });
          // Update the last result state for API-reported error
          this._lastToggleResultState.set({
            response: response,
            success: false,
            error: errorMessage,
            articleId: articleId,
          });
          // Propagate the error to the subscriber's error callback
          throw new Error(errorMessage);
        }
      }),
      catchError((error: ApiError) => {
        // Network or unexpected JavaScript error
        const errorMessage = error?.message || this._localizationService.translateTextFromJson('an_error_has_occurredUpdatingFavoriteStatus');
        Logger.error(`Error toggling favorite status for article ID ${articleId}:`, error);
        handleApiErrors(error); // Handle generic API errors (e.g., authentication)
        this._toastService.add({
          severity: 'error',
          summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
          detail: errorMessage,
          life: 5000
        });
        // Update the last result state for system error
        this._lastToggleResultState.set({
          response: { data: null, status: false, message: errorMessage }, // Create a dummy response for error state
          success: false,
          error: errorMessage,
          articleId: articleId,
        });
        // Return EMPTY to terminate the observable stream gracefully for the subscriber
        return EMPTY;
      }),
      finalize(() => {
        // Always remove the article ID from the loading set when the operation finishes
        this.loadingArticleIds.update(ids => {
          const updatedIds = new Set(ids);
          updatedIds.delete(articleId);
          return updatedIds;
        });
        Logger.debug(`Finished toggle operation for article ID: ${articleId}`);
      })
    );
  }

  /**
   * Resets the internal state of the last toggle operation result.
   * Useful if you want to clear previous success/error messages after they've been displayed.
   */
  resetLastToggleResultState(): void {
    this._lastToggleResultState.set(initialLastToggleArticleResultState);
    Logger.debug('Last toggle article result state reset.');
  }
}
