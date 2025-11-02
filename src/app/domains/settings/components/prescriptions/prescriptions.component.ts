import {
  EmptyStateCardComponent,
  ErrorStateCardComponent,
  LocalSearchComponent,
  PaginationListingComponent
} from '../../../../shared';
import {
  GetReservations,
  ReservationsEmptyState
} from '../../../appointments';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  effect
} from '@angular/core';
import {
  IGlobalReservationModel
} from '../../../appointments/models';
import {
  FileType,
  FileViewerComponent
} from '../../../talbinah-bot';
import {
  DownloadableFile
} from '../../../talbinah-bot/models';
import {
  AutoExactHeightDirective
} from '../../../../common';
import {
  VisitsReportsListFacade
} from '../../services';
import {
  TranslateModule
} from '@ngx-translate/core';
import {
  CommonModule
} from '@angular/common';
import { prescriptionsEmptyConfig } from '../../configs/settings-empty-state.config';
import { prescriptionsErrorConfig } from '../../configs';
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AutoExactHeightDirective,
    LocalSearchComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    FileViewerComponent,
    PaginationListingComponent,
    TranslateApiPipe
  ],
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrescriptionsComponent {
  private readonly visitsReportsFacade = inject(VisitsReportsListFacade);

  readonly appointmentsResponse = this.visitsReportsFacade.appointmentsResponse;
  readonly isLoading = this.visitsReportsFacade.isLoading;
  readonly isLoadingFilter = this.visitsReportsFacade.isLoadingFilter;
  readonly errorMessage = this.visitsReportsFacade.errorMessage;
  readonly searchConfig = this.visitsReportsFacade.searchConfig;
  readonly paginationConfig = this.visitsReportsFacade.paginationConfig;

  // Local search term signal
  protected readonly searchTerm = signal('');

  // Pagination signals
  protected readonly currentPage = signal(1);
  protected readonly itemsPerPage = 6;

  // Computed filtered data based on local search
  protected readonly filteredPrescriptions = computed(() => {
    const searchValue = this.searchTerm().toLowerCase().trim();
    const data = this.appointmentsResponse();
    const prescriptions = data?.data?.reservations?.data || [];

    console.log('Search value:', searchValue);
    console.log('Total prescriptions:', prescriptions.length);
    console.log('Prescriptions data:', prescriptions);

    if (!searchValue) {
      console.log('No search value, returning all prescriptions');
      return prescriptions;
    }

    const filtered = prescriptions.filter(prescription => {
      const id = prescription?.id?.toString() || '';
      const filename = prescription?.filename || '';
      const reportFile = prescription?.report_file || '';
      const message = prescription?.message || '';

      const matches = id.toLowerCase().includes(searchValue) ||
        filename.toLowerCase().includes(searchValue) ||
        reportFile.toLowerCase().includes(searchValue) ||
        message.toLowerCase().includes(searchValue);

      console.log(`Prescription ${id}:`, { id, filename, reportFile, message, matches });

      return matches;
    });

    console.log('Filtered results:', filtered.length);
    return filtered;
  });

  // Computed pagination data
  protected readonly totalPages = computed(() => {
    const totalItems = this.filteredPrescriptions().length;
    return Math.max(1, Math.ceil(totalItems / this.itemsPerPage));
  });

  protected readonly pagedPrescriptions = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredPrescriptions().slice(start, start + this.itemsPerPage);
  });

  // Local pagination config
  protected readonly localPaginationConfig = computed(() => ({
    currentPage: this.currentPage(),
    totalPages: this.totalPages(),
    onPageChange: (page: number) => {
      this.currentPage.set(page);
    }
  }));

  readonly emptyState = prescriptionsEmptyConfig;
  readonly errorState = prescriptionsErrorConfig(() => this.visitsReportsFacade.fetchVisitsReports());

  // Debug: راقب التغييرات
  constructor() {
    effect(() => {
      console.log('prescriptions searchTerm:', this.searchTerm());
      console.log('prescriptions currentPage:', this.currentPage());
      console.log('prescriptions totalPages:', this.totalPages());
      console.log('prescriptions pagedPrescriptions:', this.pagedPrescriptions().length);
    });
  }

  ngOnInit(): void {
    console.log('PrescriptionsComponent ngOnInit');
    this.visitsReportsFacade.fetchVisitsReports();
  }

  protected handleSearch(value: string): void {
    console.log('handleSearch called with value:', value);
    this.searchTerm.set(value);
    this.currentPage.set(1); // Reset to first page when searching
    // No need to call facade search since we're doing local filtering
  }

  protected handleClearSearch(): void {
    this.searchTerm.set('');
    this.currentPage.set(1); // Reset to first page when clearing search
    // No need to call facade clear search since we're doing local filtering
  }

  protected getDownloadableFile(item: IGlobalReservationModel): DownloadableFile | null {
    if (!item) return null;
    const fileUrl = item.report_file || item.message;
    if (!fileUrl) return null;

    const fileType: FileType = FileType.PDF;
    return {
      name: item.filename || this.extractFileNameFromUrl(fileUrl) || 'document.pdf',
      url: fileUrl,
      type: fileType,
      size: item?.file_size ?? 0,
      date: item.file_date ? new Date(item.file_date) : new Date()
    };
  }

  private extractFileNameFromUrl(url: string | null): string | null {
    try {
      // Support both absolute and relative URLs
      const urlObj = new URL(url ?? '', 'http://localhost'); // dummy base
      const pathname = urlObj.pathname;
      const lastSlashIndex = pathname.lastIndexOf('/');
      if (lastSlashIndex > -1) {
        let fileName = pathname.substring(lastSlashIndex + 1);
        const queryIndex = fileName.indexOf('?');
        if (queryIndex > -1) {
          fileName = fileName.substring(0, queryIndex);
        }
        return fileName || null;
      }
    } catch (e) {
      console.error('Invalid URL for file name extraction:', url, e);
    }
    return null;
  }

}
