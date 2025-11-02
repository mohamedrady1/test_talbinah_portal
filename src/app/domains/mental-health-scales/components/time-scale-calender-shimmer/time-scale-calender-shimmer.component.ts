import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-time-scale-calender-shimmer',
  standalone: true,
  imports: [],
  templateUrl: './time-scale-calender-shimmer.component.html',
  styleUrls: ['./time-scale-calender-shimmer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeScaleCalenderShimmerComponent {
  @Input() number!: number;
}
