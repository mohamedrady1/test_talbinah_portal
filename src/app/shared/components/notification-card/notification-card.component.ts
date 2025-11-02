import { ChangeDetectionStrategy, Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { CardType, Logger } from '../../../common';
import { LocalizationService } from '../..';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationCardComponent {
  @Input() type: CardType = CardType.SUMMARY;
  cardType = CardType;
  currentLanguage!: string;

  private readonly localization = inject(LocalizationService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly fallbackImageUrl: string = 'https://talbinah.net/assets/images/not-found/no-article.svg';

  @Input() item!: any;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = this.localization.getCurrentLanguage();
    }

  }

  protected onCardClick(): void {
    Logger.debug('notification card clicked ', this.item);
  }
}
