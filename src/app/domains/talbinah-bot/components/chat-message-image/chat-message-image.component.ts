import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IChatMessageImage } from '../../models';
import { ModalService } from '../../../../shared';
import { ImageViewerModalComponent } from '../image-viewer-modal';


@Component({
  selector: 'app-chat-message-image',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './chat-message-image.component.html',
  styleUrls: ['./chat-message-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageImageComponent {
  @Input() imageUrl: any | null = null;
  @Input() replay: boolean = false;
  private modalService = inject(ModalService);

  showOverlay = signal(false);

  constructor() { }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'images/icons/logo-2.png';
    imgElement.alt = 'Image not available';
  }

  downloadImage(event: MouseEvent) {
    event.stopPropagation();
    if (this.imageUrl) {
      const link = document.createElement('a');
      link.href = this.imageUrl;
      const filename = this.imageUrl.substring(this.imageUrl.lastIndexOf('/') + 1) || 'downloaded_image.png';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('No image URL available to download.');
    }
  }

  viewImageFullscreen(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    if (this.imageUrl) {
      this.modalService.open(ImageViewerModalComponent, {
        inputs: {
          title: 'view_image',
          data: {
            imgUrl: this.imageUrl
          }
        },
        outputs: {
          closed: (data: any): void => {
            console.log('Image viewer modal closed with data:', data);
          }
        },
        width: 'fit-content',
        height: 'fit-content',
      });
    } else {
      console.warn('No image URL available to view in modal.');
    }
  }
}
