import { DEFAULT_DOCTOR_IMAGE_MAN, DEFAULT_DOCTOR_IMAGE_WOMAN, HALF_HOUR_MINUTES, IDoctorItem, ModalService, UploadAppsPopupComponent } from '../../../../shared';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { IGlobalDoctorContactInfoModel, Logger } from '../../../../common';
import { BookApoointmentPopupComponent } from '../../../book-appointment';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UploadAppsHeaderConfig } from '../../../urgent-appointment';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-chat-doctor-card',
  standalone: true,
  imports: [
    TranslateModule,
    NgOptimizedImage,
    CommonModule,
    TranslateApiPipe
  ],
  templateUrl: './chat-doctor-card.component.html',
  styleUrls: ['./chat-doctor-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatDoctorCardComponent {
  // Use a union type for item to be explicit about expected types.
  @Input({ required: true }) item!: IGlobalDoctorContactInfoModel | IDoctorItem | any;
  @Input() isUploadApp: boolean = false;
  @Input() allowShortTexts: boolean | null = null;
  @Input() hideButtonAction: boolean | null = null;

  private readonly _ModalService: ModalService = inject(ModalService);

  protected HALF_HOUR_MINUTES = HALF_HOUR_MINUTES;

  protected onImageError(event: Event, gender: number | null | undefined): void {
    const target = event.target as HTMLImageElement;
    if (gender === 1) { // Assuming 1 for female
      target.src = DEFAULT_DOCTOR_IMAGE_WOMAN;
      target.alt = 'Female doctor profile picture not available';
    } else { // Default to male or generic
      target.src = DEFAULT_DOCTOR_IMAGE_MAN;
      target.alt = 'Male doctor profile picture not available';
    }
  }

  protected ReserveNow(): void {
    Logger.warn(' open booking modal: doctor item ', this.item);
    // Ensure item exists before opening modal
    if (!this.item) {
      Logger.warn('Cannot open booking modal: doctor item is null or undefined.');
      return;
    }
    if (this.isUploadApp) {
      this._ModalService.open(UploadAppsPopupComponent, {
        width: '40%',
        inputs: {
          ...UploadAppsHeaderConfig
        },
        outputs: {
          closed: (): void => {
            Logger.debug('The modal is closed');
          },
        },
      });
    }
    else {
      this._ModalService.open(BookApoointmentPopupComponent, {
        inputs: {
          image: 'images/home/icons/date.png',
          title: 'doctor_details',
          subtitle: 'book_appointment_modal_subtitle',
          item: this.item,
          doctorId: this.item.id
        },
        outputs: {
          closed: () => {
            Logger.info('Book Appointment Modal closed.');
          }
        },
        width: '70%', // Consider making this responsive, e.g., 'clamp(300px, 90vw, 500px)'
      });
    }
  }
}
