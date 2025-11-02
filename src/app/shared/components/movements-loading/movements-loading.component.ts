import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movements-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movements-loading.component.html',
  styleUrls: ['./movements-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovementsLoadingComponent {
  // Array for generating loading cards
  readonly loadingCards = Array.from({ length: 5 }, (_, i) => i + 1);
} 