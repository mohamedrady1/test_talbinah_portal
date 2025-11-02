import { Component, computed, EventEmitter, inject, Input, Output, ChangeDetectionStrategy, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DEFAULT_DOCTOR_IMAGE_MAN, DEFAULT_DOCTOR_IMAGE_WOMAN, HALF_HOUR_MINUTES, IDoctorItem, ModalService, StorageKeys, UploadAppsPopupComponent } from '../../../../shared';
import { CardType, IGlobalDoctorContactInfoModel, LanguageService, Logger, StorageService } from '../../../../common';
import { BookApoointmentPopupComponent } from '../book-apoointment-popup';
import { ToggleFavoriteDoctorFacade } from '../../services';
import { UploadAppsHeaderConfig } from '../../../urgent-appointment';
import { RoleGuardService } from '../../../authentication';
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
  selector: 'app-doctor-card-for-booking',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    TranslateApiPipe
  ],
  templateUrl: './doctor-card-for-booking.component.html',
  styleUrls: ['./doctor-card-for-booking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorCardForBookingComponent {
  // Use a union type for item to be explicit about expected types.
  @Input({ required: true }) item!: IGlobalDoctorContactInfoModel | IDoctorItem | any;
  @Input() isUploadApp: boolean = false;
  protected readonly languageService: LanguageService = inject(LanguageService);
  protected readonly currentLang: string = this.languageService.getCurrentLanguage();

  // Inject the ToggleFavoriteDoctorFacade directly, no need for underscore prefix for protected members.
  protected readonly toggleFavoriteDoctorFacade: ToggleFavoriteDoctorFacade = inject(ToggleFavoriteDoctorFacade);

  protected readonly isToggleLoading = computed<boolean>(() => {
    // Ensure item.id exists before checking the loading set.
    return !!this.item?.id && this.toggleFavoriteDoctorFacade.loadingDoctorIds().has(this.item.id);
  });

  @Output() favouriteToggled: EventEmitter<IGlobalDoctorContactInfoModel | IDoctorItem> = new EventEmitter();

  private readonly _ModalService: ModalService = inject(ModalService);
  // Use the enum for type safety
  @Input() type: CardType = CardType.SUMMARY;
  protected readonly cardTypes = CardType;

  protected HALF_HOUR_MINUTES = HALF_HOUR_MINUTES;

  protected onImageError(event: Event, gender: number | string | null | undefined): void {
    const target = event.target as HTMLImageElement;
    if (gender === 1 || gender === '1' || gender === 'female') {
      target.src = DEFAULT_DOCTOR_IMAGE_WOMAN;
      target.alt = 'Female doctor profile picture not available';
    } else { // Default to male or generic
      target.src = DEFAULT_DOCTOR_IMAGE_MAN;
      target.alt = 'Male doctor profile picture not available';
    }
  }

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _RoleGuardService = inject(RoleGuardService);

  // Reactive token signal
  private token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  // Computed login state
  protected readonly isLoggedIn = computed(() => !!this.token());

  // Call this whenever login status may have changed
  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  ngOnInit(): void {
    // if (this.item.id == 43) {
    //   this.cardClicked();
    // }
  }

  protected handleFavouriteToggle(event: Event): void {
    event.stopPropagation();

    this.refreshLoginStatus();
    Logger.debug('DoctorCardForBookingComponent | isLoggedIn(): ', this.isLoggedIn());
    if (!this.isLoggedIn()) {
      // Open login modal
      this._RoleGuardService.openLoginModal();
      return;
    }

    if (!this.item?.id || this.isToggleLoading()) {
      Logger.debug('Attempted to toggle favorite on invalid item or while already loading.');
      return;
    }

    this.toggleFavoriteDoctorFacade.toggleDoctorFavorite(this.item.id, this.item?.is_fav).subscribe({
      next: () => {
        this.item.is_fav = !this.item.is_fav;
        this.favouriteToggled.emit(this.item);
      },
      error: (err: unknown) => Logger.error('Favorite toggle failed', err)
    });
  }

  protected cardClicked(): void {
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
