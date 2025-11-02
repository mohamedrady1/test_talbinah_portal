import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { IDoctorItem, LocalizationService, ModalService, UploadAppsPopupComponent } from '../../../../shared';
import { IGlobalDoctorContactInfoModel, Logger } from '../../../../common';
import { BookApoointmentPopupComponent, ToggleFavoriteDoctorFacade, UploadAppsHeaderConfig } from '../../../../domains';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-specialist-card',
  standalone: true,
  imports: [TranslateModule, CommonModule, NgOptimizedImage, LazyLoadImageDirective, TranslateApiPipe],
  templateUrl: './specialist-card.component.html',
  styleUrls: ['./specialist-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialistCardComponent {
  @Input({ required: true }) specialistDetails!: IGlobalDoctorContactInfoModel | IDoctorItem | any;;
  @Input() isUploadApp: boolean = false;
  @Output() favouriteToggled = new EventEmitter<any>();
  @Output() openPopupAction = new EventEmitter<void>();

  protected readonly localization = inject(LocalizationService);
  protected readonly currentLang = this.localization.getCurrentLanguage();
  private readonly _ModalService = inject(ModalService);
  protected readonly toggleFavoriteDoctorFacade: ToggleFavoriteDoctorFacade = inject(ToggleFavoriteDoctorFacade);

  protected readonly isToggleLoading = computed<boolean>(() => {
    return !!this.specialistDetails?.id && this.toggleFavoriteDoctorFacade.loadingDoctorIds().has(this.specialistDetails.id);
  });

  formattedTime() {
    if (this.specialistDetails.nextAvailability) {
      const date = new Date(`1970-01-01T${this.specialistDetails.nextAvailability.start_time}Z`);
      const formattedTime = formatDate(date, 'hh:mm a', 'en-US');
      return formattedTime;
    }
    else return null;
  }


  protected handleFavouriteToggle(event: Event): void {
    event.stopPropagation();
    if (!this.specialistDetails?.id || this.isToggleLoading()) {
      Logger.debug('Attempted to toggle favorite on invalid specialistDetails or while already loading.');
      return;
    }

    Logger.debug('Toggling favorite status for doctor ID:', this.specialistDetails.id);

    this.toggleFavoriteDoctorFacade.toggleDoctorFavorite(this.specialistDetails.id, this.specialistDetails?.is_fav).subscribe({
      next: () => {
        Logger.debug(`Favorite toggle for doctor ${this.specialistDetails.id} request completed.`);

        this.specialistDetails.is_fav = !this.specialistDetails.is_fav;
        this.favouriteToggled.emit(this.specialistDetails);
      },
      error: (err: unknown) => {
        Logger.error(`Favorite toggle for doctor ${this.specialistDetails?.id} failed.`, err);
      }
    });
  }

  protected openPopup(): void {
    if (!this.specialistDetails) {
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
          item: this.specialistDetails,
          doctorId: this.specialistDetails.id
        },
        outputs: {
          closed: () => {
            Logger.info('Book Appointment Modal closed.');
          }
        },
        width: '70%',
      });
    }
  }
}
