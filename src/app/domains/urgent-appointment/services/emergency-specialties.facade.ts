import { inject, Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { ApiError, handleApiErrors, Logger } from '../../../common';
import { LocalizationService, ToastService } from '../../../shared';
import { EMPTY, catchError, finalize, tap } from 'rxjs';
import { IUrgentAppointmentApiClient, UrgentAppointmentApiClientProvider } from '../clients';
import { IEmergencySpecialtiesResponseDto } from '../dtos';
import { EmergencySpecialtiesLookupState, initialEmergencySpecialtiesLookupState } from '../models';

@Injectable({ providedIn: 'root' })
export class EmergencySpecialtiesLookupFacade {
    private readonly _apiClient: IUrgentAppointmentApiClient = inject(UrgentAppointmentApiClientProvider).getClient();
    private readonly _toastService: ToastService = inject(ToastService);
    private readonly _localizationService: LocalizationService = inject(LocalizationService);

    private readonly _state: WritableSignal<EmergencySpecialtiesLookupState> = signal<EmergencySpecialtiesLookupState>(initialEmergencySpecialtiesLookupState);

    readonly response: Signal<IEmergencySpecialtiesResponseDto | null> = computed(() => this._state().response);
    readonly isLoading: Signal<boolean> = computed(() => this._state().isLoading);
    readonly status: Signal<boolean | null> = computed(() => this._state().status);
    readonly errorMessage: Signal<string | null> = computed(() => this._state().errorMessage);

    fetchSpecialties(): void {
        Logger.debug('EmergencySpecialtiesLookupFacade: fetching specialties...');
        this._update({ isLoading: true, errorMessage: null, status: null });

        this._apiClient.getEmergencySpecialties().pipe(
            tap((response: IEmergencySpecialtiesResponseDto) => {
                if (response.status) {
                    this._update({ response, status: true });
                } else {
                    this._update({ status: false, errorMessage: response.message || this._localizationService.translateTextFromJson('lookups.specialities.errorLoading') });
                }
            }),
            catchError((error: ApiError) => {
                const localizedError = this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
                this._update({ status: false, errorMessage: localizedError });
                Logger.error('EmergencySpecialtiesLookupFacade: Error fetching specialties:', error);
                handleApiErrors(error);
                return EMPTY;
            }),
            finalize(() => {
                this._update({ isLoading: false });
            })
        ).subscribe();
    }

    resetState(): void {
        this._state.set(initialEmergencySpecialtiesLookupState);
    }

    private _update(updates: Partial<EmergencySpecialtiesLookupState>): void {
        this._state.update(state => ({ ...state, ...updates }));
    }
}


