import { ChangeDetectionStrategy, Component, inject, signal, computed, effect } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AppointmentCardSkeletonComponent, GetReservations, ReservationsEmptyState } from '../../../appointments';
import { ErrorStateCardComponent, EmptyStateCardComponent } from "../../../../shared";
import { VisitReportCardComponent } from "../visit-report-card";
import { PaginationListingComponent } from "../../../../shared";
import { AutoExactHeightDirective } from '../../../../common';
import { VisitsReportsListFacade } from '../../services';
import { LocalSearchComponent } from '../../../../shared';
import { visitReportsEmptyConfig, visitReportsErrorConfig } from '../../configs';

@Component({
  selector: 'app-visit-reports',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    AppointmentCardSkeletonComponent,
    ErrorStateCardComponent,
    PaginationListingComponent,
    AutoExactHeightDirective,
    VisitReportCardComponent,
    PaginationListingComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    LocalSearchComponent
  ],
  templateUrl: './visit-reports.component.html',
  styleUrls: ['./visit-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitReportsComponent {
  // --- Injected Facade ---
  protected readonly _VisitsReportsListFacade = inject(VisitsReportsListFacade);

  // --- Exposed Facade State and Configuration ---
  readonly appointmentsResponse = this._VisitsReportsListFacade.appointmentsResponse;
  readonly isLoading = this._VisitsReportsListFacade.isLoading;
  readonly isLoadingFilter = this._VisitsReportsListFacade.isLoadingFilter;
  readonly errorMessage = this._VisitsReportsListFacade.errorMessage;
  readonly totalItems = this._VisitsReportsListFacade.totalItems;
  readonly paginationConfig = this._VisitsReportsListFacade.paginationConfig;
  readonly searchConfig = this._VisitsReportsListFacade.searchConfig;

  // Local search term signal
  protected readonly searchTerm = signal('');

  // Pagination signals
  protected readonly currentPage = signal(1);
  protected readonly itemsPerPage = 6;

  // Computed filtered data based on local search
  protected readonly filteredVisitReports = computed(() => {
    const searchValue = this.searchTerm().toLowerCase().trim();
    const data = this.appointmentsResponse();
    const visitReports = data?.data?.reservations?.data || [];

    console.log('Search value:', searchValue);
    console.log('Total visit reports:', visitReports.length);

    if (!searchValue) {
      console.log('No search value, returning all visit reports');
      return visitReports;
    }

    const filtered = visitReports.filter(report => {
      const id = report?.id?.toString() || '';
      const filename = report?.filename || '';
      const reportFile = report?.report_file || '';
      const message = report?.message || '';

      const matches = id.toLowerCase().includes(searchValue) ||
        filename.toLowerCase().includes(searchValue) ||
        reportFile.toLowerCase().includes(searchValue) ||
        message.toLowerCase().includes(searchValue);

      console.log(`Visit Report ${id}:`, { id, filename, reportFile, message, matches });

      return matches;
    });

    console.log('Filtered results:', filtered.length);
    return filtered;
  });

  // Computed pagination data
  protected readonly totalPages = computed(() => {
    const totalItems = this.filteredVisitReports().length;
    return Math.max(1, Math.ceil(totalItems / this.itemsPerPage));
  });

  protected readonly pagedVisitReports = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredVisitReports().slice(start, start + this.itemsPerPage);
  });

  // Local pagination config
  protected readonly localPaginationConfig = computed(() => ({
    currentPage: this.currentPage(),
    totalPages: this.totalPages(),
    onPageChange: (page: number) => {
      this.currentPage.set(page);
    }
  }));

  visitReportsEmptyState = visitReportsEmptyConfig;
  protected readonly visitReportsErrorState = visitReportsErrorConfig(() => this._VisitsReportsListFacade.fetchVisitsReports());

  // Debug: راقب التغييرات
  constructor() {
    effect(() => {
      console.log('visit-reports searchTerm:', this.searchTerm());
      console.log('visit-reports currentPage:', this.currentPage());
      console.log('visit-reports totalPages:', this.totalPages());
      console.log('visit-reports pagedVisitReports:', this.pagedVisitReports().length);
    });
  }

  protected handleClearSearch(): void {
    this.searchTerm.set('');
    this.currentPage.set(1); // Reset to first page when clearing search
    // No need to call facade clear search since we're doing local filtering
  }

  protected handleSearch(value: string): void {
    console.log('Visit Reports Search value:', value);
    this.searchTerm.set(value);
    this.currentPage.set(1); // Reset to first page when searching
    // No need to call facade search since we're doing local filtering
  }

  ngOnInit(): void {
    // Delegate initial data fetch to the facade
    this._VisitsReportsListFacade.fetchVisitsReports();
  }
}
