import { Injectable, computed, effect, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IGlobalDoctorContactInfoModel, IPaginationParameters, Logger } from '../../../common';
import { BookAppointmentApiClientProvider } from '../clients';
import { IDoctorsListingResponseDto } from '../dtos';
import { ToastService } from '../../../shared';

const DEFAULT_DOCTOR_FILTERS: IPaginationParameters = {
  page: 1,
  per_page: 1000,
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

@Injectable({ providedIn: 'root' })
export class DoctorsListFacade {
  private _filters = signal<IPaginationParameters>({ ...DEFAULT_DOCTOR_FILTERS });
  private _isLoading = signal(false);
  private _isFiltering = signal(false);
  private _errorMessage = signal<string | null>(null);
  private _statusMessage = signal<string | null>(null);
  private _allDoctors = signal<IGlobalDoctorContactInfoModel[]>([]);
  private _unfilteredDoctors = signal<IGlobalDoctorContactInfoModel[]>([]);
  private _total = signal(0);
  private _hasActiveFilters = signal(false);

  // Local pagination
  private _localCurrentPage = signal(1);
  private _itemsPerPage = 6;

  private readonly _client = inject(BookAppointmentApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _isBrowser = isPlatformBrowser(this._platformId);

  // ---- Computed ----
  readonly doctors = computed(() => {
    const all = this._allDoctors();
    const start = (this._localCurrentPage() - 1) * this._itemsPerPage;
    return all.slice(start, start + this._itemsPerPage);
  });

  readonly suggestedDoctors = computed(() => {
    const all = this._unfilteredDoctors();
    const start = (this._localCurrentPage() - 1) * this._itemsPerPage;
    return all.slice(start, start + this._itemsPerPage);
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

  readonly totalPages = computed(() => {
    const count = this._hasActiveFilters() && this._allDoctors().length === 0
      ? this._unfilteredDoctors().length
      : this._allDoctors().length;
    return Math.ceil(count / this._itemsPerPage);
  });

  readonly itemsPerPage = this._itemsPerPage;

  constructor() {
    effect(() => {
      const filters = this._filters();
      if (filters.parent_id) {
        this.fetchDoctors(filters);
      }
    });
  }

  private fetchDoctors(params: IPaginationParameters): void {
    const hasValidParentId = !!params.parent_id;
    const hasFilters = Object.entries(params).some(
      ([k, v]) => !['page', 'per_page', 'total', 'parent_id'].includes(k) && v != null && v !== ''
    );

    this._hasActiveFilters.set(hasFilters);
    this._isLoading.set(!hasFilters);
    this._isFiltering.set(hasFilters);
    this._statusMessage.set(hasFilters ? '🔄 Filtering doctors...' : '🔄 Loading doctors...');
    this._errorMessage.set(null);

    const formattedParams = this.formatParams(params);

    this._client.getAllDoctors(formattedParams).subscribe({
      next: (res: IDoctorsListingResponseDto) => {
        if (res.status && res.data?.data) {
          const doctors = res.data.data;
          const total = res.data.meta?.total || doctors.length;

          this._allDoctors.set(doctors);
          this._total.set(total);
          this._localCurrentPage.set(1);
          this._errorMessage.set(null);
          this._statusMessage.set(null);

          if (!hasFilters && hasValidParentId) {
            this._unfilteredDoctors.set(doctors);
          }
        } else {
          this._allDoctors.set([]);
          this._total.set(0);
          this._errorMessage.set(res.message || 'Failed to fetch doctors.');
        }
      },
      error: (err: any) => {
        Logger.error('Error fetching doctors:', err);
        this._allDoctors.set([]);
        this._total.set(0);
        this._errorMessage.set(err.message || 'Unknown error');
        this._toastService.add({
          severity: 'error',
          summary: 'general.error',
          detail: 'general.doctorsError',
          life: 5000,
        });
      },
      complete: () => {
        this._isLoading.set(false);
        this._isFiltering.set(false);
        if (!this._errorMessage() && this._allDoctors().length === 0) {
          this._statusMessage.set('😔 No doctors found for your criteria.');
        } else {
          this._statusMessage.set(null);
        }
      }
    });
  }

  private formatParams(params: IPaginationParameters): IPaginationParameters {
    const p: any = { ...params };
    if (Array.isArray(p.services_ids)) p.services_ids = p.services_ids.join(',');
    if (Array.isArray(p.languages_ids)) p.languages_ids = p.languages_ids.join(',');
    return p;
  }

  fetch(): void {
    this._filters.update(f => ({ ...f }));
  }

  updateFilters(filters: Partial<IPaginationParameters>): void {
    this._filters.update(prev => {
      const merged = { ...prev, ...filters };
      const changed = Object.keys(filters).some(
        k => !['page', 'total', 'per_page'].includes(k) && prev[k as keyof IPaginationParameters] !== filters[k as keyof IPaginationParameters]
      );
      if (changed) this._localCurrentPage.set(1);
      return merged;
    });
  }

  setPage(page: number): void {
    const maxPage = this.totalPages();
    this._localCurrentPage.set(Math.min(Math.max(page, 1), maxPage || 1));
  }

  resetFilters(): void {
    const currentParentId = this._filters().parent_id;
    const reset = { ...DEFAULT_DOCTOR_FILTERS, parent_id: currentParentId };
    this._filters.set(reset);
    this._localCurrentPage.set(1);
    this._hasActiveFilters.set(false);
  }

  getCurrentFilters(): IPaginationParameters {
    return this._filters();
  }
}
