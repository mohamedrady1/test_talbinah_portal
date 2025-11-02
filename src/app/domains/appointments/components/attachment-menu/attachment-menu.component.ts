import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from '../../../../shared';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-attachment-menu',
  standalone: true,
  imports: [
    SvgIconComponent,
    TranslateModule,
    CommonModule
  ],
  templateUrl: './attachment-menu.component.html',
  styleUrls: ['./attachment-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentMenuComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input() showMenu: boolean = false;
  @Output() fileTypeSelected = new EventEmitter<'general' | 'image' | 'camera' | 'video' | 'audio' | 'document'>();

  onSelectFileType(type: 'general' | 'image' | 'camera' | 'video' | 'audio' | 'document'): void {
    this.fileTypeSelected.emit(type);
  }
}
