import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportantNumberItem } from '../../../domains/settings/dtos/responses/important-numbers-response.dto';

@Component({
  selector: 'app-important-number-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './important-number-card.component.html',
  styleUrls: ['./important-number-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportantNumberCardComponent {
  @Input() importantNumber!: ImportantNumberItem;
} 