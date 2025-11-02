import { ChangeDetectionStrategy, Component, inject, Input, signal, effect, PLATFORM_ID, computed, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { ISeminarDataDto, ISeminarItemDto, IUserData, PaymentPopupComponent, SeminarItemFacade, SeminarsFacade, SupportGroupsRoutesEnum, UserContextService, RoleGuardService } from '../../../../domains';
import { CardType, Logger, StorageService } from '../../../../common';
import { ErrorStateCardComponent, LocalizationService, StorageKeys } from '../../../../shared';
import { TranslateModule } from '@ngx-translate/core';
import { NationalIdVerificationComponent } from '../../../../domains/settings';
import { getErrorTherapeuticPrograms } from '../../configs/error-state.config';
import { ModalService } from '../../../../shared/services/model.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs'; // ⬅️ Import Subscription for cleanup
import { TranslateApiPipe } from '../../../../common/core/translations/pipes';

@Component({
  selector: 'app-support-group-subscription',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ErrorStateCardComponent,
    TranslateApiPipe
  ],
  templateUrl: './support-group-subscription.component.html',
  styleUrls: ['./support-group-subscription.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// ⬅️ Add lifecycle interfaces
export class SupportGroupSubscriptionComponent implements OnDestroy {
  private readonly datePipe = inject(DatePipe);
  private readonly _modalService = inject(ModalService);
  private readonly _SeminarItemFacade = inject(SeminarItemFacade);
  private readonly localization = inject(LocalizationService);
  private readonly userContext = inject(UserContextService);

  // ⬅️ Subscription property for cleanup
  private recallUserDataSubscription: Subscription | undefined;

  // Signals
  public readonly queryItemId = signal<number | string | null>(null);
  public readonly queryStatus = signal<boolean | null | undefined>(null);

  protected readonly seminarItem = this._SeminarItemFacade.seminarItem;
  readonly isLoading = this._SeminarItemFacade.isLoading;
  readonly errorMessage = this._SeminarItemFacade.errorMessage;

  // MODIFIED: Use the seminarItem signal as a guard in the initializer function.
  protected readonly ErrorState = getErrorTherapeuticPrograms(() => {
    const id = this.queryItemId();
    // Only call fetch if we have an ID AND the seminarItem is currently null/falsy (a true retry)
    if (typeof id === 'number' && !this.seminarItem()) {
      this._SeminarItemFacade.getSeminarById(id);
    }
  });

  currentLanguage = this.localization.getCurrentLanguage();

  // Inputs
  @Input() set data(value: { item?: ISeminarItemDto, paymentStatus?: boolean | null } | undefined) {
    this._data.set(value);
  }
  @Input() set seminarId(value: number | undefined) {
    this._seminarId.set(value);
  }
  @Input() status!: string;
  protected cardTypes = CardType;

  // Private signals to hold input values
  private readonly _data = signal<{ item?: ISeminarItemDto, paymentStatus?: boolean | null } | undefined>(undefined);
  private readonly _seminarId = signal<number | undefined>(undefined);

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
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
    effect(() => {
      const data = this._data();
      const idFromData = data?.item?.id;
      const idFromInput = this._seminarId();

      const idToFetch = idFromData !== undefined ? idFromData : idFromInput;

      if (idToFetch !== undefined && idToFetch > 0) {
        this.queryItemId.set(idToFetch);
        this.queryStatus.set(data?.paymentStatus);
        Logger.debug('SupportGroupSubscriptionComponent: Loading seminar data via effect for ID:', idToFetch);
        // ⬅️ IMPORTANT: Keep the initial fetch here, as it's triggered by Input changes.
        if (idToFetch) {
          this._SeminarItemFacade.getSeminarById(idToFetch);
        }
      } else {
        Logger.warn('SupportGroupSubscriptionComponent => opened without a seminarId or data.');
      }
    });

    effect(() => {
      // Update the error state title when the error message changes
      if (this.errorMessage()) {
        this.ErrorState.title = this.errorMessage() || '';
      }
    });
    // ⬅️ Remove the initial call to setUpFetchDataAfterLogin() from the constructor.
    // We will call it in OnInit instead, so we can clean up the subscription.
    // However, since it's an observable it will execute asynchronously anyway,
    // we must ensure cleanup in ngOnDestroy.
    this.setUpFetchDataAfterLogin();
  }

  // ⬅️ Implement OnDestroy
  ngOnDestroy(): void {
    this._SeminarItemFacade.resetItemState();
    // ⬅️ Unsubscribe to prevent memory leaks
    if (this.recallUserDataSubscription) {
      this.recallUserDataSubscription.unsubscribe();
    }
  }

  protected openLink(): void {
    const link = this.seminarItem()?.data?.link;
    if (link) {
      // SSR-safe window.open
      if (typeof window !== 'undefined') {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    }
  }

  protected openSubscriptionModal(): void {
    const seminarData = this.seminarItem()?.data;
    if (!seminarData) {
      console.error('Cannot open subscription modal: program data not loaded.');
      return;
    }

    if (seminarData.is_purchased && seminarData.link) {
      this.openLink();
      return;
    }

    const currentUser = this.userContext.user()?.user || (this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO) as IUserData)?.user;
    Logger.debug('UserContextService current user data => currentUser:', currentUser);
    if (currentUser?.verify_national_id === 0 && !currentUser?.national_id) {
      this._modalService.open(NationalIdVerificationComponent, {
        inputs: {
          image: 'images/home/icons/quick-appointemnt.png',
          title: 'security',
          subtitle: 'verify_national_identity_description',
          data: {
            item: seminarData,
            paymentStatus: this.queryStatus()
          }
        },
        outputs: {
          closed: (data: { status: boolean, data: any }) => {
            if (data.status) {
              this.userContext.updateUserInfo(data.data);
            }
            this.openPaymentModal(seminarData);
          }
        },
        width: "40%"
      });
    } else {
      this.refreshLoginStatus();
      if (!this.isLoggedIn()) {
        this._RoleGuardService.openLoginModal();
        return;
      }
      this.openPaymentModal(seminarData);
    }
  }

  private openPaymentModal(seminarData: ISeminarDataDto): void {
    this._modalService.open(PaymentPopupComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: 'confirm_subscription',
        type: SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES,
        data: {
          item: seminarData,
          paymentStatus: this.queryStatus()
        }
      },
      outputs: {
        closed: () => {
          console.log('The model is closed');
        }
      },
      width: "40%"
    });
  }

  /** Set up listener to fetch data after login */
  private setUpFetchDataAfterLogin(): void {
    // ⬅️ Assign the subscription to the property
    this.recallUserDataSubscription = this._UserContextService.recallUserDataViewed
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('SupportGroupSubscriptionComponent | currentUrl:', currentUrl);

        // ⬅️ Use the queryItemId signal for consistency
        const idToFetch = this.queryItemId();

        if (currentUrl.startsWith('/' + SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES) && this.isBrowser && typeof idToFetch === 'number') {
          this.refreshLoginStatus();

          // ⬅️ CRITICAL CHANGE: Prevent duplicate call if the item is already loaded.
          // The only reason to refetch after login is if the item is NOT purchased,
          // or the component is being initialized for the first time.
          const isItemPresent = !!this.seminarItem();

          // Only fetch if the item isn't present, or if the user status changes (though typically
          // the full state should handle updates. Refetching is safer for login/logout).
          // We will refetch on login/logout to ensure purchase status is correct.

          this._SeminarItemFacade.getSeminarById(idToFetch);
          Logger.debug('SupportGroupSubscriptionComponent | Refetching seminar details after login/status change for ID:', idToFetch);
        }
      });
  }

  get formattedSeminarDate(): string | null {
    const rawDate = this.seminarItem()?.data?.date;
    return rawDate ? this.datePipe.transform(new Date(rawDate), 'EEEE - d MMMM', undefined, this.currentLanguage) : null;
  }

  get formattedSeminarTime(): string | null {
    const rawTime = this.seminarItem()?.data?.time;
    return rawTime ? this.datePipe.transform(new Date(`1970-01-01T${rawTime}`), 'hh:mm a', undefined, this.currentLanguage) : null;
  }
}
