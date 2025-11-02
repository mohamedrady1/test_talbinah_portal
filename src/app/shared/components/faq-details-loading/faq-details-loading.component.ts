import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq-details-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-details-loading.component.html',
  styleUrls: ['./faq-details-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqDetailsLoadingComponent {
  // Array for generating loading cards
  readonly loadingCards = Array.from({ length: 4 }, (_, i) => i + 1);
  readonly loadingLines = Array.from({ length: 6 }, (_, i) => i + 1);
}
