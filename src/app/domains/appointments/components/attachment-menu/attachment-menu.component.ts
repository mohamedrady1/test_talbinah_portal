import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from '../../../../shared';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-attachment-menu',
  standalone: true,
  imports: [
    SvgIconComponent,
    TranslateModule,
    CommonModule,
    TranslateApiPipe
  ],
  templateUrl: './attachment-menu.component.html',
  styleUrls: ['./attachment-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentMenuComponent {
  @Input() showMenu: boolean = false;
  @Output() fileTypeSelected = new EventEmitter<'general' | 'image' | 'camera' | 'video' | 'audio' | 'document'>();

  onSelectFileType(type: 'general' | 'image' | 'camera' | 'video' | 'audio' | 'document'): void {
    this.fileTypeSelected.emit(type);
  }
}
