import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  PLATFORM_ID
} from '@angular/core';
import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';
import { LanguageService } from '../../../../common';
import { DownloadableFile } from '../../models';
import { FileType } from '../../enums';
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [CommonModule, TranslateApiPipe],
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileViewerComponent {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly languageService = inject(LanguageService);
  protected readonly currentLang = this.languageService.getCurrentLanguage();

  @Input() file: DownloadableFile | null = null;
  @Input() allowShortTexts: boolean | null = false;
  @Input() hideButtonAction: boolean | null = false;
  protected readonly fileType = FileType;

  protected download(file: DownloadableFile): void {
    if (isPlatformBrowser(this.platformId)) {
      const link = document.createElement('a');
      link.href = file.url;
      link.setAttribute('download', file.name);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  }

  protected view(file: DownloadableFile): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open(file.url, '_blank');
    }
  }

  protected formatFileSize(bytes: number): { value: string; key: string } {
    if (bytes === 0) return { value: '0', key: 'bytes' };

    const k = 1024;
    const keys = ['bytes', 'kb', 'mb', 'gb', 'tb'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = (bytes / Math.pow(k, i)).toFixed(2);

    return { value, key: keys[i] };
  }

  protected getFormattedFileName(file: DownloadableFile): string {
    const extension = file.type.toLowerCase();
    const name = file.name.toLowerCase().endsWith(`.${extension}`)
      ? file.name
      : `${file.name}.${extension}`;
    return name;
  }
}
