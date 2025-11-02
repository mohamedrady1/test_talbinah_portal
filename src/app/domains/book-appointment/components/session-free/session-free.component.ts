import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-session-free',
  standalone: true,
  imports: [TranslateModule, CommonModule, TranslateApiPipe],
  templateUrl: './session-free.component.html',
  styleUrls: ['./session-free.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionFreeComponent {
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
