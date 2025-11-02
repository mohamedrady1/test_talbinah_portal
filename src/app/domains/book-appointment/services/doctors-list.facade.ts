import { IGlobalDoctorContactInfoModel, IPaginationParameters, Logger } from '../../../common';
import { Injectable, computed, effect, inject, signal, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BookAppointmentApiClientProvider } from '../clients';
import { IDoctorsListingResponseDto } from '../dtos';
import { ToastService } from '../../../shared';

const DEFAULT_DOCTOR_FILTERS: IPaginationParameters = {
  page: 1,
  per_page: 1000, // Fetch all doctors for local pagination
  total: 1000,
  search: undefined,
  specialty: undefined,
  day: undefined,
  services_ids: undefined,
  languages_ids: undefined,
  gender: undefined,
  min_price: undefined,
  max_price: undefined,
  rate: undefined,
  status: undefined,
  parent_id: null
};

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEY_PREFIX = 'talbinah_doctors_';

interface CachedDoctorsData {
  doctors: IGlobalDoctorContactInfoModel[];
  total: number;
  timestamp: number;
  parent_id?: string | null; // Track which parent_id this cache belongs to
}

@Injectable({ providedIn: 'root' })
export class DoctorsListFacade {
  private _filters = signal<IPaginationParameters>({ ...DEFAULT_DOCTOR_FILTERS });
  private _isLoading = signal(false);
  private _isFiltering = signal(false);
  private _errorMessage = signal<string | null>(null);
  private _statusMessage = signal<string | null>(null);
  private _allDoctors = signal<IGlobalDoctorContactInfoModel[]>([]); // All doctors from server (filtered or unfiltered)
  private _unfilteredDoctors = signal<IGlobalDoctorContactInfoModel[]>([]); // Original unfiltered doctors for suggestions
  private _total = signal(0);
  private _hasActiveFilters = signal(false); // Track if filters are active
  private _skipNextFetch = signal(false); // Flag to skip fetch when restoring from cache

  // Local pagination state
  private _localCurrentPage = signal(1);
  private _itemsPerPage = 6;

  private readonly _client = inject(BookAppointmentApiClientProvider).getClient();
  private readonly _ToastService = inject(ToastService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);
  private readonly _isBrowser = isPlatformBrowser(this._platformId);

  // Computed: paginated doctors for current page
  readonly doctors = computed(() => {
    const allDoctors = this._allDoctors();
    const currentPage = this._localCurrentPage();
    const itemsPerPage = this._itemsPerPage;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return allDoctors.slice(startIndex, endIndex);
  });

  // Suggested doctors (unfiltered) when filtered results are empty
  readonly suggestedDoctors = computed(() => {
    const unfilteredDoctors = this._unfilteredDoctors();
    const currentPage = this._localCurrentPage();
    const itemsPerPage = this._itemsPerPage;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return unfilteredDoctors.slice(startIndex, endIndex);
  });

  readonly totalDoctors = computed(() => this._allDoctors().length);
  readonly totalUnfilteredDoctors = computed(() => this._unfilteredDoctors().length);
  readonly hasActiveFilters = computed(() => this._hasActiveFilters());
  readonly isLoading = computed(() => this._isLoading());
  readonly isFiltering = computed(() => this._isFiltering());
  readonly errorMessage = computed(() => this._errorMessage());
  readonly statusMessage = computed(() => this._statusMessage());
  readonly currentPage = computed(() => this._localCurrentPage());
  readonly filters = computed(() => this._filters());

  // Total pages for local pagination (based on filtered or suggested)
  readonly totalPages = computed(() => {
    const hasFilters = this._hasActiveFilters();
    const filteredCount = this._allDoctors().length;

    // If we have active filters and no results, use unfiltered for pagination
    if (hasFilters && filteredCount === 0) {
      return Math.ceil(this._unfilteredDoctors().length / this._itemsPerPage);
    }

    return Math.ceil(filteredCount / this._itemsPerPage);
  });

  // Items per page
  readonly itemsPerPage = this._itemsPerPage;

  constructor() {
    effect(() => {
      const filters = this._filters();

      // Skip fetch if we just restored from cache
      if (this._skipNextFetch()) {
        this._skipNextFetch.set(false);
        return;
      }

      if (filters.parent_id) {
        this.fetchDoctors(filters);
      }
    });
  }

