import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ShareButtonComponent } from '../share-button';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SocialMediaType } from '../../../common';
import { TranslateApiPipe } from '../../../common/core/translations';

interface SocialButton {
  name: SocialMediaType;
  icon: string;
}

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [
    ShareButtonComponent,
    TranslateModule,
    CommonModule,
    TranslateApiPipe
  ],
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareComponent implements OnInit {
  @Input() data!: { link: string };
  @Input() linkType: 'post' | 'doctor' | 'program' | 'general' = 'post'; // Type of content being shared
  public link: string = '';
  public isCopied: boolean = false;

  public socialBtns: SocialButton[] = [
    { name: SocialMediaType.TWITTER, icon: 'twitter' },
    { name: SocialMediaType.LINKED_IN, icon: 'linkedin-in' },
    { name: SocialMediaType.FACEBOOK, icon: 'facebook-f' },
    { name: SocialMediaType.WHATS_APP, icon: 'whatsapp' },
    { name: SocialMediaType.INSTAGRAM, icon: 'instagram' },
    { name: SocialMediaType.DISCORD, icon: 'discord' },
    { name: SocialMediaType.TELEGRAM, icon: 'telegram-plane' }
  ];

  ngOnInit(): void {
    this.link = this.data.link ? this.data.link : '';
    console.log('Share Component Initialized. Link:', this.link);
  }

  share(webSite: string): void {
    console.log(`Attempting to share to: ${webSite} with link: ${this.link}`);
    let shareUrl = '';
    const encodedLink = encodeURIComponent(this.link);

    switch (webSite) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedLink}&text=${encodeURIComponent('Check out this link!')}`;
        break;
      case 'linkedIn':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodedLink}`;
        break;
      case 'instagram':
        console.warn('Instagram does not support direct web sharing via URL.');
        alert('Instagram does not support direct web sharing via URL.');
        return;
      case 'discord':
        console.warn('Discord does not have a direct web sharing API.');
        alert('Discord does not support direct web sharing via URL. Please use the copy link option.');
        return;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedLink}&text=${encodeURIComponent('Check out this link!')}`;
        break;
      default:
        console.warn('Unknown social media platform:', webSite);
        alert('Unknown social media platform. Cannot share.');
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
      console.log('Link copied to clipboard successfully using Clipboard API.');
    }).catch(err => {
      console.error('Failed to copy to clipboard using Clipboard API, falling back to execCommand:', err);
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        this.isCopied = true;
        setTimeout(() => {
          this.isCopied = false;
        }, 2000);
        console.log('Link copied to clipboard successfully using document.execCommand.');
      } catch (errFallback) {
        console.error('Fallback: Could not copy text:', errFallback);
      } finally {
        document.body.removeChild(textArea);
      }
    });
  }
}
