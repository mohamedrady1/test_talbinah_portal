import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { AutoExactHeightDirective, FirestoreService, IGlobalUserContactInfoModel, Logger } from '../../../../common';
import { PaginationListingComponent, SelectionOptionComponent, ErrorStateCardComponent, EmptyStateCardComponent, LocalSearchComponent, ISelectionOptionConfig } from '../../../../shared';
import { AppointmentCardSkeletonComponent } from '../../../appointments';
import { VisitsReportsListFacade, visitReportsEmptyConfig, visitReportsErrorConfig } from '../../../settings';
import { ITechnicalSupportChatDto } from '../../dtos';
import { CustomersSupportFacade, AssignToCustomerSupportFacade } from '../../services';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-assign-to-customer-support',
  standalone: true,
  imports: [
    CommonModule,

    AutoExactHeightDirective,

    AppointmentCardSkeletonComponent,
    PaginationListingComponent,
    SelectionOptionComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    LocalSearchComponent,
  ],
  templateUrl: './assign-to-customer-support.component.html',
  styleUrls: ['./assign-to-customer-support.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignToCustomerSupportComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input({ required: true }) data: { chatItem: ITechnicalSupportChatDto | null, isSupport?: boolean } = { chatItem: null };
  @Output() closed = new EventEmitter<{ isRequestSuccessed?: boolean } | void>();

  // --- Facades ---
  protected readonly _CustomersSupportFacade = inject(CustomersSupportFacade);
  protected readonly _AssignToCustomerSupportFacade = inject(AssignToCustomerSupportFacade);
  protected readonly _VisitsReportsListFacade = inject(VisitsReportsListFacade);



  visitReportsEmptyState = visitReportsEmptyConfig;
  protected readonly visitReportsErrorState = visitReportsErrorConfig(() =>
    this._VisitsReportsListFacade.fetchVisitsReports()
  );

  // --- Facade States ---
  readonly customersSupport = this._CustomersSupportFacade.customersSupport;
  readonly isLoading = this._CustomersSupportFacade.isLoading;
  readonly errorMessage = this._CustomersSupportFacade.errorMessage;

  // --- Local States ---
  protected readonly searchTerm = signal('');
  protected readonly currentPage = signal(1);
  protected readonly itemsPerPage = 6;
  protected readonly selectedOption = signal<ISelectionOptionConfig | null>(null);

  // --- Computed ---
  protected readonly filteredCustomersSupport = computed(() => {
    const searchValue = this.searchTerm().toLowerCase().trim();
    const data: IGlobalUserContactInfoModel[] = this.customersSupport();

    if (!searchValue) return data;
    return data.filter((departmentItem) => {
      const id = departmentItem?.id?.toString() || '';
      const department = departmentItem?.full_name || '';
      return (
        id.toLowerCase().includes(searchValue) ||
        department.toLowerCase().includes(searchValue)
      );
    });
  });

  protected readonly totalPages = computed(() => {
    const totalItems = this.filteredCustomersSupport().length;
    return Math.max(1, Math.ceil(totalItems / this.itemsPerPage));
  });

  protected readonly pageCustomersSupport = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredCustomersSupport().slice(start, start + this.itemsPerPage);
  });

  protected readonly localPaginationConfig = computed(() => ({
    currentPage: this.currentPage(),
    totalPages: this.totalPages(),
    onPageChange: (page: number) => this.currentPage.set(page),
  }));

  private readonly _firestoreService = inject(FirestoreService);

  constructor() {
    effect(() => {
      if (!this._AssignToCustomerSupportFacade.loading() && this._AssignToCustomerSupportFacade.response()) {
        setTimeout(() => {
          this.closed.emit({ isRequestSuccessed: true });
        }, 0);
      }
    });

    // ✅ Auto-select if chat already has a customer_support_user_id
    effect(() => {
      const supports = this.customersSupport();
      const currentAssignedId = this.data.chatItem?.customer_support_user_id?.id;

      if (supports?.length && currentAssignedId) {
        const matched = supports.find(s => s.id === currentAssignedId);
        if (matched) {
          this.selectedOption.set({
            id: matched.id,
            name: matched.full_name,
            subtitle: '#' + matched.id,
            image: 'images/icons/logo-2.png',
            selected: true
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this._CustomersSupportFacade.fetchCustomersSupport();
    Logger.debug('TransferToDepartmentComponent | chatItem: ', this.data.chatItem);
  }

  protected handleClearSearch(): void {
    this.searchTerm.set('');
    this.currentPage.set(1);
  }

  protected handleSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  protected onCancel(): void {
    this.closed.emit();
  }

  protected onOptionSelected(event: ISelectionOptionConfig): void {
    Logger.debug('Option Selected: ', event);
    this.selectedOption.set(event);
  }

  protected assignNow(): void {
    const selected = this.selectedOption();
    const conversationId = this.data?.chatItem?.id;
    if (selected?.id && conversationId) {
      Logger.debug('Assigning to department: ', selected);
      this._AssignToCustomerSupportFacade.assign(conversationId, Number(selected.id), this.data?.isSupport);
    }
  }

  ngOnDestroy(): void {
    this._AssignToCustomerSupportFacade.reset();
  }
}
