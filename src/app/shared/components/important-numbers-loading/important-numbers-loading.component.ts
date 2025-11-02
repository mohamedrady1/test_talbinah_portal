import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-important-numbers-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './important-numbers-loading.component.html',
  styleUrls: ['./important-numbers-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportantNumbersLoadingComponent {
  // Array for generating loading cards
  readonly loadingCards = Array.from({ length: 6 }, (_, i) => i + 1);
} 