import {
  Component,
  Input,
  Output,
  signal,
  EventEmitter,
  ViewChild,
  ElementRef,
  inject,
  effect,
  OnInit, // Import OnInit
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient and HttpHeaders
import { Observable } from 'rxjs'; // Ensure Observable is imported

import { PostClassificationComponent } from '../post-classification';
import { ITab } from '../../models';
import { EmojiPickerComponent } from '../../../../shared/components/emoji-picker/emoji-picker.component';
import { AutoExactHeightDirective, ClickOutsideDirective } from '../../../../common/core/directives';
import { ApiError, handleApiErrorsMessage, Logger } from '../../../../common';
// Extend ICreatePostRequestDto to include files for the local payload
interface ICreatePostRequestDtoWithFiles extends ICreatePostRequestDto {
  files?: File[];
}
import { ICreatePostRequestDto, ICreatePostResponseDto, IPost, IUserIdentifyProfileData } from '../../dtos';
import { ImageViewComponent, ToastService, VideoViewComponent } from '../../../../shared';
import { finalize, take } from 'rxjs';
import { TalbinahCommunityApiClient, TalbinahCommunityApiClientProvider } from '../../clients';
import { UserIdentityStore } from '../../routes/user-identity.service';

@Component({
  selector: 'app-create-reels', // Change selector if it was different
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PostClassificationComponent,
    EmojiPickerComponent,
    ClickOutsideDirective,
    ReactiveFormsModule,
    AutoExactHeightDirective,
    ImageViewComponent,
    VideoViewComponent,
  ],
  templateUrl: './create-reels.component.html', // Point to the new HTML file
  styleUrls: ['./create-reels.component.scss'] // You can reuse the styles or create a new one
})
export class CreateReelsComponent implements OnInit {
  // --- Dependency Injections ---
  private readonly _ToastService = inject(ToastService);
  // private readonly postApi = inject(TalbinahCommunityApiClientProvider).getClient(); // This will be bypassed for direct http calls with sendData
  private readonly fb = inject(FormBuilder);
  protected readonly _TalbinahCommunityApiClient = inject(TalbinahCommunityApiClient);
  protected readonly userIdentityStore = inject(UserIdentityStore);
  private readonly http = inject(HttpClient); // Inject HttpClient for making direct requests

  private itemToEdit: IPost | null = null;
  @Input() selectedTabId = signal<number | null>(null);

  // --- Component Inputs and Outputs ---
  @Output() closed = new EventEmitter<ICreatePostResponseDto | void>();
  @Input() data?: { interests?: ITab[], itemToEdit?: any, userIdentityProfileData?: IUserIdentifyProfileData | null };

  // --- Reactive Form Group ---
  reelsForm!: FormGroup;

  // --- Component State Signals ---
  readonly tabs = signal<ITab[]>([]);
  readonly showEmojiPicker = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  // Update the signal type to include 'files'
  readonly submittedPostData = signal<ICreatePostRequestDtoWithFiles | null>(null);
  readonly submissionError = signal<ApiError | null>(null);

  // New signals for media handling
  readonly isAddMediaOpen = signal<boolean>(false);
  readonly selectedFiles = signal<File[]>([]);
  readonly imagePreviews = signal<string[]>([]);
  readonly showFilesRequiredError = signal<boolean>(false); // New signal for attachment error

  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // --- Helper Getters for Form Controls and Validation ---
  get contentControl(): AbstractControl | null {
    return this.reelsForm.get('content');
  }

  get interestIdControl(): AbstractControl | null {
    return this.reelsForm.get('interest_id');
  }

  get validationError(): string | null {
    if (this.contentControl?.invalid && (this.contentControl.dirty || this.contentControl.touched)) {
      // The 'required' check is no longer relevant if it's not a required validator
      if (this.contentControl.errors?.['minlength']) {
        return 'talbinahCommunity.textArea.minLength';
      }
    }
    return null;
  }

  readonly isPostValid = signal(false);

  // --- Constructor and Lifecycle Hooks ---
  constructor() {
    this.initializeForm();
    this.setupPostSubmissionEffect();
    this.setupFormStatusEffect();
    this.setupMediaPreviewsEffect();
    this.setupInterestIdSyncEffect();
  }

  ngOnInit(): void {
    Logger.debug('Create Reels Component Initialized', {
      data: this.data
    });

    this.itemToEdit = this.data?.itemToEdit || null;

    if (this.data?.interests?.length) {
      const filteredTabs = this.data.interests.filter(tab => tab.id !== null);
      this.tabs.set(filteredTabs);
    }

    if (this.itemToEdit) {
      this.patchFormForEdit();
    }
  }

