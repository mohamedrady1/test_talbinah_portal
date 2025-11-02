import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, inject, computed, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // Needed for @if, @for, etc.
import { EmptyStateComponent, EmptyStateConfig, ErrorStateComponent, ErrorStateConfig, ModalService, PaginationConfig, PaginationListingComponent } from '../../../../shared';
import { DetailsHeaderConfig, ISeminarItemDto, SeminarsFacade } from '../../../../domains';
import { Subject } from 'rxjs';
import { CardType, Logger } from '../../../../common';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { SupportGroupSubscriptionComponent } from '../support-group-subscription';
import { GroupCardComponent } from '../../../../domains/support-groups/components/group-card/group-card.component';
import { TherapeuticProgramCardShimmerComponent } from '../../../../domains/therapeutic-programs/components/therapeutic-program-card-shimmer/therapeutic-program-card-shimmer.component';

// Re-defining or importing the EmptyState and getError for AllSupportGroupsComponent
// It's better to define these in a shared utility file if used across multiple components,
// but for this example, we'll re-declare them here for clarity based on your request.
export const AllGroupsEmptyState: EmptyStateConfig = {
  imageUrl: 'images/not-found/Treatment-programs/no-data-icon.svg',
  title: 'support_groups_no_groups_found',
  gap: '1rem'
};

export function getAllGroupsError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/Treatment-programs/no-data-icon-error.svg',
    title: 'support_groups_no_groups_available',
    gap: '1rem',
    onRetry
  };
}

@Component({
  selector: 'app-all-support-groups',
  standalone: true,
  imports: [
    CommonModule, // Make sure CommonModule is imported for structural directives
    GroupCardComponent,
    TherapeuticProgramCardShimmerComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    AutoExactHeightDirective,
    PaginationListingComponent
  ],
  templateUrl: './all-support-groups.component.html',
  styleUrls: ['./all-support-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllSupportGroupsComponent implements OnInit, OnDestroy {
  @Input() type!: 'AllGroups' | 'myGroups'; // Input to determine which data to fetch

  // Injected Dependencies
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly _SeminarsFacade = inject(SeminarsFacade);
  private readonly _destroy$ = new Subject<void>();
  private readonly _modalService = inject(ModalService)
  // Component Properties for display logic
  protected cardTypes = CardType;
  protected readonly emptyStateConfig = AllGroupsEmptyState; // Using the consistent empty state config

  // Error state configurations, dynamically calling the correct facade method for retry
  protected readonly allGroupsErrorState = getAllGroupsError(() => this._SeminarsFacade.fetchAllSeminars());
  protected readonly myGroupsErrorState = getAllGroupsError(() => this._SeminarsFacade.fetchMySeminars());

  // Computed signals for data and loading/error states based on 'type'
  protected readonly seminarsData = computed(() => {
    return this.type === 'AllGroups' ? this._SeminarsFacade.allSeminars() : this._SeminarsFacade.mySeminars();
  });

  protected readonly isLoading = computed(() => {
    return this.type === 'AllGroups' ? this._SeminarsFacade.isLoadingAllSeminars() : this._SeminarsFacade.isLoadingMySeminars();
  });

  protected readonly isFiltering = computed(() => {
    return this.type === 'AllGroups' ? this._SeminarsFacade.isFilteringAllSeminars() : this._SeminarsFacade.isFilteringMySeminars();
  });

  protected readonly errorMessage = computed(() => {
    return this.type === 'AllGroups' ? this._SeminarsFacade.allSeminarsErrorMessage() : this._SeminarsFacade.mySeminarsErrorMessage();
  });

  // New computed signal for status, based on 'type'
  protected readonly seminarsStatus = computed(() => {
    return this.type === 'AllGroups' ? this._SeminarsFacade.allSeminarsStatus() : this._SeminarsFacade.mySeminarsStatus();
  });

  // --- Local Pagination State ---
  private readonly _currentPage = signal<number>(1);
  private readonly _itemsPerPage = signal<number>(6); // 6 items per page

  // Pagination configuration, dynamically computed based on 'type'
  readonly paginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this.type === 'AllGroups' ? this._SeminarsFacade.currentAllSeminarsPage() : this._SeminarsFacade.currentMySeminarsPage(),
    totalPages: this.type === 'AllGroups' ? this._SeminarsFacade.totalAllSeminarsItems() : this._SeminarsFacade.totalMySeminarsItems(),
    onPageChange: (page: number) => {
      if (this.type === 'AllGroups') {
        this.handleAllSeminarsPageChange(page);
      } else {
        this.handleMySeminarsPageChange(page);
      }
    }
  }));

  // Local pagination configuration for displayed items
  readonly localPaginationConfig = computed<PaginationConfig>(() => {
    const allData = this.seminarsData()?.data || [];
    const totalItems = allData.length;
    const totalPages = Math.ceil(totalItems / this._itemsPerPage());

    return {
      currentPage: this._currentPage(),
      totalPages: totalPages,
      onPageChange: (page: number) => this.handleLocalPageChange(page)
    };
  });

  // Get paginated data for current page
  readonly paginatedSeminars = computed(() => {
    const allData = this.seminarsData()?.data || [];
    const currentPage = this._currentPage();
    const itemsPerPage = this._itemsPerPage();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return allData.slice(startIndex, endIndex);
  });

  ngOnInit(): void {
    // Only fetch data if not already fetched by parent component
    // The parent component (support-groups-layout) already handles initial data fetching
    Logger.debug('AllSupportGroupsComponent: ngOnInit - type:', this.type);

    // Check if data is already available
    const existingData = this.seminarsData();
    if (!existingData || !existingData.data || existingData.data.length === 0) {
      Logger.debug('AllSupportGroupsComponent: No existing data, fetching...');
      if (this.type === 'AllGroups') {
        this._SeminarsFacade.fetchAllSeminars();
      } else if (this.type === 'myGroups') {
        this._SeminarsFacade.fetchMySeminars();
      }
    } else {
      Logger.debug('AllSupportGroupsComponent: Using existing data, no need to fetch');
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  // Event handlers for pagination
  handleAllSeminarsPageChange(page: number): void {
    this._SeminarsFacade.fetchAllSeminars(page);
  }

  handleMySeminarsPageChange(page: number): void {
    this._SeminarsFacade.fetchMySeminars(page);
  }

  protected handleLocalPageChange(page: number): void {
    console.log('AllSupportGroupsComponent: Local page change to', page);
    this._currentPage.set(page);

    // Scroll to top when page changes
    this.scrollToTop();
  }

  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Scroll to the top of the container
      const containerElement = document.querySelector('.all-support-groups-container');
      if (containerElement) {
        containerElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }

  protected openSeminarSubscription(item: ISeminarItemDto, paymentStatus: boolean | null): void {
    Logger.debug('SupportGroupsComponent => openSeminarSubscription : ', {
      item: item,
      paymentStatus: paymentStatus
    });
    this._modalService.open(SupportGroupSubscriptionComponent, {
      inputs: {
        ...DetailsHeaderConfig,
        data: {
          item: item,
          paymentStatus: paymentStatus
        }
      },
      outputs: {
        closed: (response: any) => {
          Logger.debug('The update model is closed => response: ', response);
          // Optionally, refresh data after modal closure if needed
          // this._SeminarsFacade.fetchAllSeminars();
          // this._SeminarsFacade.fetchMySeminars();
        }
      },
      width: '70%'
    });
  }

}