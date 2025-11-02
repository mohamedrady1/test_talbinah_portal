import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mood-card',
  standalone: true,
  imports: [],
  templateUrl: './mood-card.component.html',
  styleUrls: ['./mood-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoodCardComponent {

}
