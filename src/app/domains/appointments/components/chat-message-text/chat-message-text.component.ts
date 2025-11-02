import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chat-message-text',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './chat-message-text.component.html',
  styleUrls: ['./chat-message-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageTextComponent {
  @Input() message: string | any = '';
  @Input() isExpanded: boolean = false;
  @Input() allowShortTexts!: boolean | null;

  private readonly TRUNCATE_LENGTH: number = 400;

  public get showToggle(): boolean {
    return this.message && this.message.length > this.TRUNCATE_LENGTH;
  }

  public get displayedMessage(): string {
    if (!this.showToggle || this.isExpanded) {
      return this.message;
    }
    return this.message.substring(0, this.TRUNCATE_LENGTH) + '...';
  }

  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
}
