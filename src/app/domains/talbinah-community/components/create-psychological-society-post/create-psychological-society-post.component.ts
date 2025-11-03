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
  OnDestroy,
  WritableSignal,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';

import { PostClassificationComponent } from '../post-classification';
import { ITab } from '../../models';
import { EmojiPickerComponent } from '../../../../shared/components/emoji-picker/emoji-picker.component';
import { AutoExactHeightDirective, ClickOutsideDirective } from '../../../../common/core/directives';
import { ApiError, handleApiErrorsMessage, Logger, NavigationIntent, NavigationService } from '../../../../common';
import { ICreatePostRequestDto, ICreatePostResponseDto, IPost, IUserIdentifyProfileData } from '../../dtos';
import { ImageViewComponent, ToastService, VideoViewComponent } from '../../../../shared';
import { catchError, finalize, take, tap } from 'rxjs';
import { TalbinahCommunityApiClient, TalbinahCommunityApiClientProvider } from '../../clients';
import { UserIdentityStore } from '../../routes/user-identity.service';
import { CreatePostButtonComponent } from '../create-post-button';
import { CreateReelsComponent } from '../create-reels';
import { RefreshUserPostsService } from '../../services';
import { Router } from '@angular/router';
import { MainPageRoutesEnum } from '../../../main-page';
import { TalbinahCommunityRoutesEnum } from '../../constants';
import { TranslationsFacade } from '../../../../common/core/translations/services';

export interface ButtonConfig {
  id: string; // Unique identifier for the button
  text: string;
  imageSrc: string; // Default image source
  activeImageSrc: string; // Image source when active
  action?: (id: string) => void; // Optional action to perform on click
}

