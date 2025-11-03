import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, EMPTY, finalize, take, tap } from 'rxjs';
import { ApiError, Logger, handleApiErrorsMessage } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';
import { TalbinahCommunityApiClientProvider, ITalbinahCommunityApiClient } from '../clients';
import {
  IIdentityFormSubmissionRequestDto,
  IIdentityFormSubmissionResponseDto,
  IEmoijsListingResponseDto,
  IPostsInterestsListingResponseDto
} from '../dtos';
import { UserIdentityProfileFacade } from './user-identity-profile.facade';

const IDENTITY_FORM_STATE_KEY = makeStateKey<IdentityFormState>('identityFormState');

interface IdentityFormState {
  emojis: {
    response: IEmoijsListingResponseDto | null;
    isLoading: boolean;
    errorMessage: string;
  };
  interests: {
    response: IPostsInterestsListingResponseDto | null;
    isLoading: boolean;
    errorMessage: string;
  };
  submission: {
    isLoading: boolean;
    error: ApiError | null;
  };
}

const initialState: IdentityFormState = {
  emojis: {
    response: null,
    isLoading: false,
    errorMessage: ''
  },
  interests: {
    response: null,
    isLoading: false,
    errorMessage: ''
  },
  submission: {
    isLoading: false,
    error: null
  }
};

@Injectable({
  providedIn: 'root'
})
export class IdentityFormFacade {
  private readonly _apiClient = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _state = signal<IdentityFormState>(initialState);

  // Emojis selectors
  readonly emojis = computed(() => this._state().emojis.response?.data || []);
  readonly isLoadingEmojis = computed(() => this._state().emojis.isLoading);
  readonly emojisError = computed(() => this._state().emojis.errorMessage);

  // Interests selectors
  readonly interests = computed(() => this._state().interests.response?.data || []);
  readonly isLoadingInterests = computed(() => this._state().interests.isLoading);
  readonly interestsError = computed(() => this._state().interests.errorMessage);

  // Submission selectors
  readonly isLoadingSubmit = computed(() => this._state().submission.isLoading);
  readonly submitError = computed(() => this._state().submission.error);

  // 👇 Inject your profile facade
  private readonly _profileFacade = inject(UserIdentityProfileFacade)

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(IDENTITY_FORM_STATE_KEY, null);
      // if (cachedState) {
      //   this._state.set(cachedState);
      //   this._transferState.remove(IDENTITY_FORM_STATE_KEY);
      // }
    }
  }

  fetchEmojis(): void {
    this._updateEmojisState({ isLoading: true, errorMessage: '' });

    this._apiClient.getEmojis().pipe(
      tap((response) => {
        this._updateEmojisState({
          response,
          isLoading: false,
          errorMessage: response?.data?.length ? '' : 'No emojis found'
        });

        if (!isPlatformBrowser(this._platformId)) {
          this._transferState.set(IDENTITY_FORM_STATE_KEY, this._state());
        }
      }),
      catchError((error: ApiError) => {
        this._updateEmojisState({
          isLoading: false,
          errorMessage: 'Failed to load emojis'
        });
        handleApiErrorsMessage(error);
        return EMPTY;
      })
    ).subscribe();
  }

  fetchInterests(): void {
    this._updateInterestsState({ isLoading: true, errorMessage: '' });

    this._apiClient.getPostInterests().pipe(
      tap((response) => {
        this._updateInterestsState({
          response,
          isLoading: false,
          errorMessage: response?.data?.length ? '' : 'No interests found'
        });

        if (!isPlatformBrowser(this._platformId)) {
          this._transferState.set(IDENTITY_FORM_STATE_KEY, this._state());
        }
      }),
      catchError((error: ApiError) => {
        this._updateInterestsState({
          isLoading: false,
          errorMessage: 'Failed to load interests'
        });
        handleApiErrorsMessage(error);
        return EMPTY;
      })
    ).subscribe();
  }

  submitIdentity(payload: IIdentityFormSubmissionRequestDto): void {
    this._updateSubmissionState({ isLoading: true, error: null });
    this._logSubmissionStart(payload);

    this._apiClient.createIdentity(payload).pipe(
      take(1),
      tap({
        next: (response) => this._handleSubmissionSuccess(response),
        error: (error) => this._handleSubmissionError(error),
        complete: () => Logger.debug('IdentityFormFacade | submitIdentity | completed')
      }),
      finalize(() => {
        this._handleSubmissionFinalize();
        // Ensure loading is false even if unsubscribed
        this._updateSubmissionState({ isLoading: false });
        this._profileFacade.fetchUserIdentifyProfile();
      }),
      catchError((error) => {
        // This catchError is just for logging - error is already handled in tap
        Logger.error('IdentityFormFacade | submitIdentity | catchError:', error);
        return EMPTY;
      })
    ).subscribe();
  }

  private _handleSubmissionSuccess(response: IIdentityFormSubmissionResponseDto): void {
    Logger.debug('IdentityFormFacade: Handling success response', response);
    if (response.status) {
      Logger.debug('IdentityFormFacade: Success case');
      this._showSuccessToast(response.message || 'Identity created successfully');
      this._updateSubmissionState({ isLoading: false });
    } else {
      Logger.debug('IdentityFormFacade: Failed response case');
      this._handleFailedResponse(response);
    }
  }

  private _handleSubmissionError(error: ApiError): void {
    Logger.warn('IdentityFormFacade | submitIdentity | error:', error);
    this._updateSubmissionState({ isLoading: false, error });
    this._showErrorToast(
      error.message || this._localizationService.translateTextFromJson('general.statusErrorText')
    );
    handleApiErrorsMessage(error);
  }

  private _handleFailedResponse(response: IIdentityFormSubmissionResponseDto): void {
    Logger.warn('IdentityFormFacade | submitIdentity | failed response:', response);
    this._updateSubmissionState({ isLoading: false });
    this._showErrorToast(
      response.message || this._localizationService.translateTextFromJson('general.statusErrorText')
    );
  }

  private _handleSubmissionFinalize(): void {
    Logger.debug('IdentityFormFacade | submitIdentity | finalized');
    // Any final cleanup can go here
  }

  private _logSubmissionStart(payload: IIdentityFormSubmissionRequestDto): void {
    Logger.debug('IdentityFormFacade | submitIdentity | payload:', payload);
  }

  private _showSuccessToast(message: string): void {
    this._toastService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000
    });
  }

  private _showErrorToast(message: string): void {
    this._toastService.add({
      severity: 'error',
      summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
      detail: message,
      life: 5000
    });
  }

  resetState(): void {
    this._state.set(initialState);
  }

  private _updateEmojisState(updates: Partial<IdentityFormState['emojis']>): void {
    this._state.update(state => ({
      ...state,
      emojis: { ...state.emojis, ...updates }
    }));
  }

  private _updateInterestsState(updates: Partial<IdentityFormState['interests']>): void {
    this._state.update(state => ({
      ...state,
      interests: { ...state.interests, ...updates }
    }));
  }

  private _updateSubmissionState(updates: Partial<IdentityFormState['submission']>): void {
    this._state.update(state => ({
      ...state,
      submission: { ...state.submission, ...updates }
    }));
  }
}
