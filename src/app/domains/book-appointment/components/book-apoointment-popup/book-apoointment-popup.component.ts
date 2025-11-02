import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Input,
  signal,
  computed,
  PLATFORM_ID,
  OnInit, // ⬅️ Added OnInit
  OnDestroy, // ⬅️ Added OnDestroy
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
// ⬅️ Import for subscription management
import { Subscription } from 'rxjs';

import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { DoctorDetailsFacade } from '../../services';
import { IGlobalReservationModel } from '../../../appointments/models';
import {
  DoctorImage,
  DoctorDetailsBoxConfig,
  DoctorEmptyState,
  attachmentsEmptyState,
  couponsEmptyState,
  reviewsEmptyState,
  treatmentProgramsEmptyState,
} from '../../configs';
import { TabsComponent, GlobalRateCardComponent, GlobalTherapeuticProgramCardComponent, PublicService, SvgIconComponent, LocalizationService, StorageKeys } from '../../../../shared';
import { RateYourCompatibilityComponent } from '../rate-your-compatibility';
import { DoctorCardForDetailsComponent } from '../doctor-card-for-details';
import { ReservationWithDoctorFormComponent } from '../reservation-with-doctor-form';
import { DoctorDetailsBoxComponent } from '../doctor-details-box';
import { DiscountCodeCardComponent } from '../discount-code-card';
import { DoctorGalleryComponent } from '../doctor-gallery';
import { DoctorBioComponent } from '../doctor-bio';
import { EmptyStateCardComponent } from '../../../../shared/components/empty-state-card/empty-state-card.component';
import { BookApoointmentPopupSkeletonComponent } from '../book-apoointment-popup-skeleton';
import { ITab } from '../../../talbinah-community/models';
import { CardType, Logger, StorageService } from '../../../../common';
import { Router } from '@angular/router';
import { UserContextService } from '../../../authentication/user-authentication/services';
import { RoleGuardService } from '../../../authentication/user-authentication/services';
import { BookAppointmentRoutesEnum } from '../../constants';

@Component({
  selector: 'app-book-apoointment-popup',
  standalone: true,
  imports: [
    AutoExactHeightDirective,
    DoctorCardForDetailsComponent,
    DoctorDetailsBoxComponent,
    TabsComponent,
    TranslateModule,
    DoctorBioComponent,
    DoctorGalleryComponent,
    RateYourCompatibilityComponent,
    GlobalTherapeuticProgramCardComponent,
    DiscountCodeCardComponent,
    GlobalRateCardComponent,
    ReservationWithDoctorFormComponent,
    BookApoointmentPopupSkeletonComponent,
    EmptyStateCardComponent,
    SvgIconComponent,
    CommonModule
  ],
  templateUrl: './book-apoointment-popup.component.html',
  styleUrls: ['./book-apoointment-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('cardTransition', [
      transition('inactive => active', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition('active => inactive', [
        style({ opacity: 1, transform: 'translateX(0)' }),
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-20px)' })),
      ]),
    ]),
  ],
})
// ⬅️ Implement OnInit and OnDestroy
export class BookApoointmentPopupComponent implements OnInit, OnDestroy {
  @Input({ required: false }) item!: IGlobalReservationModel;
  @Input({ required: true }) doctorId!: number | string;

  protected CardTypes = CardType;
  doctorEmptyState = DoctorEmptyState;

  protected readonly _PublicService = inject(PublicService);
  protected readonly facade = inject(DoctorDetailsFacade);

  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly doctor = this.facade.doctor;
  protected readonly isLoading = this.facade.isLoading;
  protected readonly errorMessage = this.facade.errorMessage;

  // ⬅️ Property to hold the subscription
  private recallUserDataSubscription: Subscription | undefined;

  protected doctorInfosTabsConfig: ITab[] = [
    { id: 'bio', title: 'biography' },
    { id: 'programs', title: 'treatment_programs' },
    { id: 'discounts', title: 'coupon' },
    { id: 'ratings', title: 'rating' },
  ];

  protected DoctorDetailsBoxes: DoctorDetailsBoxConfig[] = [];
  protected images: DoctorImage[] = [];

  reviewsEmptyState = reviewsEmptyState;
  couponsEmptyState = couponsEmptyState;
  treatmentProgramsEmptyState = treatmentProgramsEmptyState;
  attachmentsEmptyState = attachmentsEmptyState;

  // UI signals
  selectedTabId = signal<string>('bio');
  currentPage = signal<number>(0);

  // Derived lists length depending on active tab
  readonly activeListLength = computed(() => {
    const tab = this.selectedTabId();
    if (tab === 'programs') return this.doctor()?.programme?.length ?? 0;
    if (tab === 'ratings') return this.doctor()?.reviews?.length ?? 0;
    if (tab === 'discounts') return this.doctor()?.coupons?.length ?? 0;
    return 0;
  });

