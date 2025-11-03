import { ChangeDetectionStrategy, Component, ElementRef, inject, PLATFORM_ID, Signal, ViewChild, signal, OnInit, OnDestroy, effect, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyStateComponent, ErrorStateComponent, LocalizationService, ModalService, PageLayoutHeaderComponent, MoodModalIntegrationService, StorageKeys, CompeleteDataAndRegisterNowComponent, SegmentControlComponent } from '../../../../shared';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { Logger, MetadataService, StorageService } from '../../../../common';
import { SiteHeaderComponent } from '../../../header';
import {
  AllMentalHealthComponent,
  CardComponent,
  CardHeaderComponent,
  ChooseYourMoodComponent,
  DepressiveDisorderScaleCardComponent,
  DepressiveDisorderScaleHeaderConfig,
  getMeasurementsError,
  getmyMeasurementsError,
  MeasurementsEmptyState,
  MentalHealthHeaderConfig,
  MentalHealthScaleListShimmerComponent,
  MentalHealthScalesFacade,
  MentalHealthScaleTestShimmerComponent,
  MentalHealthSegmentOptions,
  MoodHeaderConfig,
  MyMeasurementsFacade,
  TestHeaderConfig,
  TimeScaleComponent
} from '../../../mental-health-scales';
import { IMentalHealthScaleListItemDto, IMentalHealthQuestionDto } from '../../../mental-health-scales';
import { headerConfig, ICardHeaderConfig } from '../../models';
import { MentalHealthScalesRouteData, MentalHealthScalesRoutesEnum } from '../../constants';
import { DisplayType } from '../../enums';
import { MainPageRoutesEnum } from '../../../main-page';
import { RoleGuardService, UserContextService } from '../../../authentication';