  // --- Patch form for editing existing post ---
  private patchFormForEdit(): void {
    if (this.itemToEdit) {
      this.contentControl?.setValue(this.itemToEdit.content);
      if (this.itemToEdit.interest && this.itemToEdit.interest.id != null) {
        this.interestIdControl?.setValue(this.itemToEdit.interest.id);
        this.selectedTabId.set(this.itemToEdit.interest.id);
      }
      this.reelsForm.markAsPristine();
      this.reelsForm.markAsUntouched();
      Logger.debug('Form patched for editing:', this.itemToEdit);
    }
  }

  // --- Form Initialization ---
  private initializeForm(): void {
    this.reelsForm = this.fb.group({
      // Removed Validators.required from 'content'
      content: ['', [Validators.minLength(5)]],
      interest_id: [null],
      // Add a new form control for files, and use a custom validator
      files: [[], this.filesRequiredValidator()]
    });
  }

  // New custom validator for files
  private filesRequiredValidator() {
    return (control: AbstractControl) => {
      const files = control.value as File[];
      return files && files.length > 0 ? null : { filesRequired: true };
    };
  }

  // Effect to update isPostValid based on form status
  private setupFormStatusEffect(): void {
    effect(() => {
      // Re-evaluate form validity when reelsForm.valueChanges emits
      this.reelsForm.valueChanges.subscribe(() => {
        this.isPostValid.set(this.reelsForm.valid && this.selectedFiles().length > 0);
        // Hide the error message if files are now selected
        if (this.selectedFiles().length > 0) {
          this.showFilesRequiredError.set(false);
        }
      });
      // Re-evaluate form validity when reelsForm.statusChanges emits
      this.reelsForm.statusChanges.subscribe(() => {
        this.isPostValid.set(this.reelsForm.valid && this.selectedFiles().length > 0);
        // Hide the error message if files are now selected
        if (this.selectedFiles().length > 0) {
          this.showFilesRequiredError.set(false);
        }
      });
      // Initial check for form validity
      this.isPostValid.set(this.reelsForm.valid && this.selectedFiles().length > 0);
    }, { allowSignalWrites: true });
  }


  // --- Media Handling ---
  protected addMedia(): void {
    this.isAddMediaOpen.set(!this.isAddMediaOpen());
    this.fileInput.nativeElement.click();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles: File[] = [];
      const MAX_FILE_SIZE_MB = 5;
      const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 5 MB in bytes

      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        if (file.size > MAX_FILE_SIZE_BYTES) {
          this._ToastService.add({
            severity: 'error',
            summary: 'File Too Large',
            detail: `File "${file.name}" is too large. Max size is ${MAX_FILE_SIZE_MB} MB.`,
            life: 5000,
          });
          Logger.warn(`File "${file.name}" ignored due to size: ${file.size} bytes`);
        } else {
          newFiles.push(file);
        }
      }

