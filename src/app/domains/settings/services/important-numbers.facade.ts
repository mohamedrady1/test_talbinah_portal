import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, catchError, finalize, tap } from 'rxjs';
import { ImportantNumbersResponse, ImportantNumberItem } from '../dtos/responses/important-numbers-response.dto';
import { Logger } from '../../../common';
import { SettingsApiClient } from '../clients';

@Injectable({
    providedIn: 'root'
})
export class ImportantNumbersFacade {
    private readonly _settingsApiClient = inject(SettingsApiClient);

    // State signals
    private readonly _isLoading = signal<boolean>(false);
    private readonly _errorMessage = signal<string | null>(null);
    private readonly _importantNumbers = signal<ImportantNumberItem[]>([]);
    private readonly _importantNumbersResponse = signal<ImportantNumbersResponse | null>(null);

    // Computed signals
    readonly isLoading = computed(() => this._isLoading());
    readonly errorMessage = computed(() => this._errorMessage());
    readonly importantNumbers = computed(() => this._importantNumbers());
    readonly importantNumbersResponse = computed(() => this._importantNumbersResponse());

    fetchImportantNumbers(): void {
        Logger.debug('ImportantNumbersFacade: Fetching important numbers');

        this._isLoading.set(true);
        this._errorMessage.set(null);

        this._settingsApiClient.getImportantNumbers()
            .pipe(
                tap((response: ImportantNumbersResponse) => {
                    Logger.debug('ImportantNumbersFacade: Important numbers fetched successfully', {
                        count: response.data?.length || 0
                    });

                    if (response.status && response.data) {
                        this._importantNumbers.set(response.data);
                        this._importantNumbersResponse.set(response);
                    } else {
                        this._errorMessage.set(response.message || 'Failed to fetch important numbers');
                    }
                }),
                catchError((error) => {
                    Logger.error('ImportantNumbersFacade: Error fetching important numbers', error);
                    this._errorMessage.set('An error occurred while fetching important numbers');
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

    clearImportantNumbers(): void {
        this._importantNumbers.set([]);
        this._importantNumbersResponse.set(null);
    }
} 