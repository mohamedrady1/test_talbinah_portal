import { Component, Input, signal, ViewChildren, QueryList, ElementRef, AfterViewInit, OnDestroy, HostListener, ChangeDetectorRef, ViewChild, inject, WritableSignal, Signal } from '@angular/core';
import { ReelsComponent } from '../reels/reels.component';
import { CommonModule } from '@angular/common';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { ITab, UserReelsData } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyStateComponent, EmptyStateConfig, ModalService } from '../../../../shared';
import { CreatePsychologicalSocietyPostComponent } from '../create-psychological-society-post';
import { IUserIdentifyProfileData } from '../../dtos';

export const ReelsEmptyState: EmptyStateConfig = {
  imageUrl: 'images/not-found/community/reels/no-reels.svg', // Replace with an actual asset path
  title: 'talbinahCommunity.Reels.emptyState', // Translate key
  gap: '.5rem'
};

@Component({
  selector: 'app-reels-feed',
  standalone: true,
  imports: [CommonModule, ReelsComponent, AutoExactHeightDirective, TranslateModule, EmptyStateComponent],
  templateUrl: './reels-feed.component.html',
  styleUrls: ['./reels-feed.component.scss']
})
export class ReelsFeedComponent implements AfterViewInit, OnDestroy {
  @Input() set feedData(data: UserReelsData[]) {
    this.feeds.set(data);
  }
  feeds = signal<UserReelsData[]>([]);

  @Input() data?: { interests?: ITab[], itemToEdit?: any, userIdentityProfileData?: IUserIdentifyProfileData | null };

  @ViewChildren('reelsComponentInstance') reelComponents!: QueryList<ReelsComponent>;
  @ViewChildren('reelCardWrapper', { read: ElementRef }) reelCardElements!: QueryList<ElementRef>;

  private modalService = inject(ModalService)
  private cdr = inject(ChangeDetectorRef)
  currentActiveFeedIndex = signal(0);
  @ViewChild('reelsFeedContainer') reelsFeedContainer!: ElementRef<HTMLElement>;

  private isScrollingProgrammatically = false;
  private scrollTimeout: any;
  private activationTimeout: any; // Add a timeout for activation to prevent race conditions

  protected readonly reelsEmptyState = ReelsEmptyState;

  ngAfterViewInit(): void {
    this.cdr.detectChanges(); // Ensure ViewChildren are ready

    // Delay initial activation slightly to ensure all components are fully rendered
    this.activationTimeout = setTimeout(() => {
      this.activateReelCard(this.currentActiveFeedIndex());
      this.scrollToActiveReelCard();
    }, 50); // Small delay, can be adjusted if needed
    setInterval(() => {
      console.log('ReelsFeedComponent initialized with feeds:', this.data?.userIdentityProfileData);
    }, 2000);
    this.reelsFeedContainer.nativeElement.addEventListener('scroll', this.onScrollDebounced.bind(this));
  }

