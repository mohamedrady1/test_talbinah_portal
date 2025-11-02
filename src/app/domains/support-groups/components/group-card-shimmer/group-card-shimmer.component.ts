import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardType } from '../../../../common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-card-shimmer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-card-shimmer.component.html',
  styleUrls: ['./group-card-shimmer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupCardShimmerComponent {
  @Input() type: CardType = CardType.DETAILS;
  cardType = CardType;
  @Input() loading = false;
}
