import { TranslateApiPipe } from './../../../../common/core/translations/pipes/translate-api.pipe';
import { Component, inject, Input, OnInit, OnDestroy, signal, effect, ChangeDetectionStrategy, PLATFORM_ID, computed } from '@angular/core';
import { ProgramSubscriptionInformationCardComponent } from '../program-subscription-information-card';
import { TherapeuticProgramItemFacade, TherapeuticProgramsFacade } from '../../services';
import { AutoExactHeightDirective, CardType, Logger, StorageService } from '../../../../common';
import { ErrorStateCardComponent, ICardHeaderConfig, StorageKeys } from '../../../../shared';
import { DoctorCardForBookingComponent } from '../../../book-appointment';
import { ModalService } from '../../../../shared/services/model.service';
import { IUserData, RoleGuardService, UserContextService } from '../../../authentication';
import { CardHeaderComponent } from '../../../mental-health-scales';
import { NationalIdVerificationComponent } from '../../../settings';
import { TherapeuticProgramsRoutesEnum } from '../../constants';
import { getErrorForProgramSubscription } from '../../configs';
import { PaymentPopupComponent } from '../../../payments';
import { TranslateModule } from '@ngx-translate/core';
import { AllDoctorsComponent } from '../all-doctors';
import { ITherapeuticProgram } from '../../models';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export const DoctorsHeader: ICardHeaderConfig = {
  title: 'explore_treatment_programs',
  isButtonsVisible: false,
  isAllButtonVisible: true,
}

