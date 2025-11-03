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
  OnInit,
  OnChanges, // Import OnChanges for input property changes
  SimpleChanges, // Import SimpleChanges
  computed,
  ChangeDetectorRef
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

import { PostClassificationComponent } from '../post-classification'; // Assuming this is not directly used in this component's template, but might be indirectly.
import { ITab } from '../../models'; // Assuming ITab is used for interests mapping
import { EmojiPickerComponent } from '../../../../shared/components/emoji-picker/emoji-picker.component';
import { ClickOutsideDirective } from '../../../../common/core/directives';
import { ApiError, handleApiErrorsMessage, Logger } from '../../../../common';
import { IEmoijsListingResponseDto, IEmojiItem, IUpdateUserIdentifyProfileRequestDto, IPostInterest, IPostsInterestsListingResponseDto, IUserIdentifyProfileData, TalbinahCommunityApiClientProvider, IUpdateUserIdentifyProfileResponseDto } from '../../../../domains';
import { ToastService } from '../../../../shared';
import { finalize, take, catchError, EMPTY, tap } from 'rxjs';
import { TranslationsFacade } from '../../../../common/core/translations/services';

interface PostInterestsListState {
  interestsResponse: IPostsInterestsListingResponseDto | null;
  isLoading: boolean;
  errorMessage: string;
}

interface EmojiListState {
  emojisResponse: IEmoijsListingResponseDto | null;
  isLoading: boolean;
  errorMessage: string;
}

@Component({
  selector: 'app-update-psychological-society',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, EmojiPickerComponent, ClickOutsideDirective], // Ensure all used components/directives are imported
  templateUrl: './update-psychological-society.component.html',
  styleUrls: ['./update-psychological-society.component.scss']
})
export class UpdatePsychologicalSocietyComponent implements OnInit, OnChanges {
  @Output() closed = new EventEmitter<IUpdateUserIdentifyProfileResponseDto | void>();

  @Input() data?: { interests?: ITab[], userIdentityProfileData?: IUserIdentifyProfileData | null };

  private readonly _PostsApiClientProvider = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly cdr = inject(ChangeDetectorRef); // Still useful for manual change detection if needed, though signals reduce its necessity.
  private readonly _ToastService = inject(ToastService);
  private readonly fb: FormBuilder = inject(FormBuilder); // Inject FormBuilder
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  private postInterestsState = signal<PostInterestsListState>({
    interestsResponse: null,
    isLoading: false,
    errorMessage: ''
  });

  private emojisState = signal<EmojiListState>({
    emojisResponse: null,
    isLoading: false,
    errorMessage: ''
  });

  readonly interestsList = computed(() => this.postInterestsState().interestsResponse?.data || []);
  readonly isLoadingInterests = computed(() => this.postInterestsState().isLoading);
  readonly errorMessageInterests = computed(() => this.postInterestsState().errorMessage);

  readonly emojisList = computed(() => this.emojisState().emojisResponse?.data || []);
  readonly isLoadingEmojis = computed(() => this.emojisState().isLoading);
  readonly errorMessageEmojis = computed(() => this.emojisState().errorMessage);

  // Reactive Form Group
  formGroup: FormGroup; // Initialized in constructor

  // Form-related error signals (for direct control over error messages)
  protected emojiError = signal(false);
  protected interestsError = signal(false);

  // Signals for form values and submission state
  protected selectedEmoji = signal<IEmojiItem | null>(null);
  private _selectedInterests = signal<IPostInterest[]>([]);
  protected selectedInterests = computed(() => this._selectedInterests());

  readonly isLoadingSubmit = signal<boolean>(false);
  readonly submitRequest = signal<IUpdateUserIdentifyProfileRequestDto | null>(null);
  readonly submitError = signal<ApiError | null>(null);

  constructor() {
    this.formGroup = this.fb.group({
      defaultName: ['', Validators.required]
    });

    // Setup effects in constructor
    this.setupSubmitEffect();
    this.setupDataPatchingEffect(); // New effect for patching data
  }

  ngOnInit(): void {
    Logger.debug('Update Identity => userIdentityProfileData (onInit): ', this.data?.userIdentityProfileData);

    // Fetch initial data
    this.fetchPostsInterests();
    this.fetchEmojis();

    // No need to subscribe to valueChanges for defaultName just to mark as touched.
    // Reactive Forms handle touched state more automatically with template interactions.
  }

