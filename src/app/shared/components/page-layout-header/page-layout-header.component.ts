import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
  signal,
  PLATFORM_ID // Make sure PLATFORM_ID is imported
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // isPlatformBrowser
import { ILayoutGridHeaderConfig } from '../../interfaces'; // Verify this path
import { TranslateModule } from '@ngx-translate/core';
import { TranslateApiPipe } from '../../../common/core/translations/pipes';

@Component({
  selector: 'app-page-layout-header',
  standalone: true,
  imports: [TranslateModule, CommonModule, TranslateApiPipe],
  templateUrl: './page-layout-header.component.html',
  styleUrls: ['./page-layout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimized change detection
})
export class PageLayoutHeaderComponent {
  // Configuration for the header content (title, subtitle, image)
  // Marking as required for compile-time safety (Angular 16+)
  @Input({ required: true }) config!: ILayoutGridHeaderConfig;
  // Controls padding behavior, defaults to false
  @Input() disablePadding: boolean = false;
  // Reference to the host element (or a specific element within the parent)
  // for fullscreen operations. This is crucial for proper functionality.
  @Input({ required: true }) card!: ElementRef<HTMLElement>;

  // Emits when the close button is clicked, allowing parent components to react
  @Output() closeRequested = new EventEmitter<void>();

  // Internal component state using Angular Signals (recommended for Angular 17+)
  // `true` when in fullscreen, `false` otherwise
  readonly isFullscreen = signal(false);

  // Inject PLATFORM_ID to determine the execution environment (browser vs. server)
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Toggles fullscreen mode for the provided 'card' element.
   * This operation is client-side only and is guarded for SSR compatibility.
   */
  protected toggleFullscreen(): void {
    // Guard against browser-specific APIs when running on the server
    if (!isPlatformBrowser(this.platformId)) {
      // For SSR, these operations are skipped
      console.warn('Fullscreen operations are client-side only and skipped during SSR.');
      return;
    }

    // Update the signal immediately for a responsive UI
    this.isFullscreen.update(isFull => !isFull);
    const cardElement = this.card?.nativeElement; // Access the native DOM element

    // Ensure the card element exists before attempting fullscreen operations
    if (!cardElement) {
      console.warn('Card element not provided for fullscreen. Cannot toggle fullscreen.');
      this.isFullscreen.set(false); // Reset state if the element is missing
      return;
    }

    if (this.isFullscreen()) {
      // Attempt to enter fullscreen
      if (cardElement.requestFullscreen) {
        cardElement.requestFullscreen().catch(err => {
          // Log any errors and revert the fullscreen state if the request fails
          console.error('Fullscreen request failed:', err);
          this.isFullscreen.set(false);
        });
      } else {
        console.warn('Fullscreen API is not supported on this element or browser.');
        this.isFullscreen.set(false); // Revert if API is not available
      }
    } else {
      // Attempt to exit fullscreen if currently in fullscreen mode
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          // Log errors and revert the fullscreen state if exiting fails
          console.error('Exit fullscreen failed:', err);
          this.isFullscreen.set(true); // Reset to fullscreen if exit fails
        });
      }
    }
  }

  /**
   * Emits the closeRequested event when the close button is clicked.
   */
  protected onCloseClick(): void {
    this.closeRequested.emit();
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }
}
