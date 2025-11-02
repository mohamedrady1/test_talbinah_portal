import { TranslationsFacade } from '../../../../common/core/translations/services';
import { DisplayType, getMoodsError, IMoodItem, LastSevenUserMoodsFacade, MentalHealthScalesRoutesEnum, MoodsEmptyState, SupportGroupsRoutesEnum } from '../../../../domains';
import { ChangeDetectionStrategy, Component, computed, effect, PLATFORM_ID, Input, signal, inject, OnDestroy } from '@angular/core';
import { TimeScaleCalenderShimmerComponent } from '../time-scale-calender-shimmer';
import { CompeleteDataAndRegisterNowComponent, EmptyStateComponent, ErrorStateComponent, StorageKeys } from '../../../../shared';
import { LanguageService, Logger, StorageService } from '../../../../common';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { RoleGuardService, UserContextService } from '../../../authentication';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-time-scale',
  standalone: true,
  imports: [
    CommonModule,

    LazyLoadImageDirective,

    TimeScaleCalenderShimmerComponent,
    ErrorStateComponent,
    CompeleteDataAndRegisterNowComponent,
    EmptyStateComponent,

    
  ],
  templateUrl: './time-scale.component.html',
  styleUrls: ['./time-scale.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeScaleComponent implements OnDestroy {
  public DisplayTypes = DisplayType;
  @Input({ required: false }) type: DisplayType = this.DisplayTypes.INFOGRAPH;

  // Inject Services
  protected readonly _LanguageService = inject(LanguageService);
  protected readonly _lastSevenMoodsFacade = inject(LastSevenUserMoodsFacade);
  private readonly _StorageService = inject(StorageService);
  private readonly _RoleGuardService = inject(RoleGuardService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _Router = inject(Router);
  private readonly _destroy$ = new Subject<void>();
  lastSevenMoodsEmptyState = MoodsEmptyState;
  protected readonly lastSevenMoodsErrorState = getMoodsError(() => this._lastSevenMoodsFacade.getLastSevenUserMoods());
  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));


  // ----- Auth / Guest Signals -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  // ----- Computed Signals -----
  public readonly isLoggedIn = computed(() => !!this.token());
  protected readonly currentLang = this._LanguageService.getCurrentLanguage();

  // Add a property to store today's date (stripped of time)
  today: Date = new Date();

  // Mood selected via service
  selectedMood = signal<IMoodItem | null>(null);

  // Initial emojis if needed

  lines = [1, 1, 1, 1, 1];

  moodData = [
    { date: '22-1', value: 2 },
    { date: '23-1', value: 3 },
    { date: '24-1', value: 5 },
    { date: '25-1', value: 2 },
    { date: '26-1', value: 1 },
    { date: '27-1', value: 3 },
    { date: '28-1', value: 4 }
  ];

  moodEmojis = [
    'images/mentalHealthScale/moods/smilingFaceWithSmilingEyes.png',
    'images/mentalHealthScale/moods/pensiveFace.png',
    'images/mentalHealthScale/moods/smilingFaceWithHeartEyes.png',
    'images/mentalHealthScale/moods/huggingFace.png',
    'images/mentalHealthScale/moods/anxiousFaceWithSweat.png'
  ];

  constructor() {
    this.today.setHours(0, 0, 0, 0);


    effect(() => {
      const mood = this.selectedMood();
      const moods = this._lastSevenMoodsFacade.lastSevenUserMoods();

      if (mood) {
        Logger.debug('TimeScaleComponent received selected mood:', mood);
      }

      if (moods) {
        Logger.debug('TimeScaleComponent mood data updated:', moods);
      }
    });
  }

  ngOnInit(): void {
    // Always show loader when fetching initially
    Logger.debug("TimeScaleComponent ngOnInit: Initialized with type:", this.type);
    this.refreshLoginStatus();

    // Fetch last seven moods if user is logged in
    if (this.isLoggedIn()) {
      Logger.debug('TimeScaleComponent: User is logged in, fetching last seven moods');
      this._lastSevenMoodsFacade.getLastSevenUserMoods(true);
    } else {
      Logger.debug('TimeScaleComponent: User is not logged in, skipping last seven moods');
    }

    this.setUpFetchDataAfterLogin();
  }

  getEmoji(value: number): string {
    return this.moodEmojis[value];
  }

  getBarHeight(value: number): string {
    const step = 15;
    return `${value * step}%`;
  }

  getBarColor(value: number): string {
    const colors = ['#97e7c8', '#97e7c8', '#97e7c8', '#f4c38e', '#61a5c2'];
    return colors[value] || '#ccc';
  }
  private setUpFetchDataAfterLogin(): void {
    this.refreshLoginStatus();
    this._UserContextService.recallUserDataViewed
      .pipe(takeUntil(this._destroy$))
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('TimeScaleComponent | currentUrl:', currentUrl);
        if (currentUrl.startsWith('/' + MentalHealthScalesRoutesEnum.MENTALHEALTSCALESMAINPAGE) && this.isBrowser) {
          this.refreshLoginStatus();
          if (this.isLoggedIn()) {
            Logger.debug('TimeScaleComponent: User logged in, fetching last seven moods');
            this._lastSevenMoodsFacade.getLastSevenUserMoods(true);
          } else {
            Logger.debug('TimeScaleComponent: User logged out, resetting last seven moods');
            this._lastSevenMoodsFacade.resetLastSevenUserMoodsState();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  // Call this whenever login status may have changed
  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }
  /**
   * Checks if the given mood's creation date is today.
   * @param mood The IMoodItem to check.
   * @returns True if the mood was created today, false otherwise.
   */
  isToday(moodCreatedAt: string): boolean {
    const moodDate = new Date(moodCreatedAt);
    moodDate.setHours(0, 0, 0, 0); // Strip time for comparison
    return moodDate.getTime() === this.today.getTime();
  }
}