  // OnChanges is crucial for reacting to changes in @Input properties
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      Logger.debug('Update Identity => userIdentityProfileData (onChanges): ', this.data?.userIdentityProfileData);
      // The `setupDataPatchingEffect` will handle patching when data and lists are ready.
    }
  }

  /**
   * Effect to patch form controls and select emojis/interests when
   * userIdentityProfileData and fetched lists are available.
   */
  private setupDataPatchingEffect(): void {
    effect(() => {
      const userData = this.data?.userIdentityProfileData;
      const emojis = this.emojisList();
      const interests = this.interestsList();

      // Only proceed if user data is available and both lists are loaded and not empty
      if (userData && !this.isLoadingEmojis() && emojis.length > 0 && !this.isLoadingInterests() && interests.length > 0) {
        Logger.debug('Patching form with user data:', userData);

        // Patch defaultName
        if (userData.dummy_name) {
          this.formGroup.get('defaultName')?.setValue(userData.dummy_name);
        }

        // Select Emoji
        if (userData.emoji?.id) {
          const matchedEmoji = emojis.find(e => e.id === userData.emoji?.id);
          if (matchedEmoji) {
            this.selectedEmoji.set(matchedEmoji);
            this.emojiError.set(false); // Clear error if emoji is found
          } else {
            Logger.warn(`Emoji with ID ${userData.emoji.id} not found in fetched list.`);
          }
        }

        // Select Interests
        if (userData.interests && userData.interests.length > 0) {
          const matchedInterests: IPostInterest[] = [];
          userData.interests.forEach(userInterest => {
            const foundInterest = interests.find(i => i.id === userInterest.id);
            if (foundInterest) {
              matchedInterests.push(foundInterest);
            } else {
              Logger.warn(`Interest with ID ${userInterest.id} not found in fetched list.`);
            }
          });
          this._selectedInterests.set(matchedInterests);
          this.interestsError.set(false); // Clear error if interests are found
        }

        // Mark controls as touched/dirty after patching if you want immediate validation feedback
        // this.formGroup.markAllAsTouched();
        // this.formGroup.markAsDirty();
      }
    }); // Allow signal writes within the effect
  }


  protected selectEmoji(emoji: IEmojiItem): void {
    this.selectedEmoji.set(emoji);
    this.emojiError.set(false);
  }

  protected toggleInterest(interest: IPostInterest): void {
    const current = this._selectedInterests();
    const index = current.findIndex((i) => i.id === interest.id);
    if (index === -1) {
      this._selectedInterests.set([...current, interest]);
    } else {
      this._selectedInterests.set(current.filter((i) => i.id !== interest.id));
    }

    // Update interestsError based on current selection
    this.interestsError.set(this._selectedInterests().length === 0);
  }

  protected isInterestSelected(interest: IPostInterest): boolean {
    return this._selectedInterests().some((i) => i.id === interest.id);
  }

  protected onSubmit(): void {
    const isFormValid = this.formGroup.valid;
    const isEmojiSelected = !!this.selectedEmoji();
    const hasInterests = this._selectedInterests().length > 0;

    // Manually set error signals for non-formGroup controlled elements
    this.emojiError.set(!isEmojiSelected);
    this.interestsError.set(!hasInterests);

    if (!isFormValid || !isEmojiSelected || !hasInterests) {
      this.formGroup.markAllAsTouched(); // Mark form controls as touched to show their errors
      Logger.debug('Form submission blocked due to validation errors.');
      return;
    }

    // Clear previous submission errors
    this.submitError.set(null);

    const idsArray: number[] = this._selectedInterests().map(interest => interest.id);
    // The API might expect a JSON string or an array of numbers directly.
    // If it expects a string like "{1,2}", use: `const formattedInterestIds = `{${idsArray.join(',')}}`;`
    // If it expects a JSON string like "[1,2]", use: `const formattedInterestIds = JSON.stringify(idsArray);`
    // If it expects an array of numbers, just pass `idsArray`.
    // For this DTO, assuming it expects `string` for `interest_id` that represents an array.
    const formattedInterestIds = JSON.stringify(idsArray); // Example: "[1,2,3]"

    const formData: IUpdateUserIdentifyProfileRequestDto = {
      dummy_name: this.formGroup.value.defaultName,
      emoji_id: this.selectedEmoji()?.id || null, // Ensure it's null if not selected
      interest_id: formattedInterestIds // Assign the formatted string
    };

    Logger.debug('Prepared Identity Form Data:', formData);
    this.submitRequest.set(formData); // Trigger the effect
  }

  private setupSubmitEffect(): void {
    effect(() => {
      const request = this.submitRequest();
      if (!request) {
        return;
      }
      this.isLoadingSubmit.set(true);
      this._PostsApiClientProvider.updateIdentity(request)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoadingSubmit.set(false);
            this.submitRequest.set(null); // Clear the request to prevent re-triggering
          })
        )
        .subscribe({
          next: (response: IUpdateUserIdentifyProfileResponseDto) => {
            Logger.debug('Identity creation/update successful:', response);
            // this._ToastService.add({
            //   severity: 'success',
            //   summary: 'general.success',
            //   detail: response.message || 'Identity updated successfully!',
            //   life: 3000,
            // });
            this.closed.emit(response); // Close the modal on success
          },
          error: (error: ApiError) => {
            Logger.error('Identity creation/update failed:', error);
            this.submitError.set(error);
            handleApiErrorsMessage(error);
            this._ToastService.add({
              severity: 'error',
              summary: 'an_error_has_occurred',
              detail: error?.message || 'Failed to update identity',
              life: 5000,
            });
          }
        });
    });
  }

  private fetchPostsInterests(): void {
    // Logger.debug('Initiating post Interests fetch...');
    this.updatePostInterestsState({ isLoading: true, errorMessage: '' });
    this._PostsApiClientProvider.getPostInterests()
      .pipe(
        tap((response: IPostsInterestsListingResponseDto) => this.processPostInterestsResponse(response)),
        catchError((error: ApiError) => {
          this.handleFetchPostInterestsError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizePostInterestsFetch())
      )
      .subscribe();
  }

  private processPostInterestsResponse(response: IPostsInterestsListingResponseDto): void {
    if (response && response.data && response.data.length > 0) {
      this.updatePostInterestsState({
        interestsResponse: response,
        errorMessage: ''
      });
      // Logger.debug('Post Interests fetched successfully:', response);
    } else {
      this.updatePostInterestsState({ interestsResponse: null, errorMessage: '📭 No post Interests found.' });
    }
    this.cdr.detectChanges(); // Trigger change detection if needed for non-signal updates
  }

  private handleFetchPostInterestsError(error: ApiError): void {
    Logger.error('Error fetching post Interests:', error);
    handleApiErrorsMessage(error);
    this.updatePostInterestsState({ errorMessage: '🚨 Error loading post Interests. Please try again later.' });
    this.cdr.markForCheck();
  }

  private finalizePostInterestsFetch(): void {
    this.updatePostInterestsState({ isLoading: false });
    this.cdr.markForCheck();
  }

  private updatePostInterestsState(updates: Partial<PostInterestsListState>): void {
    this.postInterestsState.update(state => ({ ...state, ...updates }));
  }

  private fetchEmojis(): void {
    Logger.debug('Initiating emojis fetch...');
    this.updateEmojisState({ isLoading: true, errorMessage: '' });
    this._PostsApiClientProvider.getEmojis()
      .pipe(
        tap((response: IEmoijsListingResponseDto) => this.processEmojisResponse(response)),
        catchError((error: ApiError) => {
          this.handleFetchEmojisError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizeEmojisFetch())
      )
      .subscribe();
  }

  private processEmojisResponse(response: IEmoijsListingResponseDto): void {
    if (response && response.data && response.data.length > 0) {
      this.updateEmojisState({
        emojisResponse: response,
        errorMessage: ''
      });
      Logger.debug('Emojis fetched successfully:', response);
    } else {
      this.updateEmojisState({ emojisResponse: null, errorMessage: '📭 No emojis found.' });
    }
    this.cdr.detectChanges();
  }

  private handleFetchEmojisError(error: ApiError): void {
    Logger.error('Error fetching emojis:', error);
    handleApiErrorsMessage(error);
    this.updateEmojisState({ errorMessage: '🚨 Error loading emojis. Please try again later.' });
    this.cdr.markForCheck();
  }

  private finalizeEmojisFetch(): void {
    this.updateEmojisState({ isLoading: false });
    this.cdr.markForCheck();
  }

  private updateEmojisState(updates: Partial<EmojiListState>): void {
    this.emojisState.update(state => ({ ...state, ...updates }));
  }

  // No custom onCancel, using the one provided in the template

  protected onCancel(): void {
    this.closed.emit();
  }
}