      if (newFiles.length > 0) {
        this.selectedFiles.update(currentFiles => [...currentFiles, ...newFiles]);
        Logger.debug('Files selected:', this.selectedFiles());
      }
      input.value = ''; // Clear the input so the same file can be selected again
      // Update the 'files' form control and mark it as touched/dirty
      this.reelsForm.get('files')?.setValue(this.selectedFiles());
      this.reelsForm.get('files')?.markAsDirty();
      this.reelsForm.get('files')?.markAsTouched();
      // Hide the error message once files are selected
      this.showFilesRequiredError.set(false);
    }
  }

  private setupMediaPreviewsEffect(): void {
    effect(() => {
      const files = this.selectedFiles();
      const newPreviews: string[] = [];
      files.forEach(file => {
        const url = URL.createObjectURL(file);
        newPreviews.push(url);
      });
      this.imagePreviews.set(newPreviews);
      Logger.debug('Generated media previews:', this.imagePreviews());
    }, { allowSignalWrites: true });
  }

  protected isFileImage(index: number): boolean {
    const file = this.selectedFiles()[index];
    return file ? file.type.startsWith('image/') : false;
  }

  protected isFileVideo(index: number): boolean {
    const file = this.selectedFiles()[index];
    return file ? file.type.startsWith('video/') : false;
  }

  protected removeFile(index: number): void {
    this.selectedFiles.update(currentFiles => {
      const removedFile = currentFiles[index];
      if (removedFile) {
        URL.revokeObjectURL(this.imagePreviews()[index]);
        Logger.debug('Revoked Object URL:', this.imagePreviews()[index]);
      }
      const updatedFiles = currentFiles.filter((_, i) => i !== index);
      // Update the 'files' form control after removal
      this.reelsForm.get('files')?.setValue(updatedFiles);
      this.reelsForm.get('files')?.markAsDirty();
      this.reelsForm.get('files')?.markAsTouched();
      return updatedFiles;
    });
    Logger.debug(`File at index ${index} removed. Remaining files:`, this.selectedFiles());
  }

  private setupInterestIdSyncEffect(): void {
    effect(() => {
      this.interestIdControl?.valueChanges.subscribe(value => {
        const newSelectedId = value?.id !== undefined ? value.id : value;
        if (this.selectedTabId() !== newSelectedId) {
          this.selectedTabId.set(newSelectedId);
          Logger.debug('selectedTabId updated from form control:', newSelectedId);
        }
      });
    }, { allowSignalWrites: true });
  }

  // --- Event Handlers ---
  protected onTabSelected(tab: ITab): void {
    this.interestIdControl?.setValue(tab);
    this.interestIdControl?.markAsDirty();
    this.interestIdControl?.markAsTouched();
    Logger.debug('Tab selected:', tab);
  }

  protected onCancel(): void {
    this.reelsForm.reset({
      content: '',
      interest_id: null,
      files: [] // Reset the files control as well
    });
    this.selectedFiles.set([]);
    this.imagePreviews.set([]);
    this.submissionError.set(null);
    this.isLoading.set(false);
    this.submittedPostData.set(null);
    this.showFilesRequiredError.set(false); // Hide error on cancel
    this.closed.emit();
    Logger.debug('Post creation cancelled. Form and media cleared.');
  }

  /**
   * Handles the submission of the reel form.
   * Validates the form and prepares the payload for submission,
   * including content, interest ID, and selected files.
   */
  protected onSubmit(): void {
    this.reelsForm.markAllAsTouched();

    // Manually mark the 'files' control as touched to trigger validation
    this.reelsForm.get('files')?.markAsTouched();

    if (this.reelsForm.invalid) {
      Logger.debug('Post form is invalid:', this.reelsForm.errors);
      // Check specifically for the 'filesRequired' error
      if (this.reelsForm.get('files')?.hasError('filesRequired')) {
        this.showFilesRequiredError.set(true);
      }
      return;
    }

    // Ensure files are selected before proceeding with submission
    if (this.selectedFiles().length === 0) {
      this.showFilesRequiredError.set(true);
      return;
    }

    // Prepare the complete payload including files
    const payload: ICreatePostRequestDtoWithFiles = {
      content: this.contentControl?.value.trim()
    };

    if (this.interestIdControl?.value?.id) {
      payload.interest_id = this.interestIdControl?.value?.id;
    }

    // Add selected files to the payload, to be processed by sendData
    payload.files = this.selectedFiles();

    Logger.debug('Prepared Post Data for submission:', payload);
    this.userIdentityStore.fetch();
    this.submissionError.set(null);
    this.submittedPostData.set(payload); // This will trigger the effect
  }

  protected onInput(event: Event): void {
    this.contentControl?.setValue((event.target as HTMLTextAreaElement).value, { emitEvent: false });
    this.contentControl?.markAsDirty();
    this.contentControl?.markAsTouched();
  }

  protected toggleEmojiPicker(): void {
    this.showEmojiPicker.set(!this.showEmojiPicker());
    Logger.debug('Emoji picker toggled:', this.showEmojiPicker());
  }

  protected onEmojiPicked(emojiChar: string): void {
    const textarea = this.textareaRef.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = this.contentControl?.value || '';

    const updatedValue =
      currentValue.substring(0, start) +
      emojiChar +
      currentValue.substring(end);

    this.contentControl?.setValue(updatedValue);
    this.contentControl?.markAsDirty();

    setTimeout(() => {
      textarea.focus();
      const caretPos = start + emojiChar.length;
      textarea.setSelectionRange(caretPos, caretPos);
    });

    this.showEmojiPicker.set(false);
    Logger.debug('Emoji picked:', emojiChar);
  }

  /**
   * Sends data to the specified URL using HTTP POST.
   * Can send data as 'application/json' or 'multipart/form-data'.
   * @param url The API endpoint URL.
   * @param data The data payload to send.
   * @param asFormData Whether to send the data as FormData (default is false, sends as JSON).
   * @returns An Observable of the HTTP response.
   */
  sendData(
    url: string,
    data: Record<string, any>,
    asFormData: boolean = false
  ): Observable<any> {
    if (asFormData) {
      const formData = this.convertToFormData(data);
      // Angular's HttpClient automatically sets the 'Content-Type' header with the proper boundary for FormData
      return this.http.post(url, formData);
    } else {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post(url, data, { headers });
    }
  }

  /**
   * Converts a plain JavaScript object into a FormData object.
   * This is useful for sending files and other complex data types as 'multipart/form-data'.
   * Handles arrays of values and File objects specifically.
   * @param data The object to convert.
   * @returns A FormData object.
   */
  private convertToFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // If the value is an array, append each item individually.
        // For files, this will append each File object.
        // For other arrays, it will append them like 'key[0]', 'key[1]' etc.
        value.forEach((v, i) => formData.append(`${key}[${i}]`, v));
      } else if (value instanceof File || typeof value !== 'object' || value === null) {
        // If the value is a File, a primitive (string, number, boolean), or null, append it directly.
        // Null values are converted to the string "null".
        formData.append(key, value);
      } else {
        // If the value is another type of object (e.g., a nested object), stringify it to JSON.
        // This is important if your API expects nested JSON within FormData.
        formData.append(key, JSON.stringify(value));
      }
    });
    return formData;
  }

  // --- Internal Logic for API Interaction (via Effect) ---
  /**
   * Sets up an effect to react to changes in `submittedPostData` signal.
   * Triggers API call for creating or updating a post using `sendData` method.
   */
  private setupPostSubmissionEffect(): void {
    effect(() => {
      const postData = this.submittedPostData(); // This now contains content, interest_id, and files

      if (!postData) {
        return;
      }

      this.isLoading.set(true);

      // Extract the form fields that need to be sent as part of the FormData
      // The 'files' array will be handled by convertToFormData directly.
      const dataToSend: Record<string, any> = {
        content: postData.content,
      };

      if (postData.interest_id !== undefined) {
        dataToSend['interest_id'] = postData.interest_id;
      }

      // Add the files array to dataToSend. convertToFormData will pick this up
      // and append each file with correct 'files[i]' keys.
      if (postData.files && postData.files.length > 0) {
        dataToSend['files'] = postData.files;
      }

      let postRequest$: Observable<any>;
      let apiUrl: string;

      // Define your API endpoints. Adjust these URLs to match your backend.
      // For example, if your API base is 'http://localhost:3000/api', then:
      const CREATE_POST_ENDPOINT = '/posts'; // Assuming this is relative to your API base URL
      const UPDATE_POST_ENDPOINT = `/posts/${this.itemToEdit?.id}`; // Assuming '/posts/:id'

      if (this.itemToEdit?.id) {
        // If editing an existing item, use the update endpoint
        apiUrl = UPDATE_POST_ENDPOINT;
        // Use sendData with asFormData: true for updating (typically PATCH or PUT, but using POST as per sendData method signature)
        postRequest$ = this.sendData(apiUrl, dataToSend, true);
      } else {
        // If creating a new item, use the create endpoint
        apiUrl = CREATE_POST_ENDPOINT;
        // Use sendData with asFormData: true for creating
        postRequest$ = this.sendData(apiUrl, dataToSend, true);
      }

      Logger.debug(`Attempting to send data to ${apiUrl} as FormData. Payload:`, dataToSend);

      postRequest$.pipe(
        take(1),
        finalize(() => this.isLoading.set(false))
      ).subscribe({
        next: (res: ICreatePostResponseDto) => {
          this.handlePostSubmissionSuccess(res);
        },
        error: (error: ApiError) => {
          this.submissionError.set(error);
          Logger.warn('Post submission failed', error);
          handleApiErrorsMessage(error);
          this._ToastService.add({
            severity: 'error',
            summary: 'general.error',
            detail: error?.message || 'Unknown error occurred during post creation.',
            life: 5000,
          });
        }
      });
    }, { allowSignalWrites: true });
  }

  protected handlePostSubmissionSuccess(response: ICreatePostResponseDto): void {
    Logger.debug('Handle Post Submission Success called', response);
    // NEW: Log the full response object
    Logger.info('reel submission successful. Response data:', response);

    if (response.status) {
      // this._ToastService.add({
      //   severity: 'success',
      //   summary: 'general.success',
      //   detail: response.message || 'Post created successfully!',
      //   life: 3000,
      // });
      this.closed.emit(response);
      this.reelsForm.reset({
        content: '',
        interest_id: null,
        files: [] // Reset the files control as well
      });
      this.selectedFiles.set([]);
      this.imagePreviews.set([]);
      this.showFilesRequiredError.set(false); // Hide error on success
      Logger.debug('Form reset and media cleared after successful submission.');
    } else {
      this.submissionError.set({ message: response.message || 'Submission failed unexpectedly.', timestamp: new Date().toISOString() });
      this._ToastService.add({
        severity: 'error',
        summary: 'general.error',
        detail: response.message || 'Post could not be created.',
        life: 5000,
      });
    }
  }
}
