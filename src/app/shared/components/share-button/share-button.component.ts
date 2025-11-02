import { ChangeDetectionStrategy, Component, inject, Inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SocialMediaType } from '../../../common';

@Component({
  selector: 'app-share-button',
  standalone: true,
  imports: [],
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareButtonComponent {
  @Input() type!: SocialMediaType
  @Input() shareUrl: string = '';
  navUrl: any;
  private readonly platformId = inject(PLATFORM_ID);

  socialBtns = [
    { name: SocialMediaType.FACEBOOK, icon: 'facebook' },
    { name: SocialMediaType.TWITTER, icon: 'twitter' },
    { name: SocialMediaType.LINKED_IN, icon: 'linkedin-in' },
    { name: SocialMediaType.WHATS_APP, icon: 'whatsapp' },
    { name: SocialMediaType.INSTAGRAM, icon: 'instagram' },
    { name: SocialMediaType.DISCORD, icon: 'discord' },
    { name: SocialMediaType.TELEGRAM, icon: 'telegram' }
  ]

  ngOnInit(): void {
    this.createNavigationUrl();
  }

  private createNavigationUrl(): void {
    let searchParams = new URLSearchParams();
    switch (this.type) {
      case SocialMediaType.FACEBOOK:
        searchParams.set('u', this.shareUrl);
        this.navUrl = 'https://www.facebook.com/sharer/sharer.php?' + searchParams;
        break;
      case SocialMediaType.TWITTER:
        searchParams.set('url', this.shareUrl);
        this.navUrl = 'https://twitter.com/share?' + searchParams;
        break;
      case SocialMediaType.LINKED_IN:
        searchParams.set('url', this.shareUrl);
        this.navUrl = 'https://linkedIn.com/share?' + searchParams;
        break;
      case SocialMediaType.WHATS_APP:
        searchParams.set('url', this.shareUrl);
        this.navUrl = ' https://wa.me/?text=' + searchParams;
        break;
      case SocialMediaType.INSTAGRAM:
        searchParams.set('url', this.shareUrl);
        this.navUrl = 'https://instagram.com/share?' + searchParams;
        break;
      case SocialMediaType.DISCORD:
        searchParams.set('url', this.shareUrl);
        this.navUrl = 'https://discord.com/share?' + searchParams;
        break;
      case SocialMediaType.TELEGRAM:
        searchParams.set('url', this.shareUrl);
        this.navUrl = 'https://telegram.me/share/url?text=<' + searchParams + '>';
        break;
    }
  }

  public share(): Window | null {
    if (isPlatformBrowser(this.platformId)) {
      return window.open(this.navUrl, "_blank");
    }
    return null;
  }
}
