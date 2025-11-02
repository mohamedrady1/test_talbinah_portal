import { Component, ElementRef, inject, Input, PLATFORM_ID, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DEFAULT_CARD_WIDTH_PX, DEFAULT_SLIDER_CONFIG, MOCK_STORY_CARDS } from '../../constants';
import { IGlobalStorySliderConfig, IStoryCard } from '../../models';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LocalizationService } from '../../../../shared';

import { StorySliderCardComponent } from '../story-slider-card';

@Component({
  selector: 'app-global-story-slider',
  standalone: true,
  imports: [
    CommonModule,
    StorySliderCardComponent
  ],
  templateUrl: './global-story-slider.component.html',
  styleUrls: ['./global-story-slider.component.scss']
})
export class GlobalStorySliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sliderWrapper') private sliderWrapperRef?: ElementRef<HTMLElement>; // Use more specific name for clarity

  // Strongly type the input config with a fallback default value
  @Input() public config: IGlobalStorySliderConfig = DEFAULT_SLIDER_CONFIG;

  // Strongly type the cards data
  public cards: IStoryCard[] = MOCK_STORY_CARDS; // Use constant for mock data
  public cardWidth: number = DEFAULT_CARD_WIDTH_PX; // Use constant for card width

  public isDragging: boolean = false;
  private startX: number = 0;
  private scrollLeftStart: number = 0;
  private autoScrollIntervalId: ReturnType<typeof setInterval> | undefined; // Store interval ID for cleanup

  private readonly platformId: Object = inject(PLATFORM_ID);
  private readonly isBrowser: boolean = isPlatformBrowser(this.platformId);
  private readonly localizationService: LocalizationService = inject(LocalizationService); // Renamed for consistency

  ngOnInit(): void {
    // You can perform initial setup here if needed, but for a slider, AfterViewInit is often more appropriate for DOM interaction.
  }

  ngAfterViewInit(): void {
    // Check if running in browser and if auto-scroll is enabled
    if (this.isBrowser && this.config.autoScroll.isEnabled) {
      this.startAutoScroll();
    }
  }

  ngOnDestroy(): void {
    // Clean up the interval to prevent memory leaks
    this.stopAutoScroll();
  }

  /**
   * Handles the mouse down event to start dragging.
   * @param event The mouse event.
   */
  protected onMouseDown(event: MouseEvent): void {
    if (!this.isBrowser || !this.sliderWrapperRef) return;
    if (event.button !== 0) return; // Only allow left-click

    this.isDragging = true;
    this.startX = event.clientX;
    this.scrollLeftStart = this.sliderWrapperRef.nativeElement.scrollLeft;
    this.stopAutoScroll(); // Stop auto-scroll when user interacts
    event.preventDefault(); // Prevent default browser drag behavior (e.g., image dragging)
  }

  /**
   * Handles the mouse move event for dragging the slider.
   * @param event The mouse event.
   */
  protected onMouseMove(event: MouseEvent): void {
    if (!this.isBrowser || !this.isDragging || !this.sliderWrapperRef) return;

    const moveDistance: number = event.clientX - this.startX;
    this.sliderWrapperRef.nativeElement.scrollLeft = this.scrollLeftStart - moveDistance;
  }

  /**
   * Handles the mouse up event to stop dragging.
   */
  protected onMouseUp(): void {
    if (!this.isBrowser) return;
    this.isDragging = false;
    this.startAutoScroll(); // Resume auto-scroll after user interaction
  }

  /**
   * Handles the mouse leave event to stop dragging if the mouse leaves the slider area.
   */
  protected onMouseLeave(): void {
    if (!this.isBrowser) return;
    if (this.isDragging) { // Only if dragging was active
      this.isDragging = false;
      this.startAutoScroll(); // Resume auto-scroll
    }
  }

  /**
   * Scrolls the slider to the left.
   * @param container The HTMLElement to scroll.
   */
  protected scrollLeft(container: HTMLElement): void {
    if (!this.isBrowser) return;
    // Calculate scroll amount based on card width and gap
    const scrollAmount: number = this.cardWidth + 20; // 20px is the gap from SCSS
    const direction: number = this.localizationService.getCurrentLanguage() === 'ar' ? 1 : -1;
    container.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  }

  /**
   * Scrolls the slider to the right.
   * @param container The HTMLElement to scroll.
   */
  protected scrollRight(container: HTMLElement): void {
    if (!this.isBrowser) return;
    // Calculate scroll amount based on card width and gap
    const scrollAmount: number = this.cardWidth + 20; // 20px is the gap from SCSS
    const direction: number = this.localizationService.getCurrentLanguage() === 'ar' ? -1 : 1;
    container.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  }

  /**
   * Initiates the automatic scrolling of the slider.
   */
  private startAutoScroll(): void {
    // Clear any existing interval to prevent multiple intervals running
    this.stopAutoScroll();
    this.autoScrollIntervalId = setInterval(() => {
      if (this.sliderWrapperRef) {
        // Check if we are at the end of the slider to loop back
        const { scrollWidth, clientWidth, scrollLeft } = this.sliderWrapperRef.nativeElement;
        const isRtl = this.localizationService.getCurrentLanguage() === 'ar';

        if (isRtl) {
          // For RTL, scrollLeft is 0 when at the right end, and negative towards the left
          // The total width is (scrollWidth - clientWidth) in absolute terms.
          // If scrollLeft is close to (clientWidth - scrollWidth), we're at the beginning (left end of content)
          // so we jump to the right end (scrollLeft = 0).
          if (scrollLeft >= 0) { // If at or past right end (initial state or scrolled far right)
            this.sliderWrapperRef.nativeElement.scrollLeft = clientWidth - scrollWidth; // Jump to visual left end (RTL's end)
          } else {
            this.scrollRight(this.sliderWrapperRef.nativeElement); // Keep scrolling right (visually moving left)
          }
        } else { // LTR
          if (scrollLeft + clientWidth >= scrollWidth) { // If at or past the right end
            this.sliderWrapperRef.nativeElement.scrollLeft = 0; // Jump to the beginning
          } else {
            this.scrollRight(this.sliderWrapperRef.nativeElement);
          }
        }
      }
    }, this.config.autoScroll.interval);
  }

  /**
   * Stops the automatic scrolling of the slider.
   */
  private stopAutoScroll(): void {
    if (this.autoScrollIntervalId) {
      clearInterval(this.autoScrollIntervalId);
      this.autoScrollIntervalId = undefined; // Clear the stored ID
    }
  }
}
