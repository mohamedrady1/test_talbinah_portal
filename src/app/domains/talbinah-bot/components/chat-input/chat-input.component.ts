import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
  WritableSignal,
  Output,
  EventEmitter,
  Signal,
  effect
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { Logger } from '../../../../common'; // Assuming this path
import { ConversationFacade } from '../../services/conversation.facade'; // Adjust path if necessary
import { IChatMessageDataDto } from '../../dtos';
// import { response } from 'express'; // This import is likely not needed for frontend Angular component


// Define a type for a file entry to show in the UI
interface ISelectedFile {
  name: string;
  size: number; // in bytes
}

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule, // Import FormsModule for ngModel
    // AutoFocusDirective // Assuming this directive is available and correctly imported
  ],
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimized for performance with signals
})
export class ChatInputComponent {
  // --- Dependencies ---
  private readonly _ConversationFacade: ConversationFacade = inject(ConversationFacade);
  readonly isMessageSending: Signal<boolean> = this._ConversationFacade.isMessageSending;
  readonly messageError: Signal<string | null> = this._ConversationFacade.messageErrorMessage;
  readonly lastBotResponse: Signal<IChatMessageDataDto | null> = this._ConversationFacade.lastBotResponse;
  readonly lastBotStatus: Signal<boolean> = this._ConversationFacade.lastBotStatus;

  @Output() messageSentLocally = new EventEmitter<any>(); // EventEmitter to send the local message data

  // --- Component State (Signals) ---
  readonly message: WritableSignal<string> = signal<string>('');
  readonly selectedFiles: WritableSignal<ISelectedFile[]> = signal<ISelectedFile[]>([]);

  // --- Constructor and Effects ---
  constructor() {
    // Effect to react to changes in the message sending status and bot response
    effect(() => {
      const isSending = this.isMessageSending();
      const error = this.messageError();
      const response = this.lastBotResponse();
      const status = this.lastBotStatus(); // Get the status of the last message operation

      // Log when message sending starts
      if (isSending) {
        Logger.debug('ChatInputComponent: Message sending initiated...');
      }

      // Log when message sending completes (not in pending state)
      if (!isSending) {
        if (status === true && response) { // Check if status is explicitly true and there's a response
          Logger.debug('ChatInputComponent: Message sent successfully!', {
            status: status,
            response: response
          });
          // You might want to display a success toast or clear input fields here,
          // though input fields are already cleared in sendMessage.
        } else if (status === false && error) { // Check for explicit false status and an error
          Logger.error('ChatInputComponent: Message sending failed!', {
            status: status,
            error: error
          });
          // You might display an error toast here
        } else if (response === null && error === null) {
          // This case might hit if the state is reset or initial,
          // or if a send attempt was made but no clear success/fail state yet.
          // You might choose to log this or ignore based on desired verbosity.
          Logger.debug('ChatInputComponent: Message sending completed, but no explicit success/error response yet, or state reset.');
        }
      }
    });

    // Optional: Log changes in message content for debugging
    // effect(() => {
    //    Logger.debug('ChatInputComponent: Message input changed:', this.message());
    // });

    // Optional: Log changes in selected files for debugging
    // effect(() => {
    //    Logger.debug('ChatInputComponent: Selected files changed:', this.selectedFiles().map(f => f.name));
    // });
  }

  // --- Event Handlers ---
  protected sendMessage(event: Event): void {
    event.preventDefault();

    const content: string = this.message().trim();

    Logger.debug(`Attempting to send message: "${content}" with ${this.selectedFiles().length} files.`);

    if (content || this.selectedFiles().length > 0) {
      const userMessageForDisplay: IChatMessageDataDto = {
        message: content,
        replay: null,
        list: null,
        message_timestamp: new Date().toISOString(),
        replay_timestamp: null,
        isDraft: true
      };

      this._ConversationFacade.addLocalMessageToConversation(userMessageForDisplay);

      this._ConversationFacade.sendMessage(content);

      this.message.set('');
      this.clearFiles();
    } else {
      Logger.warn('Attempted to send an empty message with no files. Action ignored.');
    }
  }

  protected updateMessage(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    if (inputElement) {
      this.message.set(inputElement.value);
    } else {
      Logger.error('Input event target is null or not an HTMLInputElement.');
    }
  }

  protected onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const filesArray: ISelectedFile[] = Array.from(inputElement.files).map(file => ({
        name: file.name,
        size: file.size
      }));
      this.selectedFiles.set(filesArray);
      Logger.debug('Files selected:', this.selectedFiles());
    } else {
      this.selectedFiles.set([]); // Clear if no files or input is invalid
      Logger.debug('No files selected or input invalid, clearing selected files.');
    }
  }
  protected clearFiles(): void {
    this.selectedFiles.set([]);
    // To visually reset the file input field (important for re-selecting same file)
    const fileInput = document.getElementById('chat-input__file-upload') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = '';
      Logger.debug('File input visually reset.');
    }
    Logger.debug('Selected files cleared.');
  }

  /**
   * Determines if the send button and input field should be disabled.
   * Disabled if:
   * - Message is currently sending (isMessageSending is true)
   * - There's no message content and no files selected
   */
  protected isSendDisabled(): boolean {
    return this.isMessageSending() || (!this.message().trim() && this.selectedFiles().length === 0);
  }
}