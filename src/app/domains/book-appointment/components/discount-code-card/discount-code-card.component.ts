import { ChangeDetectionStrategy, Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Assuming TooltipComponent is standalone or part of an NgModule imported higher up
import { TooltipComponent } from '../../../../shared/components/tooltip/tooltip.component';
import { TranslateApiPipe } from '../../../../common/core/translations';

// Assuming these are globally defined or imported from a common library
import { IGlobalDoctorCopounModel, Logger, Position, TriggerTypes } from '../../../../common';

@Component({
  selector: 'app-discount-code-card',
  standalone: true,
  imports: [
    CommonModule, // Required for ngIf, ngClass etc.
    TranslateModule,
    TooltipComponent,
    TranslateApiPipe
  ],
  templateUrl: './discount-code-card.component.html',
  styleUrls: ['./discount-code-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountCodeCardComponent {
  // Input property for the coupon data. It can be null.
  @Input() item: IGlobalDoctorCopounModel | null = null; // Initialize with null for safety

  // Public properties for template access, using readonly for constants/enums
  protected readonly Position = Position;
  protected readonly trigger = TriggerTypes;
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    // No initialization logic needed here for inputs
  }

  /**
   * Copies the coupon code to the clipboard.
   * Uses `document.execCommand('copy')` for broader compatibility, especially in iframes.
   * @returns {void}
   */
  protected copyToClipboard(): void {
    if (!this.item?.coupon) {
      Logger.warn('DiscountCodeCardComponent: No coupon code to copy.');
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      const couponCode = this.item.coupon;
      let textarea: HTMLTextAreaElement | undefined;

      try {
        textarea = document.createElement('textarea');
        textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in some browsers
        textarea.style.opacity = '0'; // Hide textarea
        textarea.value = couponCode;
        document.body.appendChild(textarea);
        textarea.select(); // Select the text
        document.execCommand('copy'); // Execute copy command
        Logger.debug('DiscountCodeCardComponent => Copied to clipboard (execCommand):', couponCode);
        // In a real app, you might trigger a small visual feedback (e.g., a toast message) here
      } catch (err) {
        Logger.error('DiscountCodeCardComponent => Failed to copy to clipboard (execCommand fallback):', err);
        // Fallback for environments where execCommand also fails or is deprecated
        // You might consider navigator.clipboard.writeText() here if execCommand is not preferred,
        // but be aware of iframe restrictions.
        // For this specific context (iframe), execCommand is the primary fallback.
      } finally {
        if (textarea) {
          document.body.removeChild(textarea); // Clean up the temporary textarea
        }
      }
    } else {
      Logger.debug('DiscountCodeCardComponent => Copy to clipboard not available on server-side.');
    }
  }
}
