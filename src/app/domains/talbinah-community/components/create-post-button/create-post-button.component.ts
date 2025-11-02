import { Component, computed, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateApiPipe } from '../../../../common/core/translations';
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
  imports: [TranslateModule, TranslateApiPipe],
  templateUrl: './create-post-button.component.html',
  styleUrls: ['./create-post-button.component.scss']
})
export class CreatePostButtonComponent {
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
