import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, EMPTY, finalize, tap, Observable } from 'rxjs';
import { Logger, ApiError, handleApiErrors } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';
import { BookAppointmentApiClientProvider } from '../clients';
import { IToggleFavoriteDoctorResponseDto } from '../dtos';

// --- State for the last toggle operation ---
interface LastToggleDoctorResultState {
  response: IToggleFavoriteDoctorResponseDto | null;
  success: boolean;
  error: string | null;
  doctorId: number | null;
}

const initialLastToggleDoctorResultState: LastToggleDoctorResultState = {
  response: null,
  success: false,
  error: null,
  doctorId: null,
};

@Injectable({ providedIn: 'root' })
export class ToggleFavoriteDoctorFacade {
  // --- Dependencies ---
  private readonly _apiClient = inject(BookAppointmentApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);

  // --- State: loading status of individual doctors ---
  readonly loadingDoctorIds = signal<Set<number>>(new Set());

  // --- State: last toggle result status ---
  private readonly _lastToggleResultState = signal<LastToggleDoctorResultState>(initialLastToggleDoctorResultState);

  // --- Computed selectors ---
  readonly lastToggleResponse = computed(() => this._lastToggleResultState().response);
  readonly lastToggleSuccess = computed(() => this._lastToggleResultState().success);
  readonly lastToggleError = computed(() => this._lastToggleResultState().error);
  readonly lastToggledDoctorId = computed(() => this._lastToggleResultState().doctorId);

  toggleDoctorFavorite(doctorId: number, fav: boolean): Observable<IToggleFavoriteDoctorResponseDto> {
    Logger.debug(`Toggling favorite status for doctor ID: ${doctorId}`);

    this.loadingDoctorIds.update(ids => new Set(ids).add(doctorId));

    this._lastToggleResultState.set({
      response: null,
      success: false,
      error: null,
      doctorId,
    });

    return this._apiClient.ToggleFavoriteDoctor(doctorId, fav).pipe(
      tap((response: IToggleFavoriteDoctorResponseDto) => {
        if (response?.status) {
          Logger.debug(`Favorite status toggled successfully for doctor ID: ${doctorId}`);

          // Optionally show success toast
          // this._toastService.add({
          //   severity: 'success',
          //   summary: this._localizationService.translateTextFromJson('general.success'),
          //   detail: response?.message ?? this._localizationService.translateTextFromJson('general.favoriteStatusUpdated'),
          //   life: 5000
          // });

          this._lastToggleResultState.set({
            response,
            success: true,
            error: null,
            doctorId,
          });
        } else {
          const message = response?.message || this._localizationService.translateTextFromJson('general.failedUpdateFavoriteStatus');
          Logger.warn(`Failed to toggle favorite for doctor ID ${doctorId}: ${message}`);

          this._toastService.add({
            severity: 'error',
            summary: this._localizationService.translateTextFromJson('general.error'),
            detail: message,
            life: 5000,
          });

          this._lastToggleResultState.set({
            response,
            success: false,
            error: message,
            doctorId,
          });

          throw new Error(message);
        }
      }),
      catchError((error: ApiError) => {
        const message = error?.message || this._localizationService.translateTextFromJson('general.errorUpdatingFavoriteStatus');
        Logger.error(`Toggle favorite failed for doctor ID ${doctorId}`, error);
        handleApiErrors(error);

        this._toastService.add({
          severity: 'error',
          summary: this._localizationService.translateTextFromJson('general.error'),
          detail: message,
          life: 5000,
        });

        this._lastToggleResultState.set({
          response: { data: null, status: false, message }, // Dummy error response
          success: false,
          error: message,
          doctorId,
        });

        return EMPTY;
      }),
      finalize(() => {
        this.loadingDoctorIds.update(ids => {
          const updated = new Set(ids);
          updated.delete(doctorId);
          return updated;
        });
        Logger.debug(`Finished toggle operation for doctor ID: ${doctorId}`);
      })
    );
  }

  resetLastToggleResultState(): void {
    this._lastToggleResultState.set(initialLastToggleDoctorResultState);
    Logger.debug('Last toggle doctor result state reset.');
  }
}
