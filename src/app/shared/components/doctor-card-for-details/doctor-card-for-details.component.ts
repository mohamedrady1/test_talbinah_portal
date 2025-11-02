import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleFavoriteArticleFacade } from '../../../domains/articles/services';
import { IGlobalDoctorContactInfoModel, Logger, NavigationIntent, useNavigation } from '../../../common';
import { IDoctorItem } from '../../interfaces';
import { IGlobalReservationModel } from '../../../domains/appointments/models';
import { TranslateApiPipe } from '../../../common/core/translations';

@Component({
  selector: 'app-doctor-card-for-details',
  standalone: true,
  imports: [
    TranslateModule,
    TranslateApiPipe
  ],
  templateUrl: './doctor-card-for-details.component.html',
  styleUrls: ['./doctor-card-for-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorCardForDetailsComponent {
  @Input({ required: false }) item!: IGlobalDoctorContactInfoModel;
  @Input({ required: false }) reservation!: IGlobalReservationModel;
  @Input({ required: false }) type!: string;
  // Inject the ToggleFavoriteDoctorFacade directly, no need for underscore prefix for protected members.
  protected readonly toggleFavoriteDoctorFacade: ToggleFavoriteArticleFacade = inject(ToggleFavoriteArticleFacade);

  private readonly nav = useNavigation();

  protected readonly isToggleLoading = computed<boolean>(() => {
    // Ensure item.id exists before checking the loading set.
    return !!this.item?.id && this.toggleFavoriteDoctorFacade.loadingArticleIds().has(this.item.id);
  });

  @Output() favouriteToggled: EventEmitter<IGlobalDoctorContactInfoModel | IDoctorItem> = new EventEmitter();

  protected onImageError(event: Event, gender: number | null): void {
    const target = event.target as HTMLImageElement;
    target.src = gender === 1 ? 'images/not-found/no-woman-doctor.svg' : 'images/not-found/no-doctor.svg';
  }

  protected handleFavouriteToggle(event: Event): void {
    event.stopPropagation();
    if (!this.item?.id || this.isToggleLoading()) {
      Logger.debug('Attempted to toggle favorite on invalid item or while already loading.');
      return;
    }

    Logger.debug('Toggling favorite status for doctor ID:', this.item.id);

    this.toggleFavoriteDoctorFacade.toggleArticleFavorite(this.item.id).subscribe({
      next: () => {
        Logger.debug(`Favorite toggle for doctor ${this.item.id} request completed.`);

        this.item.is_fav = !this.item.is_fav;
        this.favouriteToggled.emit(this.item);
      },
      error: (err: unknown) => {
        Logger.error(`Favorite toggle for doctor ${this.item?.id} failed.`, err);
      }
    });
  }

  protected onTherapeuticPrescription(): void {
    Logger.debug('Therapeutic prescription button clicked: ', this.reservation);
    this.nav.navigate(
      NavigationIntent.EXTERNAL_NEW_TAB,
      `${this.reservation?.report_file}`
    );
  }
}