@Component({
  selector: 'app-mental-health-scales-layout',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    AutoExactHeightDirective,
    MentalHealthScaleTestShimmerComponent,
    MentalHealthScaleListShimmerComponent,
    DepressiveDisorderScaleCardComponent,
    PageLayoutHeaderComponent,
    ChooseYourMoodComponent,
    CardHeaderComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    SiteHeaderComponent,
    TimeScaleComponent,
    CardComponent,
    CompeleteDataAndRegisterNowComponent,
    SegmentControlComponent,
  ],
  templateUrl: './mental-health-scales-layout.component.html',
  styleUrls: ['./mental-health-scales-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentalHealthScalesLayoutComponent implements OnInit, OnDestroy {
  public DisplayTypes = DisplayType;

  // 💡 Services
  private readonly modalService = inject(ModalService);
  private readonly seo = inject(MetadataService);
  private readonly localization = inject(LocalizationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);
  @ViewChild('card') cardRef!: ElementRef;

  isFullscreen = false;
  isFinished = signal<boolean>(false);
  protected isBrowser: boolean;

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

  // Mobile segment control
  protected selectedSegmentId = signal<string>('tests');
  protected readonly segmentOptions = MentalHealthSegmentOptions;

  // Computed properties for showing sections
  protected readonly showTests = computed(() => this.selectedSegmentId() === 'tests');
  protected readonly showMeasurements = computed(() => this.selectedSegmentId() === 'measurements');

  headerConfig: headerConfig = MentalHealthHeaderConfig;
  testHeaderConfig: ICardHeaderConfig = TestHeaderConfig;
  moodHeaderConfig: ICardHeaderConfig = MoodHeaderConfig;
  DepressiveDisorderScaleHeaderConfig: ICardHeaderConfig = DepressiveDisorderScaleHeaderConfig;
  measurementsEmptyState = MeasurementsEmptyState;
  protected readonly measurementsErrorState = getMeasurementsError(() => this._mentalHealthScalesFacade.fetchAll());
  protected readonly myMeasurementsErrorState = getmyMeasurementsError(() => this._MyMeasurementsFacade.fetchMyMeasurements());

  protected readonly _mentalHealthScalesFacade = inject(MentalHealthScalesFacade);
  readonly scales = this._mentalHealthScalesFacade.scales;
  readonly isLoadingScales = this._mentalHealthScalesFacade.isLoading;
  readonly scalesErrorMessage = this._mentalHealthScalesFacade.errorMessage;

  protected readonly _MyMeasurementsFacade = inject(MyMeasurementsFacade);
  readonly myMeasurementsList = this._MyMeasurementsFacade.myMeasurements;
  readonly isLoadingMyMeasurementsList = this._MyMeasurementsFacade.isLoading;
  readonly myMeasurementsListErrorMessage = this._MyMeasurementsFacade.errorMessage;
  readonly myMeasurementsListStatus = this._MyMeasurementsFacade.status;

  // `questions` will now be dynamically set when a quiz is opened
  protected questions: Signal<IMentalHealthQuestionDto[]> = signal([]);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.setSeoMeta();

    if (this.isBrowser) {
      document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    }

    effect(() => {
      const allScalesLength = this.scales()?.length ?? 0;
      const displayedCountForTests = 3; // Number of tests displayed without "View All"
      this.testHeaderConfig.isAllButtonVisible = allScalesLength > displayedCountForTests;
      Logger.debug('testHeaderConfig.isAllButtonVisible updated to:', this.testHeaderConfig.isAllButtonVisible);
    });

    effect(() => {
      const myMeasurementsLength = this.myMeasurementsList()?.length ?? 0;
      const displayedCountForMeasurements = 4; // Number of measurements displayed without "View All"
      this.DepressiveDisorderScaleHeaderConfig.isAllButtonVisible = myMeasurementsLength > displayedCountForMeasurements;
      Logger.debug('DepressiveDisorderScaleHeaderConfig.isAllButtonVisible updated to:', this.DepressiveDisorderScaleHeaderConfig.isAllButtonVisible);
    });
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.setUpFetchDataAfterLogin();
  }


  /** Set up listener to fetch data after login */
  private setUpFetchDataAfterLogin(): void {
    this.refreshLoginStatus();
    this._UserContextService.recallUserDataViewed
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('MentalHealthScalesLayoutComponent | currentUrl:', currentUrl);

        if (currentUrl.startsWith('/' + MentalHealthScalesRoutesEnum.MENTALHEALTSCALESMAINPAGE) && this.isBrowser) {
          this.refreshLoginStatus();

          if (this.isLoggedIn()) {
            // Fetch both my measurements and all scales when user logs in
            Logger.debug('MentalHealthScalesLayoutComponent: User logged in, fetching my measurements and all scales - isLoggedIn:', this.isLoggedIn(), 'token:', !!this.token());
            this._MyMeasurementsFacade.fetchMyMeasurements();
            this._mentalHealthScalesFacade.fetchAll();
          } else {
            // Reset my measurements and fetch all scales when user logs out
            Logger.debug('MentalHealthScalesLayoutComponent: User logged out, resetting my measurements and fetching all scales - isLoggedIn:', this.isLoggedIn(), 'token:', !!this.token());
            this._MyMeasurementsFacade.resetState();
            this._mentalHealthScalesFacade.fetchAll();
          }
        }
      });
  }
  ngOnDestroy(): void {
    if (this.isBrowser) {
      document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    }
  }

  private handleFullscreenChange = () => {
    this.isFullscreen = !!document.fullscreenElement;
  };

  private setSeoMeta(): void {
    const { title, meta } = MentalHealthScalesRouteData.MentalHealthScalesMainPage;
    const lang = this.localization.getCurrentLanguage() as keyof typeof title;
    this.seo.setMetaTags({
      title: title[lang],
      description: meta.description[lang],
      keywords: 'mental health scale, home, talbinah',
      image: 'https://talbinah.net/dashboard_assets/Talbinah.png',
      url: 'https://talbinah.net/mental-health-scales',
      robots: 'index, follow',
      locale: 'en_US',
      canonical: 'https://talbinah.net/mental-health-scales'
    });
  }

  protected goHome(): void {
    if (this.isBrowser) this.router.navigate([MainPageRoutesEnum.MAINPAGE]);
  }

  protected toggleFullscreen(): void {
    if (this.isBrowser) {
      const cardEl = this.cardRef.nativeElement;
      if (!document.fullscreenElement) {
        cardEl.requestFullscreen().then(() => {
          this.isFullscreen = true;
        }).catch((err: any) => {
          console.error('فشل في التكبير:', err);
          this.isFullscreen = false;
        });
      } else {
        document.exitFullscreen().then(() => {
          this.isFullscreen = false;
        });
      }
    }
  }

  protected onWatchDetails(item: IMentalHealthScaleListItemDto): void {
    Logger.debug('MentalHealthScaleComponent => onWatchDetails => Item: ', item);
  }

  protected openAllMentalHealthScales(type: string): void {
    if (this.isBrowser) {
      this.modalService.open(AllMentalHealthComponent, {
        inputs: {
          type: type,
          image: 'images/mentalHealthScale/icons/scale.png',
          title: type === 'DepressiveDisorderScale' ? 'mental_health_scale_depressive_disorder_scale' : 'assessments'
        },
        outputs: {
          closed: (data: any): void => {
            Logger.debug('Modal closed with data:', data);
          }
        },
        width: '60%',
        height: 'fit-content'
      });
    }
  }

  protected onSegmentChanged(option: typeof MentalHealthSegmentOptions[number]): void {
    this.selectedSegmentId.set(option.id as string);
  }
}
