import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizationService } from '../../localization';
import { ModalService } from '../../services';
import { Logger } from '../../../common';
import { ShareComponent } from '../share/share.component';

@Component({
  selector: 'app-share-social',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './share-social.component.html',
  styleUrls: ['./share-social.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareSocialComponent {
  @Input() fullUrl!: string;
  @Input() icon!: string;
  @Input() linkType: 'post' | 'doctor' | 'program' | 'general' = 'post'; // Type of content being shared

  public localization = inject(LocalizationService);
  private readonly modalService: ModalService = inject(ModalService);

  share(): void {
    this.modalService.open(ShareComponent, {
      inputs: {
        image: 'images/community/icons/header-icon.png',
        title: 'talbinahCommunity.share',
        data: {
          link: this.fullUrl,
        },
        linkType: this.linkType
      },

      width: '40%',
    });
  }
}