@Component({
  selector: 'app-create-psychological-society-post',
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
    CreatePostButtonComponent,
    CreateReelsComponent,

  ],
  templateUrl: './create-psychological-society-post.component.html',
  styleUrls: ['./create-psychological-society-post.component.scss']
})
export class CreatePsychologicalSocietyPostComponent implements OnInit, OnDestroy {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }

  buttonConfigs: ButtonConfig[] = [
    {
      id: 'post',
      text: 'status',
      imageSrc: 'images/community/create/messages.svg', // Ensure these paths are correct
      activeImageSrc: 'images/community/create/messages-active.svg',
      action: (id: string) => this.performButtonAction(id)
    },
    {
      id: 'reels',
      text: 'talbinahCommunity.reels',
      imageSrc: 'images/community/create/video-add.svg',
      activeImageSrc: 'images/community/create/video-add-active.svg',
      action: (id: string) => this.performButtonAction(id)
    }
  ];

  // --- Dependency Injections ---
  private readonly _ToastService = inject(ToastService);
  private readonly postApi = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly fb = inject(FormBuilder);
  protected readonly _TalbinahCommunityApiClient = inject(TalbinahCommunityApiClient);
  protected readonly userIdentityStore = inject(UserIdentityStore);
  private readonly _RefreshUserPostsService = inject(RefreshUserPostsService);
  private readonly _Router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly nav = inject(NavigationService);

  private itemToEdit: IPost | null = null;
  @Input() selectedTabId = signal<number | null>(null);

  // --- Component Inputs and Outputs ---
  @Output() closed = new EventEmitter<ICreatePostResponseDto | void>();
  @Input() data?: { interests?: ITab[], itemToEdit?: any, userIdentityProfileData?: IUserIdentifyProfileData | null };
  @Input() fromMainPage: boolean = false;
  // --- Reactive Form Group ---
  postForm!: FormGroup;

  // --- Component State Signals ---
  readonly tabs = signal<ITab[]>([]);
  readonly showEmojiPicker = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly submittedPostData = signal<ICreatePostRequestDto | null>(null);
  readonly submissionError = signal<ApiError | null>(null);

  // New signals for media handling
  readonly isAddMediaOpen = signal<boolean>(false); // Controls the active state for the button styling
  readonly selectedFiles = signal<File[]>([]); // Stores selected File objects
  readonly imagePreviews = signal<string[]>([]); // Stores URLs for image/video previews

  // --- Single Select State ---
  @Input() selectedButtonId: string = 'post';

  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; // Reference to the hidden file input

  // --- Helper Getters for Form Controls and Validation ---
  get contentControl(): AbstractControl | null {
    return this.postForm.get('content');
  }

  get interestIdControl(): AbstractControl | null {
    return this.postForm.get('interest_id');
  }

  get validationError(): string | null {
    if (this.contentControl?.invalid && (this.contentControl.dirty || this.contentControl.touched)) {
      if (this.contentControl.errors?.['required']) {
        return 'must_write_status_first';
      }
    }
    return null;
  }

  readonly isPostValid = signal(false);
  private published = false;
  readonly shouldEnableAutoHeight = signal(false);

  // --- Constructor and Lifecycle Hooks ---
  constructor() {
    this.initializeForm();
    this.setupPostSubmissionEffect();
    this.setupFormStatusEffect();
    this.setupMediaPreviewsEffect();
    this.setupInterestIdSyncEffect(); // Add this new effect

  }

  ngOnInit(): void {
    Logger.debug('Create Psychological Society Post Component Initialized', {
      data: this.data
    });

    this.itemToEdit = this.data?.itemToEdit || null;
    // Normalize fromMainPage flag if passed inside data
    if (this.data && (this.data as any).fromMainPage === true) {
      this.fromMainPage = true;
    }

    if (this.data?.interests?.length) {
      const filteredTabs = this.data.interests.filter(tab => tab.id !== null);
      this.tabs.set(filteredTabs);
    }

    if (this.itemToEdit) {
      this.patchFormForEdit();
    }

    // Check screen size and enable auto-height only for desktop
    if (this.isBrowser) {
      this.shouldEnableAutoHeight.set(window.innerWidth >= 768);
    }
  }

  ngOnDestroy(): void {
    // If opened from main page, user closed without publishing, and running in browser => clear body overflow
    if (this.fromMainPage && !this.published && this.isBrowser) {
      document.body.style.overflowY = '';
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
      this.postForm.markAsPristine();
      this.postForm.markAsUntouched();
      Logger.debug('Form patched for editing:', this.itemToEdit);
    }
  }

  // --- Form Initialization ---
  private initializeForm(): void {
    this.postForm = this.fb.group({
      content: ['', [Validators.required]], // Only required validation
      interest_id: [null],
    });
  }

  // Effect to update isPostValid based on form status
  private setupFormStatusEffect(): void {
    effect(() => {
      this.postForm.valueChanges.subscribe(() => {
        this.isPostValid.set(this.postForm.valid);
      });
      this.postForm.statusChanges.subscribe(() => {
        this.isPostValid.set(this.postForm.valid);
      });
      this.isPostValid.set(this.postForm.valid);
    }, { allowSignalWrites: true });
  }

  // --- Media Handling ---

  /**
   * Triggers the hidden file input click event.
   */
  protected addMedia(): void {
    this.isAddMediaOpen.set(!this.isAddMediaOpen());
    this.fileInput.nativeElement.click();
  }

  /**
   * Handles file selection from the input.
   * @param event The change event from the file input.
   */
  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles: File[] = [];
      const MAX_FILE_SIZE_MB = 5;
      const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 5 MB in bytes

      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];

        // --- NEW: Check if the file is an image ---
        if (!file.type.startsWith('image/')) {
          this._ToastService.add({
            severity: 'error',
            summary: 'Invalid File Type',
            detail: `File "${file.name}" is not an image. Only image files are allowed.`,
            life: 5000,
          });
          Logger.warn(`File "${file.name}" ignored due to invalid type: ${file.type}`);
          continue; // Skip this file
        }
        // --- END NEW ---

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
    }
  }

  /**
   * Effect to generate image/video previews whenever selectedFiles changes.
   */
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

      // Clean up old object URLs when previews change.
      // This is a simplified cleanup. For incremental additions,
      // a more advanced strategy to track and revoke only old, unused URLs
      // would be needed to prevent memory leaks over long sessions.
    }, { allowSignalWrites: true });
  }

  /**
   * Determines if a file at a given index is an image.
   * @param index The index of the file in the selectedFiles array.
   */
  protected isFileImage(index: number): boolean {
    const file = this.selectedFiles()[index];
    return file ? file.type.startsWith('image/') : false;
  }

  /**
   * Determines if a file at a given index is a video.
   * @param index The index of the file in the selectedFiles array.
   */
  protected isFileVideo(index: number): boolean {
    const file = this.selectedFiles()[index];
    // This method is still here, but the onFileSelected will prevent videos from being added.
    // If you explicitly want to disallow video previews in the template as well,
    // you might consider removing or adjusting where this is used.
    return file ? file.type.startsWith('video/') : false;
  }

  /**
   * Removes a selected file and its preview.
   * @param index The index of the file to remove.
   */
  protected removeFile(index: number): void {
    this.selectedFiles.update(currentFiles => {
      const removedFile = currentFiles[index];
      if (removedFile) {
        URL.revokeObjectURL(this.imagePreviews()[index]);
        Logger.debug('Revoked Object URL:', this.imagePreviews()[index]);
      }
      return currentFiles.filter((_, i) => i !== index);
    });
    Logger.debug(`File at index ${index} removed. Remaining files:`, this.selectedFiles());
  }

  private setupInterestIdSyncEffect(): void {
    effect(() => {
      // Subscribe to value changes of the interestIdControl
      this.interestIdControl?.valueChanges.subscribe(value => {
        // If the value is an object (ITab), use its id, otherwise use the value directly
        const newSelectedId = value?.id !== undefined ? value.id : value;
        if (this.selectedTabId() !== newSelectedId) {
          this.selectedTabId.set(newSelectedId);
          Logger.debug('selectedTabId updated from form control:', newSelectedId);
        }
      });
    }, { allowSignalWrites: true }); // Allow writing to selectedTabId signal
  }
  // --- Event Handlers ---
  protected onTabSelected(tab: ITab): void {
    this.interestIdControl?.setValue(tab);
    // The effect (setupInterestIdSyncEffect) will now pick up this change
    // and update this.selectedTabId signal, which is then passed to the TabSwitcherComponent.
    this.interestIdControl?.markAsDirty();
    this.interestIdControl?.markAsTouched();
    Logger.debug('Tab selected:', tab);
  }


  protected onCancel(): void {
    this.postForm.reset({
      content: '',
      interest_id: null,
    });
    this.selectedFiles.set([]);
    this.imagePreviews.set([]);
    this.submissionError.set(null);
    this.isLoading.set(false);
    this.submittedPostData.set(null);
    this.closed.emit();
    Logger.debug('Post creation cancelled. Form and media cleared.');
  }

  protected onSubmit(): void {
    this.postForm.markAllAsTouched(); // Mark all controls as touched to trigger validation messages

    if (this.postForm.invalid) {
      Logger.debug('Post form is invalid:', this.postForm.errors);
      return; // Prevent submission if form is invalid
    }

    const payload: ICreatePostRequestDto = {
      content: this.contentControl?.value.trim()
    };

    if (this.interestIdControl?.value?.id) {
      payload.interest_id = this.interestIdControl?.value?.id;
    }

    Logger.debug('Prepared Post Data for submission:', payload);
    this.userIdentityStore.fetch();
    this._RefreshUserPostsService.triggerRefresh();

    this.submissionError.set(null);
    this.submittedPostData.set(payload);
  }

  protected onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    let value = textarea.value;

    // Remove leading spaces
    if (value.startsWith(' ')) {
      value = value.trimStart();
      textarea.value = value;
      // Set cursor position to the beginning
      textarea.setSelectionRange(0, 0);
    }

    this.contentControl?.setValue(value, { emitEvent: false });
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

  // --- Internal Logic for API Interaction (via Effect) ---
  private setupPostSubmissionEffect(): void {
    effect(() => {
      const postData = this.submittedPostData();

      if (!postData) {
        return;
      }

      this.isLoading.set(true);
      const postRequest$ = this.itemToEdit?.id
        ? this.postApi.updatePost(postData, this.itemToEdit.id)
        : this.postApi.createPost(postData);

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
            summary: 'an_error_has_occurred',
            detail: error?.message || 'Unknown error occurred during post creation.',
            life: 5000,
          });
        }
      });
    }, { allowSignalWrites: true });
  }

  protected handlePostSubmissionSuccess(response: ICreatePostResponseDto): void {
    Logger.debug('Handle Post Submission Success called', response);
    if (response.status) {
      this.published = true;
      // this._ToastService.add({
      //   severity: 'success',
      //   summary: 'general.success',
      //   detail: response.message || 'Post created successfully!',
      //   life: 3000,
      // });
      this.closed.emit(response);
      this.postForm.reset({
        content: '',
        interest_id: null,
      });
      this.selectedFiles.set([]);
      this.imagePreviews.set([]);
      Logger.debug('Form reset and media cleared after successful submission.');
      this.closed.emit();
      // Redirect to community if invoked from main page
      if (this.fromMainPage) {
        // Defer navigation to allow parent to close the popup via closed.emit()
        setTimeout(() => {
          this.nav.navigate(NavigationIntent.INTERNAL, TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE);
        }, 100);
      }
    } else {
      this.submissionError.set({ message: response.message || 'Submission failed unexpectedly.', timestamp: new Date().toISOString() });
      this._ToastService.add({
        severity: 'error',
        summary: 'an_error_has_occurred',
        detail: response.message || 'Post could not be created.',
        life: 5000,
      });
    }
  }




  // Method to handle selection
  protected handleSelect(buttonId: string): void {
    this.selectedButtonId = buttonId
    Logger.debug(`Single selected: ${this.selectedButtonId}`);
  }
  // Example action that can be passed to the button
  protected performButtonAction(id: string): void {
    Logger.debug(`Action performed for button: ${id}`);
    // You can implement specific logic here based on the button ID
  }
}