@Component({
  selector: 'app-program-subscription-popup',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    AutoExactHeightDirective,
    ProgramSubscriptionInformationCardComponent,
    DoctorCardForBookingComponent,
    CardHeaderComponent,
    ErrorStateCardComponent,

    TranslateApiPipe
  ],
  templateUrl: './program-subscription-popup.component.html',
  styleUrls: ['./program-subscription-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramSubscriptionPopupComponent implements OnInit, OnDestroy {
  // --- Query Parameter Signals ---
  public readonly queryItemId = signal<number | string | null>(null);
  public readonly queryStatus = signal<boolean | null | undefined>(null);
  doctorsHeader = DoctorsHeader;

  // --- Dependencies ---
  private readonly _modalService = inject(ModalService);
  private readonly _programsFacade = inject(TherapeuticProgramsFacade);
  private readonly _programItemFacade = inject(TherapeuticProgramItemFacade);
  private readonly userContext = inject(UserContextService);
  private readonly roleGuardService = inject(RoleGuardService);

  // --- Inputs as Signals ---
  @Input() set data(value: { item?: ITherapeuticProgram, paymentStatus?: boolean | null } | undefined) {
    const id = value?.item?.is_purchased ? value?.item?.programme_id : value?.item?.id;
    this._data.set(value);
    if (id !== undefined) {
      this._programId.set(id);
    }
  }
  private readonly _data = signal<{ item?: ITherapeuticProgram, paymentStatus?: boolean | null } | undefined>(undefined);

  @Input() set programId(value: number) {
    this._programId.set(value);
  }
  private readonly _programId = signal<number | undefined>(undefined);

  @Input() status!: string;
  protected cardTypes = CardType;

  // --- Selectors from Item Facade ---
  readonly programItem = this._programItemFacade.programItem;
  readonly isLoading = this._programItemFacade.isLoading;
  readonly errorMessage = this._programItemFacade.errorMessage;
  readonly errorState = getErrorForProgramSubscription(() => {
    const id = this._programId();
    if (id) {
      this._programItemFacade.getTherapeuticProgramById(id);
    }
  });

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);

  // ----- Computed Signals -----

  // SSR-safe browser check
  // ----- Injected services -----
  private readonly _UserContextService = inject(UserContextService);
  private readonly _Router = inject(Router);

  // ----- Computed Signals -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  public readonly isLoggedIn = computed(() => {
    if (!this.isBrowser) return false;
    return !!this.token();
  });

  protected refreshLoginStatus(): void {
    const newToken = this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null;
    this.token.set(newToken);
    Logger.debug('ProgramSubscriptionPopupComponent: Login status refreshed, isLoggedIn:', this.isLoggedIn());
  }


  constructor() {
    // Effect to handle fetching data whenever programId or data changes
    effect(() => {
      const id = this._programId();
      const data = this._data();
      if (id !== undefined) {
        this.queryItemId.set(id);
        this.queryStatus.set(data?.paymentStatus);
        Logger.debug('ProgramSubscriptionPopupComponent: Effect triggered. Fetching program with ID:', id);
        this._programItemFacade.getTherapeuticProgramById(id);
      } else {
        Logger.warn('ProgramSubscriptionPopupComponent => opened without a programId. Showing error.');
        this.errorState.title = this.errorMessage() || '';
      }
    });

    // Effect to update doctorsHeader.isAllButtonVisible when programItem()?.data?.doctor changes
    effect(() => {
      const doctorsDataLength = this.programItem()?.data?.doctor?.length ?? 0;
      const displayedCount = 3;
      this.doctorsHeader.isAllButtonVisible = doctorsDataLength > displayedCount;
    });

    effect(() => {
      if (this.errorMessage()) {
        this.errorState.title = this.errorMessage() || '';
      }
    });

  }
  ngOnInit(): void {
    this.setUpFetchDataAfterLogin();
  }

  ngOnDestroy(): void {
    this._programItemFacade.resetItemState();
  }

  protected openSubscriptionModal(): void {
    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this.roleGuardService.openLoginModal();
      return;
    }
    const programData = this.programItem()?.data;
    if (!programData) {
      console.error('Cannot open subscription modal: program data not loaded or is null.');
      return;
    }

    if (programData?.is_purchased) {
      Logger.debug('Program is already purchased. URL is: ', programData?.url);
      return;
    }

    const currentUser = this.userContext.user()?.user || (this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO) as IUserData)?.user;
    Logger.debug('UserContextService current user data for check:', currentUser);

    if (currentUser?.verify_national_id === 0 && !currentUser?.national_id) {
      Logger.debug('User needs national ID verification. Opening verification modal.');
      this._modalService.open(NationalIdVerificationComponent, {
        inputs: {
          image: 'images/home/icons/quick-appointemnt.png',
          title: 'security',
          subtitle: 'verify_national_identity_description',
          data: {
            item: programData,
            paymentStatus: this.queryStatus()
          }
        },
        outputs: {
          closed: (data: { status: boolean, data: any }) => {
            Logger.debug('National ID Verification modal closed. Status:', data.status, 'Data:', data.data);
            if (data.status && data.data) {
              this.userContext.updateUserInfo(data.data);
            }
            setTimeout(() => {
              this.openPaymentPopup(programData);
            }, 0);
          }
        },
        width: "40%"
      });
    } else {
      Logger.debug('National ID already verified or present, opening payment popup directly.');
      this.openPaymentPopup(programData);
    }
  }

  private openPaymentPopup(programData: ITherapeuticProgram): void {
    this._modalService.open(PaymentPopupComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: 'confirm_subscription',
        type: TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE,
        data: {
          item: programData,
          type: 'therapeutic-programs',
          paymentStatus: this.queryStatus()
        }
      },
      outputs: {
        closed: () => {
          Logger.debug('Payment popup modal closed.');
          this._programsFacade.fetchMyTherapeuticPrograms(1, true);
        }
      },
      width: "40%"
    });
  }

  protected openAllDoctorsPopup(): void {
    this._modalService.open(AllDoctorsComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: "explore_treatment_programs",
        doctors: this.programItem()?.data?.doctor,
      },
      width: '50%',
      outputs: {
        closed: () => {
          console.log('All Doctors modal is closed');
        }
      }
    });
  }

  /** Set up listener to fetch data after login */
  private setUpFetchDataAfterLogin(): void {
    this.refreshLoginStatus();
    this._UserContextService.recallUserDataViewed
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('ProgramSubscriptionPopupComponent | currentUrl:', currentUrl);

        if (currentUrl.startsWith('/' + TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE) && this.isBrowser) {
          this.refreshLoginStatus();
          if (this.isLoggedIn()) {
            this._programItemFacade.getTherapeuticProgramById(this._programId()!);
          } else {
            this._programItemFacade.getTherapeuticProgramById(this._programId()!);
          }
        }
      });
  }
}
