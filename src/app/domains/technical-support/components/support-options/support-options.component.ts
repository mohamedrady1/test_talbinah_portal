import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  effect,
  EffectRef,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Facades
import {
  ITechnicalSupportDepartmentDto,
  TechnicalSupportDepartmentsFacade,
  CreateTechnicalSupportConversationFacade
} from '../../services';
import { TechnicalSupportConversationComponent } from '../technical-support-conversation';
import { ModalService } from '../../../../shared';
import { Logger } from '../../../../common';
import { ITechnicalSupportChatDto } from '../../dtos';

@Component({
  selector: 'app-support-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support-options.component.html',
  styleUrls: ['./support-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportOptionsComponent implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter<{ chatItem: ITechnicalSupportChatDto | null } | void>();
  private readonly _modalService = inject(ModalService);

  // Inject facades
  private readonly departmentsFacade = inject(TechnicalSupportDepartmentsFacade);
  private readonly _CreateTechnicalSupportConversationFacade = inject(CreateTechnicalSupportConversationFacade);

  // Department state
  protected readonly departments = this.departmentsFacade.departments;
  protected readonly isLoadingDepartments = this.departmentsFacade.isLoading;
  protected readonly errorDepartments = this.departmentsFacade.errorMessage;

  // Conversation state
  protected readonly isLoadingCreateConversation = this._CreateTechnicalSupportConversationFacade.isLoading;
  protected readonly errorCreateConversation = this._CreateTechnicalSupportConversationFacade.errorMessage;
  protected readonly activeCreateConversation = this._CreateTechnicalSupportConversationFacade.conversation;

  // Selected option
  readonly selectedOption = signal<ITechnicalSupportDepartmentDto | null>(null);

  // Combined loading state → overlay shimmer
  protected readonly isLoading = computed(
    () => this.isLoadingDepartments() || this.isLoadingCreateConversation()
  );

  // Combined error state
  protected readonly errorMessage = computed(
    () => this.errorDepartments() || this.errorCreateConversation()
  );

  private effectCleanup: EffectRef | null = null;

  constructor() {
    this.effectCleanup = effect(() => {
      Logger.debug('SupportOptionsComponent | ', {
        isLoadingCreateConversation: this.isLoadingCreateConversation(),
        activeCreateConversation: this.activeCreateConversation()
      });
      if (!this.isLoadingCreateConversation() && this.activeCreateConversation()) {
        setTimeout(() => {
          this.openSupportConversationModal();
          this.closed.emit({ chatItem: this.activeCreateConversation() });
        }, 0);
      }
    });
  }

  ngOnInit(): void {
    this.departmentsFacade.fetchDepartments();
  }

  protected onSelect(option: ITechnicalSupportDepartmentDto): void {
    this.selectedOption.set(option);
    this._CreateTechnicalSupportConversationFacade.createNewConversationToDepartmentId(option.id);
  }

  private openSupportConversationModal(): void {
    this._modalService.open(TechnicalSupportConversationComponent, {
      inputs: {
        image: 'images/settings/modal-icons/support-icon.jpg',
        title: 'support',
        subtitle: 'faq_intro',
        data: {
          chatItem: this.activeCreateConversation()
        }
      },
      outputs: {
        closed: () => {
          console.log('The model is closed');
        }
      },
      width: "60%"
    });
  }

  ngOnDestroy(): void {
    if (this.effectCleanup) {
      this.effectCleanup.destroy();
      this.effectCleanup = null;
    }
    this._CreateTechnicalSupportConversationFacade.resetState();
    this.closed.complete();
    this.closed.unsubscribe();
  }
}
