import {
  inject,
  Injectable,
  signal,
  computed,
  PLATFORM_ID,
  makeStateKey,
  TransferState
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { IFaqsCategoriesResponseDto } from '../dtos';
import { SettingsApiClient } from '../clients';
import {
  initialFaqsCategoriesFeatureState,
  FaqsCategoriesFeatureState,
  FaqsCategoriesListState
} from '../models';
import { Logger, ApiError, handleApiErrors } from '../../../common';

const FAQS_CATEGORIES_STATE_KEY = makeStateKey<FaqsCategoriesFeatureState>('faqsCategories');

@Injectable({
  providedIn: 'root'
})
export class FaqsCategoriesFacade {
  // --- Dependencies ---
  private readonly _settingsApiClient = inject(SettingsApiClient);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  // --- Feature State (Signal) ---
  private readonly _featureState = signal<FaqsCategoriesFeatureState>(initialFaqsCategoriesFeatureState);

  // --- Selectors (Computed) ---
  readonly categoriesResponse = computed(() => this._featureState().categories.response);
  readonly isLoading = computed(() => this._featureState().categories.isLoading);
  readonly isFiltering = computed(() => this._featureState().categories.isFiltering);
  readonly errorMessage = computed(() => this._featureState().categories.errorMessage);
  readonly categories = computed(() => this._featureState().categories.categories);

  constructor() {
    // if (isPlatformBrowser(this._platformId)) {
    //   const cachedState = this._transferState.get<FaqsCategoriesFeatureState>(FAQS_CATEGORIES_STATE_KEY, initialFaqsCategoriesFeatureState);
    //   if (cachedState) {
    //     Logger.debug('Hydrating faqs categories from TransferState', cachedState);
    //     this._updateCategoriesListState(cachedState.categories);
    //     this._transferState.remove(FAQS_CATEGORIES_STATE_KEY);
    //   }
    // }
  }

  // --- Public Methods ---

  fetchFaqsCategories(filter: boolean = false): void {
    Logger.debug(`Fetching faqs categories - Filter: ${filter}`);

    this._updateCategoriesListState({
      isLoading: !filter,
      isFiltering: filter,
      errorMessage: null,
    });

    // const cached = this._transferState.get<FaqsCategoriesFeatureState>(FAQS_CATEGORIES_STATE_KEY, null as any);
    // if (isPlatformBrowser(this._platformId) && cached && !filter) {
    //   Logger.debug('Using cached faqs categories from TransferState');
    //   this._updateCategoriesListState({
    //     response: cached.categories.response,
    //     isLoading: false,
    //     isFiltering: false,
    //     categories: cached.categories.categories,
    //   });
    //   this._transferState.remove(FAQS_CATEGORIES_STATE_KEY);
    //   return;
    // }

    this._settingsApiClient.getFaqsCategories()
      .pipe(
        tap((response: IFaqsCategoriesResponseDto) => {
          if (response && response.data && response.data.length > 0) {
            this._updateCategoriesListState({
              response: response,
              categories: response?.data,
              errorMessage: null,
            });
            Logger.debug('FaqsCategories response: ', {
              response: response,
              categories: response?.data
            })
          } else {
            this._updateCategoriesListState({
              response: null,
              categories: [],
              errorMessage: '📭 No faqs categories found.',
            });
          }

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(FAQS_CATEGORIES_STATE_KEY, this._featureState());
            Logger.debug('Stored faqs categories in TransferState for SSR');
          }
        }),
        catchError((error: ApiError) => {
          this._updateCategoriesListState({
            errorMessage: '🚨 Error loading faqs categories. Please try again later.',
            response: null,
            categories: [],
          });
          handleApiErrors(error);
          return EMPTY;
        }),
        finalize(() => {
          this._updateCategoriesListState({
            isLoading: false,
            isFiltering: false,
          });
        })
      )
      .subscribe();
  }

  // Method to reset state
  resetState(): void {
    this._updateCategoriesListState({
      response: null,
      categories: [],
      errorMessage: null,
      isLoading: false,
      isFiltering: false,
    });
    Logger.debug('Faqs categories state has been reset');
  }

  // --- Private Utility Method ---
  private _updateCategoriesListState(updates: Partial<FaqsCategoriesListState>): void {
    this._featureState.update(state => ({
      ...state,
      categories: {
        ...state.categories,
        ...updates
      }
    }));
  }
}
