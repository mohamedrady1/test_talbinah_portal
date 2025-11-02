import { Injectable, inject, signal, computed } from '@angular/core';
import { catchError, finalize, tap, EMPTY, Observable } from 'rxjs';
import { FaqsResponse, FaqItem } from '../dtos/responses/faqs-response.dto';
import { FaqsFeatureState, initialFaqsFeatureState } from '../models/faqs.model';
import { Logger } from '../../../common';
import { SettingsApiClient } from '../clients';

// --- State for the last fetch operation ---
interface LastFetchFaqsResultState {
    response: FaqsResponse | null;
    success: boolean;
    error: string | null;
    categoryId: number | null;
}

const initialLastFetchFaqsResultState: LastFetchFaqsResultState = {
    response: null,
    success: false,
    error: null,
    categoryId: null,
};

@Injectable({
    providedIn: 'root'
})
export class FaqsFacade {
    private readonly _settingsApiClient = inject(SettingsApiClient);

    // State signals
    private readonly _state = signal<FaqsFeatureState>(initialFaqsFeatureState);

    // --- State: last fetch result status ---
    private readonly _lastFetchResultState = signal<LastFetchFaqsResultState>(initialLastFetchFaqsResultState);

    // Computed signals for reactive state
    readonly isLoading = computed(() => this._state().isLoading);
    readonly errorMessage = computed(() => this._state().errorMessage);
    readonly faqs = computed(() => this._state().faqs);
    readonly faqsResponse = computed(() => this._state().faqsResponse);

    // Computed selectors for last fetch result
    readonly lastFetchResponse = computed(() => this._lastFetchResultState().response);
    readonly lastFetchSuccess = computed(() => this._lastFetchResultState().success);
    readonly lastFetchError = computed(() => this._lastFetchResultState().error);
    readonly lastFetchedCategoryId = computed(() => this._lastFetchResultState().categoryId);

    /**
     * Fetch FAQs and update state reactively (old pattern, for compatibility)
     */
    fetchFaqs(categoryId: number): void {
        Logger.debug('FaqsFacade: Fetching FAQs', { categoryId });
        this._setLoading(true);
        this._setError(null);
        this._settingsApiClient.getFaqs(categoryId)
            .pipe(
                tap((response: FaqsResponse) => {
                    Logger.debug('FaqsFacade: FAQs fetched successfully', {
                        categoryId,
                        count: response.data?.length
                    });
                    this._setFaqs(response.data || []);
                    this._setFaqsResponse(response);
                    this._lastFetchResultState.set({
                        response,
                        success: !!response.status,
                        error: response.status ? null : response.message || 'تعذر تحميل الأسئلة',
                        categoryId,
                    });
                }),
                catchError((error) => {
                    Logger.error('FaqsFacade: Error fetching FAQs', { categoryId, error });
                    this._setError('Failed to load FAQs. Please try again.');
                    this._lastFetchResultState.set({
                        response: null,
                        success: false,
                        error: 'Failed to load FAQs. Please try again.',
                        categoryId,
                    });
                    return EMPTY;
                }),
                finalize(() => {
                    this._setLoading(false);
                })
            )
            .subscribe();
    }

    /**
     * Fetch FAQs and return an Observable for manual subscription and error handling
     */
    fetchFaqs$(categoryId: number): Observable<FaqsResponse> {
        Logger.debug('FaqsFacade: Fetching FAQs (observable)', { categoryId });
        this._setLoading(true);
        this._setError(null);
        this._lastFetchResultState.set(initialLastFetchFaqsResultState);
        return this._settingsApiClient.getFaqs(categoryId).pipe(
            tap((response: FaqsResponse) => {
                Logger.debug('FaqsFacade: FAQs fetched successfully (observable)', {
                    categoryId,
                    count: response.data?.length
                });
                this._setFaqs(response.data || []);
                this._setFaqsResponse(response);
                this._lastFetchResultState.set({
                    response,
                    success: !!response.status,
                    error: response.status ? null : response.message || 'تعذر تحميل الأسئلة',
                    categoryId,
                });
            }),
            catchError((error) => {
                Logger.error('FaqsFacade: Error fetching FAQs (observable)', { categoryId, error });
                this._setError('Failed to load FAQs. Please try again.');
                this._lastFetchResultState.set({
                    response: null,
                    success: false,
                    error: 'Failed to load FAQs. Please try again.',
                    categoryId,
                });
                return EMPTY;
            }),
            finalize(() => {
                this._setLoading(false);
            })
        );
    }

    resetLastFetchResultState(): void {
        this._lastFetchResultState.set(initialLastFetchFaqsResultState);
        Logger.debug('Last fetch faqs result state reset.');
    }

    // Private state setters
    private _setLoading(isLoading: boolean): void {
        this._state.update(state => ({ ...state, isLoading }));
    }

    private _setError(errorMessage: string | null): void {
        this._state.update(state => ({ ...state, errorMessage }));
    }

    private _setFaqs(faqs: FaqItem[]): void {
        this._state.update(state => ({ ...state, faqs }));
    }

    private _setFaqsResponse(response: FaqsResponse): void {
        this._state.update(state => ({ ...state, faqsResponse: response }));
    }
} 