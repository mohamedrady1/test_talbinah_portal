import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { IGlobalDoctorContactInfoModel, Logger, StorageService } from '../../../../common';
import { TranslateModule } from '@ngx-translate/core';
import { IDoctorItem, ModalService, ShareSocialComponent, StorageKeys } from '../../../../shared';
import { ToggleFavoriteDoctorFacade } from '../../services';
import { TherapeuticPrescriptionComponent } from '../therapeutic-prescription';
import { FavoriteDoctorsFacade } from '../../../settings/services';
import { RoleGuardService } from '../../../authentication';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-doctor-card-for-details',
  standalone: true,
  imports: [
    TranslateModule,
    
    ShareSocialComponent
  ],
  templateUrl: './doctor-card-for-details.component.html',
  styleUrls: ['./doctor-card-for-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorCardForDetailsComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  @Input({ required: false }) item!: IGlobalDoctorContactInfoModel | IDoctorItem | any;
  @Input({ required: false }) type!: string;
  // Inject the ToggleFavoriteDoctorFacade directly, no need for underscore prefix for protected members.
  protected readonly toggleFavoriteDoctorFacade: ToggleFavoriteDoctorFacade = inject(ToggleFavoriteDoctorFacade);
  private readonly _ModalService = inject(ModalService);
  private readonly favouriteDoctorFacade = inject(FavoriteDoctorsFacade);
  private readonly _ActivatedRoute = inject(ActivatedRoute);

  protected readonly isToggleLoading = computed<boolean>(() => {
    // Ensure item.id exists before checking the loading set.
    return !!this.item?.id && this.toggleFavoriteDoctorFacade.loadingDoctorIds().has(this.item.id);
  });

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Computed Signals -----
  public readonly isLoggedIn = computed(() => {
    if (!this.isBrowser) return false;
    const token = this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null;
    return !!token;
  });

  // Build shareable URL with doctorId and typeId
  protected readonly shareableUrl = computed(() => {
    if (!this.isBrowser) return '';

    const doctorId = this.item?.id;
    if (!doctorId) return this.item?.url || '';

    // Get typeId from query params
    const queryParams = this._ActivatedRoute.snapshot.queryParams;
    const typeId = queryParams['typeId'];

    // Build URL with both doctorId and typeId
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();

    if (typeId) {
      params.append('typeId', typeId);
    }
    params.append('doctorId', doctorId.toString());

    return `${baseUrl}/book-appointment?${params.toString()}`;
  });

  @Output() favouriteToggled: EventEmitter<IGlobalDoctorContactInfoModel | IDoctorItem> = new EventEmitter();

  protected onImageError(event: Event, gender: number | null): void {
    const target = event.target as HTMLImageElement;
    target.src = gender === 1 ? 'images/not-found/no-woman-doctor.svg' : 'images/not-found/no-doctor.svg';
  }

  protected handleFavouriteToggle(event: Event): void {
    event.stopPropagation();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }
    if (!this.item?.id || this.isToggleLoading()) {
      Logger.debug('Attempted to toggle favorite on invalid item or while already loading.');
      return;
    }

    Logger.debug('Toggling favorite status for doctor ID:', this.item.id);

    this.toggleFavoriteDoctorFacade.toggleDoctorFavorite(this.item.id, this.item?.is_fav).subscribe({
      next: () => {
        Logger.debug(`Favorite toggle for doctor ${this.item.id} request completed.`);

        this.item.is_fav = !this.item.is_fav;
        this.favouriteToggled.emit(this.item);
        this.favouriteDoctorFacade.fetchFavorites();
      },
      error: (err: unknown) => {
        Logger.error(`Favorite toggle for doctor ${this.item?.id} failed.`, err);
      }
    });
  }
  openTherapeuticPrescription(event: Event): void {
    event.stopPropagation();
    Logger.debug('Opening therapeutic prescription for doctor ID:', this.item.id);
    this._ModalService.open(TherapeuticPrescriptionComponent, {
      inputs: {
        title: 'userInfo.medicalPrescription',
        item: this.item
      }
    });
  }
}

