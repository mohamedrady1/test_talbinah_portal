import { MyPsychologicalSocietyNotificationCardComponent } from '../my-psychological-society-notification-card';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { TranslateModule } from '@ngx-translate/core';
import { ICommunityNotification } from '../../dtos';
import { CardType } from '../../../../common';
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
  selector: 'app-society-notifications',
  standalone: true,
  imports: [
    TranslateModule,

    AutoExactHeightDirective,

    MyPsychologicalSocietyNotificationCardComponent,

    TranslateApiPipe
  ],
  templateUrl: './society-notifications.component.html',
  styleUrls: ['./society-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocietyNotificationsComponent {
  protected notificationsList = signal<ICommunityNotification[]>([]);
  protected cardType = CardType;

  @Input() data!: { notificationsList: ICommunityNotification[] };

  ngOnInit(): void {
    if (this.data?.notificationsList) {
      this.notificationsList.set(this.data.notificationsList);
    }
  }
}
