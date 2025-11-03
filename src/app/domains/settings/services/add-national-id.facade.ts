import {
  inject,
  Injectable,
  signal,
  computed,
} from '@angular/core';
import { catchError, EMPTY, finalize, tap, Observable } from 'rxjs'; // Removed 'of' as it's not strictly necessary in this refactor
import { Logger, ApiError, handleApiErrors } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';
import { ISettingsApiClient, SettingsApiClientProvider } from '../clients';

// Define the state for the outcome of the *last completed* toggle operation
interface LastToggleArticleResultState {
  response: any | null; // The full API response
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
  private readonly _apiClient: ISettingsApiClient = inject(SettingsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);

  // --- State for tracking loading status of *individual* articles (used by ArticleCardComponent) ---
  readonly loadingArticleIds = signal<Set<number>>(new Set<number>());

  // --- State for storing the *last* toggle operation's overall result and status ---
  private readonly _lastToggleResultState = signal<LastToggleArticleResultState>(initialLastToggleArticleResultState);

  // --- Exposed Selectors (Computed Signals) for the last operation's result ---
  readonly lastToggleResponse = computed(() => this._lastToggleResultState().response);
  readonly lastToggleSuccess = computed(() => this._lastToggleResultState().success);
  readonly lastToggleError = computed(() => this._lastToggleResultState().error);
  readonly lastToggledArticleId = computed(() => this._lastToggleResultState().articleId);


  /**
   * Toggles the favorite status of an article.
   * Manages per-item loading, API calls, and provides toasts for feedback.
   * This method returns an Observable that emits the API response.
   * The calling component is responsible for optimistic UI updates and reverting on failure.
   *
   * @param articleId The ID of the article to toggle.
   * @returns An Observable that emits the full `any` upon completion (success or error).
   */
  // toggleArticleFavorite(articleId: number): Observable<any> {
  //   Logger.debug(`Attempting to toggle favorite status for article ID: ${articleId}`);

  //   // Add article ID to the loading set (for per-item loading indicator in UI)
  //   this.loadingArticleIds.update(ids => new Set(ids).add(articleId));

  //   // Reset the last toggle result state for this new operation
  //   this._lastToggleResultState.set({
  //     response: null,
  //     success: false,
  //     error: null,
  //     articleId: articleId,
  //   });

  //   // return this._apiClient.ToggleFavoriteArticle({
  //   //   article_id: articleId
  //   // }).pipe(
  //   //   tap((response: any) => {
  //   //     if (response && response.status) {
  //   //       Logger.debug(`Favorite status for article ID ${articleId} toggled successfully.`);
  //   //       this._toastService.add({
  //   //         severity: 'success',
  //   //         summary: this._localizationService.translateTextFromJson('general.success'),
  //   //         detail: response?.message || this._localizationService.translateTextFromJson('general.favoriteStatusUpdated'),
  //   //         life: 5000
  //   //       });
  //   //       // Update the last result state for success
  //   //       this._lastToggleResultState.set({
  //   //         response: response,
  //   //         success: true,
  //   //         error: null,
  //   //         articleId: articleId,
  //   //       });
  //   //     } else {
  //   //       // API call succeeded, but backend reported a failure (e.g., status: false)
  //   //       const errorMessage = response?.message || this._localizationService.translateTextFromJson('general.failedUpdateFavoriteStatus');
  //   //       Logger.warn(`Failed to toggle favorite status for article ID ${articleId}: ${errorMessage}`);
  //   //       this._toastService.add({
  //   //         severity: 'error',
  //   //         summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
  //   //         detail: errorMessage,
  //   //         life: 5000
  //   //       });
  //   //       // Update the last result state for API-reported error
  //   //       this._lastToggleResultState.set({
  //   //         response: response,
  //   //         success: false,
  //   //         error: errorMessage,
  //   //         articleId: articleId,
  //   //       });
  //   //       // Propagate the error to the subscriber's error callback
  //   //       throw new Error(errorMessage);
  //   //     }
  //   //   }),
  //   //   catchError((error: ApiError) => {
  //   //     // Network or unexpected JavaScript error
  //   //     const errorMessage = error?.message || this._localizationService.translateTextFromJson('an_error_has_occurredUpdatingFavoriteStatus');
  //   //     Logger.error(`Error toggling favorite status for article ID ${articleId}:`, error);
  //   //     handleApiErrors(error); // Handle generic API errors (e.g., authentication)
  //   //     this._toastService.add({
  //   //       severity: 'error',
  //   //       summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
  //   //       detail: errorMessage,
  //   //       life: 5000
  //   //     });
  //   //     // Update the last result state for system error
  //   //     this._lastToggleResultState.set({
  //   //       response: { data: null, status: false, message: errorMessage }, // Create a dummy response for error state
  //   //       success: false,
  //   //       error: errorMessage,
  //   //       articleId: articleId,
  //   //     });
  //   //     // Return EMPTY to terminate the observable stream gracefully for the subscriber
  //   //     return EMPTY;
  //   //   }),
  //   //   finalize(() => {
  //   //     // Always remove the article ID from the loading set when the operation finishes
  //   //     this.loadingArticleIds.update(ids => {
  //   //       const updatedIds = new Set(ids);
  //   //       updatedIds.delete(articleId);
  //   //       return updatedIds;
  //   //     });
  //   //     Logger.debug(`Finished toggle operation for article ID: ${articleId}`);
  //   //   })
  //   // );
  // }

  /**
   * Resets the internal state of the last toggle operation result.
   * Useful if you want to clear previous success/error messages after they've been displayed.
   */
  resetLastToggleResultState(): void {
    this._lastToggleResultState.set(initialLastToggleArticleResultState);
    Logger.debug('Last toggle article result state reset.');
  }
}
