import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../../../common/core/directives'; // تأكد من المسار الصحيح
import { DeletePopupComponent, LocalizationService, ModalService, SvgIconComponent } from '../../../../shared';
import { StatusInfoComponent } from '../../../payments/components/status-info/status-info.component';
import { ChatHistoryFacade } from '../../services';
import { ChatEventsService } from '../../services/chat-events.service';
import { Logger } from '../../../../common';
import { KhawiikRenameComponent } from '../khawiik-rename';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-chat-menu',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, TranslateModule, SvgIconComponent, FormsModule],
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.scss']
})
export class ChatMenuComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input() chatItem: any;
  @Input() actionIconName!: string;
  @Output() deleteAction: EventEmitter<any> = new EventEmitter();
  @Output() titleUpdated: EventEmitter<any> = new EventEmitter();
  @Output() editRequested: EventEmitter<any> = new EventEmitter();

  private localization = inject(LocalizationService);
  private modalService = inject(ModalService);
  openMenu: boolean = false;

  private platformId = inject(PLATFORM_ID);
  currentLanguage!: string;

  // Title editing functionality - simplified since editing happens in parent

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = this.localization.getCurrentLanguage();
    }
  }


  toggleMenu(): void {
    this.openMenu = !this.openMenu;
  }

  private chatHistoryFacade = inject(ChatHistoryFacade);
  private chatEvents = inject(ChatEventsService);

  deleteChat(): void {
    this.modalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: 'confirm_delete_conversation',
        data: {
          item: { storeSuccess: false },
          statusLabels: {
            errorTitle: 'delete_conversation_confirmation',
            errorSubTitle: 'confirm_delete_action_irreversible'
          }
        },
        confirmMode: true,
        onConfirmFn: async () => {
          if (!this.chatItem?.id) return false;
          try {
            const deletedId = Number(this.chatItem.id);
            await this.chatHistoryFacade.deleteChat(deletedId).toPromise();
            // Emit deletion only after successful delete so UI resets on success
            this.chatEvents.emitChatDeleted({ id: deletedId });
            return true;
          } catch {
            return false;
          }
        }
      },
      outputs: {
        confirmed: () => {
          if (!this.chatItem?.id) return;
          // Deletion is already executed in onConfirmFn; just emit UI event for parent and close
          this.deleteAction.emit(this.chatItem);
          this.openMenu = false;
        },
        closed: () => {
          this.openMenu = false;
        }
      },
      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem',
    })
  }

  // Title editing methods
  startEditingTitle(): void {
    this.openMenu = false; // Close the menu when starting to edit

    // Open the rename modal
    this.modalService.open(KhawiikRenameComponent, {
      inputs: {
        image: 'images/icons/logo-2.png',
        title: 'conversation_name',
        chatItem: this.chatItem
      },
      outputs: {
        closed: () => {
          Logger.debug('KhawiikRenameComponent | Modal closed');
        },
        titleUpdated: (updatedChat: any) => {
          Logger.debug('KhawiikRenameComponent | Title updated:', updatedChat);
          this.titleUpdated.emit(updatedChat);
        }
      },
      width: '25vw',
      minHeight: 'auto',
      maxHeight: '80vh',
      onCloseClick: () => {
        Logger.debug('KhawiikRenameComponent | Modal closed via close button');
      }
    });
  }


}
