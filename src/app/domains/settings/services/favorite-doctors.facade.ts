// domain/favorites/services/favorite-doctors.facade.ts
import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, catchError, finalize, tap } from 'rxjs';
import { IFavoriteDoctorsListingResponseDto } from '../dtos';
import { LocalizationService, ToastService } from '../../../shared';
import {
  ApiError,
  defaultPaginationParameters,
  IPaginationParameters,
  Logger
} from '../../../common';
import { SettingsApiClientProvider } from '../clients';

interface FavoriteDoctorsListState {
  favoriteDoctorsResponse: IFavoriteDoctorsListingResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
  totalItems: number;
  currentPage: number;
  status: boolean;
}

@Injectable({ providedIn: 'root' })
export class FavoriteDoctorsFacade {
  private readonly _apiClient = inject(SettingsApiClientProvider).getClient();
  private readonly _toast = inject(ToastService);
  private readonly _localization = inject(LocalizationService);

  private readonly state = signal<FavoriteDoctorsListState>({
    favoriteDoctorsResponse: null,
    isLoading: false,
    errorMessage: null,
    totalItems: 0,
    currentPage: 1,
    status: false
  });

  private readonly _paginationParams: IPaginationParameters = {
    ...defaultPaginationParameters,
    per_page: 10
  };

  readonly response = computed(() => this.state().favoriteDoctorsResponse);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly errorMessage = computed(() => this.state().errorMessage);
  readonly totalItems = computed(() => this.state().totalItems);
  readonly currentPage = computed(() => this.state().currentPage);
  readonly status = computed(() => this.state().status);
  fetchFavorites(page: number = 1, search?: string): void {
    this._paginationParams.page = page;
    this._paginationParams.search = search;

    this.updateState({ isLoading: true, errorMessage: null, currentPage: page, status: false });

    this._apiClient.getFavoritesDoctors(this._paginationParams)
      .pipe(
        tap((response: IFavoriteDoctorsListingResponseDto) => {
          this.updateState({
            favoriteDoctorsResponse: response,
            totalItems: response?.data?.data?.length || 0,
            errorMessage: ''
          });
          this.updateState({ status: true });
        }),
        catchError((err: ApiError) => {
          Logger.error('Favorite doctors fetch failed', err);
          this._toast.add({
            severity: 'error',
            summary: this._localization.translateTextFromJson('general.error'),
            detail: this._localization.translateTextFromJson('general.errorLoadingFavoriteDoctors'),
            life: 5000
          });
          this.updateState({
            errorMessage: this._localization.translateTextFromJson('general.errorLoadingFavoriteDoctors')
          });
          this.updateState({ status: false });
          return EMPTY;
        }),
        finalize(() => this.updateState({ isLoading: false }))
      )
      .subscribe();
  }

  private updateState(update: Partial<FavoriteDoctorsListState>) {
    this.state.update(state => ({ ...state, ...update }));
  }
}
