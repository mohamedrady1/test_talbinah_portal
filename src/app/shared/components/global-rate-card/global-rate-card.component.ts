import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IGlobalDoctorReviewModel } from '../../../common';

@Component({
  selector: 'app-global-rate-card',
  standalone: true,
  imports: [],
  templateUrl: './global-rate-card.component.html',
  styleUrls: ['./global-rate-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalRateCardComponent {
  @Input() item: IGlobalDoctorReviewModel | null = null;

  protected onImageError(event: Event, gender: number | null): void {
    const target = event.target as HTMLImageElement;
    target.src = gender === 1
      ? 'images/not-found/no-woman-doctor.svg'
      : 'images/not-found/no-doctor.svg';
  }

  /** Extracts initials like "E.A" from full name */
  protected get userInitials(): string {
    const fullName = this.item?.user?.full_name ?? '';
    if (!fullName.trim()) return '';

    const parts = fullName.trim().split(/\s+/); // split by spaces
    return parts.map(p => p[0].toUpperCase()).join('.'); // take first letter
  }
}