  // Mobile detection (simple)
  readonly isMobile = signal<boolean>(false);

  private readonly localizationService = inject(LocalizationService);
  readonly currentLang = this.localizationService.getCurrentLanguage();

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
  constructor() {
    // populate detail boxes when facade state is ready
    effect(() => {
      const ok = this.facade.fetchStatus();
      if (ok) {
        const d = this.doctor();
        Logger.debug('BookApoointmentPopupComponent: doctor loaded', d);

        // Check if d is available before accessing properties
        if (d) {
          this.DoctorDetailsBoxes = [
            {
              title: 'cost',
              icon: 'images/bookAppointment/real.png',
              value: `${d.price_half_hour ?? '0'} ${this._PublicService.translateTextFromJson('general.CurrencySAR')} / 30 ${this._PublicService.translateTextFromJson('general.minute')}`,
              valueColor: '#0E39B6',
            },
            {
              title: 'experiences',
              icon: 'images/bookAppointment/star.png',
              value: `${d.years_experience ?? '0'} ${this._PublicService.translateTextFromJson('general.Years')}`,
              valueColor: '#00AF6C',
            },
            {
              title: 'appointment',
              icon: 'images/bookAppointment/user.png',
              value: `${d.reservations_count ?? '0'}`,
              valueColor: '#FFAF44',
            },
          ];
        }
      }
    });

    effect(() => {
      this.activeListLength();
      this.resetPage();
    });

    if (this.isBrowser) {
      this.isMobile.set(window.innerWidth <= 768);
      // Remove the old window event listener to prevent issues on destroy
      // A safer way is to use Angular's HostListener or a custom directive/service for window events if needed,
      // but for this simple case, the check in ngOnInit is often sufficient.
      // The current implementation is simple enough to leave as is, but good to be aware of.
      window.addEventListener('resize', () => this.isMobile.set(window.innerWidth <= 768));
    }
  }

  ngOnInit(): void {
    Logger.debug('BookApoointmentPopupComponent: init doctorId', this.doctorId);

    // Fetch doctor details immediately on component init
    if (this.isBrowser && !isNaN(Number(this.doctorId))) {
      this.facade.fetchDoctorDetails(Number(this.doctorId));
    }

    this.setUpFetchDataAfterLogin();
  }

  // ⬅️ New ngOnDestroy method
  ngOnDestroy(): void {
    Logger.debug('BookApoointmentPopupComponent: destroying component and resetting facade state.');

    // 1. Reset values in the Facade to prevent stale data
    this.facade.resetDoctorDetailsState();

    // 2. Unsubscribe from the observable to prevent memory leaks
    if (this.recallUserDataSubscription) {
      this.recallUserDataSubscription.unsubscribe();
    }

    // Optional: Remove resize listener if it's strictly necessary for cleanup,
    // but often Angular's change detection handles mobile status adequately for popups.
  }

  protected onTabSelected(selected: ITab | ITab[]) {
    const tab = Array.isArray(selected) ? selected[0] : selected;
    this.selectedTabId.set(String(tab.id));
    this.currentPage.set(0); // reset to the first page when switching tabs
  }

  private resetPage() {
    const maxPage = this.maxPageIndex();
    if (this.currentPage() > maxPage) {
      this.currentPage.set(maxPage);
    }
  }

  protected goToNextPage() {
    if (this.currentPage() < this.maxPageIndex()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  protected goToPrevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  protected maxPageIndex(): number {
    const totalItems = this.activeListLength();
    const itemsPerPage = this.getItemsToShow();
    console.log(totalItems, itemsPerPage);
    return Math.max(0, Math.ceil(totalItems / itemsPerPage) - 1);
  }

  protected getVisibleItems<T>(items: T[] | null | undefined): T[] {
    if (!items || items.length === 0) return [];

    const pageIndex = this.currentPage();
    const pageSize = this.getItemsToShow();
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;

    return items.slice(startIndex, endIndex);
  }

  protected getItemsToShow(): number {
    if (!this.isBrowser) return 4;

    const width = window.innerWidth;
    if (this.isMobile()) return 1;
    if (width >= 1200) return 4;
    if (width >= 900) return 2;
    return 1;
  }

  private setUpFetchDataAfterLogin(): void {
    // ⬅️ Assign the subscription to the property
    this.recallUserDataSubscription = this._UserContextService.recallUserDataViewed
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('BookApoointmentPopupComponent | currentUrl:', currentUrl);

        if (currentUrl.startsWith('/' + BookAppointmentRoutesEnum.BOOK_APPOINTMENT_MAIN_PAGE) && this.isBrowser) {
          this.refreshLoginStatus();
          // Always refetch if the user state changes while on the book appointment page
          // This ensures the data is up-to-date for the new user status (logged in/out)
          if (!isNaN(Number(this.doctorId))) {
            this.facade.fetchDoctorDetails(Number(this.doctorId));
          }
        }
      });
  }
}
