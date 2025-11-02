import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardType } from '../../../../common';

@Component({
  selector: 'app-therapeutic-program-card-shimmer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './therapeutic-program-card-shimmer.component.html',
  styleUrls: ['./therapeutic-program-card-shimmer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TherapeuticProgramCardShimmerComponent {
  @Input() type: CardType = CardType.DETAILS;
  cardType = CardType;
  @Input() loading = false;
}
