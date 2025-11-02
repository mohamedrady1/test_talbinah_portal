import {
  Component, signal, computed, effect, inject, ChangeDetectionStrategy, PLATFORM_ID
} from '@angular/core';
import { IMoodItem, MoodsListingFacade, UserMoodStoreFacade } from '../../../domains';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { YourCurrentMoodSkeletonComponent } from '../../skeletons';
import { ModalService, MoodModalService } from '../../services';
import { SvgIconComponent } from '../svg-icon';
import { Logger } from '../../../common';
import { TranslationsFacade } from '../../../common/core/translations/services';

@Component({
  selector: 'app-your-current-mood-today',
  standalone: true,
  imports: [
    CommonModule,

    YourCurrentMoodSkeletonComponent,
    SvgIconComponent
  ],
  templateUrl: './your-current-mood-today.component.html',
  styleUrl: './your-current-mood-today.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class YourCurrentMoodTodayComponent {
  // --- Dependencies Injected ---
  private readonly modalService = inject(ModalService);
  private readonly moodModalService = inject(MoodModalService);
  private readonly userMoodStoreFacade = inject(UserMoodStoreFacade);
  private readonly moodsListingFacade = inject(MoodsListingFacade);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  // --- Platform Awareness (SSR / Browser) ---
  protected isBrowser = isPlatformBrowser(this.platformId);

  // --- Internal State (Signals) ---
  readonly allMoods = signal<IMoodItem[]>([]);
  readonly selectedMoodId = signal<number | null>(null);

  // --- Exposed Selectors (Computed Signals) ---
  readonly activeMood = computed<IMoodItem | null>(() => {
    const moods = this.allMoods();
    const selectedId = this.selectedMoodId();
    return moods.find((mood) => mood.id === selectedId) || null;
  });

  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  readonly isStoringMood = computed(() =>
    this.userMoodStoreFacade.isStoringMood()
  );

  readonly isLoading = computed(() =>
    this.moodsListingFacade.isLoading()
  );

  constructor() {
    if (!this.isBrowser) {
      return;
    }
    this.initEffects();
  }

  // --- Lifecycle Hooks ---
  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }
    this.loadMoods();
  }

  ngOnDestroy(): void {
    // No cleanup needed for simple mood selection
  }

  // --- Public Action Methods ---
  protected selectMood(mood: IMoodItem): void {
    if (!this.isBrowser) {
      return;
    }
    this.selectedMoodId.set(mood.id);
    Logger.debug('YourCurrentMoodTodayComponent |🎯 Selected mood via YourCurrentMoodTodayComponent:', mood);
  }

  protected onSubmitMood(): void {
    if (!this.isBrowser) {
      return;
    }
    const activeMood = this.activeMood();
    if (!activeMood) {
      Logger.warn('YourCurrentMoodTodayComponent | ⚠️ No active mood selected via YourCurrentMoodTodayComponent');
      return;
    }

    Logger.debug('YourCurrentMoodTodayComponent | 📤 Submitting mood via YourCurrentMoodTodayComponent:', activeMood);
    this.userMoodStoreFacade.storeUserMood({ mood_id: activeMood.id });
  }

  protected closeModal(): void {
    if (!this.isBrowser) {
      return;
    }
    this.modalService.closeAll();
  }

  // --- Private Utility Methods ---
  private loadMoods(): void {
    if (!this.isBrowser) {
      return;
    }
    this.moodsListingFacade.getMoodsListing();
    Logger.debug('YourCurrentMoodTodayComponent | 📥 YourCurrentMoodTodayComponent: Requested moods from facade');
  }

  /**
   * Initialize all reactive effects in one place.
   */
  private initEffects(): void {
    // Handle successful mood storage
    if (!this.isBrowser) {
      return;
    }
    effect(() => {
      if (this.userMoodStoreFacade.storeMoodSuccess()) {
        Logger.debug('YourCurrentMoodTodayComponent | 🎉 Mood stored successfully via YourCurrentMoodTodayComponent');
        this.moodModalService.markMoodSubmittedForToday();
        this.closeModal();
      }
    });

    // Handle mood storage errors
    effect(() => {
      if (this.userMoodStoreFacade.storeMoodError()) {
        Logger.error('YourCurrentMoodTodayComponent | ❌ Failed to store mood via YourCurrentMoodTodayComponent');
      }
    });

    // Keep moods list in sync with facade
    effect(() => {
      const moodsData = this.moodsListingFacade.moods();
      if (moodsData?.data) {
        this.allMoods.set(moodsData.data);
        Logger.debug('YourCurrentMoodTodayComponent | ✅ Moods loaded for YourCurrentMoodTodayComponent:', moodsData.data);

        // Default to first mood if nothing selected
        if (!this.selectedMoodId()) {
          this.selectedMoodId.set(moodsData.data[0]?.id ?? null);
          Logger.debug('YourCurrentMoodTodayComponent | 👉 Default mood selected:', moodsData.data[0]);
        }
      }
    });
  }
}
