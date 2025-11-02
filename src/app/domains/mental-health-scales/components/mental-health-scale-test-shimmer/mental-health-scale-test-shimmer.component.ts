import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardType } from '../../../../common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mental-health-scale-test-shimmer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mental-health-scale-test-shimmer.component.html',
  styleUrls: ['./mental-health-scale-test-shimmer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentalHealthScaleTestShimmerComponent {
  @Input() type: CardType = CardType.DETAILS;
  cardType = CardType;
}
