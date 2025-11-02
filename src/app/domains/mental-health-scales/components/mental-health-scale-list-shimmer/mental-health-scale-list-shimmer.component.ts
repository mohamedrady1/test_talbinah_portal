import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardType } from '../../../../common';

@Component({
  selector: 'app-mental-health-scale-list-shimmer',
  standalone: true,
  imports: [],
  templateUrl: './mental-health-scale-list-shimmer.component.html',
  styleUrls: ['./mental-health-scale-list-shimmer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentalHealthScaleListShimmerComponent {
  @Input() type: CardType = CardType.DETAILS;
  cardType = CardType;
}
