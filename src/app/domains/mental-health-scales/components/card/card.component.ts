import { TranslateApiPipe } from './../../../../common/core/translations/pipes/translate-api.pipe';
// ... (existing imports)
import { ITestDetails } from '../../models/test-card.model';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IMentalHealthScaleListItemDto, IQuizMessage } from '../../../../domains';
import { ModalService } from '../../../../shared';
import { MentalHealthScaleTestComponent } from '../mental-health-scale-test';
import { FirestoreService, Logger } from '../../../../common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,

    TranslateApiPipe
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  // ... (existing @Input, @Output, and properties)
  @Input() isTask!: { status: boolean } | null;
  @Input() hideFavouriteAction!: boolean | null;
  @Input() hideDescription!: boolean | null;
  @Input() allowShortTexts!: boolean | null;
  @Input() hideButtonAction!: boolean | null;
  @Input() assignment_id!: number | null;
  @Input() reservationModel!: any | null;
  @Input() review!: number;
  isFavourited = signal(false);
  @Input() type: string = 'test';
  @Input() testDetails!: IMentalHealthScaleListItemDto | IQuizMessage | any;
  @Output() favouriteToggled = new EventEmitter<IMentalHealthScaleListItemDto>();
  @Output() startQuiz = new EventEmitter<void>();
  private readonly modalService = inject(ModalService);

  openQuiz() {
    this.startQuiz.emit();
    this.openTestPopup(this.testDetails);
  }

  addToFavourite() {
    this.isFavourited.update(value => !value);
    this.favouriteToggled.emit(this.testDetails);
  }

  watchDetailsAction() {
    this.openTestDetailsModal();
  }

  private readonly firebaseService = inject(FirestoreService);

  private async openTestDetailsModal(): Promise<void> {
    console.log('Assignment ID:', this.assignment_id);

    // ✅ Await the result from Firebase before opening the modal
    const mentalHealthResult = await this.firebaseService.getMentalHealthResultByHomeworkId(
      this.reservationModel,
      +(this.assignment_id || 0)
    );

    console.log('Fetched mentalHealthResult:', mentalHealthResult);

    this.modalService.open(MentalHealthScaleTestComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/scale.png',
        title: this.testDetails?.mental_category_name,
        subtitle: this.testDetails.title,
        data: {
          item: this.testDetails,
          isView: true,
          reservationModel: this.reservationModel,
          assignment_id: this.assignment_id,
          review: this.review,
          // ✅ Pass the fetched result to the modal's data object
          mentalHealthResult: mentalHealthResult?.score
        }
      },
      outputs: {
        closed: (data: any): void => {
          Logger.debug('MentalHealthScaleComponent => openTestDetailsModal => Modal closed with data:', data);
        }
      },
      width: '60%',
    });
  }

  openTestPopup(item: any): void {
    Logger.debug('MentalHealthScaleComponent => openTestPopup => Item: ', item);
    this.modalService.open(MentalHealthScaleTestComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/scale.png',
        title: item.title,
        subtitle: item.brief,
        data: {
          item: item,
          reservationModel: this.reservationModel,
          assignment_id: this.assignment_id,
          review: this.review
        }
      },
      outputs: {
        closed: (data: any): void => {
          Logger.debug('MentalHealthScaleComponent => openTestPopup => Modal closed with data:', data);
        }
      },
      closeOnBackdropClick: false,
      width: '60%',
    });
  }

  protected logCheckboxState(event: Event): void {
    event.stopPropagation();
    Logger.debug('MentalHealthScaleDetailsComponent => isTask: ', { isTask: this.isTask, item: this.testDetails });
  }
}
