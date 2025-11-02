import { TranslateApiPipe } from './../../../../common/core/translations/pipes/translate-api.pipe';
import { getMoodsError, IMoodItem, LastSevenUserMoodsFacade, MoodsEmptyState, MoodsListingFacade, UserMoodStoreFacade } from '../../../../domains';
import { Component, OnInit, inject, effect, Input, ChangeDetectionStrategy, PLATFORM_ID, computed, signal } from '@angular/core'; // Import 'effect'
import { Logger, StorageService } from '../../../../common'; // Adjust path if needed
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EmptyStateComponent, ErrorStateComponent, StorageKeys } from '../../../../shared';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { RoleGuardService, UserContextService } from '../../../authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-your-mood',
  standalone: true,
  imports: [
    CommonModule,
    LazyLoadImageDirective,
    ErrorStateComponent,
    EmptyStateComponent,

    TranslateApiPipe
  ],
  templateUrl: './choose-your-mood.component.html',
  styleUrls: ['./choose-your-mood.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChooseYourMoodComponent implements OnInit {
  @Input() hideTitle: boolean = false;
  @Input() isSmall: boolean = false;
  // Inject the MoodsFacade for listing moods
  protected readonly _moodsFacade = inject(MoodsListingFacade);
  // Inject the new UserMoodStoreFacade for storing moods
  protected readonly _userMoodStoreFacade = inject(UserMoodStoreFacade);
  chooseMoodEmptyState = MoodsEmptyState;
  protected readonly chooseMoodErrorState = getMoodsError(() => this._moodsFacade.getMoodsListing());

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

  // ----- Pending mood storage -----
  private pendingMood: IMoodItem | null = null;

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  constructor() {
    // An effect to react to the mood storage success or error
    effect(() => {
      if (this._userMoodStoreFacade.storeMoodSuccess()) {
        Logger.debug('Mood stored successfully. You could show a success message here.');
        // Clear pending mood after successful storage
        this.pendingMood = null;
        // Optionally, reset the store state after a successful operation to clear the flag
        // this._userMoodStoreFacade.resetMoodStoreState();
        // You might want to navigate to another page or show a modal here
      }
      if (this._userMoodStoreFacade.storeMoodError()) {
        Logger.error('Failed to store mood. Display error message if not handled by toast.');
        // The toast service in the facade already handles displaying the error.
      }
    });

    // Effect to handle pending mood after login
    effect(() => {
      const isLoggedIn = this.isLoggedIn();
      if (isLoggedIn && this.pendingMood) {
        Logger.debug('User logged in, processing pending mood:', this.pendingMood);
        // Process the pending mood
        this.processPendingMood();
      }
    });
  }

  ngOnInit(): void {
    // On component initialization, trigger the moods list fetch
    this._moodsFacade.getMoodsListing();
    // Also, reset the mood store state to ensure it's clean for a new operation
    this._userMoodStoreFacade.resetMoodStoreState();
  }

  /**
   * Handles the click event on a mood option.
   * This method now triggers the mood storage via the UserMoodStoreFacade.
   * @param mood The IMoodItem that was clicked.
   */
  onMoodClick(mood: IMoodItem): void {
    Logger.debug('Mood selected for storage:', mood);
    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      // Store the mood for later processing after login
      this.pendingMood = mood;
      Logger.debug('User not logged in, storing pending mood:', mood);
      this._RoleGuardService.openLoginModal();
      return;
    }
    // Call the storeUserMood method from the UserMoodStoreFacade
    this._userMoodStoreFacade.storeUserMood({ mood_id: mood.id });
  }

  /**
   * Processes the pending mood after successful login
   */
  private processPendingMood(): void {
    if (this.pendingMood) {
      Logger.debug('Processing pending mood after login:', this.pendingMood);
      // Store the pending mood
      this._userMoodStoreFacade.storeUserMood({ mood_id: this.pendingMood.id });
    }
  }
}
