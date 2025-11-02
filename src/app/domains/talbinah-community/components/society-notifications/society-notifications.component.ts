import { MyPsychologicalSocietyNotificationCardComponent } from '../my-psychological-society-notification-card';
import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { TranslateModule } from '@ngx-translate/core';
import { ICommunityNotification } from '../../dtos';
import { CardType } from '../../../../common';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-society-notifications',
  standalone: true,
  imports: [
    TranslateModule,

    AutoExactHeightDirective,

    MyPsychologicalSocietyNotificationCardComponent

  ],
  templateUrl: './society-notifications.component.html',
  styleUrls: ['./society-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocietyNotificationsComponent {
  protected notificationsList = signal<ICommunityNotification[]>([]);
  protected cardType = CardType;

  @Input() data!: { notificationsList: ICommunityNotification[] };
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  ngOnInit(): void {
    if (this.data?.notificationsList) {
      this.notificationsList.set(this.data.notificationsList);
    }
  }
}
