import { Injectable, computed, signal, inject } from '@angular/core';
import { Observable, EMPTY, tap, catchError, finalize } from 'rxjs';
import { IPostsInterestsListingResponseDto, IPostInterest } from '../dtos';
import { ApiError, Logger, handleApiErrors } from '../../../common';
import { TalbinahCommunityApiClientProvider } from '../clients';
import { LocalizationService } from '../../../shared';
import { initialPostInterestsState, ITab, PostInterestsState } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PostInterestsFacade {
  private readonly _postsApiClient = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _localizationService = inject(LocalizationService);

  // Internal state for post interests using a signal
  private _state = signal<PostInterestsState>(initialPostInterestsState);

  // Expose computed signals for read-only access
  readonly postInterests = computed(() => this._state().interestsResponse?.data || []);
  readonly isLoadingPostInterests = computed(() => this._state().isLoading);
  readonly errorMessagePostInterests = computed(() => this._state().errorMessage);

  // Computed signal for tabs, dynamically generated from interests
  readonly tabs = computed<ITab[]>(() => {
    const dynamicTabs: ITab[] = this.postInterests().map((interest: IPostInterest) => ({
      id: interest.id,
      title: interest.name,
    }));
    return [{ id: 0, title: this._localizationService.translateTextFromJson('general.allPosts') }, ...dynamicTabs];
  });

  /**
   * Fetches all post interests from the API.
   */
  fetchPostInterests(): void {
    // Logger.debug('PostInterestsFacade: Initiating post Interests fetch...');
    this._state.update(state => ({ ...state, isLoading: true, errorMessage: '' }));

    this._postsApiClient.getPostInterests()
      .pipe(
        tap((response: IPostsInterestsListingResponseDto) => this._processPostInterestsResponse(response)),
        catchError((error: ApiError) => {
          this._handleFetchPostInterestsError(error);
          return EMPTY;
        }),
        finalize(() => this._finalizePostInterestsFetch())
      )
      .subscribe();
  }

  // --- Private Helper Methods ---

  /**
   * Updates the internal post interests state signal.
   * @param updates A partial object containing the state properties to update.
   */
  private _updateInterestsState(updates: Partial<PostInterestsState>): void {
    this._state.update(state => ({ ...state, ...updates }));
  }

  /**
   * Processes the API response for post interests.
   * @param response The API response containing post interest data.
   */
  private _processPostInterestsResponse(response: IPostsInterestsListingResponseDto): void {
    if (response?.data && response.data.length > 0) {
      this._updateInterestsState({
        interestsResponse: response,
        errorMessage: '',
      });
      // Logger.debug('PostInterestsFacade: Post Interests fetched successfully:', response);
    } else {
      this._updateInterestsState({ interestsResponse: null, errorMessage: '📭 No post Interests found.' });
      Logger.debug('PostInterestsFacade: No post interests found or invalid response.');
    }
  }

  /**
   * Handles errors during post interest fetching.
   * @param error The API error object.
   */
  private _handleFetchPostInterestsError(error: ApiError): void {
    Logger.error('PostInterestsFacade: Error fetching post Interests:', error);
    handleApiErrors(error); // This typically displays a global toast/message
    this._updateInterestsState({ errorMessage: '🚨 Error loading post Interests. Please try again later.' });
  }

  /**
   * Finalizes the post interest fetch operation by resetting loading state.
   */
  private _finalizePostInterestsFetch(): void {
    this._updateInterestsState({ isLoading: false });
  }
}