  private getCacheKey(params: IPaginationParameters): string {
    // Create a unique cache key based on filter parameters (excluding page and per_page)
    const cacheParams = { ...params };
    delete cacheParams.page;
    delete cacheParams.per_page;
    delete cacheParams.total;
    const keyString = CACHE_KEY_PREFIX + JSON.stringify(cacheParams);
    return keyString.replace(/[^a-zA-Z0-9_-]/g, '_'); // Clean key for localStorage
  }

  private getCachedData(cacheKey: string, requestedParentId?: string | null): CachedDoctorsData | null {
    // First, try TransferState (for SSR -> Browser handoff)
    const transferStateKey = makeStateKey<CachedDoctorsData>(cacheKey);

    if (this._transferState.hasKey(transferStateKey)) {
      const cachedData = this._transferState.get(transferStateKey, null);
      Logger.debug('DoctorsListFacade: Checking TransferState cache', { cacheKey });

      if (cachedData) {
        const now = Date.now();
        const isValidTime = now - cachedData.timestamp < CACHE_DURATION_MS;
        const isMatchingParentId = !requestedParentId || cachedData.parent_id === requestedParentId;

        if (isValidTime && isMatchingParentId) {
          Logger.debug('DoctorsListFacade: Using TransferState cache', { cacheKey, parent_id: cachedData.parent_id });
          // Also save to localStorage for future use
          if (this._isBrowser) {
            try {
              localStorage.setItem(cacheKey, JSON.stringify(cachedData));
            } catch (e) {
              Logger.error('Error saving to localStorage:', e);
            }
          }
          return cachedData;
        } else {
          Logger.debug('DoctorsListFacade: Cache invalid - parent_id mismatch or expired', {
            cached_parent_id: cachedData.parent_id,
            requested_parent_id: requestedParentId,
            isValidTime,
            isMatchingParentId
          });
        }
      }
    }

    // Then try localStorage (Browser only)
    if (!this._isBrowser) {
      return null;
    }

    try {
      const cachedDataStr = localStorage.getItem(cacheKey);
      if (!cachedDataStr) {
        return null;
      }

      const cachedData: CachedDoctorsData = JSON.parse(cachedDataStr);
      const now = Date.now();

      // Check if cache is still valid (within 24 hours) AND parent_id matches
      const isValidTime = now - cachedData.timestamp < CACHE_DURATION_MS;
      const isMatchingParentId = !requestedParentId || cachedData.parent_id === requestedParentId;

      if (isValidTime && isMatchingParentId) {
        Logger.debug('DoctorsListFacade: Using localStorage cache', {
          cacheKey,
          age: now - cachedData.timestamp,
          parent_id: cachedData.parent_id
        });
        return cachedData;
      } else {
        // Cache expired or parent_id doesn't match, remove it
        Logger.debug('DoctorsListFacade: Cache invalid - parent_id mismatch or expired', {
          cacheKey,
          cached_parent_id: cachedData.parent_id,
          requested_parent_id: requestedParentId,
          isValidTime,
          isMatchingParentId
        });
        localStorage.removeItem(cacheKey);
        return null;
      }
    } catch (error) {
      Logger.error('DoctorsListFacade: Error reading cache', error);
      return null;
    }
  }

