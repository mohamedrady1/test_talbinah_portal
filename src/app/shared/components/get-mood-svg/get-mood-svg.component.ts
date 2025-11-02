import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { moods } from '../../../common';

@Component({
  selector: 'app-get-mood-svg',
  standalone: true,
  imports: [],
  templateUrl: './get-mood-svg.component.html',
  styleUrls: ['./get-mood-svg.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetMoodSvgComponent {
  @Input() mood!: moods;
  state = moods;
}