  ngOnDestroy(): void {
    if (this.reelsFeedContainer && this.reelsFeedContainer.nativeElement) {
      this.reelsFeedContainer.nativeElement.removeEventListener('scroll', this.onScrollDebounced.bind(this));
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    if (this.activationTimeout) { // Clear activation timeout on destroy
      clearTimeout(this.activationTimeout);
    }
  }

  onScrollDebounced(): void {
    if (this.isScrollingProgrammatically) {
      return;
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => {
      this.onScroll();
    }, 150);
  }

  /**
   * Activates a specific reel card and deactivates others.
   * This now includes a more explicit pause/play sequence.
   * @param index The index of the reel card to activate.
   */
  activateReelCard(index: number): void {
    if (index >= 0 && index < this.feeds().length && index !== this.currentActiveFeedIndex()) {
      // Pause the previously active reel card FIRST
      const prevActiveComponent = this.reelComponents.get(this.currentActiveFeedIndex());
      if (prevActiveComponent) {
        console.log(`Deactivating card at index ${this.currentActiveFeedIndex()}`);
        prevActiveComponent.pausePlayback();
        // Important: Set isActive to false immediately to trigger ngOnChanges
        prevActiveComponent.isActive = false;
      }

      // Update the active index
      this.currentActiveFeedIndex.set(index);
      console.log(`Activating card at index ${index}`);

      // Activate the new reel card (set isActive to true, then start playback)
      const newActiveComponent = this.reelComponents.get(this.currentActiveFeedIndex());
      if (newActiveComponent) {
        // Important: Set isActive to true immediately to trigger ngOnChanges
        newActiveComponent.isActive = true;
        newActiveComponent.startPlayback(); // Explicitly start playback
      }
      this.cdr.detectChanges(); // Force change detection to ensure inputs are updated
    } else if (index === this.currentActiveFeedIndex()) {
      // If trying to activate the same card, just ensure it's playing
      const activeComponent = this.reelComponents.get(index);
      if (activeComponent) {
        activeComponent.isActive = true; // Ensure it's marked active
        activeComponent.startPlayback();
      }
    }
  }


  scrollToActiveReelCard(): void {
    const activeCardElement = this.reelCardElements.get(this.currentActiveFeedIndex())?.nativeElement;
    if (activeCardElement && this.reelsFeedContainer?.nativeElement) {
      this.isScrollingProgrammatically = true;
      this.reelsFeedContainer.nativeElement.scrollTo({
        top: activeCardElement.offsetTop,
        behavior: 'smooth'
      });

      setTimeout(() => {
        this.isScrollingProgrammatically = false;
      }, 500);
    }
  }

  onScroll(): void {
    if (this.isScrollingProgrammatically) {
      return;
    }

    const container = this.reelsFeedContainer.nativeElement;
    const containerHeight = container.clientHeight;
    const scrollTop = container.scrollTop;

    const viewportCenter = scrollTop + (containerHeight / 2);

    let newActiveIndex = this.currentActiveFeedIndex();
    let minDistance = Infinity;

    this.reelCardElements.forEach((reelCardEl, index) => {
      const el = reelCardEl.nativeElement;
      const elTop = el.offsetTop;
      const elHeight = el.offsetHeight;

      const elCenter = elTop + (elHeight / 2);

      const distance = Math.abs(elCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        newActiveIndex = index;
      }
    });

    if (newActiveIndex !== this.currentActiveFeedIndex()) {
      this.activateReelCard(newActiveIndex);
      this.scrollToActiveReelCard();
    }
  }

  goToNextFeed(): void {
    const nextIndex = this.currentActiveFeedIndex() + 1;
    if (nextIndex < this.feeds().length) {
      this.activateReelCard(nextIndex);
      this.scrollToActiveReelCard();
    }
  }

  goToPreviousFeed(): void {
    const prevIndex = this.currentActiveFeedIndex() - 1;
    if (prevIndex >= 0) {
      this.activateReelCard(prevIndex);
      this.scrollToActiveReelCard();
    }
  }

  @HostListener('window:keydown', ['$event'])
  protectedhandleKeyboardEvent(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.goToNextFeed();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.goToPreviousFeed();
        break;
    }
  }

  protected onReelCardFinished(): void {
    console.log('A ReelsComponent instance finished playing all its reels. Moving to next feed card.');
    this.goToNextFeed();
  }

  protected openCreateReels(): void {
    this.modalService.open(CreatePsychologicalSocietyPostComponent, {
      inputs: {
        image: 'images/community/icons/header-icon.png',
        title: 'talbinahCommunity.newShare',
        subtitle: 'talbinahCommunity.shareText',
        selectedButtonId: 'reels', // Ensure the correct button is selected
        data: {
          // Pass the @Input property to the child component
          interests: this.data?.interests,
          userIdentityProfileData: this.data?.userIdentityProfileData
        }
      },
      width: '60%',
      minHeight: '20rem',
      maxHeight: '70rem',
      isPhoneFromDown: true,
    });
  }
}