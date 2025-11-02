import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-notification-shemmer',
  standalone: true,
  imports: [],
  templateUrl: './notification-shemmer.component.html',
  styleUrls: ['./notification-shemmer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationShemmerComponent {
  items = [1, 2, 3, 4, 5, 6];
}
