import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-appointment-card-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './appointment-card-skeleton.component.html',
  styleUrls: ['./appointment-card-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentCardSkeletonComponent {

}
