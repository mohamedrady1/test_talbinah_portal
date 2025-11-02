import {
  inject,
  Injectable,
  signal,
  computed,
  PLATFORM_ID,
  makeStateKey,
  TransferState,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';

import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { Logger, handleApiErrors, ApiError, IGlobalDoctorReviewModel, IGlobalMentalHealthScaleModel, IGlobalArticleItemModel, IGlobalPodcastItemModel } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';
import { IReservationHomeworkArticleItem, IReservationHomeworkMentalHealthItem, IReservationHomeworkPodcastItem, IReservationHomeworkResponseDto } from '../dtos';

export interface IReservationHomeworkState {
  isLoading: boolean;
  error: string | null;
  mentalHealth: IReservationHomeworkMentalHealthItem[];
  articles: IReservationHomeworkArticleItem[];
  podcasts: IReservationHomeworkPodcastItem[];
  isReviewing: boolean;
}

const initialReservationHomeworkState: IReservationHomeworkState = {
  isLoading: false,
  error: null,
  mentalHealth: [],
  articles: [],
  podcasts: [],
  isReviewing: false,
};

const RESERVATION_HOMEWORK_STATE_KEY = makeStateKey<IReservationHomeworkState>('reservationHomeworkState');

@Injectable({ providedIn: 'root' })
export class ReservationHomeworkFacade {
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toast = inject(ToastService);
  private readonly _localization = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  private readonly _state = signal<IReservationHomeworkState>(initialReservationHomeworkState);

  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly mentalHealth = computed(() => this._state().mentalHealth);
  readonly articles = computed(() => this._state().articles);
  readonly podcasts = computed(() => this._state().podcasts);
  readonly isReviewing = computed(() => this._state().isReviewing);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get(RESERVATION_HOMEWORK_STATE_KEY, null);
      // if (cached) {
      //   this._state.set(cached);
      //   this._transferState.remove(RESERVATION_HOMEWORK_STATE_KEY);
      //   Logger.debug('Hydrated reservation homework from TransferState:', cached);
      // }
    }
  }

  loadHomework(reservationId: number): void {
    Logger.debug(`Loading homework for reservation ID: ${reservationId}`);

    this.updateState({ isLoading: true, error: null });

    this._apiClient.GetReservationHomework(reservationId)
      .pipe(
        tap((response: IReservationHomeworkResponseDto) => {
          if (response.status) {
            this.updateState({
              mentalHealth: response.data?.mental_health ?? [],
              articles: response.data?.article ?? [],
              podcasts: response.data?.podcast ?? [],
              error: null,
            });

            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(RESERVATION_HOMEWORK_STATE_KEY, this._state());
              Logger.debug('Stored reservation homework in TransferState (SSR).');
            }

            Logger.info('Reservation homework loaded successfully.');
          } else {
            const fallback = this._localization.translateTextFromJson('appointments.homeworkLoadFailed');
            this.handleError({ message: response.message || fallback } as ApiError, fallback);
          }
        }),
        catchError((error: ApiError) => {
          this.handleError(error, 'appointments.homeworkLoadFailed');
          return EMPTY;
        }),
        finalize(() => this.updateState({ isLoading: false }))
      )
      .subscribe();
  }

  reviewHomework(assignmentId: number, isTasksModal?: boolean): void {
    this.updateState({ isReviewing: true });
    this._apiClient.ReviewHomework(assignmentId)
      .pipe(
        tap(() => {
          Logger.debug('Homework reviewed', assignmentId);

          // Update local state to reflect the change
          this.updateState({
            articles: this.updateReviewStatus(this.articles(), assignmentId),
            podcasts: this.updateReviewStatus(this.podcasts(), assignmentId),
            mentalHealth: this.updateReviewStatus(this.mentalHealth(), assignmentId)
          });
        }),
        catchError((error: ApiError) => {
          this.handleError(error, 'appointments.homeworkReviewFailed');
          return EMPTY;
        }),
        finalize(() => {
          this.updateState({ isReviewing: false })
        })
      )
      .subscribe();
  }

  private updateReviewStatus<T extends { id: number; review?: '0' | '1' | number | undefined }>(items: T[], assignmentId: number): T[] {
    return items.map(item =>
      item.id === assignmentId ? { ...item, review: 1 as T['review'] } : item
    );
  }

  reset(): void {
    this._state.set(initialReservationHomeworkState);
    Logger.debug('Reservation homework state reset.');
  }

  private updateState(updates: Partial<IReservationHomeworkState>): void {
    this._state.update((current) => ({ ...current, ...updates }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error('Error loading reservation homework:', error);
    handleApiErrors(error);

    const message = error?.message ?? this._localization.translateTextFromJson(translationKey);
    this.updateState({ error: message });
    // this._toast.error(message); // Uncomment if toast feedback is needed
  }
}