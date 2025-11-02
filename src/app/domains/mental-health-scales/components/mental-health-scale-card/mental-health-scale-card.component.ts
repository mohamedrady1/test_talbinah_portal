import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { MentalHealthScaleTestComponent } from '../mental-health-scale-test';
import { FirestoreService, IGlobalMentalHealthScaleModel, Logger, ReservationModel } from '../../../../common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../../../shared';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mental-health-scale-card',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule
  ],
  templateUrl: './mental-health-scale-card.component.html',
  styleUrls: ['./mental-health-scale-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentalHealthScaleCardComponent {
  @Input() isTask!: { status: boolean } | null;
  @Input() hideFavouriteAction!: boolean | null;
  @Input() hideDescription!: boolean | null;
  @Input() allowShortTexts!: boolean | null;
  @Input() hideButtonAction!: boolean | null;
  @Input() reservationModel!: ReservationModel | null;
  @Input() messageRef!: any;
  isFavourited = signal(false);
  @Input() type: string = 'test';
  @Input() item!: IGlobalMentalHealthScaleModel;
  @Output() favouriteToggled = new EventEmitter<IGlobalMentalHealthScaleModel>();
  @Output() startQuiz = new EventEmitter<void>();
  private readonly modalService = inject(ModalService);
  private readonly firebaseService = inject(FirestoreService);

  ngOnInit(): void {
    Logger.debug('MentalHealthScaleCardComponent => ngOnInit => Item: ', this.item);
  }

  protected openQuiz(): void {
    this.startQuiz.emit();
    this.openMentalHealthScaleDetailsPopup(this.item);
  }
  protected addToFavourite(): void {
    this.isFavourited.update(value => !value);
    this.favouriteToggled.emit(this.item);
  }

  protected watchDetailsAction(): void {
    this.openTestDetailsModal();
    // this.watchDetails.emit(this.item);
  }

  private async openTestDetailsModal(): Promise<void> {
    if (this.reservationModel) {
      const mentalHealthResult = await this.firebaseService.getMentalHealthResultByHomeworkId(
        this?.reservationModel,
        +(this.messageRef.assignment_id || 0)
      );

      this.modalService.open(MentalHealthScaleTestComponent, {
        inputs: {
          image: 'images/mentalHealthScale/icons/scale.png',
          title: this.item.mental_category_name,
          subtitle: this.item.title,
          data: {
            item: this.item,
            isView: true,
            messageRef: this.messageRef,
            mentalHealthResult: mentalHealthResult
          },
          reservationModel: this.reservationModel
        },
        outputs: {
          closed: (data: any): void => {
            Logger.debug('MentalHealthScaleComponent => openTestDetailsModal => Modal closed with data:', data);
          }
        },
        width: '60%',
        closeOnBackdropClick: false,

        // height: '60%'
      });
    }
  }
  private openMentalHealthScaleDetailsPopup(item: IGlobalMentalHealthScaleModel): void {
    Logger.debug('MentalHealthScaleComponent => openMentalHealthScaleDetailsPopup => Item: ', item);
    this.modalService.open(MentalHealthScaleTestComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/scale.png',
        title: item.title,
        subtitle: item.brief,
        data: {
          item: item,
          messageRef: this.messageRef
        },
        reservationModel: this.reservationModel
      },
      outputs: {
        closed: (data: any): void => {
          Logger.debug('MentalHealthScaleComponent => openMentalHealthScaleDetailsPopup => Modal closed with data:', data);
        }
      },
      width: '60%',
      closeOnBackdropClick: false,

    });
  }

  protected logCheckboxState(event: Event): void {
    event.stopPropagation(); // Prevent the main button click
    Logger.debug('MentalHealthScaleDetailsComponent => isTask: ', { isTask: this.isTask, item: this.item });
  }
}
