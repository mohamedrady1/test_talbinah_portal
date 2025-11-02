import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface FaqCardItem {
  id: number;
  title: string;
  description?: string;
  image?: string;
  color?: string;
  icon?: string;
}

@Component({
  selector: 'app-faq-card',
  standalone: true,
  imports: [],
  templateUrl: './faq-card.component.html',
  styleUrls: ['./faq-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqCardComponent {
  @Input() item!: FaqCardItem;
}
