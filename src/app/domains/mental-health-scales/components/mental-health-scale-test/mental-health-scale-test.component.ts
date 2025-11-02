import { TranslateApiPipe } from './../../../../common/core/translations/pipes/translate-api.pipe';
import { IMentalHealthAnswerDto, IMentalHealthQuestionDto, IMentalHealthReportItemDto, IMentalHealthScaleListItemDto, RoleGuardService, UserContextService } from '../../../../domains';
import { CreateMentalHealthScaleFacade } from '../../../../domains/mental-health-scales/services/create-mental-health-scale.facade';
import { ChangeDetectionStrategy, Component, computed, effect, inject, Input, Output, EventEmitter, PLATFORM_ID, signal } from '@angular/core';
import { MentalHealthScaleTestResultComponent } from '../mental-health-scale-test-result';
import { MentalHealthScaleStartTestComponent } from '../mental-health-scale-start-test';
import { LocalizationService, EmptyStateCardComponent, StorageKeys } from '../../../../shared';
import { AutoExactHeightDirective, Logger, ReservationModel, StorageService } from '../../../../common';
import { FirestoreService } from '../../../../common/core/services/firestore.service';
import { ReservationHomeworkFacade } from '../../../appointments/services/reservation-homework.facade';
import { CommonModule } from '@angular/common';
import { MentalHealthScaleEmptyState } from '../../configs/empty-state.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mental-health-scale-test',
  standalone: true,
  imports: [CommonModule, TranslateApiPipe, MentalHealthScaleStartTestComponent, MentalHealthScaleTestResultComponent, AutoExactHeightDirective, EmptyStateCardComponent],
  templateUrl: './mental-health-scale-test.component.html',
  styleUrls: ['./mental-health-scale-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentalHealthScaleTestComponent {
  private readonly localization = inject(LocalizationService);

  // SSR-safe browser check
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _Router = inject(Router);

  // ----- Auth / Guest Computed -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  protected readonly isLoggedIn = computed(() => !!this.token());

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  // --- Inputs ---
  @Input() data?: { item: IMentalHealthScaleListItemDto, isView?: boolean, messageRef?: any, message?: any, review?: number, reservationModel?: ReservationModel | null, assignment_id?: number, mentalHealthResult?: number }; // Input data containing test details and view mode
  @Input() isFinished = signal(false); // Indicates if the test is finished
  @Input() reservationModel?: ReservationModel | null;

  // --- Outputs ---
  @Output() closed = new EventEmitter<void>();

  // Inject the new CreateMentalHealthScaleFacade for storing created tests
  protected readonly _CreateMentalHealthScaleFacade = inject(CreateMentalHealthScaleFacade);
  private readonly firestoreService = inject(FirestoreService);
  private readonly reservationHomeworkFacade = inject(ReservationHomeworkFacade);
  currentLang = this.localization.getCurrentLanguage(); // Current language for localization
  today = new Date(); // Current date

  // Empty state configuration
  emptyStateConfig = MentalHealthScaleEmptyState;

  // Loading state for empty state button
  protected isProcessingEmptyState = signal<boolean>(false);

  // Empty state button action
  protected onEmptyStateAction(): void {
    let hasApiCalls = false;
    if (this.data?.message && this.data?.message.isMessageOpened !== '1') {
      this.reservationHomeworkFacade.reviewHomework(this.data?.message.homeworkId);
      this.firestoreService.markChatMeetingMessageAsOpened(this.reservationModel!, this.data?.message.id);
    }
    try {
      // Check if we need to mark message as opened
      if (this.data?.messageRef?.id && this.reservationModel && this.data.messageRef.isMessageOpened !== '1') {
        hasApiCalls = true;
        Logger.debug('Marking message as opened:', { messageId: this.data.messageRef.id, reservation: this.reservationModel });
        this.firestoreService.markChatMeetingMessageAsOpened(this.reservationModel, this.data.messageRef.id);
        try {
          // Persist result on the message document
          this.firestoreService.updateMessageCustomFields(this.reservationModel, this.data?.messageRef.id, {
            mentalHealthResult: { isNotEmpty: true, score: this.totalScore() }
          });
        } catch { }
      } else {
        Logger.warn('Cannot mark message as opened - missing messageId or reservationModel:', {
          messageRef: this.data?.messageRef,
          reservationModel: this.reservationModel
        });
      }

      // Check if we need to review homework
      const assignmentId = Number(this.data?.messageRef?.homeworkId);
      if (!Number.isNaN(assignmentId) && assignmentId > 0 && this.data?.messageRef?.isMessageOpened !== '1') {
        hasApiCalls = true;
        this.reservationHomeworkFacade.reviewHomework(assignmentId);
      }

      // Only show loading if there are actual API calls
      if (hasApiCalls) {
        this.isProcessingEmptyState.set(true);

        // Simulate processing time for API calls
        setTimeout(() => {
          this.closed.emit();
          this.isProcessingEmptyState.set(false);
        }, 1000);
      } else {
        // No API calls needed, close immediately
        this.closed.emit();
      }
    } catch (error) {
      Logger.error('Error in empty state action:', error);
      this.isProcessingEmptyState.set(false);
      this.closed.emit();
    }
    if (this.data?.assignment_id && this.data?.reservationModel && this.data?.reservationModel.user?.id && this.data?.review !== 1) {
      this.firestoreService.markHomeworkChatMeetingMessageAsOpened(this.data?.reservationModel, this.data.assignment_id);
      Logger.debug('Trying updateMessageCustomFieldsByAssignmentId', {
        reservationModel: this.data?.reservationModel,
        assignment_id: this.data?.assignment_id
      });
      this.firestoreService.updateMessageCustomFieldsByAssignmentId(this.data?.reservationModel, this.data?.assignment_id.toString(), {
        mentalHealthResult: { isNotEmpty: true, score: this.totalScore() }
      });
    }
  }

  questions = signal<IMentalHealthQuestionDto[]>([]); // List of test questions
  // headerConfig: IHeaderConfig = {}; // Header configuration (currently unused)
  currentIndex = signal(0); // Current question index
  validationError = signal(''); // Validation error message
  currentStep = signal<0 | 1 | 2>(0); // 0: Start screen, 1: Quiz, 2: Result screen

  startTime = signal<Date | null>(null); // Test start time
  endTime = signal<Date | null>(null); // Test end time

  currentQuestion = computed(() => this.questions()[this.currentIndex()]); // Computed signal for the current question

  canGoNext = computed(() =>
    this.currentQuestion()?.answers.some((a) => !!a.selected) // Checks if an answer is selected for the current question
  );

  progress = computed(() => {
    return this.questions().length > 0 ? ((this.currentIndex() + 1) / this.questions().length) * 100 : 0; // Calculates test progress
  });

  readonly totalScore = computed(() => {
    let score = 0;
    this.questions()?.forEach((question: IMentalHealthQuestionDto) => {
      question.answers?.forEach((answer: IMentalHealthAnswerDto) => {
        if (answer.selected === 1) {
          score += answer.answer_grade || 0; // Sums up scores from selected answers
        }
      });
    });
    return score;
  });

  // Use a signal for resultAfterTest to make it reactive
  resultAfterTest = signal<IMentalHealthReportItemDto | null>(null); // Stores the test result after completion

  // ... other code ...

  constructor() {
    effect(() => {
      // Effect to react to mental health scale creation success
      if (this._CreateMentalHealthScaleFacade.createScaleSuccess()) {
        Logger.debug('Mental health scale creation successful. Updating component state.', this._CreateMentalHealthScaleFacade.createdScaleResponse());

        const apiResponse = this._CreateMentalHealthScaleFacade.createdScaleResponse();
        if (apiResponse && apiResponse.data) {
          this.resultAfterTest.set(apiResponse.data); // Set the result from the API response
        }

        this.isFinished.set(true); // Mark test as finished
        this.endTime.set(new Date()); // Set end time
        this.currentStep.set(2); // Move to result step
        Logger.debug('MentalHealthScaleTestComponent => effect => Reviewing homework:', this.data?.messageRef?.homeworkId);

        // THIS IS THE CORRECTED LOGIC BLOCK
        // Perform Firestore updates and homework review after a successful test submission
        // Check if the mental health test is part of a chat and hasn't been reviewed yet
        const isNotReviewed = this.data?.review !== 1;

        if (this.data?.assignment_id && this.data?.reservationModel && this.data?.messageRef?.id && isNotReviewed) {
          Logger.debug('Executing Firestore and homework review logic.', { data: this.data });

          // Mark the chat message as opened
          this.firestoreService.markChatMeetingMessageAsOpened(this.data.reservationModel, this.data.messageRef.id);

          // Update the message with the test result score
          this.firestoreService.updateMessageCustomFields(this.data.reservationModel, this.data.messageRef.id, {
            mentalHealthResult: { isNotEmpty: true, score: this.totalScore() }
          });

          // Review the homework assignment
          this.reservationHomeworkFacade.reviewHomework(this.data.assignment_id);
        } else {
          Logger.warn('Cannot execute Firestore and homework review logic.', {
            assignment_id: this.data?.assignment_id,
            reservationModel: this.data?.reservationModel,
            messageRefId: this.data?.messageRef?.id,
            reviewStatus: this.data?.review
          });
        }
      }

      // Effect to react to mental health scale creation error
      if (this._CreateMentalHealthScaleFacade.createScaleError()) {
        Logger.error('Failed to store create test. Display error message if not handled by toast.');
      }
    });
  }
  // ... other methods ...

  protected goNext(): void {
    if (!this.canGoNext()) {
      this.validationError.set('must_select_answer'); // Display validation error if no answer is selected
      return;
    }
    this.validationError.set(''); // Clear validation error

    if (this.currentIndex() < this.questions().length - 1) {
      this.currentIndex.update((i) => i + 1); // Move to next question
    } else {
      // Test finished, store the results
      Logger.debug('Total Score:', this.totalScore());
      Logger.debug('All Questions with Answers:', this.questions());

      if (this.data?.item?.id !== undefined) {

        this.refreshLoginStatus();
        if (!this.isLoggedIn()) {
          this._RoleGuardService.openLoginModal();
          return;
        }
        this._CreateMentalHealthScaleFacade.createMentalHealthScale({
          result: this.totalScore(),
          category_id: this.data.item.id,
        });
      } else {
        Logger.error('category_id is undefined. Cannot create mental health scale.');
        this.validationError.set('فشل: بيانات الاختبار غير مكتملة.'); // Error message for incomplete test data
      }
    }
  }


  ngOnInit() {
    Logger.debug('MentalHealthScaleTestComponent => ngOnInit => Data: ', this.data);
    Logger.debug('MentalHealthScaleTestComponent => ngOnInit => Item: ', this.data?.item);
    Logger.debug('MentalHealthScaleTestComponent => ngOnInit => Message Ref: ', this.reservationModel);

    if (this.data?.isView) {
      // If in view mode, show results immediately
      this.isFinished.set(true);
      this.endTime.set(new Date());
      this.currentStep.set(2);
      // Map the item to IMentalHealthReportItemDto, providing default values for missing properties
      this.resultAfterTest.set({
        ...(this.data.item as any),
        result_note: (this.data.item as any).result_note ?? '',
        suggest_doctor: (this.data.item as any).suggest_doctor ?? null
      } as IMentalHealthReportItemDto); // Set result for view mode
    } else {
      // If not in view mode, prepare for a new test
      this.currentStep.set(0); // Set to start screen
      this.isFinished.set(false); // Ensure it's not marked as finished
      this.startTime.set(null); // Clear start time
      this.endTime.set(null); // Clear end time
      this.currentIndex.set(0); // Reset current question index
      this.validationError.set(''); // Clear any previous validation errors
      setTimeout(() => {

        this.currentStep.set(0); // Set to start screen
        this.isFinished.set(false); // Ensure it's not marked as finished
        this.startTime.set(null); // Clear start time
        this.endTime.set(null); // Clear end time
        this.currentIndex.set(0); // Reset current question index
        this.validationError.set(''); // Clear any previous validation errors
      }, 0);
      if (this.data?.item?.questions) {
        const initialQuestions = this.data.item.questions.map(q => ({
          ...q,
          answers: q.answers.map(a => ({ ...a, selected: a.selected || 0 })) // Initialize answers with 'selected: 0'
        }));
        this.questions.set(initialQuestions);
      } else {
        this.questions.set([]); // Clear questions if no data is provided
      }
    }
    Logger.debug('MentalHealthScaleTestComponent => ngOnInit => Current Values: ', {
      currentIndex: this.currentIndex(),
      isFinished: this.isFinished(),
      currentStep: this.currentStep()
    });
  }
  /**
   * Calculates the elapsed time for the test.
   * @returns Formatted elapsed time string (MM:SS).
   */
  protected elapsedTime(): string {
    const start = this.startTime();
    const end = this.endTime();
    if (start && end) {
      const diffMs = end.getTime() - start.getTime();
      const totalSeconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      return `${minutes}:${formattedSeconds}`;
    }
    return '0:00';
  }

  /**
   * Starts the quiz, setting the start time and changing the current step.
   */
  protected startQuiz(isNotEmpty: boolean | null): void {
    if (isNotEmpty) {
      this.isFinished.set(true);
      this.endTime.set(new Date());
      this.currentStep.set(2);

    } else {
      this.currentStep.set(1);
      this.startTime.set(new Date());
    }
  }


  /**
   * Navigates to the previous question.
   */
  protected goPrevious(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1); // Move to previous question
      this.validationError.set(''); // Clear validation error
    }
  }

  /**
   * Selects an answer for the current question.
   * @param answerId The ID of the selected answer.
   */
  protected selectAnswer(answerId: number): void {
    const questionsCopy = structuredClone(this.questions()); // Create a deep copy of questions
    const current = questionsCopy[this.currentIndex()]; // Get the current question
    current.answers.forEach((a: IMentalHealthAnswerDto) => (a.selected = a.id === answerId ? 1 : 0)); // Set selected status
    this.questions.set(questionsCopy); // Update questions signal
    this.validationError.set(''); // Clear validation error
  }

  // Computed property to get the score (count of questions with selected answers that have a positive grade)
  getScore = computed(() => {
    return this.questions().filter((q) =>
      q.answers.some((a) => !!a.selected && a.answer_grade !== undefined && a.answer_grade > 0)
    ).length;
  });

  /**
   * Gathers all test results.
   * @returns An object containing questions, selected answers, score, and elapsed time.
   */
  protected getTestResults() {
    return {
      questions: this.questions(),
      answers: this.questions().map(q => q.answers.find((a: any) => !!a.selected)), // Get selected answer for each question
      score: this.getScore(),
      elapsedTime: this.elapsedTime(),
    };
  }
}
