import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Output,
  PLATFORM_ID,
  signal
} from '@angular/core';

import { ErrorStateCardComponent, PaginationListingComponent, EmptyStateCardComponent, LocalSearchComponent, SvgIconComponent, ModalService } from '../../../../shared';
import { technicalSupportChatsEmptyConfig, technicalSupportChatsErrorConfig, VisitsReportsListFacade } from '../../../settings';
import { AutoExactHeightDirective, Logger } from '../../../../common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


import { TechnicalSupportChatsListSkeletonComponent } from '../technical-support-chats-list-skeleton';
import { TechnicalSupportChatCardComponent } from "../technical-support-chat-card";
import { IUserData, UserContextService } from '../../../authentication';
import { TechnicalSupportChatsFacade } from '../../services';
import { SupportOptionsComponent } from '../support-options';
import { ITechnicalSupportChatDto } from '../../dtos';

@Component({
  selector: 'app-technical-support-chats-list',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,

    AutoExactHeightDirective,

    TechnicalSupportChatsListSkeletonComponent,
    TechnicalSupportChatCardComponent,
    PaginationListingComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    LocalSearchComponent,
    SvgIconComponent
  ],
  templateUrl: './technical-support-chats-list.component.html',
  styleUrls: ['./technical-support-chats-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalSupportChatsListComponent {
  @Output() closed = new EventEmitter<void>();

  private readonly _UserContextService = inject(UserContextService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _modalService = inject(ModalService);

  // --- Injected Facade ---
  protected readonly _ChatsFacade = inject(TechnicalSupportChatsFacade);
  protected readonly _VisitsReportsListFacade = inject(VisitsReportsListFacade);

  // --- Exposed Facade State ---
  readonly chats = this._ChatsFacade.chats;
  readonly isLoading = this._ChatsFacade.isLoading;
  readonly errorMessage = this._ChatsFacade.errorMessage;

  technicalSupportChatsEmptyState = technicalSupportChatsEmptyConfig;
  protected readonly technicalSupportChatsErrorState = technicalSupportChatsErrorConfig(() =>
    this._VisitsReportsListFacade.fetchVisitsReports()
  );

  // --- Local State ---
  protected readonly searchTerm = signal('');
  protected readonly currentPage = signal(1);
  protected readonly itemsPerPage = 6;

  // ✅ Store isSupport in a signal
  protected readonly isSupport = signal(false);

  // --- Computed filtered data ---
  protected readonly filteredChats = computed(() => {
    const searchValue = this.searchTerm().toLowerCase().trim();
    const data: ITechnicalSupportChatDto[] = this.chats();

    if (!searchValue) return data;

    return data.filter(chat => {
      const id = chat?.id?.toString() || '';
      const department = chat?.department_id?.title || '';
      const user = chat?.user_id?.full_name || '';
      const lastMessage = chat?.user_id?.full_name || '';

      return (
        id.toLowerCase().includes(searchValue) ||
        department.toLowerCase().includes(searchValue) ||
        user.toLowerCase().includes(searchValue) ||
        lastMessage.toLowerCase().includes(searchValue)
      );
    });
  });

  // --- Computed pagination ---
  protected readonly totalPages = computed(() => {
    const totalItems = this.filteredChats().length;
    return Math.max(1, Math.ceil(totalItems / this.itemsPerPage));
  });

  protected readonly pagedChats = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredChats().slice(start, start + this.itemsPerPage);
  });

  protected readonly localPaginationConfig = computed(() => ({
    currentPage: this.currentPage(),
    totalPages: this.totalPages(),
    onPageChange: (page: number) => this.currentPage.set(page)
  }));

  constructor() {
    effect(() => {
      console.log('support-chats searchTerm:', this.searchTerm());
      console.log('support-chats currentPage:', this.currentPage());
      console.log('support-chats totalPages:', this.totalPages());
      console.log('support-chats pagedChats:', this.pagedChats().length);
      console.log('support-chats isSupport:', this.isSupport());
    });
  }

  ngOnInit(): void {
    Logger.debug('TechnicalSupportChatsListComponent | User Data: ', this.getStoredUser());
    const isSupportFlag = this.getStoredUser()?.user?.is_support ?? false;

    // ✅ Set the signal
    this.isSupport.set(isSupportFlag);

    // ✅ Pass to facade
    this._ChatsFacade.fetchChats(isSupportFlag);
    // this.openSupportOptionsModal();
  }

  protected handleClearSearch(): void {
    this.searchTerm.set('');
    this.currentPage.set(1);
  }

  protected handleSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  private getStoredUser(): IUserData | null {
    if (!isPlatformBrowser(this._platformId)) return null;
    try {
      return this._UserContextService.user() ?? null;
    } catch {
      return null;
    }
  }

  protected openSupportOptionsModal(): void {
    this._modalService.open(SupportOptionsComponent, {

      inputs: {
        image: 'images/settings/modal-icons/support-icon.jpg',
        title: 'support',
        subtitle: 'faq_intro',
        data: {}
      },
      outputs: {
        closed: () => {
          console.log('The model is closed');
          this.closed.emit();
        }
      },
      width: "40%"
    });
  }
}

