import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './notification-skeleton.component.html',
  styleUrls: ['./notification-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationSkeletonComponent {
  @Input() items = [1, 2, 3, 4];
}
