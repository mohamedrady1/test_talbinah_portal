import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, catchError, finalize, tap } from 'rxjs';
import { MovementsResponse, MovementItem } from '../dtos/responses/movements-response.dto';
import { Logger } from '../../../common';
import { SettingsApiClient } from '../clients';

@Injectable({
    providedIn: 'root'
})
export class MovementsFacade {
    private readonly _settingsApiClient = inject(SettingsApiClient);

    // State signals
    private readonly _isLoading = signal<boolean>(false);
    private readonly _errorMessage = signal<string | null>(null);
    private readonly _movements = signal<MovementItem[]>([]);
    private readonly _movementsResponse = signal<MovementsResponse | null>(null);

    // Computed signals
    readonly isLoading = computed(() => this._isLoading());
    readonly errorMessage = computed(() => this._errorMessage());
    readonly movements = computed(() => this._movements());
    readonly movementsResponse = computed(() => this._movementsResponse());
    readonly movementsStatus = computed(() => this._movementsResponse()?.status);
    fetchMovements(): void {
        Logger.debug('MovementsFacade: Fetching movements');

        this._isLoading.set(true);
        this._errorMessage.set(null);

        this._settingsApiClient.getMovements()
            .pipe(
                tap((response: MovementsResponse) => {
                    Logger.debug('MovementsFacade: Movements fetched successfully', {
                        count: response.data?.length || 0
                    });

                    if (response.status && response.data) {
                        this._movements.set(response.data);
                        this._movementsResponse.set(response);
                    } else {
                        this._errorMessage.set(response.message || 'Failed to fetch movements');
                    }
                }),
                catchError((error) => {
                    Logger.error('MovementsFacade: Error fetching movements', error);
                    this._errorMessage.set('An error occurred while fetching movements');
                    throw error;
                }),
                finalize(() => {
                    this._isLoading.set(false);
                })
            )
            .subscribe();
    }

    clearError(): void {
        this._errorMessage.set(null);
    }

    clearMovements(): void {
        this._movements.set([]);
        this._movementsResponse.set(null);
    }
} 