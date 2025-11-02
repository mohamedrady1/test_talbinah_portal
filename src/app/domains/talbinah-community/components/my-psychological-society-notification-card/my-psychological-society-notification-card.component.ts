import { Component, computed, inject, Input, PLATFORM_ID } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ICommunityNotification } from '../../dtos';
import { CardType } from '../../../../common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LocalizationService } from '../../../../shared';

export interface SharedPostCardConfig {
  imageUrl: string;
  sharedBy: string;
  sharedFrom: string;
}

@Component({
  selector: 'app-my-psychological-society-notification-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './my-psychological-society-notification-card.component.html',
  styleUrls: ['./my-psychological-society-notification-card.component.scss']
})
export class MyPsychologicalSocietyNotificationCardComponent {
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
}
