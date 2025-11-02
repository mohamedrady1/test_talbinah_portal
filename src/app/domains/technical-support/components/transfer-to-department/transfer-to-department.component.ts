import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {
  PaginationListingComponent,
  ErrorStateCardComponent,
  EmptyStateCardComponent,
  LocalSearchComponent,
  SelectionOptionComponent,
  ISelectionOptionConfig
} from '../../../../shared';

import {
  VisitsReportsListFacade,
  visitReportsEmptyConfig,
  visitReportsErrorConfig
} from '../../../settings';

import {
  AssignToDepartmentFacade,
  ITechnicalSupportDepartmentDto,
  TechnicalSupportDepartmentsFacade
} from '../../services';

import { AppointmentCardSkeletonComponent } from '../../../appointments';
import { AutoExactHeightDirective, Logger } from '../../../../common';
import { ITechnicalSupportChatDto } from '../../dtos';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-transfer-to-department',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,

    AutoExactHeightDirective,

    AppointmentCardSkeletonComponent,
    PaginationListingComponent,
    SelectionOptionComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    LocalSearchComponent,
  ],
  templateUrl: './transfer-to-department.component.html',
  styleUrls: ['./transfer-to-department.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferToDepartmentComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input({ required: true }) data: { chatItem: ITechnicalSupportChatDto | null, isSupport?: boolean } = { chatItem: null };
  @Output() closed = new EventEmitter<{ isRequestSuccessed?: boolean } | void>();

  // --- Facades ---
  protected readonly _TechnicalSupportDepartmentsFacade = inject(TechnicalSupportDepartmentsFacade);
  protected readonly _AssignToDepartmentFacade = inject(AssignToDepartmentFacade);
  protected readonly _VisitsReportsListFacade = inject(VisitsReportsListFacade);

  visitReportsEmptyState = visitReportsEmptyConfig;
  protected readonly visitReportsErrorState = visitReportsErrorConfig(() =>
    this._VisitsReportsListFacade.fetchVisitsReports()
  );

  // --- Facade States ---
  readonly departments = this._TechnicalSupportDepartmentsFacade.departments;
  readonly isLoading = this._TechnicalSupportDepartmentsFacade.isLoading;
  readonly errorMessage = this._TechnicalSupportDepartmentsFacade.errorMessage;

  // --- Local States ---
  protected readonly searchTerm = signal('');
  protected readonly currentPage = signal(1);
  protected readonly itemsPerPage = 6;
  protected readonly selectedOption = signal<ISelectionOptionConfig | null>(null);

  // --- Computed ---
  protected readonly filteredDepartments = computed(() => {
    const searchValue = this.searchTerm().toLowerCase().trim();
    const data: ITechnicalSupportDepartmentDto[] = this.departments();

    if (!searchValue) return data;
    return data.filter((departmentItem) => {
      const id = departmentItem?.id?.toString() || '';
      const department = departmentItem?.title || '';
      return (
        id.toLowerCase().includes(searchValue) ||
        department.toLowerCase().includes(searchValue)
      );
    });
  });

  protected readonly totalPages = computed(() => {
    const totalItems = this.filteredDepartments().length;
    return Math.max(1, Math.ceil(totalItems / this.itemsPerPage));
  });

  protected readonly pageDepartments = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredDepartments().slice(start, start + this.itemsPerPage);
  });

  protected readonly localPaginationConfig = computed(() => ({
    currentPage: this.currentPage(),
    totalPages: this.totalPages(),
    onPageChange: (page: number) => this.currentPage.set(page),
  }));

  constructor() {
    // ✅ Close modal when assignment completes
    effect(() => {
      if (!this._AssignToDepartmentFacade.loading() && this._AssignToDepartmentFacade.response()) {
        setTimeout(() => {
          this.closed.emit({ isRequestSuccessed: true });
        }, 0);
      }
    });

    // ✅ Auto-select current department if it exists in chatItem
    effect(() => {
      const departments = this.departments();
      const currentDeptId = this.data.chatItem?.department_id?.id;

      if (departments?.length && currentDeptId) {
        const matched = departments.find(d => d.id === currentDeptId);
        if (matched) {
          this.selectedOption.set({
            id: matched.id,
            name: matched.title,
            subtitle: '#' + matched.id,
            image: 'images/icons/logo-2.png',
            selected: true
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this._TechnicalSupportDepartmentsFacade.fetchDepartments();
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
      this._AssignToDepartmentFacade.assign(conversationId, Number(selected.id), this.data?.isSupport);
    }
  }

  ngOnDestroy(): void {
    this._AssignToDepartmentFacade.reset();
  }
}
