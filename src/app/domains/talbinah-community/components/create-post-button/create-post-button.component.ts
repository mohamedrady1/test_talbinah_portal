import { Component, EventEmitter, inject, Input, Output, signal, WritableSignal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationsFacade } from '../../../../common/core/translations/services';
export interface ButtonConfig {
  id: string; // Unique identifier for the button
  text: string;
  imageSrc: string; // Default image source
  activeImageSrc: string; // Image source when active
  action?: (id: string) => void; // Optional action to perform on click
}

@Component({
  selector: 'app-create-post-button',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './create-post-button.component.html',
  styleUrls: ['./create-post-button.component.scss']
})
export class CreatePostButtonComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }

  @Input({ required: true }) config!: ButtonConfig;
  // This input now accepts a simple boolean
  @Input() public active: boolean = false;
  @Output() buttonClick = new EventEmitter<string>();

  protected onClick(): void {
    if (this.config.action) {
      this.config.action(this.config.id);
    }
    this.buttonClick.emit(this.config.id);
  }
}
