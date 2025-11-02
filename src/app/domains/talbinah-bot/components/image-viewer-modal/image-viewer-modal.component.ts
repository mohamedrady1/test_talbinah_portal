import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-viewer-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-viewer-modal.component.html',
  styleUrls: ['./image-viewer-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewerModalComponent {
  @Input() data: any;
  @Output() closed = new EventEmitter<any>();

  showDownloadButton = signal(false);

  downloadImage(event: MouseEvent) {
    event.stopPropagation();
    if (this.data?.imgUrl) {
      const link = document.createElement('a');
      link.href = this.data.imgUrl;
      const filename = this.data.title ? `${this.data.title.replace(/\s+/g, '_')}.png` : 'downloaded_image.png';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('No image URL available to download from modal.');
    }
  }
}