  private setCachedData(cacheKey: string, doctors: IGlobalDoctorContactInfoModel[], total: number, parent_id?: string | null): void {
    const cachedData: CachedDoctorsData = {
      doctors,
      total,
      timestamp: Date.now(),
      parent_id: parent_id // Save parent_id with cache
    };

    // Save to TransferState (for SSR -> Browser handoff)
    const transferStateKey = makeStateKey<CachedDoctorsData>(cacheKey);
    this._transferState.set(transferStateKey, cachedData);
    Logger.debug('DoctorsListFacade: Data cached to TransferState', { cacheKey, count: doctors.length, parent_id });

    // Also save to localStorage (Browser only)
    if (!this._isBrowser) {
      return;
    }

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cachedData));
      Logger.debug('DoctorsListFacade: Data cached to localStorage', { cacheKey, count: doctors.length, parent_id });
    } catch (error) {
      Logger.error('DoctorsListFacade: Error caching data to localStorage', error);
    }
  }

  private fetchDoctors(params: IPaginationParameters): void {
    // Check if parent_id exists - don't use cache if it's missing
    const hasValidParentId = params.parent_id && params.parent_id !== null && params.parent_id !== '';

    // Check if we have active filters (excluding page, per_page, total, parent_id)
    const hasFilters = Object.entries(params).some(
      ([key, value]) =>
        !['page', 'per_page', 'total', 'parent_id'].includes(key) &&
        value !== undefined &&
        value !== null &&
        value !== ''
    );

    this._hasActiveFilters.set(hasFilters);

    // Track if we need minimum loading time
    let needsMinimumLoadingTime = false;

    // Only use cache if we have a valid parent_id
    if (hasValidParentId && !hasFilters) {
      const cacheKey = this.getCacheKey(params);
      const cachedData = this.getCachedData(cacheKey, params.parent_id);

      // If no filters and we have cache with matching parent_id, use it
      if (cachedData) {
        Logger.debug('DoctorsListFacade: Using cache for parent_id:', params.parent_id);
        this._allDoctors.set(cachedData.doctors);
        this._unfilteredDoctors.set(cachedData.doctors); // Also set as unfiltered
        this._total.set(cachedData.total);
        this._localCurrentPage.set(1);
        this._errorMessage.set(null);
        this._statusMessage.set(null);
        return;
      } else {
        // No cache found - will need minimum loading time
        needsMinimumLoadingTime = true;
        Logger.debug('DoctorsListFacade: No cache found for parent_id, will show loading for at least 1 second:', params.parent_id);
      }
    }

    // If we have filters, also fetch unfiltered data for suggestions
    const shouldFetchUnfiltered = hasFilters && this._unfilteredDoctors().length === 0 && hasValidParentId;
    if (shouldFetchUnfiltered) {
      // Fetch unfiltered data in parallel
      const unfilteredParams = {
        page: 1,
        per_page: 1000,
        total: 1000,
        parent_id: params.parent_id
      };
      const unfilteredCacheKey = this.getCacheKey(unfilteredParams);
      const unfilteredCached = this.getCachedData(unfilteredCacheKey, params.parent_id);

      if (unfilteredCached) {
        this._unfilteredDoctors.set(unfilteredCached.doctors);
      } else {
        // Fetch unfiltered data
        this.fetchUnfilteredDoctors(unfilteredParams, unfilteredCacheKey);
      }
    }

    this._isLoading.set(!hasFilters);
    this._isFiltering.set(hasFilters);
    this._errorMessage.set(null);

    // Set the appropriate status message based on loading/filtering
    if (hasFilters) {
      this._statusMessage.set('🔄 Filtering doctors...');
    } else {
      this._statusMessage.set('🔄 Loading doctors...');
    }

    const formattedParams = this.formatParams(params);

    // Track start time for minimum loading
    const startTime = Date.now();
    const minimumLoadingTime = needsMinimumLoadingTime ? 1000 : 0; // 1 second if no cache

    this._client.getAllDoctors(formattedParams).subscribe({
      next: (res: IDoctorsListingResponseDto) => {
        if (res.status && res.data && res.data.data) {
          const doctors = res.data.data || [];
          const total = res.data.meta?.total || doctors.length;

          // Calculate remaining time for minimum loading
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

          const updateState = () => {
            this._allDoctors.set(doctors);
            this._total.set(total);
            this._localCurrentPage.set(1); // Reset to first page when new data arrives
            this._errorMessage.set(null);
            this._statusMessage.set(null);

            // Cache the data only for non-filtered requests with valid parent_id
            if (!hasFilters && hasValidParentId) {
              const cacheKey = this.getCacheKey(params);
              this.setCachedData(cacheKey, doctors, total, params.parent_id);
              this._unfilteredDoctors.set(doctors); // Also set as unfiltered
            }
          };

          // If we need minimum loading time, delay the state update
          if (remainingTime > 0) {
            Logger.debug('DoctorsListFacade: Delaying state update by', remainingTime, 'ms');
            setTimeout(() => {
              updateState();
            }, remainingTime);
          } else {
            updateState();
          }
        } else {
          this._allDoctors.set([]);
          this._total.set(0);
          this._errorMessage.set(res.message || 'Failed to fetch doctors.');
          this._statusMessage.set(null);
          this._isLoading.set(false);
          this._isFiltering.set(false);
        }
      },
      error: (error: any) => {
        Logger.error('Error fetching doctors:', error);
        this._allDoctors.set([]);
        this._total.set(0);
        this._errorMessage.set(error.message || 'Unknown error');
        this._statusMessage.set(null);
        this._isLoading.set(false);
        this._isFiltering.set(false);
        this._ToastService.add({
          severity: 'error',
          summary: 'general.error',
          detail: 'general.doctorsError',
          life: 5000,
        });
      },
      complete: () => {
        // Calculate remaining time for complete handler
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

        const completeHandler = () => {
          this._isLoading.set(false);
          this._isFiltering.set(false);
          if (!this._errorMessage() && this._allDoctors().length === 0) {
            this._statusMessage.set('😔 No doctors found for your criteria.');
          } else if (this._errorMessage()) {
            this._statusMessage.set(null);
          } else {
            this._statusMessage.set(null);
          }
        };

        if (remainingTime > 0) {
          setTimeout(completeHandler, remainingTime);
        } else {
          completeHandler();
        }
      },
    });
  }

  private fetchUnfilteredDoctors(params: IPaginationParameters, cacheKey: string): void {
    const formattedParams = this.formatParams(params);

    this._client.getAllDoctors(formattedParams).subscribe({
      next: (res: IDoctorsListingResponseDto) => {
        if (res.status && res.data && res.data.data) {
          const doctors = res.data.data || [];
          const total = res.data.meta?.total || doctors.length;

          this._unfilteredDoctors.set(doctors);
          this.setCachedData(cacheKey, doctors, total, params.parent_id);
        }
      },
      error: (error: any) => {
        Logger.error('Error fetching unfiltered doctors:', error);
      }
    });
  }

  private formatParams(params: IPaginationParameters): IPaginationParameters {
    const result: any = { ...params };
    if (Array.isArray(result.services_ids)) {
      result.services_ids = result.services_ids.join(',');
    }
    if (Array.isArray(result.languages_ids)) {
      result.languages_ids = result.languages_ids.join(',');
    }
    return result;
  }

  fetch(): void {
    this._filters.update(f => ({ ...f }));
  }

  updateFilters(filters: Partial<IPaginationParameters>): void {
    this._filters.update(prev => {
      const merged = { ...prev, ...filters };
      const filtersChanged = Object.keys(filters).some(
        key => !['page', 'total', 'per_page'].includes(key) && prev[key as keyof IPaginationParameters] !== filters[key as keyof IPaginationParameters]
      );
      if (filtersChanged) {
        merged.page = 1;
        this._localCurrentPage.set(1); // Reset local page when filters change
      }
      return merged;
    });
  }

  setPage(page: number): void {
    // Local pagination - just update the local page
    if (page < 1) page = 1;
    const maxPage = this.totalPages();
    if (page > maxPage && maxPage > 0) page = maxPage;
    this._localCurrentPage.set(page);
  }

  resetFilters(): void {
    const resetFilters = { ...DEFAULT_DOCTOR_FILTERS };
    const currentParentId = this._filters().parent_id;
    resetFilters.parent_id = currentParentId; // Keep the parent_id

    // Only try cache if we have a valid parent_id
    const hasValidParentId = currentParentId && currentParentId !== null && currentParentId !== '';

    if (hasValidParentId) {
      // Try to load from cache first
      const cacheKey = this.getCacheKey(resetFilters);
      const cachedData = this.getCachedData(cacheKey, currentParentId);

      if (cachedData) {
        // Use cached data
        Logger.debug('DoctorsListFacade: Restoring from cache on reset');
        this._allDoctors.set(cachedData.doctors);
        this._unfilteredDoctors.set(cachedData.doctors);
        this._total.set(cachedData.total);
        this._localCurrentPage.set(1);
        this._hasActiveFilters.set(false);
        this._errorMessage.set(null);
        this._statusMessage.set(null);

        // Set flag to skip next fetch, then update filters
        this._skipNextFetch.set(true);
        this._filters.set(resetFilters);
        return;
      }
    }

    // No cache or no valid parent_id - reset filters normally (will trigger fetch via effect)
    this._filters.set(resetFilters);
    this._localCurrentPage.set(1);
    this._hasActiveFilters.set(false);
  }

  getCurrentFilters(): IPaginationParameters {
    return this._filters();
  }

  clearCache(): void {
    if (!this._isBrowser) {
      return;
    }

    try {
      // Clear all doctor caches from localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      Logger.debug('DoctorsListFacade: Cache cleared from localStorage');
    } catch (error) {
      Logger.error('DoctorsListFacade: Error clearing cache', error);
    }
  }
}

// This utility function is not part of the class, so it remains as is.
function cleanEmptyFilters<T extends object>(filters: T): T {
  const result = { ...filters };

  for (const key in result) {
    const value = result[key];

    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete result[key];
    }
  }

  return result;
}
