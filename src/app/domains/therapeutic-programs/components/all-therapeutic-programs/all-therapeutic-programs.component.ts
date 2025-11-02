import { Component, OnInit, inject, input, OnDestroy, computed, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TherapeuticProgramsFacade } from '../../services/therapeutic-programs.facade';
import { TherapeuticProgramCardComponent } from '../therapeutic-program-card';
import { EmptyStateComponent, ErrorStateComponent, LocalizationService, ModalService, PaginationConfig } from '../../../../shared';
import { CardType, MetadataService, Logger } from '../../../../common';
import { TherapeuticProgramCardShimmerComponent } from '../therapeutic-program-card-shimmer';
import { Subject, takeUntil } from 'rxjs';
import { getError, EmptyState } from '../../configs'; // Removed specific header configs as they are not used here directly
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { PaginationListingComponent } from "../../../../shared/components/pagination-listing/components/pagination-listing/pagination-listing.component";

@Component({
  selector: 'app-all-therapeutic-programs',
  standalone: true,
  imports: [
    CommonModule,
    TherapeuticProgramCardComponent,
    TherapeuticProgramCardShimmerComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    AutoExactHeightDirective,
    PaginationListingComponent
  ],
  templateUrl: './all-therapeutic-programs.component.html',
  styleUrls: ['./all-therapeutic-programs.component.scss']
})
export class AllTherapeuticProgramsComponent implements OnInit, OnDestroy, OnChanges {
  // --- Injected Dependencies ---
  protected readonly _programsFacade = inject(TherapeuticProgramsFacade);
  private readonly _destroy$ = new Subject<void>();

  // --- Input Properties ---
  @Input() type!: string;
  // --- Component Properties ---
  protected cardType = CardType;
  protected readonly emptyState = EmptyState;

  // Error states for all and my programs, based on the facade
  protected readonly allProgramsErrorState = getError(() => this._programsFacade.fetchAllTherapeuticPrograms());
  protected readonly myProgramsErrorState = getError(() => this._programsFacade.fetchMyTherapeuticPrograms());

  // Local pagination state
  private readonly _currentPage = signal<number>(1);
  private readonly _itemsPerPage = signal<number>(6); // 6 for explore, 4 for my programs

  // Local pagination configuration that works with stored data
  readonly paginationConfig = computed<PaginationConfig>(() => {
    const allData = this.programsList || [];
    const totalItems = allData.length;
    const itemsPerPage = 6
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      currentPage: this._currentPage(),
      totalPages: totalPages,
      onPageChange: (page: number) => this.handleLocalPageChange(page)
    };
  });

  // Get paginated data for current page
  readonly paginatedPrograms = computed(() => {
    const allData = this.programsList || [];
    const currentPage = this._currentPage();
    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return allData.slice(startIndex, endIndex);
  });


  ngOnInit(): void {
    // Fetch data based on the 'type' input
    if (this.type === 'exploreTherapyPrograms') {
      this._programsFacade.fetchAllTherapeuticPrograms();
    } else {
      this._programsFacade.fetchMyTherapeuticPrograms();
    }

    // Reset to first page when component initializes
    this._currentPage.set(1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reset to first page when type changes
    if (changes['type'] && !changes['type'].firstChange) {
      this._currentPage.set(1);
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Handles local page changes without API calls.
   * @param page The new page number.
   */
  handleLocalPageChange(page: number): void {
    Logger.debug(`AllTherapeuticProgramsComponent: Local page change to ${page}`);
    this._currentPage.set(page);

    // Scroll to top when page changes
    this.scrollToTop();
  }

  private scrollToTop(): void {
    // Scroll to the top of the container
    const containerElement = document.querySelector('.all-therapeutic-programs');
    if (containerElement) {
      containerElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Helper to determine which programs list to use based on type
  get programsList() {
    return this.type === 'exploreTherapyPrograms'
      ? this._programsFacade.allPrograms()?.data
      : this._programsFacade.myPrograms()?.data;
  }

  // Helper to determine the loading state
  get isLoading() {
    return this.type === 'exploreTherapyPrograms'
      ? this._programsFacade.isLoadingAllPrograms() || this._programsFacade.isFilteringAllPrograms()
      : this._programsFacade.isLoadingMyPrograms() || this._programsFacade.isFilteringMyPrograms();
  }

  // Helper to determine if there's an error
  get hasError() {
    return this.type === 'exploreTherapyPrograms'
      ? this._programsFacade.allProgramsErrorMessage()
      : this._programsFacade.myProgramsErrorMessage();
  }
  // Helper to determine status
  get status() {
    return this.type === 'exploreTherapyPrograms'
      ? this._programsFacade.allProgramsStatus()
      : this._programsFacade.myProgramsStatus();
  }
  // Helper to determine the error state config
  get errorStateConfig() {
    return this.type === 'exploreTherapyPrograms'
      ? this.allProgramsErrorState
      : this.myProgramsErrorState;
  }
}