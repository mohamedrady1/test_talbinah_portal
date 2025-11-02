import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CardType, IGlobalNotification } from '../../../../common';
import { LocalizationService } from '../../../../shared';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-notification-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './header-notification-card.component.html',
  styleUrls: ['./header-notification-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNotificationCardComponent {
  @Input() item!: IGlobalNotification;
  @Input() type: CardType = CardType.SUMMARY;

  cardType = CardType;

  protected readonly _LocalizationService = inject(LocalizationService);

}
