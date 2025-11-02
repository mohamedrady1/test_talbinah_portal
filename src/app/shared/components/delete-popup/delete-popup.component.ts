import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-popup',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeletePopupComponent {
  @Output() closed = new EventEmitter<{ status: boolean }>();

  protected confirmDelete(): void {
    this.closed.emit({ status: true });
  }

  protected closeModal(): void {
    this.closed.emit({ status: false });
  }
}
