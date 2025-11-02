import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-session-free',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './session-free.component.html',
  styleUrls: ['./session-free.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionFreeComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Output() closed = new EventEmitter<{ confirmed: boolean } | void>();

  /** Handles Cancel button click */
  protected handleCancel(): void {
    this.closed.emit({ confirmed: false });
  }

  /** Handles Confirm button click */
  protected handleConfirm(): void {
    this.closed.emit({ confirmed: true });
  }
}
